<template>
	<view>
		<!-- 上门地址 -->
		<view class="gap"></view>
		<use-list-title v-if="!(addrData && addrData._id)" color="#333" title="选择上门地址" iconfont="icondizhi-"
			@goto="toaddr"></use-list-title>
		<view v-else class="padding dflex-b bg-main" @click="toaddr">
			<view class="dflex">
				<view class="iconfont icondizhi- margin-right ft-main"></view>
				<view class="w-full dflex-wrap-w">
					<view class="margin-bottom-xs">
						<text>{{ addrData.address }} {{ addrData.addr_detail }}</text>
					</view>
					<view>
						<text>{{ addrData.consignee }}</text>
						<text class="margin-left">{{ addrData.mobile }}</text>
					</view>
				</view>
			</view>

			<view class="iconfont iconjiantou-01 fs-sm"></view>
		</view>
		<view class="gap"></view>

		<!-- 上门时间 -->
		<use-list-title style="margin-bottom: -10px;" title="期望上门时间" :tip="chooseTime || '请选择上门时间'" size="32" fwt="600"
			color="#333" iconfont=" " @goto="showTime = true"></use-list-title>
		<view>
			<u-picker :show="showTime" title="选择上门时间" ref="uPicker" :columns="timeColumns" @confirm="confirm"
				@change="changeHandler" @cancel="close"></u-picker>
		</view>

		<view class="goods-area bg-main padding-bottom padding-left padding-right">
			<!-- 商品列表 -->
			<view class="goods-item" :class="{ 'margin-top': index > 0 }" v-for="(item, index) in goodsDatas"
				:key="index">
				<view class="pos-r">
					<image mode="aspectFill" :src="item.goods.img"></image>
					<!-- <view v-if="(item.goods.stock_num < 10 || item.goods.stock_num < item.goods.goods_num)"
						class="disabled dflex-c dflex-flow-c pos-a pos-tl-c border-radius-c">
						<text>库存不足</text><text class="margin-left-xs fs-xs" v-if="item.goods.stock_num > 0">剩余
							{{item.goods.stock_num}}</text>
					</view> -->
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
		<use-list-title style="margin-bottom: -10px;" title="工程师选择" size="32" fwt="600" color="#333" iconfont=" "
			right=""></use-list-title>
		<view class="goods-area bg-main padding-bottom padding-left padding-right flex" style="overflow-x: scroll;">
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
		<view class="gap"></view>

		<!-- 金额明细 -->
		<view class="bg-main">
			<view class="dflex-b padding-lr padding-tb-sm">
				<view class="flex1">服务费用</view>
				<view class="">
					<text style="font-size: 24rpx;">￥</text>
					{{ goods_money }}元起
				</view>
			</view>

			<view v-if="total_coupon_money > 0" class="dflex-b padding-lr padding-tb-sm">
				<view class="flex1">优惠金额</view>
				<view class="ft-base">-￥{{ total_coupon_money }}</view>
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
				<!-- <text class="fs-sm">实付款</text> -->
				<text class="price margin-left-sm fs-xl">{{ total_money }}元起</text>
			</view>
			<view class="submit dflex-c bg-base fs animated-all" :class="is_submit === 1 ? 'bg-disabled' : ''"
				@click="submit">提交订单</view>
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
				// 收货地址
				addrData: {},
				// 上门时间
				chooseTime: '',
				// 商品数据
				goodsDatas: [],
				// 产品金额
				goods_money: 0,

				// 优惠券
				couponShow: false,
				couponName: '选择优惠券',
				couponDatas: [],
				// 优惠券类型 满减|折扣
				coupon_type: '满减',
				// 优惠券金额
				coupon_money: 0,
				// 实付金额
				total_money: 0,
				// 优惠金额
				total_coupon_money: 0,

				// 购物车 ids
				cart_ids: [],
				// 商品 id
				goods_id: 0,
				// 商品数量
				goods_num: 1,
				// 商品 sku id
				goods_sku_id: 0,
				// 使用优惠券ID
				order_coupon_id: 0,
				// 买家备注
				order_desc: '',

				is_submit: 1,
				platform: '',
				platform_name: '',

				// 显示上门时间选择框
				showTime: false,
				timeColumns: [],
				timeData: [],

				imageStyle: {
					height: '200rpx',
					width: '200rpx'
				},
				imageValue: [],

				// 工程师列表
				engineerList: [],
				// 工程师Id
				dataId: '',
				checkedEngineer: -1,
				// 工程师电话
				engineer_phone_number: '',
				// 定时器
				timer: null,
				// 过滤工程师技能数组
				skills: [],
				// 商品的大分类名称
				category_name: '',
				// 订单起止时间
				start_time: 0,
				end_time: 0
			};
		},
		async onLoad(options) {
			await this.initTime();
			// 获取详情页的上门时间和地址
			if (options.addr) {
				let addr = JSON.parse(options.addr);
				this.addrData = addr;
			}
			this.chooseTime = options.time || '';

			let _this = this;
			this.$api.get_env(res => {
				this.platform = res.platform;
				this.platform_name = res.platform_name;
			});

			// 商品 ids
			this.goods_id = options.goods_id || '';
			// 商品 sku
			this.goods_sku_id = options.sku_id || '';

			console.log('skuuuuuuuuu', options.goods_id, options.sku_id);

			// 购物车 ids
			if (options.cart_ids) {
				this.cart_ids = options.cart_ids.split(',');
			}
			// 加载商品数据
			await this.loadData();

			// 加载工程师数据
			this.loadEngineer();

			uni.$on('__event_choice_address', data => {
				this.addrData = data;
			});
		},
		onShow() {},
		watch: {
			addrData() {
				this.loadEngineer();
			},
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
		methods: {
			// 发送信息
			sendMessageToEngineer(phone) {
				uni.request({
					url: 'https://home-service.joyteck.cn/voice_notice',
					method: 'POST',
					data: {
						phone: phone
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log('========----------------', res);
					},
					fail(err) {
						console.log('==================>', err);
					}
				});
			},
			// 根据服务的cid获取类型名称
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
			// 获取工程师
			async loadEngineer() {
				let _this = this;
				let engineerList = [];
				let timeFilter = [];
				this.engineerList = [];
				await this.getCategory();
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

			// 点击工程师选择
			groupChange(n, index) {
				console.log('groupChange', n);
				this.dataId = n;
				this.checkedEngineer = index;
			},

			// 关闭时间选择框
			close() {
				this.showTime = false;
			},

			// 初始化上门时间参数
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

				if (this.addrData && this.addrData._id) return;
				await this.$db[_address]
					.where('create_uid == $env.uid')
					.where("is_default == '是'")
					.tofirst()
					.then(res => {
						console.log('res', res);
						if (res && res.code === 200) {
							_this.addrData = res.datas;
						}
					});
			},

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

			// 回调参数为包含columnIndex、value、values
			confirm(e) {
				this.chooseTime = e.value.join(' ');
				this.showTime = false;
			},
			// 加载数据
			async loadData() {
				await this.$func.usemall
					.call('goods/detail2order', {
						cart_ids: this.cart_ids,
						goods_id: this.goods_id,
						goods_sku_id: this.goods_sku_id
					})
					.then(res => {
						if (res.code === 200) {
							this.goodsDatas = res.datas;
							this.calcTotalMoney();
							this.is_submit = 0;
							return;
						}

						this.$api.msg(res.msg);
					});
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

				// 商品金额 + 服务金额 - 优惠金额
				if (this.coupon_type == '满减') {
					this.total_coupon_money = this.coupon_money;
					this.total_money = (this.goods_money + service_money - this.coupon_money).toFixed(0);
				} else if (this.coupon_type == '折扣') {
					this.total_coupon_money = this.goods_money + service_money - ((this.goods_money + service_money) * this
						.coupon_money).toFixed(0);
					this.total_money = ((this.goods_money + service_money) * this.coupon_money).toFixed(0);
				}
			},
			// 提交订单
			async submit() {
				if (!(this.addrData && this.addrData._id)) {
					this.$api.msg('请选择上门地址');
					return;
				}
				if (!this.chooseTime) {
					this.$api.msg('请选择上门时间');
					return;
				}
				if (this.dataId === '') {
					this.$api.msg('请选择工程师');
					return;
				}
				if (this.order_desc === '') {
					this.$api.msg('请填写故障描述');
					return;
				}

				let imageUrls = [];
				this.imageValue.forEach(item => {
					imageUrls.push(item.url);
				});

				// 由工程师id获取手机号码
				const resPhone = await this.$db['engineers'].where({
					user_id: this.dataId
				}).tofirst();
				this.sendMessageToEngineer(resPhone.datas.phone);

				if (this.is_submit) {
					this.$api.msg('提交中');
					return;
				}
				this.is_submit = 1;

				let _this = this;

				let obj = {
					cart_ids: this.cart_ids,

					goods_id: this.goods_id,
					goods_num: this.goods_num,
					goods_sku_id: this.goods_sku_id,

					order_coupon_id: this.order_coupon_id,
					addr_id: this.addrData._id,
					order_from: this.platform_name,
					order_desc: this.order_desc,
					imgs: imageUrls,
					time: this.chooseTime,
					start_time: this.start_time,
					end_time: this.end_time,
					engineer_id: this.dataId
				};

				this.$func.usemall.call('order/create', obj).then(res => {
					if (res.code === 200) {
						// uni PUSH给工程师engineer_id和order_id，超过10分钟再push一下，然后分给别的工程师
						uni.$emit('create_order', res.datas.order_id, _this.dataId, _this.goodsDatas, _this
							.addrData);
						// 给工程师发事件
						_this.$db['uni-id-device'].where({
							user_id: _this.dataId
						}).tofirst().then(res1 => {
							getApp().pushMsg(res1.datas.push_clientid, '新订单', '您有新的订单，请注意查收', {
								engineer_id: _this.dataId,
								order_id: res.datas.order_id
							}, res.datas.order_id)
						});
						// 跳转订单成功页
						uni.navigateTo({
							url: `/sub_pages_1/user/order/order-success?order_id=${res.datas.order_id}`
						});
						return;
					}

					_this.$api.msg(res.msg);
					_this.$api.timerout(() => {
						_this.is_submit = 0;
					}, 800);
				});
			},
			// 选择收货人
			toaddr() {
				uni.navigateTo({
					url: '/sub_pages_1/user/address/address?source=1',
					complete() {}
				});
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
