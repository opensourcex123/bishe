<template>
	<view class="content bg-drak ft-main">
		<u-tabs lineWidth="30" :activeStyle="{
		    color: '#303133',
		    fontWeight: 'bold',
		    transform: 'scale(1.05)'
		}" :inactiveStyle="{
		    color: '#606266',
		    transform: 'scale(1)'
		}" itemStyle="padding-left: 5rpx; padding-right: 5rpx; padding-top:5rpx; height: 34px;" :scrollable="false"
			:list="list" @click="tabChange">
		</u-tabs>
		<view class="gap"></view>
		<vieW v-if="index === 0">
			<view class="row dflex border-line padding-lr">
				<text class="tit">单位名称</text>
				<input class="input" type="text" v-model="billData.compony_name" placeholder="请输入单位名称"
					placeholder-class="placeholder" />
			</view>
			<view class="row dflex border-line padding-lr">
				<text class="tit">纳税人识别号</text>
				<input class="input" type="number" v-model="billData.identity_number" placeholder="请输入纳税识别号"
					placeholder-class="placeholder" />
			</view>
			<view class="gap"></view>
			<view class="padding w-full margin-top">
				<view class="dflex-b border-radius-big">
					<view class="tac padding-tb-sm flex1 bg-base" @click="submit">提交</view>
				</view>
			</view>
		</view>
		<view v-if="index === 1">
			<view class="row dflex border-line padding-lr">
				<text class="tit">单位名称</text>
				<input class="input" type="text" v-model="billData.compony_name" placeholder="请输入单位名称"
					placeholder-class="placeholder" />
			</view>
			<view class="row dflex border-line padding-lr">
				<text class="tit">纳税人识别号</text>
				<input class="input" type="text" v-model="billData.identity_number" placeholder="请输入纳税人识别号"
					placeholder-class="placeholder" />
			</view>
			<view class="row dflex border-line padding-lr">
				<text class="tit">单位地址</text>
				<view class="dflex-b flex1">
					<view class="flex1 input_t" @click="choiceMapAddr">{{ address }}</view>
					<!-- #ifdef MP-WEIXIN || MP-BAIDU -->
					<view class="iconfont icondizhi- input_t padding-lr-sm padding-tb-16" @click="choiceMapAddr">定位
					</view>
					<!-- #endif -->
				</view>
			</view>
			<view class="row dflex border-line padding-lr">
				<text class="tit">单位电话</text>
				<input class="input" type="number" v-model="billData.company_phone" placeholder="请输入单位电话"
					placeholder-class="placeholder" />
			</view>

			<view class="row dflex border-line padding-lr">
				<text class="tit">开户行</text>
				<input class="input" type="text" v-model="billData.bank_name" placeholder="请输入开户行"
					placeholder-class="placeholder" />
			</view>
			<view class="row dflex border-line padding-lr">
				<text class="tit">开户行账号</text>
				<input class="input" type="text" v-model="billData.bank_account" placeholder="请输入开户行账号"
					placeholder-class="placeholder" />
			</view>
			<view class="gap"></view>
			<view class="padding w-full margin-top">
				<view class="dflex-b border-radius-big">
					<view class="tac padding-tb-sm flex1 bg-base" @click="submit">提交</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				index: 0,
				list: [{
						name: '普票',
					},
					{
						name: '专票'
					}
				],
				address: '请选择地址',
				billData: {
					compony_name: '',
					identity_number: '',
					company_address: '',
					company_phone: '',
					bank_name: '',
					bank_account: '',
					status: 0,
					order_id: '',
					tab: 0,
					create_uid: ''
				},
			};
		},
		onLoad(options) {
			this.billData.order_id = options.order_id;
		},
		methods: {
			tabChange(item) {
				this.index = item.index;
			},
			// 选择地图地址
			choiceMapAddr(options) {
				let _this = this;

				uni.authorize({
					scope: 'scope.userLocation',
					success() {
						uni.chooseLocation({
							success: res => {
								if (res && res.name) {
									_this.address = res.address + res.name;
								}
							},
							fail(err) {
								console.log(err);
							}
						});
					},
					fail(err) {
						uni.showModal({
							title: '位置未授权，打开设置',
							success: function(res) {
								if (res.confirm) {
									uni.openSetting({});
								}
							}
						});
					}
				});
			},

			//提交
			async submit() {
				const bill = await this.$db['electronic-tickets'].where({order_id: this.billData.order_id}).tofirst()
				const user = uni.getStorageSync('uni-id-pages-userInfo')
				this.billData.create_uid = user._id;
				if (Object.keys(bill.datas).length !== 0) {
					this.$api.msg('您已申请过发票，请勿重复申请');
					return;
				}
				if (this.billData.compony_name === '') {
					this.$api.msg('请输入单位名称');
					return;
				}
				if (this.billData.identity_number === '') {
					this.$api.msg('请输入纳税人识别号');
					return;
				}
				if (this.index === 1) {
					this.billData.company_address = this.address;
					this.billData.tab = 1;
					if (this.billData.company_address === '') {
						this.$api.msg('请选择单位地址');
						return;
					}
					if (!/(^1[3|4|5|7|8|9][0-9]{9}$)/.test(this.billData.company_phone)) {
						this.$api.msg('请输入正确的单位电话');
						return;
					}
					if (this.billData.bank_name === '') {
						this.$api.msg('请输入开户行名称');
						return;
					}
					if (this.billData.bank_account === '') {
						this.$api.msg('请输入开户行账号');
						return;
					}
				}

				this.$db['electronic-tickets'].add(this.billData).then(res => {
					if (res.code === 200) {
						this.$api.msg('添加成功');
						this.$api.timerout(() => {
							uni.navigateBack();
						}, 100);
						return;
					}

					this.$api.msg(res.msg);
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.row {
		background: #fff;
		position: relative;
		height: 110rpx;

		.tit {
			flex-shrink: 0;
			width: 180rpx;
		}

		.input {
			flex: 1;
			font-size: 30rpx;
			padding-left: 0;
		}

		.input_t {
			color: #333;
		}
	}
</style>
