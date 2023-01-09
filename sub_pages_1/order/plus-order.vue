<template>
	<view>
		<view class="gap"></view>

		<use-list-title v-if="plusOrderWay === '工程师加单'" style="margin-bottom: -10px;" title="期望上门时间"
			:tip="chooseTime || '请选择上门时间'" size="32" fwt="600" color="#333" iconfont=" " @goto="showTime = true">
		</use-list-title>
		<view v-if="plusOrderWay === '工程师加单'">
			<u-picker :show="showTime" title="选择上门时间" ref="uPicker" :columns="timeColumns" @confirm="confirm"
				@change="changeHandler" @cancel="showTime = false"></u-picker>
		</view>

		<view class="goods-area bg-main padding">
			<!-- 商品列表 -->
			<view class="goods-item" :class="{ 'margin-top': index > 0 }" v-for="(item, index) in goodsDatas"
				:key="index">
				<view class="pos-r">
					<image mode="aspectFill" :src="item.goods.img"></image>
				</view>
				<view class="flex1 padding-left-sm">
					<text class="title clamp-2">{{ item.goods.name }}</text>
					<view class="ft-dark fs-xs padding-top-xs">
						<text v-if="cart_ids && cart_ids.length > 0"
							class="margin-right">×{{ item.cart.goods_num }}</text>
						{{ (item.goods_sku && item.goods_sku.spec) || '&nbsp;&nbsp;' }}
					</view>
					<view class="pos-r dflex-b padding-top">
						<view class="price flex1">{{ item.goods.price / 100 || '' }}{{ item.goods.unit }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="gap"></view>

		<!-- 工程师选择 -->
		<use-list-title v-if="plusOrderWay === '工程师加单'" style="margin-bottom: -10px;" title="工程师选择" size="32" fwt="600"
			color="#333" iconfont=" " right=""></use-list-title>
		<view v-if="plusOrderWay === '工程师加单'" class="goods-area bg-main padding-bottom padding-left padding-right flex"
			style="overflow-x: scroll;">
			<use-list-title v-if="engineerList.length === 0" title="暂无匹配的工程师" size="28" fwt="500" color="#333"
				iconfont=" " right=""></use-list-title>
			<view v-for="(item, index) in engineerList" :key="index" :class="index === checkedEngineer ? 'solids' : ''"
				class="flex flex-direction margin-right align-center" @click="groupChange(item.user_id, index)">
				<uni-card :title="item.name + '师傅'" :thumbnail="item.avatar" style="width: 450rpx;">
					<view class="flex flex-wrap justify-around align-center">
						<view v-for="(item1, index1) in item.skill" :key="index1"
							:class="index1 >= 2 ? 'margin-top' : ''" class="cu-tag bg-blue sm">{{ item1 }}</view>
					</view>
				</uni-card>
			</view>
		</view>
		<view v-if="plusOrderWay === '工程师加单'" class="gap"></view>

		<!-- 金额明细 -->
		<view class="bg-main">
			<view class="dflex-b padding-lr padding-tb-sm">
				<view class="flex1">服务费用</view>
				<view class="">
					<text style="font-size: 24rpx;">￥</text>
					{{ goods_money }}元起
				</view>
			</view>

			<view class="dflex-b padding-lr padding-tb-sm">
				<view class="margin-right-xl">故障描述</view>
				<input class="flex1 padding-sm" type="text" v-model="order_desc" placeholder="描述内容(必填)"
					placeholder-class="placeholder" />
			</view>
		</view>
		<view class="gap"></view>

		<!-- 维修图片 -->
		<view class="bg-main">
			<use-list-title title="故障图片(最少上传3张,包括远景,近景,细节)" size="32" fwt="600" color="#333" iconfont=" " rightIcon="">
			</use-list-title>
			<view class="padding-bottom padding-left">
				<uni-file-picker v-model="imageValue" fileMediatype="image" returnType="array"
					:image-styles="imageStyle" @delete="imgDelete" />
			</view>
		</view>
		<view class="gap"></view>
		<!-- 底部  -->
		<view class="oper-area pos-f pos-bottom w-full dflex-b bg-main safe-area-inset-bottom padding-left">
			<view>
				<text class="price margin-left-sm fs-xl">{{ total_money }}元起</text>
			</view>
			<view class="submit dflex-c bg-base fs animated-all" @click="submit">加单</view>
		</view>
	</view>
</template>

<script>
	// 收获人地址
	const _address = 'usemall-member-address';
	const db = uniCloud.database();
	export default {
		data() {
			return {
				chooseTime: '',
				showTime: false,
				timeColumns: [],
				start_time: 0,
				end_time: 0,
				// 商品数据
				goodsDatas: [],
				// 产品金额
				goods_money: 0,
				// 实付金额
				total_money: 0,
				order_id: '',

				// 商品 id
				goods_id: '',
				// 商品数量
				goods_num: 1,
				// 商品 sku id
				goods_sku_id: 0,
				// 买家备注
				order_desc: '',
				platform: '',
				platform_name: '',

				imageStyle: {
					height: '200rpx',
					width: '200rpx'
				},
				imageValue: [],
				warranty_id: '',
				plusOrderWay: '',
				// 工程师列表
				engineerList: [],
				skills: [],
				addrData: {},
				engineer_id: '',
				checkedEngineer: -1
			};
		},
		watch: {
			chooseTime() {
				let year = this.$dayjs().year();
				let month = this.chooseTime.split('月')[0];
				let day = this.chooseTime.split('月')[1].split('日')[0];
				let start = this.chooseTime.split(' ')[1].split('~')[0];
				let end = this.chooseTime.split(' ')[1].split('~')[1];
				this.start_time = this.$dayjs(year + '-' + month + '-' + day + ' ' + start).valueOf();
				this.end_time = this.$dayjs(year + '-' + month + '-' + day + ' ' + end).valueOf();

				this.loadEngineer();
			}
		},
		async onLoad(options) {
			let _this = this;
			await this.initTime();
			this.$api.get_env(res => {
				this.platform = res.platform;
				this.platform_name = res.platform_name;
			});

			this.plusOrderWay = options.plus_way;
			// 商品 ids
			this.goods_id = options.goods_id;
			// 商品 sku
			this.goods_sku_id = options.sku_id;
			// order_id
			this.order_id = options.order_id;
			console.log('order_id', this.order_id);
			// 加载商品数据
			await this.loadData();
			this.loadEngineer();
		},
		onShow() {},
		methods: {
			changeHandler(e) {
				const {
					columnIndex,
					value,
					values, // values为当前变化列的数组内容
					index,
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.uPicker
				} = e;

				if (columnIndex === 0 && index === 0) {
					// picker为选择器this实例，变化第二列对应的选项
					picker.setColumnValues(1, this.timeData[0]);
				} else if (columnIndex === 0 && index != 0) {
					picker.setColumnValues(1, this.timeData[1]);
				}
			},

			async initTime() {
				let _this = this;
				this.timeColumns = [];
				this.timeData = [];

				var date = new Date();
				let timeDateList = [];
				let timeHourList = [];
				let currentHour = date.getHours() + 2;
				let initHour = 0;
				let initDay = 0;
				let interval = '';

				if (currentHour <= 9) {
					initHour = 9;
				} else {
					initHour = currentHour;
				}

				if (currentHour >= 23) {
					initDay = date.getDate() + 1;
				} else {
					initDay = date.getDate();
				}

				for (let i = 0; i < 7; i++) {
					timeDateList.push(date.getMonth() + 1 + '月' + initDay + '日');
					date = date.setDate(initDay + 1);
					date = new Date(date);
					initDay = date.getDate();
				}

				if (initHour >= 23) {
					timeHourList = [
						'9:00~10:00',
						'10:00~11:00',
						'11:00~12:00',
						'12:00~13:00',
						'13:00~14:00',
						'14:00~15:00',
						'15:00~16:00',
						'16:00~17:00',
						'17:00~18:00',
						'18:00~19:00',
						'19:00~20:00',
						'20:00~21:00',
						'21:00~22:00'
					];
				} else {
					for (initHour; initHour < 22; initHour++) {
						interval = initHour + ':00' + '~' + (initHour + 1) + ':00';
						timeHourList.push(interval);
					}
				}

				this.timeColumns.push(timeDateList);
				this.timeColumns.push(timeHourList);
				this.timeData.push(timeHourList);
				this.timeData.push([
					'9:00~10:00',
					'10:00~11:00',
					'11:00~12:00',
					'12:00~13:00',
					'13:00~14:00',
					'14:00~15:00',
					'15:00~16:00',
					'16:00~17:00',
					'17:00~18:00',
					'18:00~19:00',
					'19:00~20:00',
					'20:00~21:00',
					'21:00~22:00'
				]);
				this.chooseTime = [timeDateList[0], timeHourList[0]].join(' ');
			},

			// 回调参数为包含columnIndex、value、values
			confirm(e) {
				this.chooseTime = e.value.join(' ');
				this.showTime = false;
			},
			// 点击工程师选择
			groupChange(n, index) {
				console.log('groupChange', n);
				this.engineer_id = n;
				this.checkedEngineer = index;
			},
			getCategory() {
				let _this = this;
				return new Promise(async (resolve, reject) => {
					for (var i = 0; i < this.goodsDatas.length; i++) {
						const good = this.goodsDatas[i];
						this.skills.push(good.goods.name);
						const res = await this.$db['usemall-goods-category'].tofirst(good.goods.cid)
						this.skills.push(res.datas.name);
						const res1 = await _this.$db['usemall-goods-category'].tofirst(res.datas.pid)
						this.skills.push(res1.datas.name);
						this.category_name = res1.datas.name;
					}
					resolve(this.skills);
				});
			},
			// 计算工程师一天的接单数量
			getEngineerOrderCount(engineer_id) {
				let start = new Date(this.start_time).setHours(0, 0, 0, 0);
				let end = new Date(this.end_time).setHours(23, 59, 59, 999);
				let count = 0;
				return new Promise((resolve, reject) => {
					db.collection('usemall-order')
						.where({
							engineer_id: engineer_id,
							state: db.command.nin(['待接单', '已取消', '待改派', '待取消']),
							start_time: db.command.gt(start),
							end_time: db.command.lt(end)
						})
						.count()
						.then(res => {
							count = res.result.total;
							resolve(count);
						});
				});
			},
			getAddress() {
				return new Promise(async (resolve, reject) => {
					this.$db['usemall-order'].where({
						order_id: this.order_id
					}).tofirst().then(res => {
						this.$db['usemall-member-address'].tofirst(res.datas.addr_id).then(res1 => {
							this.addrData = res1.datas;
							resolve(this.addrData);
						})
					})
				})
			},
			// 获取工程师
			async loadEngineer() {
				let _this = this;
				let engineerList = [];
				let timeFilter = [];
				this.engineerList = [];
				await this.getCategory();
				await this.getAddress();
				console.log(this.skills);
				let engineers = await db
					.collection('engineers')
					.where({
						point: db.command.geoNear({
							geometry: new db.Geo.Point(parseFloat(_this.addrData.longitude), parseFloat(
								_this.addrData.latitude))
						}),
						status: 1,
						audit_status: 1,
						skill: db.command.in(this.skills)
					})
					.get();
				engineerList = engineers.result.data;
				// 接单数量过滤
				for (var i = 0; i < engineerList.length; i++) {
					const engineer = engineerList[i];
					let count = await _this.getEngineerOrderCount(engineer.user_id);
					console.log('count', count);
					if (count < engineer.limit) {
						this.engineerList.push(engineer);
					}
				}
			},
			// 根据分类名称获取质保卡id
			async getWarrantyCardId() {
				let category = -1;
				if (this.category_name.indexOf('家电') != -1) {
					category = 0;
				} else if (this.category_name.indexOf('家具') != -1) {
					category = 1;
				} else {
					category = 2;
				}

				await this.$db['warranty-card']
					.where({
						category: category
					})
					.tofirst()
					.then(res => {
						this.warranty_id = res.datas._id;
					});
			},
			// 加载数据
			async loadData() {
				await this.$func.usemall
					.call('goods/detail2order', {
						goods_id: this.goods_id,
						goods_sku_id: this.goods_sku_id
					})
					.then(res => {
						if (res.code === 200) {
							this.goodsDatas = res.datas;
							console.log('goodsDAta', this.goodsDatas);
							this.calcTotalMoney();
							return;
						}

						this.$api.msg(res.msg);
					});
				this.getCategory();
			},
			// 计算实际支付 总金额
			calcTotalMoney() {
				// 服务项总金额
				let service_money = 0;

				this.goods_money = 0;
				this.goodsDatas.forEach(x => {
					if (x.goods_sku && x.goods_sku.price) {
						x.goods.price = x.goods_sku.price;
						x.goods.stock_num = x.goods_sku.stock_num;
					}
					if (x.cart && x.cart.goods_num) {
						x.goods.goods_num = x.cart.goods_num;
					}

					this.goods_money += (x.goods.price / 100) * x.goods.goods_num;
				});
				this.total_money = this.goods_money;
			},
			// 提交订单
			async submit() {
				if (this.order_desc === '') {
					this.$api.msg('请填写故障描述');
					return;
				}

				const user = uni.getStorageSync('uni-id-pages-userInfo');
				const userRes = await this.$db['uni-id-users'].tofirst(user._id);
				const orderRes = await this.$db['usemall-order'].where({
					order_id: this.order_id
				}).tofirst();
				let _this = this;

				// 如果订单付完款了，需要将订单的价格改为0
				if (['待评价', '已完成'].includes(orderRes.datas.state)) {
					this.$db['usemall-order'].where({
						order_id: this.order_id
					}).update({
						order_actural_paid: 0
					});
				}

				let imageUrls = [];
				this.imageValue.forEach(item => {
					imageUrls.push(item.url);
				});

				// 更新初始订单状态
				if (this.plusOrderWay === '客户加单') {
					console.log('=======state>>>', orderRes.datas.state);
					if (!['待接单', '已接单'].includes(orderRes.datas.state)) {
						this.$db['usemall-order'].where({
							order_id: this.order_id
						}).update({
							state: '已上门',
							scanner: userRes.datas._id
						});
						this.$db['usemall-order-log'].add({
							order_id: this.order_id,
							create_uid: user._id,
							is_delete: 0,
							current_state: '已上门'
						})
					}

					// 更新order表里的image字段
					this.$func.usemall.call('order/updateOrderImgs', {
						order_id: this.order_id,
						imgs: imageUrls
					})

					// 新增order-detal
					let obj = {
						goods_id: _this.goods_id,
						goods_num: 1,
						goods_sku_id: _this.goods_sku_id || '',
						order_id: _this.order_id,
						order_desc: _this.order_desc,
						goods_name: _this.goodsDatas[0].goods.name,
						goods_img: _this.goodsDatas[0].goods.img,
						goods_num: 1,
						goods_price: _this.goodsDatas[0].goods.price,
						goods_market_price: _this.goodsDatas[0].goods.market_price,
						goods_sku_name: _this.goodsDatas[0].goods_sku.sku_name || '',
						is_delete: 0,
						create_uid: user._id
					};
					this.$db['usemall-order-detail'].add(obj).then(res => {
						// 跳转订单成功页
						uni.redirectTo({
							url: `/sub_pages_1/user/order/order-detail?order_id=${_this.order_id}`
						});
						return;
					})
				} else if (this.plusOrderWay === '工程师加单') {
					if (this.chooseTime === '') {
						this.$api.msg('请选择上门时间');
						return;
					}

					let obj = {
						goods_id: this.goods_id,
						goods_num: 1,
						goods_sku_id: this.goods_sku_id || '',
						addr_id: orderRes.datas.addr_id,
						order_from: this.platform_name,
						order_desc: this.order_desc,
						imgs: imageUrls,
						time: this.chooseTime,
						start_time: this.start_time,
						end_time: this.end_time,
						engineer_id: this.engineer_id,
						introduce_engineer_id: user._id,
						create_uid: orderRes.datas.create_uid
					};

					this.$func.usemall.call('order/create', obj).then(res => {
						if (res.code === 200) {
							// uni PUSH给工程师engineer_id和order_id，超过10分钟再push一下，然后分给别的工程师
							uni.$emit('create_order', res.datas.order_id, _this.engineer_id, _this.goodsDatas,
								_this.addrData);
							// 给工程师发事件
							_this.$db['uni-id-device'].where({
								user_id: _this.engineer_id
							}).tofirst().then(res1 => {
								getApp().pushMsg(res1.datas.push_clientid, '新订单', '您有新的订单，请注意查收', {
									engineer_id: _this.engineer_id,
									order_id: res.datas.order_id
								}, res.datas.order_id)
							});
							uni.redirectTo({
								url: '/sub_pages_1/enginner/home/home'
							})
							return;
						}

						_this.$api.msg(res.msg);
					});
				}
			},
			// 删除图片
			imgDelete(e) {
				this.imageValue.splice(this.imageValue.findIndex(x => x.url == e.url), 1);
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100rpx;
	}

	.solids::after {
		border: 8upx solid #1890ff;
	}

	.goods-area {
		.goods-item {
			display: flex;

			.disabled {
				color: #fff !important;
				width: 70%;
				height: 70%;
				background-color: rgba(51, 51, 51, 0.5);
			}

			image {
				flex-shrink: 0;
				display: block;
				width: 180rpx;
				height: 180rpx;
				border-radius: 4rpx;
			}
		}
	}

	.oper-area {
		z-index: 998;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);

		.submit {
			width: 280rpx;
			height: 100rpx;
		}
	}

	/* 优惠券区 */
	.coupon-area {
		max-height: 60vh;
		overflow: auto;

		.coupon-item {
			margin-bottom: 20rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.content {
				&:after {
					position: absolute;
					left: 0;
					bottom: 0;
					content: '';
					width: 100%;
					height: 0;
					border-bottom: 1px dashed #f3f3f3;
					transform: scaleY(50%);
				}
			}

			.circle {
				position: absolute;
				bottom: -10rpx;
				z-index: 10;
				width: 20rpx;
				height: 20rpx;
				background: #f5f5f5;
				border-radius: 50%;

				&.r {
					right: -6rpx;
				}

				&.l {
					left: -6rpx;
				}
			}
		}
	}

	.coupon-none {
		width: 100%;
		height: 100%;
		line-height: 30vh;
		display: flex;
		align-items: center;
		justify-content: center;

		.coupon-none-tip {
			color: #909399;
		}
	}
</style>
