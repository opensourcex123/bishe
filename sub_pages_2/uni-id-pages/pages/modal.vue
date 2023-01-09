<template>
	<view>
		<view class="cu-modal" :class="showModal ? 'show' : ''" v-if="showModal">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">报价推送</view>
					<view v-if="!isCreate" class="action" @tap="showModal = false"><text
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
		data() {
			return {
				payload: {},
				order_detail_id: [],
				order_id: '',
				isCreate: true,
				showModal: false
			};
		},
		onLoad(options) {
			let _this = this;
			this.payload = JSON.parse(options.data);
			this.order_detail_id = Object.keys(this.payload.list);
			this.order_id = this.payload.order_id;

			const user = uni.getStorageSync('uni-id-pages-userInfo');
			if (user._id === this.payload.scanner) {
				this.isCreate = true;
			} else {
				this.isCreate = false;
			}
			this.showModal = true;
		},
		methods: {
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
				this.showModal = false;
				uni.navigateBack()
			},
			async confirm() {
				const _this = this;
				console.log(this.payload);
				console.log('========================>>>>>>>>');
				console.log(this.order_id);
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
				this.showModal = false;
				uni.navigateBack()
			}
		}
	};
</script>

<style></style>
