<template>
	<view class="padding bg-page">
		<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top" :label-width="100">
			<uni-forms-item label="疫苗接种情况" name="yimiao" required><uni-data-checkbox v-model="formData.yimiao" :localdata="yimiaoList" /></uni-forms-item>
			<uni-forms-item label="健康宝截图" name="image" required><use-upload class="pos-r" @upload="uploadImgs" :limit="1"></use-upload></uni-forms-item>
		</uni-forms>
		<view>
			<view>1、健康信息每3天收集一次</view>
			<view class="margin-tb">2、提交表示您同意我们收集您的健康信息，展示区域包括不限于用户订单页面和消息通知等；如存在虚假上报，由此产生的后果将自行承担</view>
		</view>
		<button @click="submit" class="cu-btn bg-blue block lg">提交</button>
	</view>
</template>

<script>
import UUpload from '../../../../uni_modules/uview-ui/components/u-upload/u-upload.vue';
export default {
	data() {
		return {
			yimiaoList: [
				{
					text: '未接种',
					value: 0
				},
				{
					text: '第1/3针',
					value: 1
				},
				{
					text: '第2/3针',
					value: 2
				},
				{
					text: '第3/3针',
					value: 3
				},
				{
					text: '第1/2针',
					value: 4
				},
				{
					text: '第2/2针',
					value: 5
				},
				{
					text: '第2针+加强针',
					value: 6
				}
			],
			// 表单数据
			formData: {
				yimiao: '',
				image: ''
			},
			rules: {
				// 对name字段进行必填验证
				yimiao: {
					rules: [
						{
							required: true,
							errorMessage: '请选择疫苗接种情况'
						}
					]
				},
				image: {
					rules: [
						{
							required: true,
							errorMessage: '请选择截图上传'
						}
					]
				}
			}
		};
	},
	methods: {
		uploadImgs(list) {
			this.formData.image = list[0].url;
		},
		// 触发提交表单
		submit() {
			this.$refs.form
				.validate()
				.then(res => {
					console.log('表单数据信息：', res);
					this.$func.usemall
						.call('healthInfo/create', {
							yimiao: res.yimiao,
							url: res.image
						})
						.then(res => {
							this.$api.msg('提交成功');
							setTimeout(() => {
								uni.navigateBack();
							}, 1000);
						});
				})
				.catch(err => {
					console.log('表单错误信息：', err);
				});
		}
	},
	onLoad() {
		// this.$func.usemall.call("healthInfo/uploadImage",{
		// 	 yimiao: 1,
		// 	 imageUrl: ""
		// }).then(res=>{
		// 	console.log(res)
		// })
	}
};
</script>

<style lang="scss"></style>
