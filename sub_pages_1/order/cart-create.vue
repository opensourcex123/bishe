<template>
	<view>
		<u-tabs lineWidth="30" :activeStyle="{
		    color: '#303133',
		    fontWeight: 'bold',
		    transform: 'scale(1.05)'
		}" :inactiveStyle="{
		    color: '#606266',
		    transform: 'scale(1)'
		}" itemStyle="padding-left: 10px; padding-right: 10px; height: 34px;" :scrollable="false" :list="list"
			@click="tabChange">
		</u-tabs>

		<view v-for="(item, index) in goodsDatas" v-if="showGood === index">
			<!-- 上门地址 -->
			<use-list-title v-if="!(addrData[index] && addrData[index]._id)" color="#333" title="选择上门地址"
				iconfont="icondizhi-" @goto="toaddr(index)"></use-list-title>
			<view v-else class="padding dflex-b bg-main" @click="toaddr(index)">
				<view class="dflex">
					<view class="iconfont icondizhi- margin-right ft-main"></view>
					<view class="w-full dflex-wrap-w">
						<view class="margin-bottom-xs">
							<text>{{ addrData[index].address }} {{ addrData[index].addr_detail }}</text>
						</view>
						<view>
							<text>{{ addrData[index].consignee }}</text>
							<text class="margin-left">{{ addrData[index].mobile }}</text>
						</view>
					</view>
				</view>

				<view class="iconfont iconjiantou-01 fs-sm"></view>
			</view>
			<view class="gap"></view>

			<!-- 上门时间 -->
			<use-list-title style="margin-bottom: -10px;" title="期望上门时间" :tip="chooseTime[index] || '请选择上门时间'" size="32"
				fwt="600" color="#333" iconfont=" " @goto="showTime = true">
			</use-list-title>
			<view>
				<u-picker :show="showTime" title="选择上门时间" ref="uPicker" :columns="timeColumns"
					@confirm="confirm($event, index)" @change="changeHandler" @cancel="close">
				</u-picker>
			</view>

			<view class="goods-area bg-main padding-bottom padding-left padding-right">
				<!-- 商品列表 -->
				<view class="goods-item">
					<view class="pos-r">
						<image mode="aspectFill" :src="item.goods.img"></image>
					</view>
					<view class="flex1 padding-left-sm">
						<text v-if="item.goods_sku" class="title clamp-2">{{ item.goods_sku.spec }}</text>
						<text v-else class="title clamp-2">{{ item.goods.name }}</text>
						<view class="pos-r dflex-b padding-top">
							<view v-if="item.goods_sku" class="price flex1">
								{{ item.goods_sku.price/100 }}{{item.goods_sku.unit}}</view>
							<view v-else class="price flex1">{{ item.goods.price / 100 }}{{item.goods.unit}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="gap"></view>

			<!-- 工程师选择 -->
			<use-list-title style="margin-bottom: -10px;" title="工程师选择" size="32" fwt="600" color="#333" iconfont=" "
				right="">
			</use-list-title>
			<view class="goods-area bg-main padding-bottom padding-left padding-right flex justify-start"
				style="overflow-x: scroll;">
				<view v-for="(item, index1) in engineerList[index]" :key="index1"
					:class="index1 === checkedEngineer[index] ? 'solids' : ''"
					class="flex flex-direction margin-right align-center"
					@click="groupChange(item.user_id, index, index1)">
					<uni-card :title="item.name + '师傅'" :thumbnail="item.avatar">
						<view class="flex flex-wrap justify-around align-center">
							<view v-for="(item1, index1) in item.skill" :class="index1 >= 2 ? 'margin-top' : ''"
								class='cu-tag bg-blue sm'>{{item1}}</view>
						</view>
					</uni-card>
				</view>
			</view>
			<view class="gap"></view>

			<view class="gap"></view>

			<!-- 金额明细 -->
			<view class="bg-main">
				<view class="dflex-b padding-lr padding-tb-sm">
					<view class="flex1">服务费用</view>
					<view class=""><text
							style="font-size: 24rpx;">￥</text>{{ item.goods_sku.price/100 || item.goods.price/100 }}元起
					</view>
				</view>

				<view v-if="total_coupon_money > 0" class="dflex-b padding-lr padding-tb-sm">
					<view class="flex1">优惠金额</view>
					<view class="ft-base">-￥{{ total_coupon_money }}</view>
				</view>

				<view class="dflex-b padding-lr padding-tb-sm">
					<view class="margin-right-xl">故障描述</view>
					<input class="flex1 padding-sm" type="text" v-model="order_desc[index]" placeholder="描述内容(必填)"
						placeholder-class="placeholder" />
				</view>
			</view>
			<view class="gap"></view>

			<!-- 维修图片 -->
			<view class="bg-main">
				<use-list-title title="故障图片(最少上传3张,包括远景,近景,细节)" size="32" fwt="600" color="#333" iconfont=" "
					rightIcon="">
				</use-list-title>
				<view class="padding-bottom padding-left">
					<uni-file-picker v-model="imageValue[index]" fileMediatype="image" returnType="array"
						:image-styles="imageStyle" @delete="imgDelete($event, index)" />
				</view>
			</view>
			<view class="gap"></view>
		</view>
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
	const _address = 'usemall-member-address'
	const db = uniCloud.database();
	export default {
		data() {
			return {
				// tab名称
				list: [],
				// 收货地址
				addrData: [],
				// 上门时间
				chooseTime: [],
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
				// 商品 sku id
				goods_sku_id: 0,
				// 使用优惠券ID
				order_coupon_id: 0,
				// 买家备注
				order_desc: [],

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
				dataId: [],
				checkedEngineer: [],
				// 工程师电话
				engineer_phone_number: [],
				// 定时器
				timer: [],
				// 过滤工程师技能数组
				skills: [],
				// 展示的商品tab
				showGood: 0,
				// 修改的商品索引值
				index: 0,
				// 商品的大分类名称
				category_name: [],
				// 订单的质保卡id
				warranty_id: [],
				start_time: [],
				end_time: [],
			};
		},
		onLoad(options) {
			this.initTime();

			let _this = this;
			this.$api.get_env(res => {
				this.platform = res.platform;
				this.platform_name = res.platform_name;
			});

			// 购物车 ids
			if (options.cart_ids) {
				this.cart_ids = options.cart_ids.split(',');
			}
			// 加载商品数据
			this.loadData();

			uni.$on('__event_choice_address', (data, index) => {
				// this.addrData[index] = data;
				this.$set(this.addrData, index, data);
				this.index = index;
			});
		},
		watch: {
			addrData() {
				this.loadEngineer(this.index);
			},
			chooseTime() {
				let year = this.$dayjs().year();
				let month = this.chooseTime[this.index].split('月')[0];
				let day = this.chooseTime[this.index].split('月')[1].split('日')[0];
				let start = this.chooseTime[this.index].split(' ')[1].split('~')[0];
				let end = this.chooseTime[this.index].split(' ')[1].split('~')[1];
				this.$set(this.start_time, this.index, this.$dayjs(year + '-' + month + '-' + day + ' ' + start).valueOf())
				this.$set(this.end_time, this.index, this.$dayjs(year + '-' + month + '-' + day + ' ' + end).valueOf())

				this.loadEngineer(this.index);
			},
		},
		methods: {
			// 发送信息
			sendMessageToEngineer(phone) {
				uni.request({
					url: 'https://home-service.joyteck.cn/voice_notice',
					method: 'POST',
					data: {
						'phone': phone
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log(res);
					},
					fail(err) {
						console.log(err);
					}
				});
			},
			// 根据服务的cid获取类型名称
			getCategory(index) {
				let _this = this;
				let good = this.goodsDatas[index];
				return new Promise(async (resolve, reject) => {
					this.skills[index] = [];
					this.skills[index].push(good.goods.name);
					this.$db['usemall-goods-category'].tofirst(good.goods.cid).then(res => {
						this.skills[index].push(res.datas.name);
						_this.$db['usemall-goods-category'].tofirst(res.datas.pid).then(res1 => {
							this.skills[index].push(res1.datas.name);
							this.$set(this.category_name, index, res1.datas.name);
							resolve(this.skills);
						})
					})
				})
			},
			// 计算工程师一天的接单数量
			getEngineerOrderCount(engineer_id) {
				let start = new Date(this.start_time[this.index]).setHours(0, 0, 0, 0);
				let end = new Date(this.end_time[this.index]).setHours(23, 59, 59, 999);
				let count = 0;
				return new Promise((resolve, reject) => {
					db.collection('usemall-order').where({
						engineer_id: engineer_id,
						state: db.command.nin(['待接单', '已取消', '待改派', '待取消']),
						start_time: db.command.gt(start),
						end_time: db.command.lt(end)
					}).count().then(res => {
						count = res.result.total;
						resolve(count);
					});
				})
			},
			// 根据分类名称获取质保卡id
			async getWarrantyCardId(index) {
				let category = -1;
				if (this.category_name[index].indexOf('家电') != -1) {
					category = 0;
				} else if (this.category_name[index].indexOf('家具') != -1) {
					category = 1;
				} else {
					category = 2;
				}

				await this.$db['warranty-card'].where({
					category: category
				}).tofirst().then(res => {
					this.$set(this.warranty_id, index, res.datas._id);
				})
			},
			// 获取工程师
			async loadEngineer(index) {
				if (index === -1) {
					return;
				}
				let _this = this;
				let engineerList = [];
				let filterEngineerList = [];
				this.$set(this.engineerList, index, []);
				await this.getCategory(index);
				let engineers = await db.collection("engineers").where({
					point: db.command.geoNear({
						geometry: new db.Geo.Point(parseFloat(_this.addrData[index].longitude),
							parseFloat(_this
								.addrData[index].latitude))
					}),
					status: 1,
					audit_status: 1,
					skill: db.command.in(this.skills[index])
				}).get()
				engineerList = engineers.result.data;
				for (var i = 0; i < engineerList.length; i++) {
					const engineer = engineerList[i];
					let count = await _this.getEngineerOrderCount(engineer.user_id);
					if (count < engineer.limit) {
						filterEngineerList.push(engineer);
					}
				}
				this.$set(this.engineerList, index, filterEngineerList);
			},

			// 点击工程师选择
			groupChange(n, index, index1) {
				console.log('groupChange', n);
				this.$set(this.dataId, index, n);
				this.$set(this.checkedEngineer, index, index1);
			},

			// 关闭时间选择框
			close() {
				this.showTime = false
			},

			// 初始化上门时间参数
			async initTime() {

				let _this = this;
				this.timeColumns = []
				this.timeData = []

				var date = new Date()
				let timeDateList = []
				let timeHourList = []
				let currentHour = date.getHours() + 2
				let initHour = 0
				let initDay = 0
				let interval = ""

				if (currentHour <= 9) {
					initHour = 9
				} else {
					initHour = currentHour
				}

				if (currentHour >= 23) {
					initDay = date.getDate() + 1
				} else {
					initDay = date.getDate()
				}

				for (let i = 0; i < 7; i++) {
					timeDateList.push((date.getMonth() + 1) + "月" + initDay + "日")
					date = date.setDate(initDay + 1);
					date = new Date(date);
					initDay = date.getDate()
				}

				if (initHour >= 23) {
					timeHourList = ["9:00~10:00", "10:00~11:00", "11:00~12:00", "12:00~13:00", "13:00~14:00",
						"14:00~15:00",
						"15:00~16:00",
						"16:00~17:00", "17:00~18:00", "18:00~19:00", "19:00~20:00", "20:00~21:00", "21:00~22:00"
					]
				} else {
					for (initHour; initHour < 22; initHour++) {
						interval = initHour + ":00" + "~" + (initHour + 1) + ":00"
						timeHourList.push(interval)
					}
				}

				this.timeColumns.push(timeDateList)
				this.timeColumns.push(timeHourList)
				this.timeData.push(timeHourList)
				this.timeData.push(["9:00~10:00", "10:00~11:00", "11:00~12:00", "12:00~13:00", "13:00~14:00",
					"14:00~15:00",
					"15:00~16:00",
					"16:00~17:00", "17:00~18:00", "18:00~19:00", "19:00~20:00", "20:00~21:00", "21:00~22:00"
				])
			},

			changeHandler(e) {
				const {
					columnIndex,
					value,
					values, // values为当前变化列的数组内容
					index,
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.uPicker
				} = e

				if (columnIndex === 0 && index === 0) {
					// picker为选择器this实例，变化第二列对应的选项
					picker.setColumnValues(1, this.timeData[0])
				} else if (columnIndex === 0 && index != 0) {
					picker.setColumnValues(1, this.timeData[1])
				}
			},

			// 回调参数为包含columnIndex、value、values
			confirm(e, index) {
				this.$set(this.chooseTime, index, e.value.join(" "))
				this.showTime = false
			},
			// 加载数据
			async loadData() {
				this.$func.usemall.call('goods/detail2order', {
					cart_ids: this.cart_ids,
				}).then(res => {
					if (res.code === 200) {
						let i = 1;
						let _this = this;
						res.datas.forEach(item => {
							this.list.push({
								name: '订单' + i
							});
							this.imageValue.push([]);
							i++;
						});
						this.goodsDatas = res.datas;
						console.log('goodsDAtas1111111', this.goodsDatas);

						this.calcTotalMoney();
						this.is_submit = 0;
					}
				});
			},
			// 计算实际支付 总金额
			calcTotalMoney() {
				// 服务项总金额
				console.log('是否有只', this.goodsDatas)
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
				for (var i = 0; i < this.goodsDatas.length; i++) {
					if (!(this.addrData[i] && this.addrData[i]._id)) {
						this.$api.msg(`请选择订单${i+1}的上门地址`);
						return;
					}
					if (!this.chooseTime[i]) {
						this.$api.msg(`请选择订单${i+1}的上门时间`);
						return;
					}
					if (this.dataId[i] === '') {
						this.$api.msg(`请选择订单${i+1}的工程师`);
						return;
					}
					if (this.order_desc[i] === '') {
						this.$api.msg(`请填写订单${i+1}的故障描述`);
						return;
					}
				}

				let imageUrls = [];
				let start_time = [];
				let end_time = [];
				for (var i = 0; i < this.goodsDatas.length; i++) {
					imageUrls.push([]);
					this.imageValue[i].forEach(item => {
						imageUrls[i].push(item.url);
					});

					// 给工程师打电话
					const resPhone = await this.$db['engineers'].where({
						user_id: this.dataId[i]
					}).tofirst();
					this.sendMessageToEngineer(resPhone.datas.phone);
				}
				if (this.is_submit) {
					this.$api.msg('提交中');
					return;
				}
				this.is_submit = 1;

				let _this = this;

				for (var i = 0; i < this.goodsDatas.length; i++) {
					let good = this.goodsDatas[i];
					let goods_sku = good.hasOwnProperty('goods_sku') ? good.goods_sku._id : '';
					let obj = {
						cart_ids: _this.cart_ids[i],
						goods_id: good.goods._id,
						goods_num: 1,
						goods_sku_id: goods_sku,
						order_coupon_id: _this.order_coupon_id,
						// order_integral: 0,		// 是否使用积分抵扣
						// order_use_integral: 0,	// 使用的积分
						addr_id: _this.addrData[i]._id,
						order_from: _this.platform_name,
						order_desc: _this.order_desc[i],
						imgs: imageUrls[i],
						time: this.chooseTime[i],
						start_time: this.start_time[i],
						end_time: this.end_time[i],
						engineer_id: this.dataId[i],
					};

					this.$func.usemall.call('order/create', obj).then(res => {
						if (res.code === 200) {
							// TODO Uni PUSH给工程师engineer_id和order_id，超过10分钟再push一下，然后分给别的工程师
							uni.$emit('create_order', res.datas.order_id, _this.dataId[i], good, _this
								.addrData[i]);
							// 给工程师发事件
							_this.$db['uni-id-device'].where({
								user_id: _this.dataId[i]
							}).tofirst().then(res1 => {
								getApp().pushMsg(res1.datas.push_clientid, '新订单', '您有新的订单，请注意查收', {
									engineer_id: _this.dataId[i],
									order_id: res.datas.order_id
								}, res.datas.order_id)
							});
							// 给工程师信息表发信息
							getApp().sendMsgToEngineer(_this.dataId[i], '新订单', '您有新的订单，请注意查收',
								`/sub_pages_1/enginner/home/item-details/item-details?id=${res.datas.order_id}`
								)
							// 跳转订单成功页
							uni.navigateTo({
								url: `/sub_pages_1/user/order/order-success?order_id=${res.datas.order_id}`
							})
							return;
						}

						_this.$api.msg(res.msg);
						_this.$api.timerout(() => {
							_this.is_submit = 0;
						}, 800);
					})
				}
			},
			// 选择收货人
			toaddr(index) {
				uni.navigateTo({
					url: `/sub_pages_1/user/address/address?source=1&index=${index}`,
					complete() {}
				});
			},
			// 删除图片
			imgDelete(e, index) {
				this.imageValue[index].splice(this.imageValue[index].findIndex(x => x.url == e.url), 1);
			},
			tabChange(item) {
				this.showGood = item.index;
				this.index = item.index;
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
