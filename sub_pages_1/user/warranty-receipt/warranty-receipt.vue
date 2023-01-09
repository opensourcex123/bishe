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
					<use-empty v-if="tabItem.datas.length === 0 && tabItem.loaded" e-style="round" e-type="cart" tip="暂无质保卡" height="93vh"></use-empty>
					<view class="padding-lr" @click="toOrderDetail(item)" v-for="(item, index) in tabItem.datas" :key="index">
						<view class="coupon_box border-radius margin-top-sm bg-main">
							<view class="dflex-b">
								<view class="left pos-a h-full dflex-c dflex-flow-c">
									<view class="fs-sm">{{item.name}}</view>
								</view>
								<view class="right padding left_t flex1">
									<view class="dflex-b ft-dark fs-xs border-line">
										<view class="">有效期至 {{ item.deadline_format }}</view>
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
				navData: [],
				navList: [{
						id: 0,
						loadingType: 'more',
						state: '未过期',
						datas: []
					},
					{
						id: 1,
						loadingType: 'more',
						state: '已过期',
						datas: []
					}
				],
				scrollLeft: 0
			};
		},
		onLoad(options) {
			this.tabCurrentIndex = parseInt(options.index);
			this.loadData();
		},
		methods: {
			// 点击跳转详情页面
			toOrderDetail(item) {
				console.log(item)
				uni.navigateTo({
					url: `/sub_pages_1/user/order/order-detail?order_id=${item.order_id}`
				});
			},
			// 加载数据
			async loadData() {
				const db = uniCloud.database();
				let _this = this;
				let list = [];
				let res = await db.collection('usemall-order, warranty-card')
				.where('create_uid == $env.uid')
				.where({state: db.command.in(['已付款', '待评价', '已完成'])})
				.get()

				list = res.result.data;
				list.forEach(item => {
					item.warranty_card_id.forEach(warranty => {
						let deadline = item.start_time + warranty.duration;
						warranty.deadline = deadline;
						warranty.order_id = item.order_id;
						warranty.deadline_format = _this.$dayjs(deadline).format('YYYY-MM-DD');
						if (warranty.deadline >= _this.$dayjs().valueOf()) {
							this.navList[0].datas.push(warranty);
						} else {
							this.navList[1].datas.push(warranty);
						}
					})
				});
				console.log(list);
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
