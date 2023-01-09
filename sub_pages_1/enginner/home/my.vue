<template name="my">
	<scroll-view scroll-y class="scrollPage bg-page">
		<view class="UCenter-bg bg-blue" @tap="checkInfo">
			<view class="flex align-center justify-between margin-bottom-lg" style="width: 100%;">
				<view class="flex align-center">
					<view class="cu-avatar xl round margin-left" :style="'background-image: url(' + info.info.avatar + ');width: 40vw'"></view>
					<view class="margin-left">
						<view class="text-bold text-xl">{{ info.info.name }}</view>
						<view class="cu-tag bg-orange text-black round margin-top-xs light" v-for="item in info.info.skill" :key="item">{{ item }}</view>
					</view>
				</view>
			</view>
			<image src="https://cloud-sports-1302510758.cos.ap-beijing.myqcloud.com/common/wave.gif" mode="scaleToFill" class="gif-wave"></image>
		</view>
		<view class="padding flex text-center text-grey bg-white shadow-warp">
			<view class="flex flex-sub flex-direction solid-right">
				<view class="text-xxl text-bold text-black">{{ info.successNum || 0 }}</view>
				<view class="margin-top-sm">本月成功单</view>
			</view>
			<view class="flex flex-sub flex-direction solid-right">
				<view class="text-xxl text-bold text-black">{{ info.failNum || 0 }}</view>
				<view class="margin-top-sm">本月失败单</view>
			</view>
			<view class="flex flex-sub flex-direction">
				<view class="text-xxl text-bold text-black">{{ info.info.salary || 0 }}</view>
				<view class="margin-top-sm">我的账户</view>
			</view>
		</view>
		<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
			<view class="cu-item arrow">
				<navigator class="content" url="/sub_pages_1/enginner/my/orders/orders" hover-class="none">
					<text class="cuIcon-list text-blue"></text>
					<text class="text-grey">历史订单</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" url="/sub_pages_1/enginner/my/reimburse/reimburse" hover-class="none">
					<text class="cuIcon-evaluate_fill text-green"></text>
					<text class="text-grey">报销申请</text>
				</navigator>
			</view>
			<!-- 			<view class="cu-item arrow">
				<navigator class="content" url="/sub_pages_1/enginner/my/complain/complain" hover-class="none">
					<text class="cuIcon-list text-blue"></text>
					<text class="text-grey">投诉申诉</text>
				</navigator>
			</view> -->
			<view class="cu-item arrow">
				<button class="cu-btn content" open-type="feedback">
					<text class="cuIcon-dianhua text-cyan"></text>
					<text class="text-grey">客服中心</text>
				</button>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" url="/sub_pages_1/enginner/my/feedback/feedback" hover-class="none">
					<text class="cuIcon-writefill text-orange"></text>
					<text class="text-grey">意见反馈</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" url="/sub_pages_1/enginner/my/health/health" hover-class="none">
					<text class="cuIcon-punch text-grey"></text>
					<text class="text-grey">防疫信息</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<button class="cu-btn content" @tap="checkDoc">
					<text class="cuIcon-form text-cyan"></text>
					<text class="text-grey">工程师协议</text>
				</button>
			</view>
		</view>
		<view class="cu-tabbar-height"></view>
	</scroll-view>
</template>

<script>
export default {
	data() {
		return {
			info: {}
		};
	},
	methods: {
		getInfo() {
			this.$func.usemall.call('engineers/getInfo').then(res => {
				console.log(res);
				this.info = res.datas.data;
			});
		},
		checkInfo() {
			uni.navigateTo({
				url: '/sub_pages_1/enginner/my/info/info'
			});
		},
		checkDoc() {
			uni.showLoading()
			uni.downloadFile({
				url: 'https://jiadianweixiu-1302510758.cos.ap-beijing.myqcloud.com/agreement.docx',
				success: function(res) {
					var filePath = res.tempFilePath;
					uni.openDocument({
						filePath: filePath,
						showMenu: true,
						success: function(res) {
							console.log('打开文档成功');
							uni.hideLoading()
						},
						fail() {
							uni.hideLoading()
						}
					});
				}
			});
		}
	},
	mounted() {
		this.getInfo();
	}
};
</script>

<style scoped lang="scss">
.UCenter-bg {
	background-image: url(https://image.weilanwl.com/color2.0/index.jpg);
	background-size: cover;
	height: 400rpx;
	display: flex;
	justify-content: center;
	padding-top: 40rpx;
	overflow: hidden;
	position: relative;
	flex-direction: column;
	align-items: center;
	color: #fff;
	font-weight: 300;
	text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}

.UCenter-bg text {
	opacity: 0.8;
}

.UCenter-bg image {
	width: 200rpx;
	height: 200rpx;
}

.UCenter-bg .gif-wave {
	position: absolute;
	width: 100%;
	bottom: 0;
	left: 0;
	z-index: 99;
	mix-blend-mode: screen;
	height: 100rpx;
}

map,
.mapBox {
	left: 0;
	z-index: 99;
	mix-blend-mode: screen;
	height: 100rpx;
}

map,
.mapBox {
	width: 750rpx;
	height: 300rpx;
}
</style>
