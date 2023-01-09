<template>
	<view :class="type == 'round' ? 'padding-lr-sm' : ''">
		<!-- 列表标题 -->
		<view class="use-list-title dflex-b padding-lr w-full bg-main" :class="type == 'round' ? 'border-radius' : ''" @click="goto">
			<view class="dflex">
				<view v-if="iconfont && iconfont != ' '" class="iconfont __left margin-right-sm" :class="iconfont" :style="{ color: color }"></view>
				<view v-if="iconfont1 != ''" class="iconfont-1 __left margin-right-sm" :class="iconfont1" :style="{ color: color }"></view>
				<text :style="{fontSize: size + 'rpx', fontWeight: fwt }">{{ title }}</text>
			</view>
			<view class="dflex">
				<text v-if="tip" class="tip margin-right-xs">{{tip}}</text>
				<view v-if="right == 'a'" class="iconfont fs-sm" :class="rightIcon" :style="{ color: rightColor }"></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		type: {
			type: String,
			default: 'square'
		},
		title: {
			type: String,
			default: '列表标题'
		},
		size: {
			type: String,
			default: '28'
		},
		fwt: {
			type: String,
			default: 'normal'
		},
		tip: {
			type: [String, Number],
			default: ''
		},
		right: {
			type: String,
			default: 'a',
		},
		iconfont: {
			type: String,
			default: 'icondaifahuo-'
		},
		iconfont1: {
			type: String,
			default: ''
		},
		color: {
			type: String,
			default: '#C0C4CC'
		},
		rightIcon: {
			type: String,
			default: 'iconjiantou-01'
		},
		rightColor: {
			type: String,
			default: '#c0c0c0'
		}
	},
	data() {
		return {};
	},
	methods: {
		goto() {
			console.log('goto');
			this.$emit('goto', {
				type: 'goto'
			});
		}
	}
};
</script>

<style lang="scss">
.use-list-title {
	height: 100rpx;
	line-height: 100rpx;
}
.use-list-title {
	.__left{
		font-size: $font-lg + 8upx;
	}
	
	.iconfont {
		color: #c0c0c0;
	}
	
	.iconfont-1 {
		color: #c0c0c0;
	}
	
	.tip {
		font-size: $font-sm;
		color: #c0c0c0;
	}
}
</style>
