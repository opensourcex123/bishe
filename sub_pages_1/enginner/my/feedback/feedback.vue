<template>
	<view class="bg-page">
		<view class="padding" style="padding-bottom: 30px;">
			<u-subsection :list="list" :current="current" mode="button" @change="sectionChange" fontSize="14"></u-subsection>
			<view class="margin-top-lg">
				<u-radio-group v-model="contentValue" placement="column">
					<u-radio :customStyle="{ marginBottom: '15px' }" v-for="(item, index) in content[current]" :key="index" :label="item.title" :name="item.title"></u-radio>
				</u-radio-group>
			</view>

			<view class="text-bold text-lg text-black margin-tb-sm">反馈内容</view>
			<view class="bg-white margin-tb-sm"><textarea placeholder="请详细描述,有助于我们更快的解决问题" placeholder-style="padding: 5px" v-model="describe"></textarea></view>
			<use-upload :limit="3" @upload="upload"></use-upload>
		</view>

		<view class="footer bg-white padding-bottom">
			<view class="bg-blue light padding-sm text-center">我们会认真阅读每条反馈并及时回复</view>
			<button class="cu-btn block bg-blue lg" @tap="submit">提交</button>
		</view>
	</view>
</template>

<script>
import { curry } from 'lodash';
export default {
	data() {
		return {
			list: ['订单问题', '余额账户', 'APP体验', '我要投诉', '其他建议'],
			current: 0,
			contentValue: '',
			describe: '',
			imgs: [],
			content: {
				0: [
					{
						title: '派单规则问题'
					},
					{
						title: '新单提醒问题'
					},
					{
						title: '订单信息有误'
					},
					{
						title: '订单报价问题'
					},
					{
						title: '配件问题'
					},
					{
						title: '订单结算问题'
					},
					{
						title: '其他'
					}
				],
				1: [
					{
						title: '提留明细问题'
					},
					{
						title: '质保金问题'
					},
					{
						title: '配件费问题'
					},
					{
						title: '绩效计算问题'
					},
					{
						title: '其他'
					}
				],
				2: [
					{
						title: '界面操作不方便'
					},
					{
						title: '页面卡顿、不流畅'
					},
					{
						title: 'APP闪退、无响应'
					},
					{
						title: '规则不明确、不易懂'
					},
					{
						title: '其他'
					}
				],
				3: [
					{
						title: '投诉客服'
					},
					{
						title: '投诉派单员'
					},
					{
						title: '投诉主管'
					},
					{
						title: '举报主管'
					}
				],
				4: [
					{
						title: '服务流程建议'
					},
					{
						title: 'APP功能建议'
					},
					{
						title: '管理制度建议'
					},
					{
						title: '其他'
					}
				]
			}
		};
	},
	methods: {
		sectionChange(index) {
			this.current = index;
			this.describe = '';
			this.imgs = [];
		},
		submit() {
			if (!this.contentValue || !this.describe || this.imgs.length === 0) {
				uni.showToast({
					icon: 'none',
					title: '请检查输入'
				});
				return;
			}

			this.$db['feedback']
				.add({
					type: this.list[this.current],
					title: this.contentValue,
					describe: this.describe,
					img: this.imgs,
					create_time: Date.now()
				})
				.then(res => {
					console.log(res);
					uni.showToast({
						icon: 'none',
						title: '创建成功'
					});

					setTimeout(() => {
						uni.navigateBack();
					}, 1200);
				});
		},
		upload(imgs) {
			imgs.forEach(v => {
				this.imgs.push(v.url);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.footer {
	position: fixed;
	width: 100%;
	bottom: 0;
	z-index: 1024;
	box-shadow: 0 -1upx 6upx rgba(0, 0, 0, 0.1);
}
</style>
