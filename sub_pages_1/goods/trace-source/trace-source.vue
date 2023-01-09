<template>
	<view class="source">
		<view>
			<image
				class="wh-full"
				style="width: 100%;height: 300upx;"
				mode="aspectFill"
				src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-8d470f4a-a816-4da4-a295-14d1c305a5e9/ea0667e8-5718-4eb7-a97a-bad7cd19b275.png"
			/>
		</view>
		<view class="padding-sm">
			<view class="cu-bar">
				<view class="action sub-title">
					<text class="text-xl text-bold text-green">产品信息</text>
					<text class="bg-green" style="width:3rem"></text>
				</view>
			</view>
			<view class="flex align-center margin-tb" v-for="(item, key) in infomation" :key="key">
				<view><text class="cuIcon-btn text-green"></text></view>
				<view>{{ item.title }}：</view>
				<view class="text-bold">{{ item.value }}</view>
			</view>

			<view class="margin-top">
				<view class="cu-bar">
					<view class="action sub-title">
						<text class="text-xl text-bold text-green">溯源流程</text>
						<text class="bg-green" style="width:3rem"></text>
					</view>
				</view>
				<view class="cu-timeline" style="background-color: unset;">
					<view class="cu-item text-blue" v-for="(item, index) in source" :key="index">
						<view class="text-grey">
							<text class="cuIcon-title text-blue"></text>
							{{ item.datetime }}
						</view>
						<view class="content bg-cyan shadow-blur">
							<view>{{ item.content }}</view>
							<image v-if="item.image" :src="item.image" mode="aspectFill"></image>
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
			infomation: {
				companyName: {
					title: '品牌企业',
					value: '测试'
				},
				productName: {
					title: '产品名称',
					value: '小米'
				},
				productionID: {
					title: '生产编号',
					value: 'xxxxxx'
				},
				productionCompany: {
					title: '生产企业',
					value: 'xxx工厂'
				},
				productionAddress: {
					title: '生产地址',
					value: '昌平'
				},
				productionLocation: {
					title: '生产位置',
					value: '北京市'
				},
				productionDate: {
					title: '生产日期',
					value: '2022-04-01'
				},
				dealer: {
					title: '经销商',
					value: 'xxx'
				},
				price: {
					title: '建议零售价',
					value: '￥20'
				}
			},
			source: [
				{
					datetime: '2022-03-09 20:00:00',
					content: '意大利🇮🇹 安科纳 原料采集'
				},
				{
					datetime: '2022-03-10 20:00:00',
					content: '意大利🇮🇹 安科纳 原油压榨'
				},
				{
					datetime: '2022-03-15 20:00:00',
					content: '意大利🇮🇹 安科纳 出港'
				},
				{
					datetime: '2022-04-10 20:00:00',
					content: '中国🇨🇳 上海 到港'
				},
				{
					datetime: '2022-04-15 20:00:00',
					content: '中国🇨🇳 上海 灌装'
				},
				{
					datetime: '2022-04-22 20:00:00',
					content: '中国🇨🇳 上海 松江区 欧尚超市上架',
					image: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-8d470f4a-a816-4da4-a295-14d1c305a5e9/9bc0415a-a45a-49b1-b3ad-8683e43291f5.jpeg'
				}
			]
		};
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.source {
	background-color: #e8ffea;
}
</style>
