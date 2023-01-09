<template name="orderItem">
	<view class="bg-white order padding" style="width: 90vw;">
		<view class="flex items-center justify-between">
			<view class="flex align-center" v-if="checkTime(end, status)">
				<view class="cuIcon-titles text-lg" :class="'text-' + formatColor(status)"></view>
				<view v-if="status === '已接单'" class="flex align-center">
					<text class="text-lg text-bold" :class="'text-' + formatColor(status)">请在</text>
					<view><u-count-down :time="formatTime(end)" format="HH时mm分ss秒"></u-count-down></view>
					<text class="text-lg text-bold" :class="'text-' + formatColor(status)">内上门</text>
				</view>
				<view v-else><text class="text-lg text-bold" :class="'text-' + formatColor(status)">服务中</text></view>
			</view>
			<view v-else class="flex align-center">
				<view class="cuIcon-titles text-lg text-red"></view>
				<view class="text-red text-lg text-bold">已超时</view>
			</view>
			<view class="cu-tag round light text-bold" :class="'bg-' + formatColor(status)">{{ status }}</view>
		</view>
		<view class="text-bold text-black text-xl margin-tb-sm">{{ title }}</view>
		<view class="text-bold text-grey text-lg">{{ address }}</view>
		<view class="margin-tb-sm">
			<view class="cu-tag bg-grey round">计价器</view>
			<view class="cu-tag bg-gray round">有效联系</view>
		</view>
		<button class="cu-btn bg-blue block text-bold margin-top lg" v-if="['待接单'].includes(status)">接单</button>
		<button class="cu-btn bg-blue block text-bold margin-top lg" v-if="['已接单'].includes(status)">上门</button>
		<button class="cu-btn bg-blue block text-bold margin-top lg" v-if="['已上门'].includes(status)">结算</button>
	</view>
</template>

<script>
export default {
	props: ['status', 'title', 'address', 'end'],
	data() {
		return {};
	},
	methods: {
		formatTime(time) {
			const data = this.$dayjs(time).diff(this.$dayjs());
			return data;
		},
		formatColor(status) {
			const obj = {
				待接单: 'orange',
				已接单: 'blue',
				已上门: 'cyan',
				已取消: 'red'
			};
			return obj[status];
		},
		checkTime(time, status) {
			const data = this.$dayjs(time).diff(this.$dayjs());
			return ['已上门'].includes(status) || data > 0;
		}
	}
};
</script>

<style lang="scss" scoped>
.order {
	border-radius: 15upx;
	width: 90%;
}
</style>
