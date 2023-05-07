<template name="workItem">
	<view class="bg-white">
		<u-tabs :list="list1" @click="click"></u-tabs>
		<view class="bg-page" style="width: 100%;padding-bottom: 150upx;">
			<z-paging ref="paging" v-model="list" @query="getOrders" :use-page-scroll="true">
				<view class="flex items-center justify-center" @tap="checkDetails(item.order_id)" 
				v-for="(item, index) in list" :key="index">
					<order-item class="margin-tb" :status="item.state" :end="item.end_time" 
					:title="item.order_info" :address="item.order_consignee_addr"></order-item>
				</view>
			</z-paging>
		</view>
	</view>
</template>

<script>
import UTabs from '../../../uni_modules/uview-ui/components/u-tabs/u-tabs.vue';
import orderItem from './item/orderItem.vue';
import ZPMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin';
export default {
	mixins: [ZPMixin],
	components: {
		UTabs,
		orderItem
	},
	data() {
		return {
			currentTab: 0,
			list1: [
				{
					name: '进行中'
				},
				{
					name: '今日上门'
				},
				{
					name: '明日上门'
				},
				{
					name: '待改派'
				},
				{
					name: '待取消'
				}
				// {
				// 	name: '警告单'
				// },
				// {
				// 	name: '投诉'
				// },
				// {
				// 	name: '历史订单'
				// },
				// {
				// 	name: '本月成功订单'
				// },
				// {
				// 	name: '本月失败订单'
				// }
			],
			list: [],
			lists: {
				todayList: [],
				tomList: [],
				waitCancel: [],
				waitTransfer: []
			}
		};
	},
	methods: {
		click(item) {
			console.log('item', item);
			this.currentTab = item.index;
			this.$refs.paging.reload();
		},
		checkDetails(id) {
			uni.navigateTo({
				url: '/sub_pages_1/enginner/home/item-details/item-details?id=' + id
			});
		},
		getOrders(pageNo, pageSize) {
			let route = '';
			switch (this.currentTab) {
				case 0:
					route = 'checkUnderwayData';
					break;
				case 1:
					route = 'checkTodayData';
					break;
				case 2:
					route = 'checkTomorrowData';
					break;
				case 3:
					route = 'checkReassignmentData';
					break;
				case 4:
					route = 'checkPendingCancelStateOrder';
					break;
			}
			this.$func.usemall
				.call('order/' + route, {
					page: pageNo,
					pageSize: pageSize
				})
				.then(res => {
					console.log(res);
					this.$refs.paging.complete(res.datas.data.data);
					// this.list.push(...res.datas.data.data);
				});
		},
		reload() {
			this.$refs.paging.reload(true);
		}
	},
};
</script>

<style></style>
