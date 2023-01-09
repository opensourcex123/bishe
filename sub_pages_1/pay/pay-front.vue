<template>
	<view class="app w-full">
		<view class="price-box dflex-c dflex-flow-c">
			<view>支付金额</view>
			<view class="price fs-xxxl margin-top-sm">{{money}}</view>
		</view>

		<view class="pay-type-list">
			<!-- #ifdef MP-WEIXIN -->
			<view class="type-item dflex-b pos-r padding-tb-sm" @click="changePayType('微信支付')">
				<text class="iconfont iconweixin"></text>
				<view class="item flex1">
					<text class="tit">微信支付</text>
					<text>推荐使用</text>
				</view>
				<label class="radio">
					<radio value="" color="#FF6A6C" :checked="pay_way == '微信支付'" :disabled="money <= 0" />
					</radio>
				</label>
			</view>
			<!-- #endif -->
			
			<!-- #ifdef APP -->
			<view class="type-item dflex-b pos-r padding-tb-sm" @click="changePayType('支付宝')">
				<text class="iconfont iconalipay"></text>
				<view class="item flex1">
					<text class="tit">支付宝支付</text>
					<text>推荐使用</text>
				</view>
				<label class="radio">
					<radio value="" color="#FF6A6C" :checked="pay_way == '支付宝'" :disabled="money <= 0" />
				</label>
			</view>
			<!-- #endif -->
		</view>

		<view class="padding w-full margin-top-big pos-a" style="bottom: 30rpx;">
			<view class="dflex-b border-radius-big">
				<!-- #ifndef H5 || MP-360 -->
				<view class="tac padding-tb-sm flex1 bg-base" @click="confirm">{{pay_tip}}</view>
				<!-- #endif -->
			</view>
		</view>
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
				user_id: '',
				order_id: ''
			};
		},
		computed: {

		},
		onLoad(options) {
			this.money = options.money || 0;
			this.user_id = options.user_id;
			this.order_id = options.order_id;

			// #ifdef MP-WEIXIN 
			this.pay_way = '微信支付';
			this.pay_original = '微信支付';
			this.pay_trade_type = 'JSAPI';
			// #endif
			// #ifdef APP 
			this.pay_way = '支付宝';
			this.pay_original = '支付宝支付';
			this.pay_trade_type = '';
			// #endif
		},

		methods: {
			//选择支付方式
			changePayType(type, original, trade_type) {
				if (this.money <= 0) return;

				this.pay_way = type;
				if (original) this.pay_original = original;
				if (trade_type) this.pay_trade_type = trade_type;
				
				if(this.pay_trade_type == 'NATIVE') {
					this.loadQRCode();
				}
			},
			//确认支付
			confirm() {
				let _this = this;
				// #ifdef MP-WEIXIN
				uni.login({
					success(loginRes) {
						console.log('loginRes', loginRes);
						if (loginRes.code) {
				
							let obj = {
								code: loginRes.code,
								money: _this.money,
								pay_way: _this.pay_way,
								pay_original: _this.pay_original,
								pay_trade_type: _this.pay_trade_type,
							};
							_this.$func.usemall.call('order/payFrontMoney', obj).then(res => {
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
										
										// #ifdef MP-ALIPAY
										pay_datas = {
											tradeNO: res.datas.trade_no
										};
										// #endif
								
										// 检查当前 session 是否有效
										if(uni.canIUse('checkSession')){
											uni.checkSession({
												success() {
													// 调用支付
													_this.topayment(pay_datas);
												},
												fail() {
													// 当前 session 无效，调用 uni.login 获取数据
													uni.login({
														success() {
															// 调用支付
															_this.topayment(pay_datas);
														},
														fail() {
											
														}
													})
												},
											})
										} else {
											// 调用支付
											_this.topayment(pay_datas);
										}
								
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
				})
				// #endif
				
				// #ifdef APP-PLUS
				let obj = {
					money: _this.money,
					pay_way: _this.pay_way,
					pay_original: _this.pay_original,
					pay_trade_type: _this.pay_trade_type,
				};
				_this.$func.usemall.call('order/payFrontMoney', obj).then(res => {
					console.log('支付接口', res.datas);
					if (res.code === 200) {
						if (res.datas) {
							// 调用支付
							const pay_datas = {
								provider: 'alipay',
								orderInfo: res.datas.info
							};
							console.log('执行了=====》', pay_datas);
							_this.topayment(pay_datas);
						}
					}
					})
				// #endif
				
			},
			async topayment(pay_datas) {
				let _this = this;
				
				const cidRes = await this.$db['uni-id-device'].where({user_id: this.user_id}).tofirst();
				uni.requestPayment({
					...pay_datas,
					success: function(pres) {
						console.log('requestPayment success:', pres);
						getApp().pushMsg(cidRes.datas.push_clientid, '定金支付', '客户定金支付成功', {}, _this.order_id)
						uni.redirectTo({
							url: `/sub_pages_1/pay/success?order_id=${_this.order_id}`
						});
						return;
					},
					fail: function(err) {
						console.log('requestPayment fail:', err);
						_this.$api.toorder();
					}
				});
			},
		}
	}
</script>

<style lang='scss'>
	.app { }

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
