<template>
	<view class="bg-page">
		<u-sticky bgColor="#fff">
			<u-tabs
				:list="list1"
				:activeStyle="{
					fontWeight: 'bold',
					transform: 'scale(1.05)'
				}"
			></u-tabs>
		</u-sticky>

		<view class="padding">
			<view>
				<view class="text-black text-lg text-bold">2022-09-03</view>
				<view>
					<text>09:38</text>
					<text class="text-grey padding-left-sm">定责</text>
				</view>

				<view class="complain-card padding-sm bg-white margin-bottom margin-top-sm" @click="checkDetails">
					<view class="flex justify-between">
						<view>
							<text class="cuIcon-titles text-red text-xl"></text>
							<text class="text-xl text-black text-bold">投诉内容</text>
						</view>
						<view class="cu-tag bg-red round light">投诉</view>
					</view>
					<view class="text-grey text-lg margin-left margin-tb-sm">
						工程师已同意退款，用户进线催退款
					</view>
					<view class="text-right">
						<text class="text-red text-xl">-</text>
						<text class="text-red">￥</text>
						<text class="text-xxl text-red">0.00</text>
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
			list1: [
				{
					name: '可申诉'
				},
				{
					name: '待审核'
				},
				{
					name: '已定责'
				}
			]
		};
	},
	methods: {
		checkDetails() {
			uni.navigateTo({
				url: "/sub_pages_1/enginner/my/complain/details/details"
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.complain-card {
	border-radius: 15px;
}
</style>
