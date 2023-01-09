<template>
	<view class="bg-page">
		<view class="padding">
			<view class="msg-card bg-white padding-sm">
				<view class="text-black text-lg text-bold">{{ data.title }}</view>
				<view class="margin-tb-sm text-grey">{{ data.content }}</view>
				<u-divider />
				<view class="text-blue text-lg text-center" @click="checkNav(data.nav)">立即查看</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			data: {}
		};
	},
	methods: {
		getDetails(id) {
			this.$db['engineers-msg']
				.where({
					_id: id
				})
				.tofirst()
				.then(res => {
					console.log(res);
					this.data = res.datas;
				});
		},
		checkNav(nav) {
			uni.navigateTo({
				url: nav
			});
		}
	},
	onLoad(e) {
		this.getDetails(e.id);
	}
};
</script>

<style lang="scss" scoped>
.msg-card {
	border-radius: 5px;
}
</style>
