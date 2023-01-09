<template>
	<view>
		<z-paging ref="paging" v-model="order2Add" @query="loadData" :use-page-scroll="true">
			<view v-for="(item, index) in order2Add" :key="index" :class="index === checkedOrder ? 'solids' : ''"
				@click="groupChange(item.order_id, index)">
				<uni-card :title="item.goods_sku_name || item.order_info" :thumbnail="item.goods_img">
					<view class="flex flex-wrap justify-center flex-direction">
						<text>订单地址：{{item.order_consignee_addr}}{{item.order_consignee_addr_detail}}</text>
						<text>下单时间：{{$dayjs(item.create_time).format('YYYY-MM-DD HH:mm')}}</text>
					</view>
				</uni-card>
			</view>
		</z-paging>
		<view style="height: 100rpx;"></view>
		<view class="oper-area dflex-b padding-right padding-left-sm">
			<view class="dflex">
				<view class="btn-area dflex dflex-flow-c" @click="tohome">
					<text class="iconfont iconshouye-1"></text>
					<text>首页</text>
				</view>
			</view>
			<button class="cu-btn round bg-blue flex justify-end" @click="confirmPlusOrder">立即加单</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order2Add: [],
				order2AddId: '',
				checkedOrder: -1,
				plusOrderWay: '',
				goods_id: '',
				goods_sku_id: '',
			}
		},
		onLoad(options) {
			this.plusOrderWay = options.plus_way;
			this.goods_id = options.goods_id
			this.goods_sku_id = options.sku_id;
		},
		methods: {
			loadData(pageNo, pageSize) {
				const db = uniCloud.database();
				const dbCmd = db.command;
				const user = uni.getStorageSync('uni-id-pages-userInfo');
				let _this = this;
				
				if (this.plusOrderWay === '客户加单') {
					db.collection('usemall-order').where({
						create_uid: user._id,
						state: dbCmd.nin(['待取消', '已取消', '待改派'])
					}).orderBy('create_time desc').skip((pageNo - 1) * pageSize).limit(pageSize).get().then(async res => {
						let order2Add = [];
						for (let i = 0; i < res.result.data.length; i++) {
							const order = res.result.data[i];
							let res1 = await _this.$db['usemall-order-detail'].where({
								order_id: order.order_id
							}).tofirst()
							order.goods_img = res1.datas.goods_img;
							order.goods_sku_name = res1.datas.goods_sku_name;
							order2Add.push(order);
						}
						this.$refs.paging.complete(order2Add);
					})
				} else if (this.plusOrderWay === '工程师加单') {
					db.collection('usemall-order').where({
						engineer_id: user._id,
						state: dbCmd.nin(['待取消', '已取消', '待改派'])
					}).orderBy('create_time desc').skip((pageNo - 1) * pageSize).limit(pageSize).get().then(async res => {
						let order2Add = [];
						for (let i = 0; i < res.result.data.length; i++) {
							const order = res.result.data[i];
							let res1 = await _this.$db['usemall-order-detail'].where({
								order_id: order.order_id
							}).tofirst()
							order.goods_img = res1.datas.goods_img;
							order.goods_sku_name = res1.datas.goods_sku_name;
							order2Add.push(order);
						}
						this.$refs.paging.complete(order2Add);
					})
				}
			},
			// 点击加单订单选择
			groupChange(order_id, index) {
				console.log('groupChange', order_id);
				this.order2AddId = order_id;
				this.checkedOrder = index;
			},
			confirmPlusOrder() {
				if (this.order2AddId === '') {
					this.$api.msg('请选择您要加单的订单');
					return;
				}
				
				uni.navigateTo({
					url: `/sub_pages_1/order/plus-order?goods_id=${this.goods_id}&sku_id=${this.goods_sku_id}&order_id=${this.order2AddId}&plus_way=${this.plusOrderWay}`
				});
			},
			tohome() {
				this.$api.tohome();
			},
		}
	}
</script>

<style lang="scss">
	.solids::after {
		border: 8upx solid #1890ff;
	}

	.oper-area {
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		position: fixed;
		z-index: 100;
		bottom: 0;
		left: 0;
		border-top: 1px solid #f0f0f0;

		.btn-area {
			font-size: $font-sm;
			color: $font-color-base;
			width: 96rpx;

			.iconfont {
				font-size: 40rpx;
				line-height: 48rpx;
			}

			.iconfont-1 {
				font-size: 40rpx;
				line-height: 48rpx;
			}
		}

		/* 操作按钮 */
		.action-btn {
			width: 156rpx;
			height: inherit;
			line-height: inherit;
			margin: 0;
			margin-left: 20rpx;
			padding: 12rpx 0;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			/* #ifdef MP-QQ || MP-ALIPAY */
			border: 1px solid;
			/* #endif */

			&:after {
				border-radius: 100px;
			}

			&.main-btn {
				background: #fff9f9;
				color: $base-color;

				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}
</style>
