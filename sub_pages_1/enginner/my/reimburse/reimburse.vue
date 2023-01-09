<template>
	<view class="bg-white">
		<u-subsection :list="list" :current="current" @change="sectionChange"></u-subsection>
		<view v-if="current === 0" class="padding">
			<uni-forms ref="form" :modelValue="formData" :rules="rules">
				<uni-forms-item label="物品" name="object"><uni-easyinput type="text" v-model="formData.object" placeholder="请输入物品名称" /></uni-forms-item>
				<uni-forms-item label="金额" name="money"><uni-easyinput type="number" v-model.number="formData.money" placeholder="请输入金额" /></uni-forms-item>
				<uni-forms-item label="凭证" name="imgs"><use-upload :limit="3" @upload="upload"></use-upload></uni-forms-item>
			</uni-forms>
			<button class="cu-btn bg-blue lg block margin-top" @tap="submit">提交</button>
		</view>
		<view v-if="current === 1">
			<u-collapse>
				<u-collapse-item :title="v.object" v-for="(v, k) in applyList" :key="k">
					<text class="cu-tag bg-blue round" v-if="v.status === 1">正在审核</text>
					<text class="cu-tag bg-green round" v-if="v.status === 2">审核通过</text>
					<text class="cu-tag bg-red round" v-if="v.status === 3">审核失败</text>
					<text class="cu-tag bg-orange round" v-if="v.status === 4">已撤回</text>
					<text class="text-black text-lg margin-tb">￥{{ v.money / 100 }} 元</text>
					<u-album :urls="v.imgs"></u-album>
					<button class="cu-btn bg-red lg block" @tap="callback(v._id)" v-if="v.status === 1">撤销申请</button>
				</u-collapse-item>
			</u-collapse>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: ['报销申请', '报销结果'],
			applyList: [],
			current: 0,
			formData: {
				object: '',
				money: 0,
				imgs: []
			},
			rules: {
				object: {
					rules: [
						{
							required: true,
							errorMessage: '请输报销物品名称'
						}
					]
				},
				money: {
					rules: [
						{
							required: true,
							errorMessage: '请输入金额'
						}
					]
				},
				imgs: {
					rules: [
						{
							required: true,
							errorMessage: '请上传凭证'
						}
					]
				}
			}
		};
	},
	methods: {
		upload(imgs) {
			this.formData.imgs = imgs.map(v => v.url);
			console.log(imgs);
		},
		submit() {
			this.$refs.form.validate().then(res => {
				const user = uni.getStorageSync('uni-id-pages-userInfo');
				this.$db['reimburse']
					.add({
						object: res.object,
						imgs: res.imgs,
						money: res.money * 100,
						engineer_id: user._id,
						create_time: Date.now()
					})
					.then(res => {
						uni.showToast({
							icon: 'none',
							title: '申请已提交'
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 1200);
					});
			});
		},
		sectionChange(index) {
			this.current = index;
			if (this.current === 1) {
				this.getList();
			}
		},
		getList() {
			const user = uni.getStorageSync('uni-id-pages-userInfo');
			this.$db['reimburse']
				.where({
					engineer_id: user._id
				})
				.tolist()
				.then(res => {
					this.applyList = res.datas;
				});
		},
		callback(id) {
			console.log(id);
			this.$db['reimburse']
				.where({
					_id: id
				})
				.update(
					{
						status: 4
					},
					{}
				)
				.then(res => {
					uni.showToast({
						icon: 'none',
						title: '该申请已撤回'
					});
				});
		}
	},
	mounted() {}
};
</script>

<style lang="scss"></style>
