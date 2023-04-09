<template>
	<view class="app w-full">
		<view class="price-box dflex-c dflex-flow-c">
			<view v-if="pay_id !== ''" class="margin-bottom">工程师代付</view>
			<view>支付金额</view>
			<view class="price fs-xxxl margin-top-sm">{{ money }}</view>
		</view>

		<view class="pay-type-list">
			<!-- #ifdef MP-WEIXIN -->
			<view class="type-item dflex-b pos-r padding-tb-sm" @click="changePayType('微信支付')">
				<text class="iconfont iconweixin"></text>
				<view class="item flex1">
					<text class="tit">微信支付</text>
					<text>推荐使用</text>
				</view>
				<label class="radio"><radio value="" color="#FF6A6C" :checked="pay_way == '微信支付'" :disabled="money <= 0" /></label>
			</view>
			<!-- #endif -->

			<!-- #ifdef APP -->
			<view class="type-item dflex-b pos-r padding-tb-sm" @click="changePayType('支付宝')">
				<text class="iconfont iconalipay"></text>
				<view class="item flex1">
					<text class="tit">支付宝支付</text>
					<text>推荐使用</text>
				</view>
				<label class="radio"><radio value="" color="#FF6A6C" :checked="pay_way == '支付宝'" :disabled="money <= 0" /></label>
			</view>
			<!-- #endif -->
		</view>

		<view class="padding w-full margin-top-big pos-a" style="bottom: 30rpx;">
			<view class="dflex-b border-radius-big">
				<!-- #ifndef H5 || MP-360 -->
				<view class="tac padding-tb-sm flex1 bg-base" :class="is_submit === 1 ? 'bg-disabled' : ''" @click="isHaveCoupon">{{ pay_tip }}</view>
				<!-- #endif -->
			</view>
		</view>
		<!-- ���������������惠券pop -->
		<u-popup :show="showCoupon" :round="10" :closeable="true" @close="close" mode="bottom">
			<view style="padding-top: 3%;">
				<text class="padding-left" style="font-size: larger; font-weight: bolder;">请选择优惠券</text>
				<view v-for="item in coupons" @click="useCoupon(item)" :key="item"><use-list-title :title="item.name" tip="使用" iconfont=" " fwt="300"></use-list-title></view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			money: 0,
			is_submit: 1,
			// 平台支付方式
			pay_way: '微信支付',
			// 原始支付方式 微信支付 支付宝支付
			pay_original: '',
			// JSAPI，NATIVE，APP，H5支付固定传 MWEB
			pay_trade_type: '',
			pay_tip: '确认支付',

			qrcode: '',
			time_remaining: 0,
			// 优惠券
			coupons: [],
			showCoupon: false,
			order_id: '',
			pay_id: ''
		};
	},
	computed: {},
	onLoad(options) {
		this.money = options.money / 100 || 0;
		this.order_id = options.order_id;
		this.pay_id = options.engineer_id || '';

		// #ifdef MP-WEIXIN
		this.pay_way = '微信支付';
		this.pay_original = '微信支付';
		this.pay_trade_type = 'JSAPI';
		// #endif
		// #ifdef APP
		this.pay_way = '支付宝';
		this.pay_original = '支付宝支付';
		this.pay_trade_type = 'APP';
		// #endif
		// #ifdef H5 || MP-360
		this.$api.timerout(() => {
			this.pay_way = '微信支付';
			this.pay_original = '微信支付';
			this.pay_trade_type = 'NATIVE';
		}, 0);

		this.pay_tip = '已完成支付';
		// #endif

		this.loadData();
	},

	methods: {
		// 使用优惠券
		useCoupon(item) {
			this.showCoupon = false;
			// 这个money单位是元
			this.money -= item.price;
			// 删除优惠券
			this.$db['coupons'].remove(item._id);
			// 把order表的实际付款金额更新
			this.$db['usemall-order'].where({ order_id: this.order_id }).update({ order_actural_paid: this.money * 100 });
			this.confirm();
		},
		close() {
			this.showCoupon = false;
		},
		qrcode_rs(res) {},
		loadData() {
			let _this = this;
			_this.$func.usemall
				.call('order/detail', {
					order_id: _this.order_id
				})
				.then(res => {
					if (res.code == 200) {
						if (res.datas.order.state === '待付款') {
							_this.is_submit = 0;
						} else {
							_this.pay_tip = _this.order_id + ' 订单' + res.datas.order.state;
						}

						_this.money = res.datas.order.order_actural_paid / 100;
						if (_this.money <= 0) {
							uni.redirectTo({
								url: `/sub_pages_1/pay/success?order_id=${_this.order_id}`
							});
							return;
							// _this.pay_way = '微信支付';
						}

						// #ifdef H5 || MP-360
						// 获取微信支付二维码
						_this.loadQRCode();
						// #endif
						return;
					}
					_this.$api.msg(res.msg);
				});
		},

		//选择支付方式
		changePayType(type, original, trade_type) {
			if (this.money <= 0) return;

			this.pay_way = type;
			if (original) this.pay_original = original;
			if (trade_type) this.pay_trade_type = trade_type;

			if (this.pay_trade_type == 'NATIVE') {
				this.loadQRCode();
			}
		},
		// 确认支付前弹窗是否有优惠券
		async isHaveCoupon() {
			let _this = this;
			const createUIDRes = await this.$db['usemall-order'].where({ order_id: this.order_id }).tofirst();

			this.$db['coupons']
				.where({ user_id: createUIDRes.datas.create_uid })
				.tofulllist()
				.then(res => {
					res.datas.forEach(item => {
						if (_this.money >= item.amount && item.deadline > new Date().getTime()) {
							_this.coupons.push(item);
						}
					});
					if (_this.coupons.length > 0) {
						_this.showCoupon = true;
					} else {
						_this.fakeConfirm(_this.order_id);
					}
					console.log('asfsa', this.coupons);
				});
		},
		//确认支付
		confirm() {
			if (this.is_submit) return;

			this.is_submit = 1;

			let _this = this;
			// #ifdef MP-WEIXIN
			uni.login({
				success(loginRes) {
					console.log('loginRes', loginRes);
					if (loginRes.code) {
						let obj = {
							code: loginRes.code,
							order_id: _this.order_id,
							pay_way: _this.pay_way,
							pay_original: _this.pay_original,
							pay_trade_type: _this.pay_trade_type
						};
						_this.$func.usemall.call('order/pay', obj).then(res => {
							console.log('支付接口', obj, res);

							if (res.code === 200) {
								if (res.datas) {
									let pay_datas = {};

									//#ifdef MP-WEIXIN
									pay_datas = {
										timeStamp: res.datas.timeStamp,
										nonceStr: res.datas.nonceStr,
										package: res.datas.package,
										signType: res.datas.signType,
										paySign: res.datas.paySign
									};
									//#endif

									// 检查当前 session 是否有效
									if (uni.canIUse('checkSession')) {
										uni.checkSession({
											success() {
												// 调用支付
												_this.topayment(pay_datas, res.datas.order_id);
											},
											fail() {
												// 当前 session 无效，调用 uni.login ���取���据
												uni.login({
													success() {
														// 调用支付
														_this.topayment(pay_datas, res.datas.order_id);
													},
													fail() {}
												});
											}
										});
									} else {
										// 调用支付
										_this.topayment(pay_datas, res.datas.order_id);
									}
								} else {
									uni.setStorage({
										key: '__order_state',
										data: '待付款',
										success(res) {
											console.log(res);
										},
										complete() {
											_this.$api.toorder();
										}
									});
								}

								return;
							}

							_this.$api.timerout(() => {
								if (typeof res.msg === 'object') {
									res.msg = res.msg.errorMessage;
								}
								_this.$api.msg(res.msg, 5000);
								_this.is_submit = 0;
							}, 800);
						});
					}
				},
				fail(err) {
					_this.$api.msg(err);
					_this.is_submit = 0;
				}
			});
			// #endif

			// #ifdef APP-PLUS
			let obj = {
				order_id: _this.order_id,
				pay_way: _this.pay_way,
				pay_original: _this.pay_original,
				pay_trade_type: _this.pay_trade_type
			};
			_this.$func.usemall.call('order/pay', obj).then(res => {
				console.log('支付接口', res.datas);
				if (res.code === 200) {
					if (res.datas) {
						// 调用支付
						const pay_datas = {
							provider: 'alipay',
							orderInfo: res.datas.info
						};
						console.log('执行了=====》', pay_datas);
						_this.topayment(pay_datas, res.datas.order_id);
					} else {
						uni.setStorage({
							key: '__order_state',
							data: '待付款',
							success(res) {
								console.log(res);
							},
							complete() {
								_this.$api.toorder();
							}
						});
					}
				}
			});
			// #endif
		},
		topayment(pay_datas, order_id) {
			let _this = this;
			const db = uniCloud.database();

			uni.requestPayment({
				...pay_datas,
				success: async function(pres) {
					console.log('requestPayment success:', pres);

					// 如果是代支付，把待支付人的id存入order表中
					if (_this.pay_id !== '') {
						_this.$db['usemall-order'].where({ order_id: order_id }).update({ pay_id: _this.pay_id });
					}

					const resOrder = await _this.$db['usemall-order']
						.where({
							order_id: order_id
						})
						.tofirst();
					const order = resOrder.datas;

					// ���据order���的���程���id获取工程师type
					const resType = await db
						.collection('engineers')
						.where({
							user_id: order.engineer_id
						})
						.get();

					// 根据type获取分成数据
					const ratioRes = await db
						.collection('usemall-order-parameter')
						.where({
							type: resType.result.data[0].type - 1
						})
						.get();

					console.log('ratioType====>', ratioRes);
					const engineerRatio = await db
						.collection('usemall-order-parameter')
						.where({
							type: 2
						})
						.get();
					console.log('engineerRatio====>', engineerRatio);
					// 根据分成金额获取平台费用和工程师费用
					let second_engineer_income = 0;
					let introduce_engineer_income = 0;
					const plat_income = order.order_actural_paid * (ratioRes.result.data[0].platform_ratio / 100);
					let engineer_income = order.order_actural_paid * (ratioRes.result.data[0].engineer_ratio / 100);

					// 如果有介绍工程师
					if (order.introduce_engineer_id && order.introduce_engineer_id !== '') {
						introduce_engineer_income = engineer_income * 0.2;
						engineer_income = engineer_income - introduce_engineer_income;

						// 如果有副工程师
						if (order.second_engineer_id && order.second_engineer_id !== '') {
							second_engineer_income = engineer_income * 0.5;
							engineer_income = engineer_income - second_engineer_income;
						}
					} else {
						// 没有介绍工程师但有副工程师
						if (order.second_engineer_id && order.second_engineer_id !== '') {
							second_engineer_income = engineer_income * (engineerRatio.result.data[0].second_engineer_ratio / 100);
							engineer_income = engineer_income - second_engineer_income;
						}
					}

					// 新增收入表数据
					let income = {
						order_id: order_id,
						actual_money: parseInt(Math.round(order.order_actural_paid)),
						plat_income: parseInt(Math.round(plat_income)),
						engineer_income: parseInt(Math.round(engineer_income)),
						second_engineer_income: parseInt(Math.round(second_engineer_income)),
						introduce_engineer_income: parseInt(Math.round(introduce_engineer_income)),
						unusual_income: 0,
						engineer_id: order.engineer_id,
						second_engineer_id: order.second_engineer_id,
						introduce_engineer_id: order.introduce_engineer_id
					};

					console.log('==========>', income);

					await db.collection('income').add(income);

					if (_this.pay_id !== '') {
						_this.$api.msg('支付成功');
						uni.redirectTo({
							url: `/sub_pages_1/enginner/home/home`
						});
					} else {
						uni.redirectTo({
							url: `/sub_pages_1/pay/success?order_id=${order_id}`
						});
					}
					return;
				},
				fail: function(err) {
					console.log('requestPayment fail:', err);

					uni.setStorage({
						key: '__order_state',
						data: '待付款',
						success(res) {
							console.log(res);
						},
						complete() {
							_this.$api.toorder();
						}
					});
				}
			});
		},
		// 绕过uni-pay的确认支付
		async fakeConfirm(order_id) {
			let _this = this;
			const db = uniCloud.database();
			
			if (_this.pay_id !== '') {
				_this.$db['usemall-order'].where({ order_id: order_id }).update({ pay_id: _this.pay_id });
			}
			
			const resOrder = await _this.$db['usemall-order']
				.where({
					order_id: order_id
				})
				.tofirst();
			const order = resOrder.datas;
			
			// 根据orderid获取工程师type
			const resType = await db
				.collection('engineers')
				.where({
					user_id: order.engineer_id
				})
				.get();
			
			// 根据type获取分成数据
			const ratioRes = await db
				.collection('usemall-order-parameter')
				.where({
					type: resType.result.data[0].type - 1
				})
				.get();
			
			console.log('ratioType====>', ratioRes);
			const engineerRatio = await db
				.collection('usemall-order-parameter')
				.where({
					type: 2
				})
				.get();
			console.log('engineerRatio====>', engineerRatio);
			// 根据分成金额获取平台费用和工程师费用
			let second_engineer_income = 0;
			let introduce_engineer_income = 0;
			const plat_income = order.order_actural_paid * (ratioRes.result.data[0].platform_ratio / 100);
			let engineer_income = order.order_actural_paid * (ratioRes.result.data[0].engineer_ratio / 100);
			
			// 如果有介绍工程师
			if (order.introduce_engineer_id && order.introduce_engineer_id !== '') {
				introduce_engineer_income = engineer_income * 0.2;
				engineer_income = engineer_income - introduce_engineer_income;
			
				// 如果有副工程师
				if (order.second_engineer_id && order.second_engineer_id !== '') {
					second_engineer_income = engineer_income * 0.5;
					engineer_income = engineer_income - second_engineer_income;
				}
			} else {
				// 没有介绍工程师但有副工程师
				if (order.second_engineer_id && order.second_engineer_id !== '') {
					second_engineer_income = engineer_income * (engineerRatio.result.data[0].second_engineer_ratio / 100);
					engineer_income = engineer_income - second_engineer_income;
				}
			}
			
			// 新增收入表数据
			let income = {
				order_id: order_id,
				actual_money: parseInt(Math.round(order.order_actural_paid)),
				plat_income: parseInt(Math.round(plat_income)),
				engineer_income: parseInt(Math.round(engineer_income)),
				second_engineer_income: parseInt(Math.round(second_engineer_income)),
				introduce_engineer_income: parseInt(Math.round(introduce_engineer_income)),
				unusual_income: 0,
				engineer_id: order.engineer_id,
				second_engineer_id: order.second_engineer_id,
				introduce_engineer_id: order.introduce_engineer_id
			};
			
			console.log('==========>', income);
			
			await db.collection('income').add(income);
			
			// 如果支付成功，修改一下状态
			await _this.$db['usemall-order'].where({order_id: order_id}).update({
				state: '待评价',
				order_pay_state: '已付款'
			});
			let order_log = {
				order_id: order_id,
				log_type: '订单支付',
				current_state: '待评价',
				prev_state: '待付款',
				is_delete: 0,
				create_uid: order.create_uid,
			};
			await db.collection('usemall-order-log').add(order_log);
			
			if (_this.pay_id !== '') {
				_this.$api.msg('支付成功');
				uni.redirectTo({
					url: `/sub_pages_1/enginner/home/home`
				});
			} else {
				uni.redirectTo({
					url: `/sub_pages_1/pay/success?order_id=${order_id}`
				});
			}
			return;
		},
		// 检测订单支付状态
		check() {
			let _this = this;

			_this.$func.usemall
				.call('order/paystate', {
					order_id: _this.order_id
				})
				.then(res => {
					// 商户后端查询的微信支付状态，通知收银台支付结果
					/*
					  0：支付成功
					  1：支付超时
					  2：支付失败
					  3：支付关闭
					  9：订单状态未知/未支付
					*/
					if (res.code == 200) {
						let code = 9;
						let trade_state = res.datas.trade_state || '';

						if (res.datas.pay_state == '已付款') {
							code = 0;
						} else if (trade_state == 'SUCCESS') {
							code = 0;
						} else if (trade_state == 'NOTPAY' || trade_state == 'PAYERROR') {
							code = 2;
						} else if (trade_state == 'CLOSED') {
							code = 3;
						}

						switch (code) {
							case 0:
								uni.redirectTo({
									url: `/sub_pages_1/pay/success?order_id=${_this.order_id}`
								});
								break;
							case 1:
								_this.$api.msg('支付超时，请重新支付', 3500);
								break;
							case 2:
								_this.$api.msg('已取消，请重新支付', 3500);
								break;
							case 3:
								_this.$api.msg('支付关闭，请重新支付', 3500);
								break;
							case 4:
								_this.$api.msg('支付取消，请重新支付', 3500);
								break;
							case 9:
							default:
								_this.$api.msg('支付失败，请重新支付', 3500);
								break;
						}
						return;
					}
				})
				.catch(err => {});
		},
		// #ifdef H5 || MP-360
		loadQRCode() {
			let _this = this;
			let obj = {
				order_id: _this.order_id,
				pay_way: _this.pay_way,
				pay_original: _this.pay_original,
				pay_trade_type: _this.pay_trade_type
			};
			uni.showLoading({
				title: '请求中'
			});
			// this.$api.alert('二维码支付开发中');
			_this.$func.usemall.call('order/pay', obj).then(res => {
				console.log('支付接口', obj);
				uni.hideLoading();

				if (res.code === 200) {
					if (res.datas) {
						_this.qrcode = res.datas.codeUrl;
						_this.time_remaining = res.datas.time_remaining;
					} else {
						uni.setStorage({
							key: '__order_state',
							data: '待付款',
							success(res) {
								console.log(res);
							},
							complete() {
								_this.$api.toorder();
							}
						});
					}

					return;
				}

				_this.$api.timerout(() => {
					_this.$api.msg(res.msg, 5000);
					_this.is_submit = 0;
				}, 800);
			});
		},
		ontimeend() {
			let _this = this;
			uni.showModal({
				title: '提示',
				content: '支付二维码已过期',
				confirmText: '重新生成',
				success: function(res) {
					if (res.confirm) {
						_this.loadQRCode();
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		}
		// #endif
	}
};
</script>

<style lang="scss">
.app {
}

.price-box {
	height: 266rpx;
	font-size: 28rpx;
	color: #909399;
}

.pay-type-list {
	padding-left: 60rpx;
	padding-right: 60rpx;

	.type-item {
		height: 120rpx;
		font-size: 30rpx;
	}

	.iconfont {
		width: 100rpx;
		font-size: 52rpx;
	}

	.iconhuiyuan {
		color: #fe8e2e;
	}

	.iconweixin {
		color: #36cb59;
	}

	.iconalipay {
		color: #01aaef;
	}

	.iconqq {
		color: #13c6fe;
	}

	.iconbaidu {
		color: #306cff;
	}

	.icontoutiao {
		color: #f85959;
	}

	.tit {
		font-size: $font-lg;
		color: $font-color-dark;
		margin-bottom: 4rpx;
	}

	.item {
		display: flex;
		flex-direction: column;
		font-size: $font-sm;
		color: $font-color-light;
	}
}
</style>
