<template>
	<view>
		<view class="bg-page"><image :src="cosUrl + '/img/工程师.png'" style="width: 100%;height: 200px;"></image></view>

		<view class="padding">
			<uni-forms ref="form" :modelValue="formData" :rules="rules" label-width="80">
				<uni-forms-item label="姓名" name="name" required><uni-easyinput type="text" v-model="formData.name" placeholder="请输入姓名" /></uni-forms-item>
				<uni-forms-item label="手机号" name="phone" required><uni-easyinput type="text" v-model="formData.phone" placeholder="请输入手机号" /></uni-forms-item>
				<uni-forms-item label="类型" name="type" required>
					<u-radio-group v-model="formData.type" placement="column">
						<u-radio label="全职" :name="1"></u-radio>
						<view style="margin-top: 10px;"><u-radio label="兼职" :name="2"></u-radio></view>
					</u-radio-group>
				</uni-forms-item>
				<uni-forms-item label="身份证正面" name="id_card_front" required><use-upload :limit="1" @upload="idCardFrontUpload"></use-upload></uni-forms-item>
				<uni-forms-item label="身份证背面" name="id_card_back" required><use-upload :limit="1" @upload="idCardBackUpload"></use-upload></uni-forms-item>
				<uni-forms-item label="个人照片" name="avatar" required><use-upload :limit="1" @upload="avatarUpload"></use-upload></uni-forms-item>
				<uni-forms-item label="银行名称" name="bank_card_type" required><uni-easyinput type="text" v-model="formData.bank_card_type" placeholder="请输入工资结算银行名称" /></uni-forms-item>
				<uni-forms-item label="银行卡号" name="bank_card_number" required><uni-easyinput type="text" v-model="formData.bank_card_number" placeholder="请输入工资结算银行卡号" /></uni-forms-item>
				<uni-forms-item label="维修项" name="job" required>
					<u-checkbox-group v-model="formData.job" placement="column" borderBottom>
						<u-checkbox :label="item" v-for="item in jobColumns" :key="item" :name="item"></u-checkbox>
					</u-checkbox-group>
				</uni-forms-item>
			</uni-forms>
			
			<button class="cu-btn lg block bg-blue" @tap="submit">提交审核</button>
		</view>
	</view>
</template>

<script>
const cosUrl = getApp().globalData.cosUrl;
export default {
	data() {
		return {
			cosUrl,
			jobColumns: [],
			// 表单数据
			formData: {
				name: '',
				phone: '',
				job: [],
				id_card_front: '',
				id_card_back: '',
				avatar: '',
				uid: '',
				type: '',
				bank_card_type: "",
				bank_card_number: ""
			},
			rules: {
				// 对name字段进行必填验证
				name: {
					rules: [
						{
							required: true,
							errorMessage: '请输入姓名'
						}
					]
				},
				// 对email字段进行必填验证
				phone: {
					rules: [
						{
							required: true,
							format: 'number',
							errorMessage: '请输入正确的电话'
						}
					]
				},
				id_card_front: {
					rules: [
						{
							required: true,
							errorMessage: '请上传身份证正面'
						}
					]
				},
				id_card_back: {
					rules: [
						{
							required: true,
							errorMessage: '请上传身份证背面'
						}
					]
				},
				avatar: {
					rules: [
						{
							required: true,
							errorMessage: '请上传个人照片'
						}
					]
				},
				job: {
					rules: [
						{
							required: true,
							format: 'string',
							errorMessage: '请选择维修项'
						}
					]
				},
				type: {
					rules: [
						{
							required: true,
							format: 'string',
							errorMessage: '请选择类型'
						}
					]
				},
				bank_card_type: {
					rules: [
						{
							required: true,
							format: 'string',
							errorMessage: '请输入银行名称'
						}
					]
				},
				bank_card_number: {
					rules: [
						{
							required: true,
							format: 'string',
							errorMessage: '请输入银行卡号'
						}
					]
				}
			}
		};
	},

	methods: {
		idCardFrontUpload(imgs) {
			this.formData.id_card_front = imgs[0].url;
		},
		idCardBackUpload(imgs) {
			this.formData.id_card_back = imgs[0].url;
		},
		avatarUpload(imgs) {
			this.formData.avatar = imgs[0].url;
		},
		getServices() {
			this.$db['usemall-goods-category'].where({state: "启用"}).tofulllist().then(res => {
				console.log(res);
				res.datas.forEach(item => {
					if (!item.pid) {
						this.jobColumns.push(item.name);
					}
				});
			});
		},
		submit() {
			const user = uni.getStorageSync('uni-id-pages-userInfo');
			this.$refs.form.validate().then(res => {
				console.log('表单数据信息：', res);
				this.$func.usemall
					.call('engineers/create', {
						phone: res.phone.toString(),
						name: res.name,
						skill: res.job,
						avatar: res.avatar,
						id_card_front: res.id_card_front,
						id_card_back: res.id_card_back,
						user_id: user._id,
						type: parseInt(res.type),
						bank_card_type: res.bank_card_type,
						bank_card_number: res.bank_card_number
					})
					.then(res1 => {
						uni.showToast({
							title: '申请已提交'
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 1800);
					});
			});
		},
	},
	mounted() {
		this.getServices()
	}
};
</script>

<style lang="scss" scoped></style>
