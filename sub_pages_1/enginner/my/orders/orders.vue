<template>
	<view class="bg-page">
		<u-status-bar customStyle="background: white"></u-status-bar>
		<view class="cu-bar bg-white">
			<view class="action">
				<text class="cuIcon-back padding-right-sm" @click="goBack"></text>
				<text class="text-bold text-black text-lg" @click="showDatetimePicker = true">{{ datetimeFormat || '选择时间' }}</text>
			</view>
			<view class="content text-bold"></view>
		</view>

		<u-sticky bgColor="#fff">
			<u-tabs
				:list="list1"
				:activeStyle="{
					fontWeight: 'bold',
					transform: 'scale(1.05)'
				}"
				@change="tabChange"
			></u-tabs>
		</u-sticky>

		<view>
			<!-- <view class="text-grey margin-left-sm" style="margin-top: 10upx;">只能查看本月和上月工单</view> -->
			<z-paging ref="paging" v-model="list" @query="getData" :use-page-scroll="true" :refresher-enabled="false" :auto="false">
				<view class="flex align-center justify-center" v-for="(item, index) in list" :key="index">
					<view class="order-card padding bg-white shadow margin-tb" @click="checkDetails(item.order_id)">
						<view class="flex align-center justify-between">
							<view>
								<text class="cuIcon-titles text-green text-lg"></text>
								<text class="text-black text-bold text-lg">工单号：{{ item.order_id }}</text>
							</view>
							<view class="cu-tag bg-green light round" v-if="!['已取消','待取消'].includes(item.state)">成功</view>
							<view class="cu-tag bg-red light round" v-else>失败</view>
						</view>
						<view class="margin-top-sm">
							<view class="margin-left-sm">
								<text class="text-lg text-grey">服务产品</text>
								<text class="text-lg text-black padding-left">{{ item.order_info }}</text>
							</view>
						</view>
						<view class="margin-top-sm">
							<view class="margin-left-sm">
								<text class="text-lg text-grey">创建时间</text>
								<text class="text-lg text-black padding-left">{{ item.create_time }}</text>
							</view>
						</view>
						<view class="margin-top-sm">
							<view class="margin-left-sm">
								<text class="text-lg text-grey">订单状态</text>
								<text class="cu-tag margin-left">{{ item.state }}</text>
							</view>
						</view>
						<view class="margin-top-sm">
							<view class="margin-left-sm">
								<text class="text-lg text-grey">收费金额</text>
								<text class="text-lg text-black padding-left">￥{{ item.order_actural_paid / 100 }}</text>
							</view>
						</view>
						<!-- 			<view class="margin-top-sm">
							<view class="margin-left-sm">
								<text class="text-lg text-grey">算账时间</text>
								<text class="text-lg text-black padding-left">2022-10-06 16:11:31</text>
							</view>
						</view> -->
					</view>
				</view>
			</z-paging>
		</view>

		<u-datetime-picker
			:show="showDatetimePicker"
			v-model="datetime"
			mode="year-month"
			@confirm="confirmDatetime"
			@cancel="showDatetimePicker = false"
			:minDate="minDate"
			:maxDate="maxDate"
		></u-datetime-picker>
	</view>
</template>

<script>
import UTabs from '../../../../uni_modules/uview-ui/components/u-tabs/u-tabs.vue';
import USticky from '../../../../uni_modules/uview-ui/components/u-sticky/u-sticky.vue';
import UStatusBar from '../../../../uni_modules/uview-ui/components/u-status-bar/u-status-bar.vue';
export default {
	data() {
		return {
			showDatetimePicker: false,
			datetime: '',
			start_time: 0,
			end_time: 0,
			datetimeFormat: '',
			currentTab: 0,
			minDate: 0,
			maxDate: 0,
			list1: [
				{
					name: '已完成'
				},
				{
					name: '失败单'
				}
			],
			list: []
		};
	},
	methods: {
		confirmDatetime(val) {
			console.log(val.value);
			this.datetimeFormat = this.$dayjs(val.value).format('YYYY年MM月');
			this.start_time = this.start_time = this.$dayjs(val.value)
				.startOf('month')
				.valueOf();
			this.end_time = this.$dayjs(val.value)
				.endOf('month')
				.valueOf();
			this.showDatetimePicker = false;
			this.$refs.paging.reload();
		},
		goBack() {
			uni.navigateBack();
		},
		checkDetails(id) {
			uni.navigateTo({
				url: '/sub_pages_1/enginner/my/orders/details/details?id=' + id
			});
		},
		tabChange(item) {
			this.currentTab = item.index;
			this.$refs.paging.reload();
		},
		getData(pageNo, pageSize) {
			console.log(this.currentTab);
			let states = [];
			switch (this.currentTab) {
				case 0:
					states = ['已付款', '待付款', '待评价', '已完成'];
					break;
				case 1:
					states = ['已取消', '待取消'];
					break;
			}
			this.$func.usemall
				.call('order/getOrderListByStateAndTime', {
					pageNo,
					pageSize,
					states,
					start_time: this.start_time,
					end_time: this.end_time
				})
				.then(res => {
					console.log('====>', res);
					this.$refs.paging.complete(res.datas.data.data);
				});
		}
	},
	mounted() {
		this.start_time = this.$dayjs()
			.startOf('month')
			.valueOf();
		this.end_time = this.$dayjs()
			.endOf('month')
			.valueOf();
		this.minDate = this.$dayjs('2022-01-01 00:00:00').valueOf();
		this.maxDate = this.$dayjs().valueOf();
		this.datetime = this.$dayjs().unix();
		this.datetimeFormat = this.$dayjs().format('YYYY年MM月');
		this.$refs.paging.reload();
	},
	onPullDownRefresh() {
		this.$refs.paging.reload();
		uni.stopPullDownRefresh();
	}
};
</script>

<style lang="scss" scoped>
.order-card {
	border-radius: 15px;
	width: 90%;
}
</style>
