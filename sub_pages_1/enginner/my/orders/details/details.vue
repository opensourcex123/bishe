<template>
	<view class="bg-page">
		<view class="bg-white padding-sm margin-tb" v-if="income && info.state !== '已取消'">
			<view>
				<text class="cuIcon-titles text-blue text-xl"></text>
				<text class="text-black text-xl text-bold">基本信息</text>
			</view>
			<view class="flex align-center justify-between margin-tb-sm">
				<view>
					<text class="text-lg text-bold">本单收入</text>
					<text>（金额以实际发放为准）</text>
				</view>
				<view class="text-right">
					<text class="text-red">￥</text>
					<text class="text-xxl text-red">{{ income.engineer_income ? income.engineer_income / 100 : 0.0 }}</text>
				</view>
			</view>
			<view class="flex align-center justify-between margin-tb-sm">
				<view class="text-grey">算账时间</view>
				<view class="text-black">{{ $dayjs(income.create_time).format('YYYY-MM-DD HH:mm:ss') }}</view>
			</view>
		</view>

		<view class="bg-white padding-sm margin-tb">
			<view>
				<text class="cuIcon-titles text-blue text-xl"></text>
				<text class="text-black text-xl text-bold">费用信息</text>
			</view>
			<view class="flex align-center justify-between margin-tb-sm">
				<view class="text-grey" style="width: 20%;">产品名称</view>
				<view class="text-black">{{ info.order_info }}</view>
			</view>
			<!-- 			<view class="flex align-center justify-between margin-tb-sm">
				<view class="text-grey" style="width: 20%;">服务项目</view>
				<view class="text-black">安装费（￥198.00）</view>
			</view> -->
			<view class="flex align-center justify-between margin-tb-sm">
				<view class="text-grey" style="width: 20%;">服务基价</view>
				<view class="text-orange">￥{{ info.order_total_money / 100 }}</view>
			</view>
			<view class="flex align-center justify-between margin-tb-sm">
				<view class="text-grey" style="width: 20%;">订单实收</view>
				<view class="text-orange">￥{{ info.order_actural_paid / 100 }}</view>
			</view>
		</view>

		<view class="bg-white padding-sm margin-tb" v-if="info.state !== '已取消'">
			<view>
				<text class="cuIcon-titles text-blue text-xl"></text>
				<text class="text-black text-xl text-bold">保修信息</text>
			</view>
			<view class="flex align-center justify-between margin-tb-sm">
				<view class="text-grey" style="width: 20%;">保修产品</view>
				<view class="text-black">{{ info.order_info }}</view>
			</view>
			<view v-for="item in card" :key="item">
				<view class="flex align-center justify-between margin-tb-sm">
					<view class="text-grey" style="width: 20%;">保修卡</view>
					<view class="text-black">{{ item.name }}</view>
				</view>
				<view class="flex align-center justify-between margin-tb-sm">
					<view class="text-grey" style="width: 20%;">保修时间</view>
					<view class="text-black">
						{{ $dayjs(info.create_time).format('YYYY-MM-DD') }}至{{
							$dayjs(info.create_time)
								.add(item.duration, 'millisecond')
								.format('YYYY-MM-DD')
						}}
					</view>
				</view>
				<view class="flex align-center justify-between margin-tb-sm">
					<view class="text-grey" style="width: 20%;">领取状态</view>
					<view class="text-black">已领取</view>
				</view>
			</view>
		</view>

		<view class="bg-white padding-sm margin-tb">
			<view>
				<text class="cuIcon-titles text-blue text-xl"></text>
				<text class="text-black text-xl text-bold">照片信息</text>
			</view>
			<view class="margin-tb"><u-album :urls="info.imgs"></u-album></view>
		</view>

		<view class="bg-white padding-sm margin-tb">
			<view>
				<text class="cuIcon-titles text-blue text-xl"></text>
				<text class="text-black text-xl text-bold">订单信息</text>
			</view>
			<view class="flex align-center justify-between margin-tb-sm">
				<view class="text-grey" style="width: 20%;">订单号码</view>
				<view class="flex align-center">
					<view class="text-black">{{ info.order_id }}</view>
					<view class="cu-tag bg-grey round sm margin-left-xs" @tap="copy(info.order_id)">复制</view>
				</view>
			</view>
			<view class="flex align-center justify-between margin-tb-sm">
				<view class="text-grey" style="width: 20%;">预约时间</view>
				<view class="text-black">{{ $dayjs(info.start_time).format('YYYY-MM-DD HH:mm') }}</view>
			</view>
			<view class="flex align-center justify-between margin-tb-sm">
				<view class="text-grey" style="width: 20%;">订单产品</view>
				<view class="text-black">{{ info.order_info }}</view>
			</view>
			<view class="flex align-center justify-between margin-tb-sm">
				<view class="text-grey" style="width: 20%;">故障描述</view>
				<view class="text-black">{{ info.remark }}</view>
			</view>
			<view class="flex align-center justify-between margin-tb-sm">
				<view class="text-grey" style="width: 20%;">订单标记</view>
				<view class="flex align-center">
					<view class="cu-tag bg-grey">计价器</view>
					<view class="cu-tag bg-grey">有效联系</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			info: {},
			income: {},
			card: []
		};
	},
	methods: {
		getDetails(id) {
			this.$func.usemall
				.call('order/getEngineerOrderDetails', {
					order_id: id
				})
				.then(res => {
					console.log(res);
					this.info = res.datas.data.info || '';
					this.income = res.datas.data.income || '';
					this.card = res.datas.data.card;
				});
		},
		copy(text) {
			uni.setClipboardData({
				data: text,
				success() {
					this.$api.msg('已复制');
				}
			});
		}
	},
	onLoad(e) {
		console.log('=====>', e.id);
		this.getDetails(e.id);
	}
};
</script>

<style lang="scss"></style>
