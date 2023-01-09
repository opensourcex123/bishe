<template>
	<view class="bg-grey">
		<view class="box">
			<u-status-bar customStyle="background: white"></u-status-bar>
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon-home padding-right-sm" @click="back"></text>
					<text class="text-black text-bold text-xl">工程师端</text>
				</view>
				<view class="content text-bold"></view>
			</view>

			<view v-if="newOrder.order_info" @tap="checkOrder(newOrder.order_id)"><u-alert :title="newOrder.order_info" type="success" :closable="true"></u-alert></view>

			<workItem v-if="currentTab === 'workItem'" ref="workItem"></workItem>
			<messageItem v-if="currentTab === 'message'"></messageItem>
			<myItem v-if="currentTab === 'my'"></myItem>

			<view class="cu-bar tabbar bg-white shadow foot">
				<view v-for="(item, index) in tabList" :key="index" class="action" :class="item.active ? 'text-blue' : 'text-gray'" @click="changeTab(item, index)">
					<view :class="item.active ? item.icon + 'fill' : item.icon"><view class="cu-tag badge" v-if="item.badge"></view></view>
					{{ item.name }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import workItem from './workItem.vue';
import myItem from './my.vue';
import messageItem from './message.vue';
export default {
	components: {
		workItem,
		myItem,
		messageItem
	},
	data() {
		return {
			currentTab: 'workItem',
			tabList: [
				{
					name: '工作台',
					value: 'workItem',
					icon: 'cuIcon-home',
					active: true,
					badge: false
				},
				{
					name: '消息',
					value: 'message',
					icon: 'cuIcon-message',
					active: false,
					badge: false
				},
				{
					name: '我的',
					value: 'my',
					icon: 'cuIcon-my',
					active: false,
					badge: false
				}
			],
			newOrder: {
				title: '🛎【新订单】家电维修'
			}
		};
	},
	methods: {
		changeTab(item, index) {
			this.tabList.forEach(v => {
				v.active = false;
			});
			this.tabList[index].active = true;
			this.currentTab = item.value;
		},
		back() {
			uni.reLaunch({
				url: '/pages/tabbar/home'
			});
		},
		updateLocation() {
			const that = this;
			let time = setInterval(function() {
				uni.getLocation({
					type: 'gcj02 ',
					success: function(res) {
						that.$func.usemall
							.call('engineers/updateLocation', {
								lng: res.longitude,
								lat: res.latitude
							})
							.then(resp => {});
					},
					fail: function() {
						uni.showToast({
							title: '获取位置失败',
							icon: 'none'
						});
					}
				});
			}, 10000);
		},
		checkOrder(order_id) {
			uni.navigateTo({
				url: '/sub_pages_1/enginner/home/item-details/item-details?id=' + order_id
			});
		},
		listen() {
			uni.$on('engineer_create_order', (engineer_id, order_id) => {
				const user = uni.getStorageSync('uni-id-pages-userInfo');
				if (user._id === engineer_id) {
					this.$func.usemall
						.call('order/getDetails', {
							order_id: id
						})
						.then(res => {
							this.newOrder = res.datas.data.data[0];
						});
				}
			});
		}
	},
	onShow() {
		this.$refs.workItem.reload()
	},
	onLoad() {
		this.listen();
		this.$func.usemall.call('unipush/create', { cid: '4edb9bcacf4efb64f3d9b4a8e901486e' }).then(res => {
			console.log(res);
		});
		this.updateLocation();
	}
};
</script>

<style lang="scss" scoped>
.enginer-home-container {
	background-color: $base-color;
}
</style>
