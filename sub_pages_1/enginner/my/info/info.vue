<template>
	<view class="bg-page">
		<view class="padding-sm">
			<view class="cu-list menu sm-border card-menu margin-tb">
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-btn text-blue"></text>
						<text class="text-grey">照片</text>
					</view>
					<view class="action"><view class="cu-avatar radius" :style="'background-image:url(' + info.avatar + ');'" @tap="showAvatar = true"></view></view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-btn text-blue"></text>
						<text class="text-grey">姓名</text>
					</view>
					<view class="action"><uni-easyinput v-model="info.name"></uni-easyinput></view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-btn text-blue"></text>
						<text class="text-grey">手机号</text>
					</view>
					<view class="action"><uni-easyinput v-model="info.phone"></uni-easyinput></view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-btn text-blue"></text>
						<text class="text-grey">类别</text>
					</view>
					<view class="action">
						<u-radio-group v-model="info.type" placement="row">
							<u-radio label="全职" :name="1"></u-radio>
							<u-radio label="兼职" :name="2" :customStyle="{ marginLeft: '10px' }"></u-radio>
						</u-radio-group>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-btn text-blue"></text>
						<text class="text-grey">是否接单</text>
					</view>
					<view class="action"><u-switch v-model="status" @change="changeStatus"></u-switch></view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-btn text-blue"></text>
						<text class="text-grey">结算银行</text>
					</view>
					<view class="action"><uni-easyinput v-model="info.bank_card_type"></uni-easyinput></view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-btn text-blue"></text>
						<text class="text-grey">银行卡号</text>
					</view>
					<view class="action"><uni-easyinput v-model="info.bank_card_number"></uni-easyinput></view>
				</view>
				<view class="cu-item arrow" @tap="showServices = true">
					<view class="content">
						<text class="cuIcon-btn text-blue"></text>
						<text class="text-grey">服务项</text>
					</view>
				</view>
			</view>

			<button class="cu-btn bg-blue lg block margin-top" @tap="submit">提交更改</button>
		</view>

		<u-action-sheet :closeOnClickOverlay="true" :closeOnClickAction="true" title="照片信息" :show="showAvatar" @close="showAvatar = false" :safeAreaInsetBottom="true">
			<view class="flex align-center justify-center margin-tb-xl">
				<view style="width: 80vw;"><use-upload :limit="1" @upload="avatarUploaded" style="width: 10vw;"></use-upload></view>
			</view>
		</u-action-sheet>

		<u-action-sheet :closeOnClickOverlay="true" :closeOnClickAction="true" title="技能选择" :show="showServices" @close="showServices = false" :safeAreaInsetBottom="true">
			<view class="padding" style="margin-bottom: 50px;">
				<u-checkbox-group v-model="info.skill" placement="column">
					<u-checkbox :label="item" v-for="item in jobColumns" :key="item" :name="item" :customStyle="{ margin: '10px auto' }"></u-checkbox>
				</u-checkbox-group>
				<button class="cu-btn bg-blue block margin-top" @tap="showServices = false">确认</button>
			</view>
		</u-action-sheet>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showAvatar: false,
			showServices: false,
			status: false,
			info: {},
			jobColumns: []
		};
	},
	methods: {
		avatarUploaded(imgs) {
			this.info.avatar = imgs[0].url;
			this.showAvatar = false;
		},
		getDetails() {
			const user = uni.getStorageSync('uni-id-pages-userInfo');
			this.$db['engineers']
				.where({
					user_id: user._id
				})
				.tofirst()
				.then(res => {
					console.log(res);
					this.info = res.datas;
					this.status = !!this.info.status;
				});
		},
		changeStatus(val) {
			this.status = val;
			this.info.status = val ? 1 : 0;
		},
		getServices() {
			this.$db['usemall-goods-category']
				.where({ state: '启用' })
				.tofulllist()
				.then(res => {
					console.log(res);
					res.datas.forEach(item => {
						if (!item.pid) {
							this.jobColumns.push(item.name);
						}
					});
				});
		},
		submit() {
			if (!this.info.name || !this.info.avatar || !this.info.phone || this.info.skill.length === 0) {
				this.$api.msg('请检查输入');
				return;
			}

			const user = uni.getStorageSync('uni-id-pages-userInfo');
			if (!user) {
				this.$api.msg('没有查询到用户信息');
				return;
			}
			this.$db['engineers']
				.where({
					user_id: user._id
				})
				.update({
					name: this.info.name,
					avatar: this.info.avatar,
					phone: this.info.phone.toString(),
					type: this.info.type,
					skill: this.info.skill,
					status: this.info.status,
					bank_card_type: this.info.bank_card_type,
					bank_card_number: this.info.bank_card_number
				})
				.then(() => {
					this.$api.msg('更新成功');
					setTimeout(() => {
						uni.navigateBack();
					}, 1200);
				});
		}
	},
	mounted() {
		this.getDetails();
		this.getServices();
	}
};
</script>

<style lang="scss"></style>
