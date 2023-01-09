<template>
	<view class="bg-drak">
		<view class="dflex dflex-flow-c padding-top">
			<image style="width: 150rpx; height: 150rpx;" src="../../../static/images/success.png" mode="aspectFill"></image>
			<text style="font-size: larger; font-weight: bolder;">订单提交成功</text>
			<text class="margin-top">工程师接单后将尽快与您确认上门时间</text>
			<text class="margin-top" style="color: grey; font-size: smaller;">私下交易所有责任后果由您自负,请您监督举报:4000879009</text>
			<view class="margin-top-big dflex-a w-full">
				<u-button shape="circle" type="primary" plain @click="toHome">返回首页</u-button>
				<u-button shape="circle" type="primary" @click="todetail">查看订单</u-button>
			</view>
			<view class="w-full margin-top-big">
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				items: ['精选', '家电维修', '家电清洗', '家电安装'],
				order_id: '',
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
			}
		},
		onLoad(options) {
			let _this = this;
			console.log(options.order_id);
			this.order_id = options.order_id;
			this.$db['usemall-goods'].where({limited: 1}).tolist().then(res => {
				_this.jingXuanDatas = res.datas;
			});
		},
		methods: {
			togoods1(item) {
				this.$api.togoods({
					id: item._id
				});
			},
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

			toHome() {
				this.$api.tohome();
			},

			todetail() {
				uni.navigateTo({
					url: `/sub_pages_1/user/order/order-detail?order_id=${this.order_id}`
				});
			},
		}
	}
</script>

<style lang='scss'>
	.u-button {
		width: 40% !important;
	}

	.content {
		display: flex;
		justify-content: center;
		height: auto;
		align-items: center;
		text-align: center;
	}

	page {
		min-height: 100%;
	}

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
</style>
