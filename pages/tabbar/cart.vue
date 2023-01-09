<template>
	<view class="container bg-drak" :class="{ 'margin-bottom-big': !empty }">
		<!-- 00. 未授权登录 -->
		<use-empty v-if="!islogin" e-type="unauthorized" tip="当前未授权" btn-tip="去登录" height="70vh" :auto="false"
			@goto="tologin"></use-empty>
		<!-- 00. 空白页 -->
		<view v-else-if="empty">
			<use-empty e-type="cart" tip="购物车空空,快去挑选服务吧~" height="50vh"></use-empty>
			<!-- 03. 分类推荐 -->
			<!-- <use-hot-goods title-type="round" title="热门推荐"></use-hot-goods> -->
			<view>
				<uni-segmented-control styleType="text" activeColor="#2979ff;" :current="current" :values="items" @clickItem="onClickItem">
				</uni-segmented-control>
				<view class="content">
					<view style="width:100%" v-show="current === 0">
						<view class="cart-list padding-sm">
							<block v-for="(item, index) in jingXuanDatas" :key="item._id">
								<view class="cart-item bg-main padding-lg dflex-s border-radius" @click="togoods1(item)">
									<view class="image-wrapper pos-r">
										<!-- 商品图片 -->
										<image class="border-radius-xs wh-full" mode="aspectFill" :lazy-load="true"
											:src="item.img">
										</image>
									</view>
									<view style="display: flex; flex-direction: column; justify-content: space-between;" class="item-right padding-left">
										<view style="display: flex; flex-direction: column;">
											<view class="dflex" style="font-size: large; font-weight: bolder;">
												{{item.name}}
											</view>
											<view>
												<text>保修90天 快速响应 计价器报价</text>
											</view>
										</view>
										
										<view class="dflex-b w-full">
											<view class="padding-tb-sm">
												<text class="price">{{ item.price / 100 }}</text>
											</view>
											<button class="cu-btn round bg-blue" @click.stop="toOrderCreate(item._id)">立即预约</button>
										</view>
									</view>
								</view>
							</block>
						</view>
					</view>
					<view style="width:100%" v-show="current === 1">
						<view class="cart-list padding-sm">
							<block v-for="(item, index) in jiaDianWeiXiu" :key="item._id">
								<view class="cart-item bg-main padding-lg dflex-s border-radius" @click="togoods1(item)">
									<view class="image-wrapper pos-r">
										<!-- 商品图片 -->
										<image class="border-radius-xs wh-full" mode="aspectFill" :lazy-load="true"
											:src="item.img">
										</image>
									</view>
									<view style="display: flex; flex-direction: column; justify-content: space-between;" class="item-right padding-left">
										<view style="display: flex; flex-direction: column;">
											<view class="dflex" style="font-size: large; font-weight: bolder;">
												{{item.name}}
											</view>
											<view>
												<text>保修90天 快速响应 计价器报价</text>
											</view>
										</view>
										
										<view class="dflex-b">
											<view class="padding-tb-sm">
												<text class="price">{{ item.price }}</text>
											</view>
											<button class="cu-btn round bg-blue" @click.stop="toOrderCreate(item._id, item.sku_id)">立即预约</button>
										</view>
									</view>
								</view>
							</block>
						</view>
					</view>
					<view style="width:100%" v-show="current === 2">
						<view class="cart-list padding-sm">
							<block v-for="(item, index) in jiaDianQingXi" :key="item._id">
								<view class="cart-item bg-main padding-lg dflex-s border-radius" @click="togoods1(item)">
									<view class="image-wrapper pos-r">
										<!-- 商品图片 -->
										<image class="border-radius-xs wh-full" mode="aspectFill" :lazy-load="true"
											:src="item.img">
										</image>
									</view>
									<view style="display: flex; flex-direction: column; justify-content: space-between;" class="item-right padding-left">
										<view style="display: flex; flex-direction: column;">
											<view class="dflex" style="font-size: large; font-weight: bolder;">
												{{item.name}}
											</view>
											<view>
												<text>保修90天 快速响应 计价器报价</text>
											</view>
										</view>
										
										<view class="dflex-b">
											<view class="padding-tb-sm">
												<text class="price">{{ item.price / 100 }}</text>
											</view>
											<button class="cu-btn round bg-blue" @click.stop="toOrderCreate(item._id, item.sku_id)">立即预约</button>
										</view>
									</view>
								</view>
							</block>
						</view>
					</view>
					<view style="width:100%" v-show="current === 3">
						<view class="cart-list padding-sm">
							<block v-for="(item, index) in jiaDianAnZhuang" :key="item._id">
								<view class="cart-item bg-main padding-lg dflex-s border-radius" @click="togoods1(item)">
									<view class="image-wrapper pos-r">
										<!-- 商品图片 -->
										<image class="border-radius-xs wh-full" mode="aspectFill" :lazy-load="true"
											:src="item.img">
										</image>
									</view>
									<view style="display: flex; flex-direction: column; justify-content: space-between;" class="item-right padding-left">
										<view style="display: flex; flex-direction: column;">
											<view class="dflex" style="font-size: large; font-weight: bolder;">
												{{item.name}}
											</view>
											<view>
												<text>保修90天 快速响应 计价器报价</text>
											</view>
										</view>
										
										<view class="dflex-b">
											<view class="padding-tb-sm">
												<text class="price">{{ item.price / 100 }}</text>
											</view>
											<button class="cu-btn round bg-blue" @click.stop="toOrderCreate(item._id, item.sku_id)">立即预约</button>
										</view>
									</view>
								</view>
							</block>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 00. 列表 -->
		<view v-else>
			<!-- 01. 购物车列表 -->
			<view class="cart-list padding-sm">
				<block v-for="(item, index) in cartDatas" :key="index">
					<view class="cart-item bg-main margin-bottom-sm padding-lg pos-r dflex-s border-radius">
						<view class="image-wrapper pos-r" @click="togoods(item)">
							<!-- 商品图片 -->
							<image class="border-radius-xs wh-full" mode="aspectFill" :lazy-load="true"
								:src="item.goods.img">
							</image>
							<!-- 选中|未选中按钮 -->
							<view
								class="iconfont checkbox pos-a bg-main border-radius-big"
								:class="{active: item.checked, iconxuanzhongzhuangtai: item.checked, iconweixuanzhongzhuangtai: !item.checked}"
								@tap.stop="check('item', index)"></view>

						</view>
						<view class="item-right padding-left pos-r w-full">
							<!-- 商品名称 -->
							<view class="clamp-2 title" @click="togoods(item)">
								{{item.goods.name}}
							</view>
							<view class="ft-dark fs-xs padding-top-xs">{{ item.goods_sku.spec || '&nbsp;&nbsp;' }}
							</view>
							<view class="padding-tb-sm">
								<text class="price" v-if="item.goods_sku.price">{{ item.goods_sku.price/100 }}{{item.goods_sku.unit}}</text>
								<text class="price" v-else>{{ item.goods.price / 100 }}{{item.goods.unit}}</text>
							</view>
						</view>

						<!-- 删除 -->
						<view class="del-btn iconfont iconlajitong-01 pos-a border-radius-c dflex-c ft-dark fs-xl"
							@tap.stop="deleteCart(item._id)"></view>
					</view>
				</block>
			</view>

			<!-- 02. 底部操作栏 -->
			<view class="action-section dflex w-full bg-main pos-f padding-right">
				<view class="checkbox pos-r h-full dflex-c">
					<view class="padding-lr iconfont"
						:class="{active:allChecked,iconxuanzhongzhuangtai: allChecked, iconweixuanzhongzhuangtai: !allChecked}"
						@click="check('all')"></view>
					<view class="clear-btn pos-a tac ft-white" :class="{ show: allChecked }" @click="clearCart">清空
					</view>
				</view>
				<view class="total-box flex1 tar padding-right-lg">
					<text class="price">{{total || 0}}元起</text>
				</view>
				<button type="primary" class="payment no-border border-radius-lg fs" @click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	const _cart = 'usemall-goods-cart'
	export default {
		data() {
			return {
				// 空白页
				empty: false,
				// 购物车数据
				cartDatas: [],
				// 全选状态
				allChecked: false,
				// 总价格
				total: 0,
				islogin: true,
				current: 0,
				items: ['精选', '家电维修', '家电清洗', '家电安装'],
				jingXuanDatas: [],
				jiaDianWeiXiu: [{
						_id: "1665539935240327279",
						img: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/b3075dd2-aa51-4b4a-b01a-6670f07157bf.jfif",
						name: "挂机空调维修",
						extra: "空调不制冷/漏水/噪音大...",
						price: 98,
						sku_id: "63632cc0f1492c00018ce10d"
					},
					{
						_id: "1667292436721923230",
						img: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/f59a2653-1f05-4bb5-8f12-f46e0fcb9bf2.jpeg",
						name: "洗衣机维修",
						extra: "[保修90天]告别油垢污渍",
						price: 79,
						sku_id: ""
					}
				],
				jiaDianQingXi: [{
						_id: "1667365859678660854",
						img: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/78bb9fa1-5300-44ad-951b-719fb99e163d.jpeg",
						name: "油烟机清洗（拆机洗）",
						extra: "[强力除油污]告别油垢污渍",
						price: 16600,
						sku_id: "6361fbe35125130001f0b583",
					},
					{
						_id: "1667365374418915975",
						img: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/54a71c96-439a-48f1-8da4-dd6ec27ff3f3.jpeg",
						name: "滚筒洗衣机清洗（不拆机）",
						extra: "[除霉除污垢]去除洗衣桶内壁细...",
						price: 15800,
						sku_id: "6361f9fe53a7f30001886755",
					}
				],
				jiaDianAnZhuang: [
					{
						_id: "1667439223445738437",
						price: 3000,
						name: "挂机空调拆卸、安装",
						sku_id: "63631a77ce2777000195e0fe",
						img: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/14c2bf1f-1ad3-471d-aee8-21033f499ad3.jpeg",
					},
					{
						_id: "1667439356256612762",
						price: 3000,
						name: "电视安装",
						sku_id: "",
						img: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/35cc525e-97bd-4bfe-b443-33520e1f1117.jpeg",
					}
				],
			};
		},
		watch: {
			//显示空白页
			cartDatas(e) {
				let empty = e.length === 0;
				if (this.empty !== empty) {
					this.empty = empty;
				}
			}
		},
		// 监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
		onShow() {
			if (!uni.getStorageSync('uni-id-pages-userInfo')) {
				this.islogin = false;
				return;
			}
			this.loadData();
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.loadData(() => {
				uni.stopPullDownRefresh();
			});
		},

		methods: {
			// 跳转创建订单页
			toOrderCreate(id, sku_id) {
				uni.navigateTo({
					url: `/sub_pages_1/order/create?goods_id=${id}&sku_id=${sku_id || ''}`,
				});
			},
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			//请求数据
			loadData(callback) {
				this.$db['usemall-goods-cart,usemall-goods,usemall-goods-sku'].collection()
					.where('create_uid == $env.uid')
					.field(
						'_id, goods_num, goods_sku.spec, goods_sku.price, goods_sku.unit, goods.price, goods.unit, goods.market_price, goods.stock_num, goods.name,goods.name_pw ,last_modify_time, goods._id as goods_id, goods.img, goods.state'
					)
					.orderBy('last_modify_time desc')
					.get()
					.then(res => {
						if (res && res.result && res.result.code === 0) {
							let _cartDatas = [];
							res.result.data.forEach(x => {
								x.goods = x.goods[0];
								x.goods_id = x.goods_id[0];
								x.goods_sku = x.goods_sku[0] || {};

								if (x.goods && x.goods_id) _cartDatas.push(x);
							});
							// 购物车数据
							this.cartDatas = _cartDatas;
							console.log('asdfasdf', this.cartDatas);
							// 计算总价
							this.calcTotal();

							if (typeof callback === 'function') {
								// 数据加载完成回调函数
								callback();
							}
						}
					})
				this.$db['usemall-goods'].where({limited: 1}).tolist().then(res => {
					this.jingXuanDatas = res.datas;
				})
				return;
			},
			// 跳转登录页
			tologin() {
				this.$api.tologin();
			},
			// 跳转商品页
			togoods(item) {
				this.$api.togoods({
					id: item.goods_id
				});
			},
			togoods1(item) {
				this.$api.togoods({
					id: item._id
				});
			},

			// 选中状态处理
			check(type, index) {
				console.log(index);
				if (type === 'item') {
					this.cartDatas[index].checked = !this.cartDatas[index].checked;
				} else {
					const checked = !this.allChecked
					this.cartDatas.forEach(item => {
						item.checked = checked;
					})
					this.allChecked = checked;
				}

				this.calcTotal();
			},
			// 删除
			deleteCart(id) {
				let _this = this
				uni.showModal({
					title: '提示',
					content: '删除购物车',
					success: function(res) {
						if (res.confirm) {
							_this.$db[_cart].where('create_uid == $env.uid').remove(id)
								.then(res => {
									if (res.code === 200) {
										_this.loadData();
									}
								})
						} else if (res.cancel) {}
					}
				});
			},
			// 清空
			clearCart() {
				let _this = this;
				uni.showModal({
					title: '提示',
					content: '清空购物车',
					success: function(res) {
						if (res.confirm) {
							_this.$db[_cart].where('create_uid == $env.uid').remove()
								.then(res => {
									if (res.code === 200) {
										_this.cartDatas = [];
										return;
									}
									_this.$api.msg(res.msg)
								})
						} else if (res.cancel) {}
					}
				});
			},
			// 计算总价
			calcTotal() {
				if (this.cartDatas.length === 0) {
					this.empty = true;
					return;
				}

				let total = 0,
					checked = true;

				this.cartDatas.forEach(item => {
					if (item.checked) {
						if (item.goods_sku.price) {
							total += (item.goods_sku.price / 100);
						} else {
							total += (item.goods.price / 100);
						}
					} else if (checked) {
						checked = false;
					}
				})

				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			// 创建订单
			createOrder() {
				let cart_ids = [];
				this.cartDatas.forEach(item => {
					// 选中有库存购物车
					if (item.checked) {
						cart_ids.push(item._id)
					}
				})
				if (cart_ids.length <= 0) {
					this.$api.msg('请选择结算商品')
					return;
				}
				uni.navigateTo({
					url: `/sub_pages_1/order/cart-create?cart_ids=${cart_ids.join(',')}`
				})
			},
		},
	}
</script>

<style lang='scss'>
	.content {
		display: flex;
		justify-content: center;
		height: auto;
		align-items: center;
		text-align: center;
	}
	
	.u-button {
		width: 40% !important;
	}

	page {
		min-height: 100%;
	}

	/* 购物车列表项 */
	.cart-item {

		&:last-child {
			margin-bottom: 0;
		}

		.image-wrapper {
			width: 230rpx;
			height: 230rpx;
			flex-shrink: 0;

			image {
				opacity: 1;
			}
		}

		.checkbox {
			top: -16rpx;
			left: -16rpx;
			color: $font-color-disabled;
			line-height: 1;
			font-size: 46rpx;
			padding: 5rpx;
			z-index: 8;
		}

		.disabled {
			color: #fff !important;
			width: 70%;
			height: 70%;
			background-color: rgba(51, 51, 51, 0.5);
		}

		.item-right {
			height: 260rpx;
			overflow: hidden;
		}

		.del-btn {
			bottom: 40rpx;
			right: 30rpx;
			width: 70rpx;
			height: 70rpx;
		}
	}

	/* 底部栏 */
	.action-section {
		z-index: 999;
		bottom: 0;
		height: 100rpx;

		.checkbox {
			.iconfont {
				font-size: 46rpx;
				color: #2C405A;
			}
		}

		.clear-btn {
			left: 100rpx;
			background: #2C405A;
			border-radius: 0 50rpx 50rpx 0;
			padding: 12rpx 0;
			transition: all .2s;

			width: 0;
			opacity: 0;

			&.show {
				width: 120rpx;
				opacity: 1;
			}
		}

		.payment {
			padding: 0 40rpx;
			font-size: $font-base;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}

	/* #ifdef H5 || MP-360 */
	.action-section {
		margin-bottom: 50px;
	}

	/* #endif */
</style>
