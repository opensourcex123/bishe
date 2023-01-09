<template>
	<view class="container">

		<view class="pos-f w-full navbar-area bg-main">
			<view class="state-area dflex-a">
				<view v-for="(item, index) in navList" :key="index" :class="{ active: tabCurrentIndex === index }" class="nav-item dflex-c pos-r fs padding-lr-lg h-full"
				 @click="tabClick(index)">
					{{ item.state }}
				</view>
			</view>
		</view>

		<swiper :current="tabCurrentIndex" :disable-touch="true" class="swiper-box swiper-area h-full" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content h-full" scroll-y>
					<!-- 空白页 -->
					<use-empty v-if="tabItem.datas.length === 0 && tabItem.loaded" e-style="round" e-type="cart" tip="暂无优惠券" height="93vh"></use-empty>
					<view class="padding-lr" v-for="(item, index) in tabItem.datas" :key="index">
						<view class="coupon_box border-radius margin-top-sm bg-main" :class="[{ 'disabled': tabItem.state != '未使用' }]">
							<view class="dflex-b">
								<view class="left pos-a h-full dflex-c dflex-flow-c">
									<view>
										<text class="price fs-big">{{ item.price }}</text>
									</view>
									<view class="fs-sm" v-if="item.amount > 0">满{{ item.amount }}元使用</view>
								</view>
								<view class="right padding left_t flex1">
									<view class="dflex-b padding-bottom-xs">
										<view class="fwb fs">{{ item.name }}</view>
									</view>
									<view class="dflex-b ft-dark fs-xs padding-bottom border-line">
										<view class="">有效期至 {{ $dayjs(item.deadline).format('YYYY-MM-DD') }}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabCurrentIndex: 0,
				navData: {},
				navList: [{
						id: 0,
						state: '未使用',
						loadingType: 'more',
						datas: []
					},
					{
						id: 1,
						state: '已过期',
						loadingType: 'more',
						datas: []
					}
				],
				scrollLeft: 0
			};
		},
		onLoad(options) {
			this.loadData();
		},
		methods: {
			// 加载数据
			loadData() {
				let _this = this;
				this.$db['coupons'].where('user_id == $env.uid').tofulllist().then(res => {
					res.datas.forEach(item => {
						if (item.deadline >= _this.$dayjs().valueOf()) {
							this.navList[0].datas.push(item);
						} else {
							this.navList[1].datas.push(item);
						}
					})
				})
			},

			// swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
			},
			// 顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
		}
	};
</script>

<style lang="scss">
	page,
	.container {
		min-height: 100%;
		background: $page-color-base;
	}

	.container {
		padding-top: 7vh;
	}

	/* 优惠券状态区 */
	.navbar-area {
		top: 0;
		white-space: nowrap;

		.state-area {
			height: 7vh;
			box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
			z-index: 10;
		}

		.nav-item {
			flex: 1;

			&.active {
				&:after {
					content: '';
					position: absolute;
					left: 50%;
					transform: translate(-50%);
					bottom: 0;
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	/* #ifdef H5 */
	.navbar-area {
		margin-top: calc(44px + env(safe-area-inset-top));
	}

	/* #endif */

	/* 优惠券轮播区 */
	.swiper-area {
		height: 93vh;
	}

	.coupon_box {
		position: relative;
		&:last-child {
			margin-bottom: 20rpx;
		}
		.left {
			background-color: $base-color;
			color: #fff;
			width: 30%;

			.price {
				color: #fff !important;
			}
		}

		.right {
			margin-left: 30%;
		}

		.discount {
			font-weight: 580;
		}

		.discount::after {
			content: '折';
			font-size: 24rpx;
			margin-left: 6rpx;
		}

		.border-line {
			border-bottom: 1px dotted #ededed;
		}
	}

	.disabled {
		.left {
			background-color: #d9d9d9;
			color: #b2b2b2 !important;

			.price {
				color: #b2b2b2 !important;
			}
		}

		.iconfont {
			position: absolute;
			top: 0rpx;
			right: 30rpx;
			font-size: 110rpx;
		}
	}
</style>
