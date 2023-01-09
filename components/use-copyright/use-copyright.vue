<template>
	<view>
		<!-- #ifndef MP-TOUTIAO -->
		<view class="use-copyright dflex-c padding-lr w-full" @click="to">
			<image src="../../static/images/logo.png" style="width: 100upx;height: 100upx;"></image>
            <text>家庭维修服务系统</text>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
	props: {
		
	},
	data() {
		return {};
	},
	methods: {
		to() {
			this.$emit('to', {
				type: 'to'
			});
		}
	}
};
</script>

<style lang="scss">
.use-copyright {
	height: 180rpx;
}
.use-copyright {
	text {
		color: #c0c0c0;
	}
}
</style>
