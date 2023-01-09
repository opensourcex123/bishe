<template>
	<view class="order-detail">
		<!-- 订单状态 -->
		<!-- <view class="state-area padding-lr margin-tb-sm">
			<view class="padding border-radius bg-base">

				<view v-if="order_data.state == '待接单'">
					<view class="dflex-c fs-lg">
						<text class="iconfont icondaifukuan- fs-lg fwb"></text>
						<text class="fwb margin-left-sm">订单待支付</text>
					</view>
					<view class="dflex-c">
						剩余时间：
						<use-count-down :show-days="false" separator="zh" separator-color="#fff" font-size="24"
							:timestamp="time_remaining"></use-count-down>
					</view>
				</view>

				<view v-if="order_data.state == '待发货'">
					<view class="dflex-c fs-lg">
						<text class="iconfont icondaifahuo- fs-lg fwb"></text>
						<text class="fwb margin-left-sm">订单备货中</text>
					</view>
					<view class="dflex-c">预计1天后发货</view>
				</view>

				<view v-if="order_data.state == '待收货'">
					<view class="dflex-c fs-lg">
						<text class="iconfont icondaishouhuo- fs-lg fwb"></text>
						<text class="fwb margin-left-sm">订单已发货</text>
					</view>
					<view class="dflex-c">还剩5天10时自动确认</view>
				</view>

				<view v-if="order_data.state == '待评价'">
					<view class="dflex-c fs-lg">
						<text class="iconfont iconyiwancheng- fs-lg fwb"></text>
						<text class="fwb margin-left-sm">订单已收货</text>
					</view>
					<view class="dflex-c">感谢您的支持，评价送积分</view>
				</view>

				<view v-if="order_data.state == '已完成'">
					<view class="dflex-c fs-lg">
						<text class="iconfont iconyiwancheng- fs-lg fwb"></text>
						<text class="fwb margin-left-sm">订单已完成</text>
					</view>
					<view class="dflex-c">感谢您的支持，期待下次购买</view>
				</view>

				<view v-if="order_data.state == '已取消'">
					<view class="dflex-c fs-lg">
						<text class="iconfont icondaifukuan- fs-lg fwb"></text>
						<text class="fwb margin-left-sm">订单已关闭</text>
					</view>
					<view class="dflex-c">感谢您的支持</view>
				</view>

				<view v-if="order_data.state == '售后中'">
					<view class="dflex-c fs-lg">
						<text class="iconfont icondaifukuan- fs-lg fwb"></text>
						<text class="fwb margin-left-sm">已申请售后</text>
					</view>
					<view class="dflex-c">请耐心等待工作人员处理</view>
				</view>
				<view v-if="order_data.state == '售后结束'">
					<view class="dflex-c fs-lg">
						<text class="iconfont iconyiwancheng- fs-lg fwb"></text>
						<text class="fwb margin-left-sm">{{order_data.order_refund_state}}</text>
					</view>
					<view class="dflex-c">感谢您的支持</view>
				</view>
			</view>
		</view> -->

		<!-- 收货人 -->
		<!-- <view class="address-area padding-lr margin-tb-sm" v-if="order_data.order_consignee">
			<view class="dflex padding border-radius bg-main">
				<view class="iconfont icondizhi- margin-right ft-main"></view>
				<view class="flex1">
					<view class="w-full dflex-wrap-w">
						<view class="margin-bottom-xs desc">
							<text>{{ order_data.order_consignee_addr }}
								{{ order_data.order_consignee_addr_detail }}</text>
						</view>
						<view>
							<text>{{ order_data.order_consignee }}</text>
							<text class="margin-left">{{ order_data.order_consignee_tel }}</text>
						</view>
					</view>
				</view>
			</view>
		</view> -->

		<u-sticky offset-top="0">
			<u-alert style="position: fixed; top: 0;" font-size="13" title="温馨提示:如发现工程师中途无故加价,请拒绝付款!" type="warning">
			</u-alert>
		</u-sticky>
		<!-- 订单步骤条 -->
		<view class="order-area padding margin-lr margin-tb-sm bg-main border-radius">
			<text style="font-size: larger; font-weight: bolder; padding-left: 20rpx;">订单状态</text>
			<view class="margin-top"></view>
			<u-steps dot activeColor="#969799" direction="column">
				<view v-for="item in order_log">
					<u-steps-item :title="item.current_state" :desc="formatTime(item.create_time)"></u-steps-item>
				</view>
			</u-steps>
		</view>

		<!-- 预约信息 -->
		<view class="order-area padding margin-lr margin-tb-sm bg-main border-radius">
			<text style="font-size: larger; font-weight: bolder; padding-left: 20rpx;">预约信息</text>
			<view class="item">
				<text>预约时间：</text>
				<text class="">{{ order_data.time }}</text>
			</view>
			<view class="item dflex-s">
				<text>服务地址：</text>
				<text class="">{{ order_data.order_consignee_addr }}{{ order_data.order_consignee_addr_detail }}</text>
			</view>
			<view class="item">
				<text></text>
				<text>{{ order_data.order_consignee }}</text>
			</view>
			<view class="item">
				<text></text>
				<text class="">{{ order_data.order_consignee_tel }}</text>
			</view>
			<view class="item">
				<text>预约服务：</text>
				<text class="">{{ order_detail[0].goods_sku_name || order_detail[0].goods_name }}</text>
			</view>
		</view>

		<!-- 服务信息 -->
		<view class="order-area padding margin-lr margin-tb-sm bg-main border-radius">
			<text style="font-size: larger; font-weight: bolder; padding-left: 20rpx;">服务信息</text>
			<view class="item">
				<text>维修师傅：</text>
				<text class="">{{ engineer.name }}师傅</text>
			</view>
			<view class="item">
				<text>服务产品：</text>
				<text class="">{{ order_detail[0].goods_sku_name || order_detail[0].goods_name }}</text>
			</view>
		</view>

		<!-- 加单信息 -->
		<view v-if="order_detail.length > 1 && index > 0" v-for="(item, index) in order_detail">
			<view class="order-area padding margin-lr margin-tb-sm bg-main border-radius">
				<text style="font-size: larger; font-weight: bolder; padding-left: 20rpx;">加单信息</text>
				<view class="item">
					<text>服务产品：</text>
					<text class="">{{ item.goods_sku_name || item.goods_name }}</text>
				</view>
			</view>
		</view>

		<!-- 订单信息 -->
		<view class="order-area padding margin-lr margin-tb-sm bg-main border-radius">
			<text style="font-size: larger; font-weight: bolder; padding-left: 20rpx;">订单信息</text>
			<view class="item">
				<text>订单编号：</text>
				<text class="">{{ order_data.order_id }}</text>
				<text class="copy" @click="copy">复制</text>
			</view>
			<view class="item">
				<text>下单时间：</text>
				<text class="">{{ order_data.create_time }}</text>
			</view>
		</view>

		<!-- 退款数据 -->
		<view class="order-area padding margin-lr margin-tb-sm bg-main border-radius"
			v-if="order_data.order_refund_state">
			<view class="item">
				<text>退款原因：</text>
				<text class="">{{ order_data.order_refund_reason }}</text>
			</view>
			<view class="item">
				<text>退款说明：</text>
				<text class="">{{ order_data.order_refund_desc }}</text>
			</view>
			<view class="item">
				<text>退款状态：</text>
				<text>{{ order_data.order_refund_state }}</text>
			</view>
			<view class="item">
				<text>退款情况：</text>
				<text>{{ order_data.order_refund_remark || '' }}</text>
			</view>
		</view>

		<!-- tab区 -->
		<view class="w-full">
			<uni-segmented-control styleType="text" activeColor="#2979ff;" :current="current" :values="items"
				@clickItem="onClickItem"></uni-segmented-control>
			<view class="content">
				<view style="width:100%" v-show="current === 0">
					<view class="cart-list padding-sm">
						<block v-for="(item, index) in jingXuanDatas" :key="item._id">
							<view class="cart-item bg-main padding-lg dflex-s border-radius" @click="togoods1(item)">
								<view class="image-wrapper pos-r">
									<!-- 商品图片 -->
									<image class="border-radius-xs wh-full" mode="aspectFill" :lazy-load="true"
										:src="item.img"></image>
								</view>
								<view style="display: flex; flex-direction: column; justify-content: space-between;"
									class="item-right padding-left">
									<view style="display: flex; flex-direction: column;">
										<view class="dflex" style="font-size: large; font-weight: bolder;">
											{{ item.name }}</view>
										<view><text>保修90天 快速响应 计价器报价</text></view>
									</view>

									<view class="dflex-b w-full">
										<view class="padding-tb-sm">
											<text class="price">{{ item.price / 100 }}</text>
										</view>
										<button class="cu-btn round bg-blue"
											@click.stop="toOrderCreate(item._id)">立即预约</button>
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
										:src="item.img"></image>
								</view>
								<view style="display: flex; flex-direction: column; justify-content: space-between;"
									class="item-right padding-left">
									<view style="display: flex; flex-direction: column;">
										<view class="dflex" style="font-size: large; font-weight: bolder;">
											{{ item.name }}</view>
										<view><text>保修90天 快速响应 计价器报价</text></view>
									</view>

									<view class="dflex-b">
										<view class="padding-tb-sm">
											<text class="price">{{ item.price }}</text>
										</view>
										<button class="cu-btn round bg-blue"
											@click.stop="toOrderCreate(item._id, item.sku_id)">立即预约</button>
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
										:src="item.img"></image>
								</view>
								<view style="display: flex; flex-direction: column; justify-content: space-between;"
									class="item-right padding-left">
									<view style="display: flex; flex-direction: column;">
										<view class="dflex" style="font-size: large; font-weight: bolder;">
											{{ item.name }}</view>
										<view><text>保修90天 快速响应 计价器报价</text></view>
									</view>

									<view class="dflex-b">
										<view class="padding-tb-sm">
											<text class="price">{{ item.price / 100 }}</text>
										</view>
										<button class="cu-btn round bg-blue"
											@click.stop="toOrderCreate(item._id, item.sku_id)">立即预约</button>
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
										:src="item.img"></image>
								</view>
								<view style="display: flex; flex-direction: column; justify-content: space-between;"
									class="item-right padding-left">
									<view style="display: flex; flex-direction: column;">
										<view class="dflex" style="font-size: large; font-weight: bolder;">
											{{ item.name }}</view>
										<view><text>保修90天 快速响应 计价器报价</text></view>
									</view>

									<view class="dflex-b">
										<view class="padding-tb-sm">
											<text class="price">{{ item.price / 100 }}</text>
										</view>
										<button class="cu-btn round bg-blue"
											@click.stop="toOrderCreate(item._id, item.sku_id)">立即预约</button>
									</view>
								</view>
							</view>
						</block>
					</view>
				</view>
			</view>
		</view>

		<view style="height: 100rpx;"></view>

		<!-- 底部操作区 -->
		<view class="oper-area dflex-b padding-right padding-left-sm">
			<view class="dflex">
				<view class="btn-area dflex dflex-flow-c" @click="tohome">
					<text class="iconfont iconshouye-1"></text>
					<text>首页</text>
				</view>
				<view class="btn-area dflex dflex-flow-c" @click="scanCode">
					<text class="iconfont-1 icon-scanning"></text>
					<text>扫码</text>
				</view>
				<view class="btn-area dflex dflex-flow-c" @click="watchPrice">
					<text class="iconfont iconsousuo-01"></text>
					<text>查看报价</text>
				</view>
			</view>

			<view class="dflex-e">
				<view class="dflex" v-if="!['待改派', '待取消', '已取消'].includes(order_data.state)">
					<button class="action-btn border-radius-big bg-main" @click="toCategory">加单</button>
				</view>
				<view class="dflex" v-if="order_data.state === '待接单'"><button
						class="action-btn border-radius-big bg-main" @click="cancelOrder">取消订单</button></view>
				<view class="dflex" v-if="['已接单', '已上门'].includes(order_data.state)">
					<button class="action-btn border-radius-big bg-main" @click="showReasonFunc">取消订单</button>
				</view>
				<view class="dflex" v-if="order_data.state == '待付款'"><button class="action-btn main-btn"
						@click="payment">立即支付</button></view>
				<!-- <view class="dflex" v-if="order_data.state == '待发货'">
					<button v-if="!order_data.order_refund_state" class="action-btn border-radius-big bg-main"
						@click="refund">申请退款</button>
				</view> -->
				<!-- <button v-if="!order_data.order_refund_state && 
					['待收货', '待评价', '已完成'].includes(order_data.state)" class="action-btn" @click="toexpress">查看物流</button>
				<view class="dflex" v-if="order_data.state == '待收货'">
					<button v-if="!order_data.order_refund_state" class="action-btn main-btn"
						@click="toreceipt">确认收货</button>
				</view> -->
				<view class="dflex" v-if="order_data.state == '待评价'"><button class="action-btn main-btn"
						@click="evaluate">我要评价</button></view>
				<view v-if="order_data.state == '已完成' || order_data.state == '已取消'"><button @click="delorder"
						class="action-btn main-btn">删除订单</button></view>
			</view>
		</view>
		
		<view v-if="['待评价', '已完成'].includes(order_data.state)" class="fixed-top animated" :style="{ bottom: 120 + 'rpx' }" @tap.stop="toBill">
			<text>申请开票</text>
		</view>

		<view v-if="showReason" class="cu-modal" :class="showReason ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">取消原因</view>
					<view class="action" @tap="showReason = false"><text class="cuIcon-close text-grey"></text></view>
				</view>
				<view class="padding-xl">
					<uni-forms border>
						<uni-forms-item required label="原因">
							<uni-easyinput type="text" v-model="order_data.order_cancel_reason"
								placeholder="请输入订单取消原因" />
						</uni-forms-item>
					</uni-forms>
					<button class="cu-btn bg-blue lg margin-top" @tap="cancelOrderWithReason">确认</button>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="showPrice ? 'show' : ''" v-if="showPrice">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">报价推送</view>
					<view v-if="!isCreate" class="action" @tap="showPrice = false"><text
							class="cuIcon-close text-grey"></text></view>
				</view>
				<view class="padding-xl flex flex-direction">
					<view class="flex flex-direction">
						<view v-for="detailId in order_detail_id" :key="detailId">
							<view v-for="item in payload.list[detailId]" :key="item.name">
								{{ item.name }}：{{ item.price }}
							</view>
						</view>
					</view>
					<text>总价：{{ payload.price }}元</text>
					<view class="flex justify-around" v-if="isCreate">
						<button class="cu-btn bg-red lg margin-top" @click="refuse">拒绝</button>
						<button class="cu-btn bg-blue lg margin-top" @click="confirm">确认</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {
			// share
		},
		data() {
			return {
				// 商品数据
				order_detail: [],
				// 订单数据
				order_data: {},
				// 订单日志
				order_log: [],
				// 工程师信息
				engineer: {},
				addressData: [],
				sharekefuList: [],
				shareEmptyList: [],
				order_id: '',
				goods_price_tip: '产品总计',
				time_remaining: 0,
				current: 0,
				items: ['精选', '家电维修', '家电清洗', '家电安装'],
				jingXuanDatas: [],
				jiaDianWeiXiu: [{
						_id: '1665539935240327279',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/b3075dd2-aa51-4b4a-b01a-6670f07157bf.jfif',
						name: '挂机空调维修',
						extra: '空调不制冷/漏水/噪音大...',
						price: 98,
						sku_id: '63632cc0f1492c00018ce10d'
					},
					{
						_id: '1667292436721923230',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/f59a2653-1f05-4bb5-8f12-f46e0fcb9bf2.jpeg',
						name: '洗衣机维修',
						extra: '[保修90天]告别油垢污渍',
						price: 79,
						sku_id: ''
					}
				],
				jiaDianQingXi: [{
						_id: '1667365859678660854',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/78bb9fa1-5300-44ad-951b-719fb99e163d.jpeg',
						name: '油烟机清洗（拆机洗）',
						extra: '[强力除油污]告别油垢污渍',
						price: 16600,
						sku_id: '6361fbe35125130001f0b583'
					},
					{
						_id: '1667365374418915975',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/54a71c96-439a-48f1-8da4-dd6ec27ff3f3.jpeg',
						name: '滚筒洗衣机清洗（不拆机）',
						extra: '[除霉除污垢]去除洗衣桶内壁细...',
						price: 15800,
						sku_id: '6361f9fe53a7f30001886755'
					}
				],
				jiaDianAnZhuang: [{
						_id: '1667439223445738437',
						price: 3000,
						name: '挂机空调拆卸、安装',
						sku_id: '63631a77ce2777000195e0fe',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/14c2bf1f-1ad3-471d-aee8-21033f499ad3.jpeg'
					},
					{
						_id: '1667439356256612762',
						price: 3000,
						name: '电视安装',
						sku_id: '',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/35cc525e-97bd-4bfe-b443-33520e1f1117.jpeg'
					}
				],
				showReason: false,
				showPrice: false,
				payload: {},
				order_detail_id: [],
				isCreate: true,
				cancelItem: {}
			};
		},
		onUnload() {
			uni.$emit('__event_order', 'refresh');
		},
		onLoad(options) {
			this.order_id = options.order_id;

			this.loadData();
		},
		onShow() {
			this.loadData();
		},
		methods: {
			// 点击查看报价
			watchPrice() {
				const db = uniCloud.database();
				db.collection('unipush-log').where({order_id: this.order_id, title: '报价推送'}).orderBy('create_time desc').get().then(res => {
					console.log(res.result.data);
					if (res.result.data.length === 0) {
						this.$api.msg('工程师未推送报价');
						return;
					}
					
					if (this.order_data.state === '待推送报价') {
						this.isCreate = true
					} else {
						this.isCreate = false
					}
					
					this.payload = res.result.data[0].payload;
					this.order_detail_id = Object.keys(this.payload.list);
					this.showPrice = true;
				})
			},
			// 拒绝报价
			async refuse() {
				let _this = this;
			
				const cidRes = await this.$db['uni-id-device'].where({
					user_id: this.payload.user_id
				}).tofirst();
				this.$db['usemall-order']
					.where({
						order_id: this.order_id
					})
					.update({
						state: '拒绝报价'
					})
					.then(() => {
						getApp().pushMsg(cidRes.datas.push_clientid, '报价确认', '用户拒绝了报价', {
								is_confirm: 0
							}, _this.order_id)
							.then(res2 => {
								console.log(res2);
							});
					});
				this.$db['usemall-order-log'].add({
					order_id: this.order_id,
					is_delete: 0,
					current_state: '拒绝报价'
				});
				this.loadData().then(() => {
					this.showPrice = false;
				});
			},
			async confirm() {
				const _this = this;
				const db = uniCloud.database();
			
				const cidRes = await this.$db['uni-id-device'].where({
					user_id: this.payload.user_id
				}).tofirst();
				this.$db['usemall-order']
					.where({
						order_id: this.order_id
					})
					.update({
						state: '已完成报价'
					})
					.then(() => {
						this.$db['usemall-order'].where({
							order_id: this.order_id
						}).update({
							state: '上传维修前照片'
						});
						getApp().pushMsg(cidRes.datas.push_clientid, '报价确认', '用户已确认报价', {
								is_confirm: 1
							}, _this.order_id)
							.then(res2 => {
								console.log('时间发出', res2);
							});
					});
				this.$db['usemall-order-log']
					.add({
						order_id: this.order_id,
						is_delete: 0,
						current_state: '已完成报价'
					})
					.then(() => {
						this.$db['usemall-order-log'].add({
							order_id: this.order_id,
							is_delete: 0,
							current_state: '上传维修前照片'
						});
					});
			
				this.$db['usemall-order']
					.where({
						order_id: this.order_id
					})
					.update({
						order_actural_paid: this.payload.price * 100
					})
					.then(() => {
						for (let i = 0; i < this.order_detail_id.length; i++) {
							const item = this.order_detail_id[i];
							this.$func.usemall.call('order/updateChargeStandard', {
								order_detail_id: item,
								charge_standard: _this.payload.list[item]
							});
						}
					});
				this.loadData().then(() => {
					this.showPrice = false;
				});
			},
			// 跳转所有商品页
			toCategory() {
				this.$api.tocategory();
			},
			toBill() {
				uni.navigateTo({
					url: `/sub_pages_1/bill/bill-edit?order_id=${this.order_id}`
				});
			},
			// 跳转创建订单页
			toOrderCreate(id, sku_id) {
				uni.navigateTo({
					url: `/sub_pages_1/order/create?goods_id=${id}&sku_id=${sku_id || ''}`
				});
			},
			togoods1(item) {
				this.$api.togoods({
					id: item._id
				});
			},
			// 调起扫码方法
			async scanCode() {
				const _this = this;
				const user = uni.getStorageSync('uni-id-pages-userInfo');
				if (!user) {
					this.$api.msg('没有查询到当前用户信息');
					return;
				}
				uni.scanCode({
					onlyFromCamera: false,
					scanType: ['qrCode'],
					success: function(res) {
						const result = JSON.parse(res.result);
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + result.order_id);
						console.log('条码内容：' + result.engineer_id);
						const db = uniCloud.database();
						// 发送事件给工程师端，更新订单状态
						_this.$db['uni-id-device'].where({
							user_id: result.engineer_id
						}).tofirst().then(res1 => {
							getApp().pushMsg(res1.datas.push_clientid, '订单更新', '用户已扫码，请注意订单更新状态', {
									engineer_id: result.engineer_id,
									user_id: user._id
								}, result.order_id)
								.then(async res => {
									await _this.$db['usemall-order'].where({
										order_id: result.order_id
									}).update({
										create_uid: user._id
									});
									await _this.$db['usemall-order'].where({
										order_id: result.order_id
									}).update({
										scanner: user._id
									});
									await _this.changeOrderState(result.order_id, '已上门');
									await _this.changeOrderState(result.order_id, '待推送报价');
								});
						});
					},
					complete: function() {
						_this.loadData();
					}
				});
			},
			changeOrderState(order_id, state) {
				const user = uni.getStorageSync('uni-id-pages-userInfo');
				const p1 = this.$db['usemall-order']
					.where({
						order_id: order_id
					})
					.update({
						state: state
					});
				const p2 = this.$db['usemall-order-log'].add({
					order_id: order_id,
					is_delete: 0,
					create_uid: user._id,
					current_state: state
				});
				return Promise.all([p1, p2]);
			},
			// 格式化时间
			formatTime(value) {
				return this.$dayjs(value).format('MM-DD HH:mm');
			},
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			tohome() {
				this.$api.tohome();
			},
			async loadData() {
				let _this = this;
				await this.$func.usemall
					.call('order/detail', {
						order_id: _this.order_id
					})
					.then(res => {
						if (res.code === 200) {
							res.datas.order.create_time = this.$api.format(res.datas.order.create_time);
							_this.order_data = res.datas.order;
							_this.order_detail = res.datas.order_detail;
							_this.order_log = res.datas.order_log;
							_this.addressData = res.datas.order_trip;

							_this.order_detail.forEach(data => {
								if (data.goods_opt_id > 0) {
									let desc = '';
									if (data.goods_opt_desc) {
										desc = ' (' + data.goods_opt_desc + ')';
									}
									_this.goods_price_tip = data.goods_opt_name + desc;
								}
							});

							this.$db['engineers']
								.where({
									user_id: _this.order_data.engineer_id
								})
								.tofirst()
								.then(res => {
									_this.engineer = res.datas;
								});
							// console.log(_this.order_detail);
							// console.log(_this.order_data.state);
							console.log('order log.........', this.order_log.length);
						}
					});
				this.$db['usemall-goods']
					.where({
						limited: 1
					})
					.tolist()
					.then(res => {
						this.jingXuanDatas = res.datas;
					});
			},
			// 立即支付
			payment() {
				// if (this.order_data.order_pay_state == '待核实') {
				// 	this.$api.msg('订单已支付待核实状态');
				// 	return;
				// }

				this.$api.topay({
					order_id: this.order_data.order_id,
					money: this.order_data.order_actural_paid
				});
			},
			// 查看物流
			toexpress(item) {
				// this.$api.msg('查看物流开发中');
				uni.navigateTo({
					url: `/sub_pages_1/user/order/order-express?order_id=${this.order_id}`
				});
			},
			// 已发货
			toreceipt() {
				let _this = this;

				uni.showModal({
					title: '提示',
					content: '确认收货',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后'
							});
							_this.$func.usemall
								.call('order/received', {
									order_id: _this.order_id,
									state: '待评价'
								})
								.then(res => {
									_this.loadData('refresh');
								});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					},
					complete() {
						uni.hideLoading();
					}
				});
			},
			// 删除订单
			delorder() {
				let _this = this;

				uni.showModal({
					title: '提示',
					content: '删除订单',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后'
							});
							_this.$func.usemall
								.call('order/deleted', {
									order_id: _this.order_id
								})
								.then(res => {
									if (res.code === 200) {
										uni.navigateBack({});
									}
								});
						} else if (res.cancel) {
							console.log('点击取消');
						}
					},
					complete() {
						uni.hideLoading();
					}
				});
			},
			// 取消订单
			cancelOrder() {
				let _this = this;

				uni.showModal({
					title: '提示',
					content: '取消订单',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后'
							});
							_this.$func.usemall
								.call('order/cancel', {
									order_id: _this.order_id,
									state: '已取消'
								})
								.then(res => {
									if (res.code === 200) {
										_this.loadData('refresh');
									}
								});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					},
					complete() {
						uni.hideLoading();
					}
				});
			},
			showReasonFunc(item) {
				this.showReason = true;
			},
			// 带原因的取消订单
			cancelOrderWithReason() {
				let _this = this;
				if (!this.order_data.hasOwnProperty('order_cancel_reason')) {
					this.$api.msg('取消原因不能为空');
					return;
				}

				_this.$func.usemall
					.call('order/cancel', {
						order_id: _this.order_id,
						order_cancel_reason: _this.order_data.order_cancel_reason,
						state: '待取消'
					})
					.then(res => {
						if (res.code === 200) {
							_this.loadData('refresh');
						}
					});
				this.showReason = false;
			},
			// 点击复制
			copy() {
				let _this = this;

				uni.setClipboardData({
					data: _this.order_id,
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
			// 评价
			evaluate() {
				uni.navigateTo({
					url: `/sub_pages_1/user/order/order-evaluate?id=${this.order_id}`
				});
			},
			// 申请退款
			refund() {
				uni.navigateTo({
					url: `/sub_pages_1/user/order/order-refund?order_id=${this.order_id}`
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.fixed-top {
		width: 150rpx;
		height:140rpx;
	}
	
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

	.order-detail .item text:first-child {
		width: 152rpx;
		text-align: right;
		display: inline-block;
	}

	/* 状态区 */
	.state-area {}

	/* 收货人 */
	.address-area {}

	/* 商品区 */
	.goods-area {
		&:last-child {
			margin-bottom: 0;
		}

		image {
			width: 180rpx;
			height: 180rpx;
		}
	}

	/* 订单数据区 */
	.order-area {
		.item {
			line-height: 66rpx;

			.copy {
				margin-left: 20rpx;
				padding: 10rpx 40rpx;
				background-color: #f1f1f1;
				border-radius: 40rpx;
				font-size: 24rpx;
			}
		}
	}

	/* 数据统计区 */
	.total-area {
		.item {
			line-height: 48rpx;

			text {
				padding-right: 16rpx;
			}
		}
	}

	/* 操作区 */
	.oper-area {
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		position: fixed;
		z-index: 1;
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
			font-size: $font-sm + 8upx;
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
