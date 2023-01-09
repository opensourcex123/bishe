<template>
	<view>
		<u-subsection :list="list" :current="current" @change="sectionChange"></u-subsection>

		<view v-if="current === 0" class="padding">
			<view class="flex align-center justify-between">
				<view class="text-black text-lg">选择跟单内容</view>
				<view class="text-lg text-gray" @click="showMain = true">{{ tabData1.main || '未选择 >' }}</view>
			</view>
			<u-action-sheet
				:actions="mainList"
				:closeOnClickOverlay="true"
				:closeOnClickAction="true"
				title="跟单内容"
				:show="showMain"
				@close="showMain = false"
				@select="mainSelect"
			></u-action-sheet>
			<u-divider></u-divider>
			<view class="flex align-center justify-between">
				<view class="text-black text-lg">选择跟单缘由</view>
				<view class="text-lg text-gray" @click="showReason = true">{{ tabData1.reason || '未选择 >' }}</view>
			</view>
			<u-action-sheet
				:actions="reasonList[mainValue]"
				:closeOnClickOverlay="true"
				:closeOnClickAction="true"
				title="跟单缘由"
				:show="showReason"
				@close="showReason = false"
				@select="reasonSelect"
			></u-action-sheet>
			<u-divider></u-divider>
			<u-textarea placeholder="请输入跟单备注" :placeholderStyle="{ backgroundColor: '#F7F8FA' }" v-model="tabData1.extra"></u-textarea>
			<button class="cu-btn bg-blue block margin-top" @tap="submit">提交</button>
		</view>

		<view v-if="current === 1" class="padding">
			<view v-for="(item, index) in followList" :key="index">
				<view class="flex justify-between align-center">
					<view>
						<text class="cuIcon-titles text-blue text-lg"></text>
						<text class="text-bold text-black text-lg">{{item.main}}</text>
					</view>
					<view class="text-orange">{{item.status}}</view>
				</view>
				<view class="text-black">{{item.extra}}</view>
				<u-divider></u-divider>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: ['发起跟单', '查看处理情况'],
			current: 0,
			tabData1: {
				main: '',
				reason: '',
				extra: ''
			},
			showMain: false,
			showReason: false,
			order_id: '',
			mainList: [
				{
					name: '申请改价格',
					value: 0
				},
				{
					name: '服务完成',
					value: 1
				},
				{
					name: '保留工单',
					value: 2
				}
			],
			mainValue: 0,
			reasonList: {
				0: [
					{
						name: '改价格'
					}
				],
				1: [
					{
						name: '用户观察后收费'
					},
					{
						name: '已收费待交账'
					},
					{
						name: '开发票收款'
					}
				],
				2: [
					{
						name: '等用户自备材料'
					},
					{
						name: '用户考虑'
					},
					{
						name: '待用户确认时间'
					}
				]
			},
			followList: []
		};
	},
	methods: {
		sectionChange(index) {
			this.current = index;
		},
		mainSelect(e) {
			this.mainValue = e.value;
			this.tabData1.main = e.name;
			this.tabData1.reason = '';
		},
		reasonSelect(e) {
			this.tabData1.reason = e.name;
		},
		submit() {
			if (!this.tabData1.main || !this.tabData1.reason) {
				uni.showToast({
					icon: 'none',
					title: '请检查输入'
				});
				return;
			}
			this.$func.usemall
				.call('follow/create', {
					main: this.tabData1.main,
					reason: this.tabData1.reason,
					extra: this.tabData1.extra,
					order: this.order_id
				})
				.then(res => {
					console.log(res);
					uni.showToast({
						icon: 'none',
						title: '跟单已提交'
					});

					setTimeout(() => {
						uni.navigateBack();
					}, 1200);
				});
		},
		getList(id) {
			this.$db['order-follow']
				.where({
					order_id: id
				})
				.tolist()
				.then(res => {
					console.log(res)
					this.followList = res.datas
				});
		}
	},
	onLoad(e) {
		this.getList(e.id);
		this.order_id = e.id;
	}
};
</script>

<style lang="scss" scoped></style>
