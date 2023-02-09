<template>
	<view class="user-area">
		<view class="header-area padding-lr-sm padding-top">
			<view class="dflex-b">
				<view class="member-area padding-top-sm margin-bottom dflex pos-r" @click="to('/sub_pages_2/uni-id-pages/pages/userinfo/userinfo')">
					<view>
						<image v-if="member.avatar_file" class="headimg border-radius-c" :src="member.avatar_file.url"></image>
						<image class="headimg border-radius-c" :src="'/static/images/logo.png'" v-else></image>
					</view>
					<view class="margin-left-sm">
						<view class="info-box">
							<text v-if="member" class="fs-lg">{{ member.nickname || '用户' }}</text>
							<text class="fs-lg" v-else>{{ '用户' }}</text>
						</view>
						<!-- 						<view v-if="member.member_city">
							<text class="fs-xxs">{{ member.member_city }}</text>
						</view> -->
					</view>
					<view v-if="member && is_mp" class="padding" @click.stop="updateMember"><view :class="{ rotate: isreq }" class="animated iconfont">&#xe6ff;</view></view>
				</view>
				<view class="border-radius-big bg-base dflex-c padding-lr" @click="copy">
					<view class="iconfont fs-xl iconqiandao margin-right-xs"></view>
					<view>复制id</view>
				</view>
			</view>

			<view class="border-radius">
				<!-- <view class="vip-card-area pos-r padding-lr padding-tb-sm">
					<view>
						<text class="iconfont iconhuiyuan text-white"></text>
						<text class="margin-left-sm text-white">码店 会员</text>
					</view>
				</view> -->

				<view class="stats-area dflex-c bg-main">
					<view class="item dflex dflex-flow-c" @click="to('/sub_pages_1/user/coupon/coupon')">
						<!-- <text class="num">{{ coupon_count }}</text> -->
						<text>优惠券</text>
						<view class="vertical-line"></view>
					</view>
					<!-- <view class="item dflex dflex-flow-c" @click="to('/sub_pages_1/user/equity-card/equity-card')">
						<text class="num">{{ member.member_coupon_cnt || 6 }}</text>
						<text>权益卡</text>
						<view class="vertical-line"></view>
					</view> -->
					<view class="item dflex dflex-flow-c" @click="to('/sub_pages_1/user/warranty-receipt/warranty-receipt?index=0')">
						<!-- <text class="num">{{ warranty_count }}</text> -->
						<text>质保卡</text>
						<view class="vertical-line"></view>
					</view>
					<view class="item dflex dflex-flow-c" @click="to('/sub_pages_1/bill/bill')">
						<text>发票</text>
						<view class="vertical-line"></view>
					</view>
				</view>
			</view>
		</view>

		<view class="container-area padding-lr-sm padding-bottom-sm">
			<!-- 我的订单 -->
			<view class="border-radius margin-top-sm bg-main">
				<use-list-title
					title="我的订单"
					iconfont="icondingdan"
					color="#ff6a6c"
					fwt="600"
					tip="查看全部订单"
					@goto="toOrder('/sub_pages_1/user/order/order', '全部')"
				></use-list-title>

				<view class="order-area padding-bottom-sm padding-lr dflex-c">
					<view class="item dflex dflex-flow-c" @click="toOrder('/sub_pages_1/user/order/order', '待接单')">
						<view class="iconfont-1">&#xe657;</view>
						<text>待接单</text>
					</view>
					<view class="item dflex dflex-flow-c" @click="toOrder('/sub_pages_1/user/order/order', '已接单')">
						<view class="iconfont-1">&#xe616;</view>
						<text>待上门</text>
					</view>
					<view class="item dflex dflex-flow-c" @click="toOrder('/sub_pages_1/user/order/order', '待评价')">
						<view class="iconfont-1">&#xe904;</view>
						<text>待评价</text>
					</view>
				</view>
			</view>

			<view class="border-radius margin-top-sm bg-main">
				<!-- <use-list-title
					title="我的奖品"
					iconfont=" "
					iconfont1="icon-wodejiangpin"
					color="#ffab6c"
					fwt="600"
					:tip="stats.browsing"
					@goto="to('/pages/user/prize/prize')"
				></use-list-title> -->
				<!-- <scroll-view scroll-x class="browsing-area padding-lr">
					<view class="dflex">
						<view v-for="(item, index) in historyDatas" :key="index">
							<image class="border-radius-sm margin-right-sm" @click="togoods(item)" :src="item.img"
								mode="aspectFill"></image>
						</view>
					</view>
				</scroll-view> -->
				<use-list-title
					title="地址管理"
					iconfont="icondizhi-"
					color="#ff6a6c"
					fwt="600"
					:tip="stats.collect"
					@goto="to('/sub_pages_1/user/address/address')"
				></use-list-title>
				<use-list-title title="我的客服" iconfont="iconkefu-01" color="#ffab6c" fwt="600" @goto="serviceVisible = true"></use-list-title>
				<u-popup :show="serviceVisible" :round="10" :closeable="true" @close="close" @open="open" mode="bottom">
					<view style="padding-top: 3%;">
						<text class="padding-left" style="font-size: larger; font-weight: bolder;">请选择咨询方式</text>
						<!-- #ifdef MP-WEIXIN -->
						<button class="btn no-border" open-type="contact"><use-list-title title="微信客服" tip="快速响应" iconfont=" " fwt="300"></use-list-title></button>
						<!-- #endif -->
					</view>
				</u-popup>
				<use-list-title title="设置" iconfont="iconshezhi-" color="#58bc8a" fwt="600" @goto="to('/sub_pages_1/user/setting/setting')"></use-list-title>
				<use-list-title title="工程师入口" iconfont=" " iconfont1="icon-gongchengshi" color="#1296db" fwt="600" @goto="toEnginner"></use-list-title>
			</view>

			<view v-if="member" class="border-radius margin-top-sm padding-sm dflex-c bg-main log-out-btn" @click="openActionSheet"><text class="cell-tit">退出登录</text></view>
			<view
				v-else
				class="border-radius margin-top-sm padding-sm dflex-c bg-main log-out-btn"
				@click="to('/sub_pages_2/uni-id-pages/pages/login/login-withoutpwd?type=weixin')"
			>
				<text class="cell-tit">去登录</text>
			</view>

			<!-- 操作菜单 -->
			<use-action-sheet v-model="actionSheetShow" :list="actionSheetList" :tips="actionSheetTips" @click="actionSheetClick" @close="actionSheetClose"></use-action-sheet>
		</view>
		<use-copyright></use-copyright>
	</view>
</template>
<script>
const _history = 'usemall-goods-history';
export default {
	data() {
		return {
			isreq: false,
			// 浏览历史
			historyDatas: {},
			// 统计数据
			member: uni.getStorageSync('uni-id-pages-userInfo') || '',
			stats: {},

			actionSheetShow: false,
			actionSheetList: [],
			actionSheetTips: {
				text: '',
				color: '#9a9a9a',
				size: 24
			},

			is_mp: false,
			is_alipay: false,
			// 客服弹出框
			serviceVisible: false,
			coupon_count: 0,
			warranty_count: 0,
		};
	},
	onLoad() {
		this.$nextTick(() => {
			this.is_mp = this.$env.is_mp;
			this.is_alipay = this.$env.platform == 'alipay';
		});
	},
	onShow() {
		let _this = this;

		this.loadData();
	},
	methods: {
		copy() {
			if (!this.member) {
				this.$api.tologin();
				return;
			}
			
			let _this = this;
			uni.setClipboardData({
				data: _this.member._id,
				success: function(res) {
					uni.getClipboardData({
						success: function(res) {
							uni.showToast({
								title: '复制成功'
							});
						}
					});
				}
			});
		},
		tabChange(item) {
			switch (item.index) {
				case 0:
					this.$nextTick(() => {
						uni.pageScrollTo({
							selector: '.a'
							// scrollTop: 100,
						});
					});
					break;
				case 1:
					this.$nextTick(() => {
						uni.pageScrollTo({
							selector: '.b'
						});
					});
					break;
				case 2:
					this.$nextTick(() => {
						uni.pageScrollTo({
							selector: '.c'
						});
					});
					break;
				case 3:
					this.$nextTick(() => {
						uni.pageScrollTo({
							selector: '#shuiDianWeiXiu',
							duration: 100
						});
					});
					break;
			}
		},
		// 加载数据
		loadData() {
			this.member = uni.getStorageSync('uni-id-pages-userInfo') || '';
			this.$func.usemall.call('member/data').then(res => {
				if (res.code == 200) {
					// this.putMember(res.datas.member);
					console.log('member/data', res);

					this.stats = res.datas.stats;
					this.stats.order_state = {};
					this.stats.order.forEach(_order => {
						this.stats.order_state[_order._id] = _order.num;
					});
				}
			});

			// 浏览历史
			this.$db['usemall-goods-history, usemall-goods']
				.collection()
				.where('create_uid == $env.uid')
				.field('visit_cnt, last_modify_time, goods._id as goods_id, goods.img as goods_img, goods.state as goods_state')
				.orderBy('last_modify_time desc')
				.get()
				.then(res => {
					if (res && res.result && res.result.code === 0) {
						let _historyDatas = [];
						res.result.data.forEach(x => {
							x._id = x.goods_id[0];
							x.img = x.goods_img[0];
							x.state = x.goods_state[0];
							_historyDatas.push(x);
						});
						this.historyDatas = _historyDatas;
					}
				});
		},

		// 打开操作菜单
		openActionSheet() {
			this.actionSheetShow = true;

			this.$api.timerout(() => {
				this.actionSheetList = [
					{
						text: '退出登录',
						color: '#333'
					},
					{
						text: '切换账号',
						color: '#333'
					}
				];
			}, 0);
		},
		// 关闭操作菜单
		actionSheetClose() {
			console.log(this.actionSheetShow);
		},
		// 点击操作菜单
		async actionSheetClick(index) {
			const uniIdCo = uniCloud.importObject('uni-id-co');
			const res11 = await uniIdCo.logout();
			switch (index) {
				case 0:
					this.$api.msg('退出成功');
					// this.logout();
					uni.removeStorageSync('uni-id-pages-userInfo');
					this.member = '';
					this.$api.timerout(() => {
						this.$api.tohome();
					}, 200);
					break;
				case 1:
					this.$api.tologin();
					break;
			}
		},

		updateMember() {
			if (this.isreq) return;
			this.isreq = true;
			let _this = this;

			uni.getUserProfile({
				desc: '更新会员信息',
				lang: 'zh_CN',
				success(res) {
					_this.$func.usemall
						.call('member/update', {
							nickname: res.userInfo.nickName,
							gender: res.userInfo.gender,
							avatar: res.userInfo.avatarUrl,
							comment: [res.userInfo.country, res.userInfo.province, res.userInfo.city].filter(x => x).join('-')
						})
						.then(res => {
							_this.isreq = false;

							if (res.code == 200) {
								_this.loadData();
								return;
							}

							_this.$api.msg(res.msg);
						});
				},
				fail(err) {
					console.log(err);
					_this.isreq = false;
				}
			});
		},

		// 统一跳转接口，拦截未登录路由
		to(url) {
			// let _this = this;
			// this.$func.usemall.call('unipush/create', {
			// 	cid: '09b8206d2601d7e6dade762028c1733d',
			// 	title: '报价推送',
			// 	content: 'asda',
			// 	payload: {
			// 		price: 10000,
			// 		order_id: '1668416878199098085',
			// 		cid: '09b8206d2601d7e6dade762028c1733d',
			// 		scanner: '11dc4ff5c6246acfe72577ae981f3ab1',
			// 		list: {'634cb91f548ef400015d7aee': [{'name': 'sdafsa', 'price': '100元'}, {'name': 'sdafsa', 'price': '100元'}]} }}).then(res => {
			// 	console.log(res);
			// })
			if (!this.member) {
				this.$api.tologin();
				return;
			}

			uni.navigateTo({
				url
			});
		},
		// 跳转到 订单
		toOrder(url, state) {
			if (!this.member) {
				this.$api.tologin();
				return;
			}

			uni.setStorage({
				key: '__order_state',
				data: state,
				success(res) {
					console.log(res);
				},
				complete() {
					uni.navigateTo({
						url
					});
				}
			});
		},

		// 跳转商品详情
		togoods(item) {
			this.$api.togoods({
				id: item._id
			});
		},
		toEnginner() {
			if (!this.member) {
				this.$api.tologin();
				return;
			}
			this.$func.usemall.call('engineers/checkAuth', {}).then(res => {
				console.log(res);
				if (res.datas.rows === 0) {
					// uni.showToast({
					// 	title: "您还不是工程师"
					// })
					uni.navigateTo({
						url: '/sub_pages_1/enginner/apply/apply'
					});
				} else {
					uni.navigateTo({
						url: '/sub_pages_1/enginner/home/home'
					});
				}
			});
		},

		// 打开客服框
		open() {
			console.log('open');
		},
		// 关闭客服框
		close() {
			this.serviceVisible = false;
		},
		// 跳转创建订单页
		toOrderCreate(id) {
			// if (!this.islogin) {
			// 	this.$api.tologin();
			// 	return;
			// }
			uni.navigateTo({
				url: `/sub_pages_1/order/create?goods_id=${id}`
			});
		}
		// tabChange(item) {
		// 	switch (item.index) {
		// 		case 0:
		// 			this.$nextTick(() => {
		// 				uni.pageScrollTo({
		// 					selector: '.a',
		// 					duration: 300
		// 					// scrollTop: 100,
		// 				});
		// 			});
		// 			break;
		// 		case 1:
		// 			this.$nextTick(() => {
		// 				uni.pageScrollTo({
		// 					selector: '.b',
		// 					duration: 300
		// 				});
		// 			});
		// 			break;
		// 		case 2:
		// 			this.$nextTick(() => {
		// 				uni.pageScrollTo({
		// 					selector: '.c',
		// 					duration: 300
		// 				});
		// 			});
		// 			break;
		// 		case 3:
		// 			this.$nextTick(() => {
		// 				uni.pageScrollTo({
		// 					selector: '.d',
		// 					duration: 300
		// 				});
		// 			});
		// 			break;
		// 	}
		// }
	}
};
</script>
<style lang="scss">
.l-mask {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: rgba(51, 51, 51, 0.3);
	z-index: 99;
}
page {
	min-height: 100%;
	background: $page-color-base;
}

.u-button {
	width: 40% !important;
}

.member-area {
	image {
		width: 130rpx;
		height: 130rpx;
		border: 5rpx solid #fff;
	}
}

.vip-card-area {
	color: #f7d680;
	background: linear-gradient(to left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8));
}

.stats-area {
	.item {
		padding: 30rpx 0;
	}

	.num {
		font-size: $font-lg;
		color: $font-color-dark;
		margin-bottom: 6rpx;
	}
}

.order-area {
	.item {
	}

	.iconfont {
		position: relative;
		font-size: $font-lg + 8upx;

		.badge {
			right: initial;
		}
	}
}

.stats-area .item,
.order-area .item {
	position: relative;
	font-size: $font-sm;
	color: $font-color-base;
	flex: 1;
}

.browsing-area {
	image {
		width: 160rpx;
		height: 160rpx;
	}
}

::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
	display: none;
}

.log-out-btn {
	color: $font-color-base;
}

.box-container {
	position: absolute;
	width: 500rpx;
	height: 300rpx;
	background: #fff;
	left: 50%;
	transform: translate(-50%, -50%);
	top: 50%;
	z-index: 999;
	border-radius: 10rpx;
	text-align: center;
	padding: 30rpx;

	.title {
		margin-top: 40rpx;
		font-size: 30rpx;
	}

	.btn-contaer {
		display: flex;
		position: absolute;
		bottom: 30rpx;
		left: 30rpx;
		right: 30rpx;
	}

	button {
		background: #eee;
		color: #333;
		width: 50%;
		font-size: 28rpx;

		&:last-child {
			margin-left: 10px;
			background: #26a92e;
			color: #fff;
		}
	}
}
</style>
