<template name="message">
	<view class="bg-page">
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>
				消息列表
			</view>
		</view>

		<view style="padding-bottom: 150upx;">
			<z-paging ref="paging" v-model="list" @query="getMessages" :use-page-scroll="true">
				<view class="cu-list menu-avatar">
					<view class="cu-item" v-for="(item, index) in list" @click="checkDetails(item._id)" :key="index">
						<view class="cu-avatar xl round" style="background-color: white;">
							<image src="../../../static/images/notice.svg" style="width: 80upx;height: 80upx;"></image>
						</view>
						<view class="content">
							<view class="text-grey">{{ item.title }}</view>
							<view class="text-gray text-sm flex">
								<view class="text-cut">{{ item.content }}</view>
							</view>
						</view>
						<view class="action">
							<view class="text-grey text-xs">{{ item.time }}</view>
							<view class="cu-tag round bg-grey sm">1</view>
						</view>
					</view>
				</view>
			</z-paging>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: []
		};
	},
	methods: {
		checkDetails(id) {
			uni.navigateTo({
				url: '/sub_pages_1/enginner/home/message-details/message-details?id=' + id
			});
		},
		getMessages(pageNo, pageSize) {
			console.log(pageSize);
			this.$func.usemall
				.call('engineer-msg/getMsgs', {
					page: pageNo,
					pageSize: pageSize
				})
				.then(res => {
					this.$refs.paging.complete(res.datas.data.data);
					this.list = res.datas.data.data;
					this.list.forEach((v, i) => {
						v.create_time = new Date(v.create_time);
						v.time = '' + v.create_time.getHours() + ':' + v.create_time.getMinutes() + ':' + v.create_time.getSeconds();
					});
					console.log(this.list);
				});
		}
	}
};
</script>

<style></style>
