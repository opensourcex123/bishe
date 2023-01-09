<template>
	<view class="container">
		<use-list-title title="个人资料" iconfont=" " @goto="to"></use-list-title>
		<view class="gap"></view>
			
		<!-- #ifdef MP-ALIPAY -->
		<view class="use-item padding-left">
			<button class="no-border wh-full tal" open-type="feedback" @click="tofeedback">意见反馈</button>
		</view>
		<!-- #endif -->
		
		<!-- #ifndef MP-ALIPAY -->
		<view class="use-item">
			<button class="no-border wh-full tal" open-type="feedback" @click="tofeedback">意见反馈</button>
		</view>
		<!-- #endif -->
		<view class="gap"></view>
		
		
		<view class="use-item log-out-btn tac" @click="tologin">
			<text>切换账号</text>
		</view>
		<view class="gap"></view>
		
		<view class="use-item log-out-btn tac" @click="tologout">
			<text>退出登录</text>
		</view>
	</view>
</template>

<script>
	const _about = 'usemall-app-about'
	export default {
		data() {
			return {
				version: '1.0.0',
				aboutData: {}
			};
		},
		onLoad(options) {
			this.$db[_about].tofirst().then(res=>{
				if(res.code === 200){
					this.aboutData = res.datas;
					// console.log('this.aboutData', this.aboutData);
					return
				}
			})
		},
		onShow() {
			this.version = '版本 ' + this.$config.version;
		},
		methods: {
			// 个人资料
			to() {
				uni.navigateTo({
					url:'/sub_pages_2/uni-id-pages/pages/userinfo/userinfo'
				})
			},
			// 关于
			toabout() {
				if (this.aboutData.type == '网页') {
					uni.navigateTo({
						url: `/sub_pages_1/content/web?url=${this.aboutData.url}`
					});
				} else if (this.aboutData.type == '内容') {
					uni.setStorage({
						key: '__rich_text',
						data: this.aboutData.content,
						success() {
							uni.navigateTo({
								url: '/sub_pages_1/content/rich-text'
							})	
						}
					})
				} 
			},
			tofeedback(){
				this.$api.msg('打开右上角-反馈功能');
			},
			// 切换账号
			tologin(){
				this.$api.tologin();
			},
			// 退出登录
			tologout() {
				const uniIdCo = uniCloud.importObject('uni-id-co')
				uni.showModal({
					content: '退出登录',
					success: async (e) => {
						if (e.confirm) {
							this.$api.msg('退出成功');
							await uniIdCo.logout()
							uni.removeStorageSync("uni-id-pages-userInfo")
							
							this.$api.timerout(() => {
								this.$api.tohome();
							}, 200);
						}
					}
				});
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
	}

	.use-item {
		height: 100rpx;
		line-height: 100rpx;
		position: relative;
		background: #fff;
		
		switch {
			transform: translateX(16rpx) scale(.84);
		}
		
		button {
			line-height: 100rpx;
			background: #fff;
			font-size: 15px;
		}
	}
</style>
