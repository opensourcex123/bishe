<template>
	<view>
		<view class="padding">
			<view class="flex align-center justify-center" style="width: 100%;">
				<u-radio-group v-model="type" placement="row"
					:customStyle="{ display: 'flex', justifyContent: 'spaceAround' }">
					<view style="border-radius: 10rpx;width: 300rpx;margin-left: 23rpx;height: 100rpx;"
						:class="[type === 1 ? 'blueborder' : '']" class="flex justify-center align-center bg-gray"
						@tap="changeType(1)">
						<u-radio label="待件" :name="1" :size="24"></u-radio>
					</view>
					<view style="border-radius: 10rpx;width: 300rpx;margin-left: 50rpx;height: 100rpx;"
						:class="[type === 2 ? 'blueborder' : '']" class="flex justify-center align-center bg-gray"
						@tap="changeType(2)">
						<u-radio label="拉修" :name="2" :size="24"></u-radio>
					</view>
				</u-radio-group>
			</view>
			<view class="margin-top"></view>
			<uni-forms :model="form" ref="uForm" :rules="rules" label-position="top">
				<uni-forms-item label="配件名称" name="name">
					<u-input v-model="form.name" type="text" :border="false" placeholder="请输入配件名称" />
				</uni-forms-item>
				<u-divider></u-divider>
				<uni-forms-item label="采购方式" name="buy_type">
					<u-radio-group v-model="form.buy_type" placement="row"
						:customStyle="{ display: 'flex', justifyContent: 'spaceAround' }">
						<view class="margin-left">
							<u-radio label="内采" name="内采" :size="20"></u-radio>
						</view>
						<view class="margin-left-xl">
							<u-radio label="外采" name="外采" :size="20"></u-radio>
						</view>
						<view class="margin-left-xl">
							<u-radio label="用户自备" name="用户自备" :size="20"></u-radio>
						</view>
					</u-radio-group>
				</uni-forms-item>
				<u-divider></u-divider>
				<uni-forms-item label="预计到达日期(选填)" :label-width="200" name="arrival_time">
					<button class="cu-btn bg-white" @tap="showTimePicker = true">
						{{ form.arrival_time ? $dayjs(form.arrival_time).format('YYYY-MM-DD HH:mm') : '选择日期' }}
					</button>
					<u-datetime-picker ref="datetimePicker" :show="showTimePicker" v-model="form.arrival_time"
						mode="datetime" :formatter="formatter" @close="showTimePicker = false"
						@cancel="showTimePicker = false" @confirm="showTimePicker = false"></u-datetime-picker>
				</uni-forms-item>
				<u-divider></u-divider>
				<uni-forms-item label="定金(选填)" :label-width="150" name="earnest">
					<view class="flex align-center">
						<u-input v-model="form.earnest" type="text" :border="false"
							placeholderStyle="font-size:35rpx;color:＃D3D3D3" placeholder="若需收定金,请输入定金金额" />
					</view>
				</uni-forms-item>
				<u-divider></u-divider>
				<uni-forms-item label="下次上门时间" :label-width="200" name="next_service_time">
					<button @tap="showTime = true"
						class="cu-btn bg-white">{{ form.next_service_time || '选择上门时间' }}</button>
					<u-picker :show="showTime" title="选择上门时间" ref="uPicker" :columns="timeColumns" @confirm="confirm"
						@change="changeHandler" @cancel="showTime = false"></u-picker>
				</uni-forms-item>
				<u-divider></u-divider>
				<uni-forms-item name="imgUrl">
					<view class="margin-top margin-bottom padding-bottom-sm">
						<view class="margin-left-xs">照片</view>
						<use-upload @upload="geturl"></use-upload>
					</view>
				</uni-forms-item>
			</uni-forms>
			<u-button type="primary" @click="submit">提交</u-button>
		</view>
	</view>
</template>

<script>
	import useUpload from '../../../../../components/use-upload/use-upload.vue';
	export default {
		data() {
			return {
				type: 1,
				showTimePicker: false,
				form: {
					name: '',
					buy_type: '',
					arrival_time: '',
					earnest: 0,
					imgUrl: [],
					next_service_time: ''
				},
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '配件名称不能为空'
						}]
					},
					buy_type: {
						rules: [{
							required: true,
							errorMessage: '采购类别不能为空'
						}]
					},
					next_service_time: {
						rules: [{
							required: true,
							errorMessage: '下次上门时间不能为空'
						}]
					},
					imgUrl: {
						rules: [{
							required: true,
							errorMessage: '照片不能为空'
						}]
					}
				},
				// 显示上门时间选择框
				showTime: false,
				timeColumns: [],
				timeData: [],
				data: {}
			};
		},
		methods: {
			geturl(imgs) {
				this.form.imgUrl = imgs.map(v => v.url);
			},
			changeType(name) {
				this.type = name;
			},
			submit() {
				this.$refs.uForm.validate().then(res => {
					console.log(res);
					let year = this.$dayjs().year();
					let month = this.form.next_service_time.split('月')[0];
					let day = this.form.next_service_time.split('月')[1].split('日')[0];
					let start = this.form.next_service_time.split(' ')[1].split('~')[0];
					let end = this.form.next_service_time.split(' ')[1].split('~')[1];
					let start_time = this.$dayjs(year + '-' + month + '-' + day + ' ' + start).valueOf();
					let end_time = this.$dayjs(year + '-' + month + '-' + day + ' ' + end).valueOf();
					const p1 = this.$db['order-mounting'].add({
						type: this.type === 1 ? '待件' : '拉修',
						name: this.form.name,
						buy_type: this.form.buy_type,
						arrival_time: this.form.arrival_time,
						earnest: parseInt(this.form.earnest) * 100,
						imgs: this.form.imgUrl,
						create_time: Date.now()
					});

					const p2 = this.$db['usemall-order']
						.where({
							order_id: this.data.order_id
						})
						.update({
							start_time: start_time,
							end_time: end_time
						}, {});

					Promise.all([p1, p2]).then(() => {
						const user = uni.getStorageSync('uni-id-pages-userInfo');
						this.$db['uni-id-device'].where({
							user_id: this.data.scanner
						}).tofirst().then(res => {
							getApp().pushMsg(res.datas.push_clientid, '定金推送', '工程师已提交定金，请及时支付', {
									order_id: this.data.order_id,
									price: parseFloat(this.form.earnest),
									user_id: user._id
								}, this.data.order_id)
								.then(() => {
									uni.showToast({
										icon: 'none',
										title: '定金已推送，等待用户确认'
									});
									setTimeout(() => {
										uni.navigateBack();
									}, 1200);
								});
						});
					});
				});
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`;
				}
				if (type === 'month') {
					return `${value}月`;
				}
				if (type === 'day') {
					return `${value}日`;
				}
				return value;
			},
			// 初始���上门时间参数
			async initTime() {
				let _this = this;
				this.timeColumns = [];
				this.timeData = [];

				var date = new Date();
				let timeDateList = [];
				let timeHourList = [];
				let currentHour = date.getHours() + 2;
				let initHour = 0;
				let initDay = 0;
				let interval = '';

				if (currentHour <= 9) {
					initHour = 9;
				} else {
					initHour = currentHour;
				}

				if (currentHour >= 23) {
					initDay = date.getDate() + 1;
				} else {
					initDay = date.getDate();
				}

				for (let i = 0; i < 7; i++) {
					timeDateList.push(date.getMonth() + 1 + '月' + initDay + '日');
					date = date.setDate(initDay + 1);
					date = new Date(date);
					initDay = date.getDate();
				}

				if (initHour >= 23) {
					timeHourList = [
						'9:00~10:00',
						'10:00~11:00',
						'11:00~12:00',
						'12:00~13:00',
						'13:00~14:00',
						'14:00~15:00',
						'15:00~16:00',
						'16:00~17:00',
						'17:00~18:00',
						'18:00~19:00',
						'19:00~20:00',
						'20:00~21:00',
						'21:00~22:00'
					];
				} else {
					for (initHour; initHour < 22; initHour++) {
						interval = initHour + ':00' + '~' + (initHour + 1) + ':00';
						timeHourList.push(interval);
					}
				}

				this.timeColumns.push(timeDateList);
				this.timeColumns.push(timeHourList);
				this.timeData.push(timeHourList);
				this.timeData.push([
					'9:00~10:00',
					'10:00~11:00',
					'11:00~12:00',
					'12:00~13:00',
					'13:00~14:00',
					'14:00~15:00',
					'15:00~16:00',
					'16:00~17:00',
					'17:00~18:00',
					'18:00~19:00',
					'19:00~20:00',
					'20:00~21:00',
					'21:00~22:00'
				]);
				this.form.next_service_time = [timeDateList[0], timeHourList[0]].join(' ');
			},

			changeHandler(e) {
				const {
					columnIndex,
					value,
					values, // values为当前变化列的数组内容
					index,
					// 微信小程序无法将picker实例传出来，只能�����过ref操作
					picker = this.$refs.uPicker
				} = e;

				if (columnIndex === 0 && index === 0) {
					// picker为选择器this实例，变化第二列对应的选项
					picker.setColumnValues(1, this.timeData[0]);
				} else if (columnIndex === 0 && index != 0) {
					picker.setColumnValues(1, this.timeData[1]);
				}
			},

			// 回调参数为包含columnIndex、value、values
			confirm(e) {
				this.form.next_service_time = e.value.join(' ');
				this.showTime = false;
			}
		},
		mounted() {
			this.initTime();
		},
		onLoad(e) {
			this.data = JSON.parse(e.data);
		}
	};
</script>

<style lang="scss">
	.blueborder {
		border-color: blue;
		border-width: 1px;
		border-style: solid;
	}
</style>
