<template>
	<view class="bg-page">
		<view class="bg-blue">
			<u-row justify="space-between">
				<u-col span="3">
					<view class="flex align-center justify-center" @tap="follow">
						<view class="flex-direction flex justify-center align-center">
							<view class="iconfont-1 icon-order" style="font-size: 30px;"></view>
							<view>跟单</view>
						</view>
					</view>
				</u-col>
				<u-col span="3" @tap="showContact = true">
					<view class="flex align-center justify-center">
						<view class="flex-direction flex justify-center align-center">
							<view class="iconfont-1 icon-tongxunlu" style="font-size: 30px;"></view>
							<view>联系方式</view>
						</view>
					</view>
				</u-col>
				<u-col span="3" @tap="showPriceList = true">
					<view class="flex align-center justify-center">
						<view class="flex-direction flex justify-center align-center">
							<view class="iconfont-1 icon-consumption" style="font-size: 30px;"></view>
							<view>计费标准</view>
						</view>
					</view>
				</u-col>
				<u-col span="3">
					<view class="flex align-center justify-center" @tap="showFunc = true">
						<view class="flex-direction flex justify-center align-center">
							<view class="iconfont-1 icon-viewgallery" style="font-size: 30px;"></view>
							<view>更多功能</view>
						</view>
					</view>
				</u-col>
			</u-row>
		</view>

		<view class="bg-white padding-sm">
			<view>
				<text class="cuIcon-titles text-blue text-xl"></text>
				<text class="text-xl text-black">基本信息</text>
			</view>
			<view class="flex align-center justify-between margin-tb-sm">
				<view class="flex align-center">
					<view class="iconfont-1 icon-responsetime text-xxl"></view>
					<view class="margin-left-sm">
						<view class="text-black text-lg">预约时间</view>
						<view>{{ formatTime(data.start_time) }}</view>
					</view>
				</view>

				<view class="cuIcon-edit text-orange" style="font-size: 20px;" @tap="showTimeChange = true"></view>
			</view>

			<view class="flex align-center justify-between margin-tb-sm">
				<view class="flex align-center">
					<view class="iconfont-1 icon-product text-xxl"></view>
					<view class="margin-left-sm">
						<view class="text-black text-lg">产品名称</view>
						<view>{{ data.order_info }}</view>
					</view>
				</view>

				<!-- <view class="iconfont text-orange icon-editor1 text-xxl"></view> -->
			</view>

			<view class="flex align-center justify-between margin-tb-sm" v-if="data.address_data">
				<view class="flex align-center">
					<view class="iconfont-1 icon-map text-xxl"></view>
					<view class="margin-left-sm">
						<view class="text-black text-lg">详细地址</view>
						<view class="flex align-center">
							<view>{{ data.address_data.address + data.address_data.addr_detail }}</view>
							<view class="cu-tag bg-blue sm round margin-left-xs">{{ data.address_data.remark }}</view>
						</view>
					</view>
				</view>

				<view class="flex align-center">
					<view class="iconfont-1 text-blue icon-click text-xxl margin-lr-sm" style="font-size: 28px;"
						@click="daohang(data.addr_id)"></view>
					<view class="cuIcon-edit text-orange" style="font-size: 20px;" @tap="showLocationChange = true">
					</view>
				</view>
			</view>

			<view class="flex align-center justify-between margin-tb-sm">
				<view class="flex align-center">
					<view class="iconfont-1 icon-zhongjianren text-xxl"></view>
					<view class="margin-left-sm">
						<view class="text-black text-lg">用户</view>
						<view>{{ data.order_consignee_tel }}</view>
					</view>
				</view>

				<view class="flex align-center margin-left" @tap="call(data.order_consignee_tel)">
					<view class="cuIcon-phone text-blue" style="font-size: 20px;"></view>
				</view>
			</view>
		</view>

		<view class="bg-white margin-tb padding-sm">
			<view>
				<text class="cuIcon-titles text-blue text-xl"></text>
				<text class="text-xl text-black">订单信息</text>
			</view>

			<view class="flex align-center margin-tb-sm">
				<view class="text-grey">订单号码</view>
				<view class="margin-lr">{{ data.order_id }}</view>
				<view class="cu-tag bg-grey round sm" @tap="copy(data.order_id)">复制</view>
			</view>

			<view class="flex align-center margin-tb-sm">
				<view class="text-grey">订单标记</view>
				<view class="margin-lr">有效联系</view>
			</view>

			<!-- 			<view class="flex align-center margin-tb-sm">
				<view class="text-grey">故障描述</view>
				<view class="margin-lr">横着开改为竖着开</view>
			</view> -->
		</view>

		<view class="text-grey margin-top padding-sm" style="padding-bottom: 50px;">
			<view class="text-bold">郑重提示：</view>
			<view>· 请您为了家人幸福、自身安全着想，严格遵守安全管理规定，严格践行安全操作指南，规范操作行为，谨慎细心，安全第一</view>
			<view>· 同时再次提醒您请勿违反约定私下交易，一经发现，我们将追究您相关民事、刑事责任</view>
			<view class="text-black">请与用户协商一致后添加项目，若产生投诉，将全额退款并予以处罚。</view>
		</view>

		<view v-if="is_main_engineer">
			<button class="cu-btn block lg footer bg-blue" @click="takeOrder" v-if="['待接单'].includes(data.state)"
				:loading="takeOrderBtnLoading" :disabled="takeOrderBtnLoading">
				接单
			</button>
			<button class="cu-btn block lg footer bg-blue" @click="visited"
				v-if="['已接单'].includes(data.state)">上门</button>
			<button class="cu-btn block lg footer bg-blue" @click="showPricePushModal = true"
				v-if="['已上门', '待推送报价'].includes(data.state)">推送报价</button>
			<button class="cu-btn block lg footer bg-blue" @click="showPricePushModal = true"
				v-if="['拒绝报价'].includes(data.state)">重新报价</button>
			<button class="cu-btn block lg footer bg-blue" v-if="['已完成报价', '上传维修前照片'].includes(data.state)"
				@tap="showBeforeUpload = true">上传维修前照片</button>
			<button class="cu-btn block lg footer bg-blue" v-if="data.state === '上传维修后照片'"
				@tap="showAfterUpload = true">上传维修后照片</button>
			<button class="cu-btn block lg footer bg-blue" v-if="data.state === '选择质保卡'"
				@tap="showOrderCard = true">选择质保卡</button>
			<button class="cu-btn block lg footer bg-blue" v-if="data.state === '待结算'"
				@tap="showFinishOrderModal = true">结算</button>
			<!-- 			<u-overlay :show="showQR" @click="showQR = false"></u-overlay> -->

			<u-modal :closeOnClickOverlay="true" title="客户扫码确认" :show="showQR" @cancel="showQR = false"
				:showConfirmButton="false" :showCancelButton="true" cancelText="关闭" width="700rpx">
				<view class="flex justify-center margin-bottom">
					<view style="width: 100%">
						<uqrcode ref="uqrcode" canvas-id="qrcode" :value="orderData" :size="150"></uqrcode>
					</view>
				</view>
			</u-modal>
			<view class="cu-modal" :class="showPricePushModal ? 'show' : ''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">推送报价</view>
						<view class="action" @tap="showPricePushModal = false"><text
								class="cuIcon-close text-grey"></text></view>
					</view>
					<view class="padding-xl">
						<u-alert title="客户加单需要重新推送所有维修项" type="warning"></u-alert>
						<uni-forms border>
							<uni-forms-item label="价格¥">
								<uni-easyinput type="number" v-model.number="price" placeholder="请输入价格"
									@change="priceChange" />
							</uni-forms-item>
						</uni-forms>
						<u-divider text="选择服务"></u-divider>

						<view v-for="(val, key) in priceList" :key="key">
							<view class="text-left">
								<text class="cuIcon-titles text-blue text-lg"></text>
								<text class="text-lg text-black text-bold">{{ val.name }}</text>
							</view>

							<u-collapse>
								<u-collapse-item :title="v.big_title" v-for="(v, k) in val.list" :key="k">
									<u-checkbox-group placement="column" borderBottom
										v-model="serviceCheckBox[`${val.value}&${v.big_title}`]"
										@change="serviceChange">
										<u-checkbox v-for="(item, key1) in v.sort" :key="key1"
											:checked="serviceCheckedOrderList.includes(`${item.small_title}&${item.price}${item.unit}`)"
											:name="`${item.small_title}&${item.price}${item.unit}`"
											:label="item.small_title + `  『${item.price}${item.unit}』`"></u-checkbox>
									</u-checkbox-group>
								</u-collapse-item>
							</u-collapse>
						</view>

						<button class="cu-btn bg-blue lg margin-top" @tap="pushPrice">确认</button>
					</view>
				</view>
			</view>

			<view class="cu-modal" :class="showFinishOrderModal ? 'show' : ''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">订单结算</view>
						<view class="action" @tap="showFinishOrderModal = false"><text
								class="cuIcon-close text-grey"></text></view>
					</view>
					<view class="padding-xl">
						<u-radio-group v-model="payType" placement="row">
							<u-radio label="客户支付" name="client_pay"></u-radio>
							<u-radio label="工程师代付" name="self_pay"></u-radio>
						</u-radio-group>
						<button class="cu-btn bg-blue lg margin-top" @tap="finishOrder()">确认</button>
					</view>
				</view>
			</view>
		</view>

		<view class="cu-modal" :class="showContact ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">联系方式</view>
					<view class="action" @tap="showContact = false"><text class="cuIcon-close text-grey"></text></view>
				</view>
				<view class="padding">
					<view class="cu-list menu sm-border card-menu margin-top">
						<view class="cu-item">
							<view class="content">
								<text class="cuIcon-phone text-grey"></text>
								<text class="text-grey">客服电话：4000879009</text>
							</view>
							<view class="action"><button class="cu-btn bg-blue round sm"
									@tap="call('4000879009')">拨打</button></view>
						</view>
						<view class="cu-item">
							<view class="content">
								<text class="cuIcon-phone text-grey"></text>
								<text class="text-grey">用户电话：{{ data.order_consignee_tel }}</text>
							</view>
							<view class="action"><button class="cu-btn bg-blue round sm"
									@tap="call(data.order_consignee_tel)">拨打</button></view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="cu-modal" :class="showPriceList ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">计费标准</view>
					<view class="action" @tap="showPriceList = false"><text class="cuIcon-close text-grey"></text>
					</view>
				</view>
				<view class="bg-white">
					<view v-for="(val, key) in priceList" :key="key">
						<view class="text-left">
							<text class="cuIcon-titles text-blue text-lg"></text>
							<text class="text-lg text-black text-bold">{{ val.name }}</text>
						</view>

						<u-collapse>
							<u-collapse-item :title="v.big_title" v-for="(v, k) in val.list" :key="k">
								<view v-for="(item, key1) in v.sort" :key="key1" class="margin-tb">
									<view class="flex align-center justify-between">
										<view class="text-black">{{ item.small_title }}</view>
										<view class="text-black">{{ item.price }}{{ item.unit }}</view>
									</view>
									<view class="text-left">{{ item.content }}</view>
								</view>
							</u-collapse-item>
						</u-collapse>
					</view>
				</view>
			</view>
		</view>

		<u-modal :show="showLocationChange" title="更改预约地址" @confirm="confirmLocationChange">
			<view style="width: 100%;">
				<view class="row dflex border-line padding-left">
					<text class="tit">具体地址</text>
					<view class="dflex-b flex1">
						<view class="flex1 input_t" @click="choiceMapAddr">{{ addressName }}</view>
						<!-- #ifdef MP-WEIXIN || MP-BAIDU -->
						<view class="iconfont icondizhi- input_t padding-lr-sm padding-tb-16" @click="choiceMapAddr">定位
						</view>
						<!-- #endif -->
						<!-- #ifdef MP-ALIPAY -->
						<view class="iconfont icondizhi- input_t padding-lr-sm padding-tb-16"
							@click="choiceAlipayMapAddr"></view>
						<!-- #endif -->
					</view>
				</view>
				<view class="row dflex border-line padding-lr">
					<text class="tit">楼号/门牌号</text>
					<input class="input" type="text" v-model="addrData.addr_detail" placeholder="例:6号楼203室"
						placeholder-class="placeholder" />
				</view>
			</view>
		</u-modal>

		<u-picker :show="showTimeChange" title="选择上门时间" ref="uPicker" :columns="timeColumns"
			@confirm="confirmTimeChange" @change="timeChangeHandler" @cancel="showTimeChange = false"></u-picker>

		<u-modal :show="showBeforeUpload" title="维修前图片上传" @confirm="confirmBeforeImgs" :showCancelButton="true"
			@cancel="showBeforeUpload = false">
			<view style="width: 100%;">
				<use-upload :limit="5" @upload="beforeUpload" :sourceType="['camera']"></use-upload>
			</view>
		</u-modal>

		<u-modal :show="showOrderCard" title="选择质保期限" @confirm="confirmOrderCard" :showCancelButton="true"
			@cancel="showOrderCard = false">
			<view style="width: 100%;">
				<u-radio-group v-model="orderCardValue" placement="column">
					<u-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in orderCardList" :key="index"
						:label="item.name" :name="item.value"></u-radio>
				</u-radio-group>
			</view>
		</u-modal>

		<u-modal :show="showDiscountCard" title="优惠券发放" @confirm="confirmDiscountCard" :showCancelButton="true"
			@cancel="showDiscountCard = false">
			<view style="width: 100%;">
				<u-radio-group v-model="discountCardValue" placement="column">
					<u-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in discountCardsList"
						:key="index" :label="item.name" :name="item.value"></u-radio>
				</u-radio-group>
			</view>
		</u-modal>

		<u-modal :show="showAfterUpload" title="维修后图片上传" @confirm="confirmAfterImgs" :showCancelButton="true"
			@cancel="showAfterUpload = false">
			<view style="width: 100%;">
				<use-upload :limit="5" @upload="afterUpload" :sourceType="['camera']"></use-upload>
			</view>
		</u-modal>

		<u-modal :show="showAddEngineer" title="新增工程师协助" @confirm="confirmSecondEngineer" :showCancelButton="true"
			@cancel="showAddEngineer = false">
			<view class="goods-area bg-main padding-bottom padding-left padding-right flex" style="overflow-x: scroll;">
				<use-list-title v-if="engineerList.length === 0" title="暂无匹配的工程师" size="28" fwt="500" color="#333"
					iconfont=" " right=""></use-list-title>
				<view v-for="(item, index) in engineerList" :key="index"
					:class="item.user_id === checkedEngineer ? 'solids' : ''"
					class="flex flex-direction margin-right align-center" @click="groupChange(item.user_id)">
					<uni-card :title="item.name + '师傅'" :thumbnail="item.avatar" style="width: 450rpx;">
						<view class="flex flex-wrap justify-around align-center">
							<view v-for="(item1, index1) in item.skill" :key="index1"
								:class="index1 >= 2 ? 'margin-top' : ''" class="cu-tag bg-blue sm">{{ item1 }}</view>
						</view>
					</uni-card>
				</view>
			</view>
		</u-modal>

		<u-action-sheet :actions="funcList" title="更多功能" :show="showFunc" :closeOnClickOverlay="true"
			:closeOnClickAction="true" @close="showFunc = false" @select="funcSelect"
			v-if="Object.keys(data).length !== 0 && is_main_engineer" safeAreaInsetBottom></u-action-sheet>
	</view>
</template>

<script>
	import tkiQrcode from '@/sub_pages_1/components/tki-qrcode/tki-qrcode.vue';
	const _address = 'usemall-member-address';
	const db = uniCloud.database();
	export default {
		components: {
			tkiQrcode
		},
		data() {
			return {
				showFunc: false,
				showQR: false,
				showFinishOrderModal: false,
				showContact: false,
				showPriceList: false,
				isConfirmPrice: false,
				showPricePushModal: false,
				showBeforeUpload: false,
				showAfterUpload: false,
				beforeUploadImgs: [],
				afterUploadImgs: [],
				orderData: '',
				data: {},
				price: 0,
				tmpPrice: 0,
				priceList: {},
				payType: 'client_pay',
				serviceCheckBox: {},
				showLocationChange: false,
				// 更改地址参数
				addressName: '请选择地址',
				addrData: {
					consignee: '',
					mobile: '',
					address: '',
					province_name: '',
					city_name: '',
					area_name: '',
					addr_detail: '',
					is_default: 0,
					addr_source: '录入',
					remark: '家',
					longitude: '',
					latitude: ''
				},
				showTimeChange: false,
				timeColumns: [],
				timeData: [],
				chooseTime: '',
				scanQrID: '',
				showAddEngineer: false,
				engineerList: [],
				skills: [],
				checkedEngineer: '',
				is_main_engineer: false,
				takeOrderBtnLoading: false,
				showOrderCard: false,
				orderCardList: [],
				orderCardValue: '',
				serviceCheckedOrderList: [],
				discountCardsList: [],
				showDiscountCard: false,
				discountCardValue: ''
			};
		},
		computed: {
			funcList: function() {
				return [{
						name: '优惠券发放',
						value: 'card',
						disabled: false
					},
					{
						name: '改派',
						value: 'reassign',
						disabled: ['已完成报价', '上传维修前照片', '上传维修后照片', '选择质保卡', '待结算'].includes(this.data.state)
					},
					{
						name: '加新单',
						value: 'addOrder',
						disabled: false
					},
					{
						name: '请求工程师协助',
						value: 'add_engineer',
						disabled: ['待结算', '待付款'].includes(this.data.state)
					},
					{
						name: '拉修/待件',
						value: 'mounting',
						disabled: !['已完成报价', '上传维修前照片', '上传维修后照片', '选择质保卡', '待结算'].includes(this.data.state)
					},
					{
						name: '激活订单',
						value: 'active',
						disabled: !this.data.state === '待取消'
					},
					{
						name: '取消订单',
						value: 'cancel',
						disabled: this.data.state === '待取消'
					}
				];
			}
		},
		methods: {
			visited() {
				console.log(111);
				this.showQR = true;
			},
			qrR(e) {
				console.log(e);
			},
			follow() {
				uni.navigateTo({
					url: '/sub_pages_1/enginner/home/item-details/follow/follow'
				});
			},
			async getDetails(id) {
				const p1 = this.$func.usemall.call('order/getDetails', {
					order_id: id
				});
				const p2 = this.$func.usemall.call('order/detail', {
					order_id: id
				});

				Promise.all([p1, p2]).then(async vals => {
					console.log(vals);
					const user = uni.getStorageSync('uni-id-pages-userInfo');
					this.data = vals[0].datas.data.data[0];
					this.data.order_info = vals[1].datas.order_detail.map(v => v.goods_name);
					this.price = parseFloat(this.data.order_actural_paid / 100);
					this.tmpPrice = parseFloat(this.data.order_actural_paid / 100);
					this.is_main_engineer = this.data.engineer_id === user._id;
					const addrRes = await this.$db['usemall-member-address'].tofirst(this.data.addr_id);
					console.log('地址信息', this.data);
					this.data.address_data = addrRes.datas;
					await this.loadEngineer();
				});
			},
			copy(data) {
				uni.setClipboardData({
					data: data,
					success() {
						uni.showToast({
							icon: 'none',
							title: '复制成功'
						});
					},
					fail() {
						uni.showToast({
							icon: 'none',
							title: '复制失败，请检查权限'
						});
					}
				});
			},
			formatTime(time) {
				return this.$dayjs(time).format('LLLL');
			},
			call(phone) {
				uni.makePhoneCall({
					phoneNumber: phone.toString(),
					success() {},
					fail(err) {}
				});
			},

			serviceChange(arr) {
				this.$nextTick(() => {
					let price = this.tmpPrice;
					Object.values(this.serviceCheckBox).forEach(v => {
						v.forEach(item => {
							const reg = /\d/;
							const text = item.split('&')[1];
							console.log('text', text, item);
							if (reg.test(text)) {
								if (text.indexOf('~') !== -1) {
									console.log('=====》', text);
									const str = text.split('~')[0];
									const numArr = str.match(/\d+/g);
									price += parseInt(numArr.join(''));
									return;
								}
								const numArr = text.match(/\d+/g);
								console.log('=======>******', parseInt(numArr.join('')));
								price += parseInt(numArr.join(''));
							}
						});
					});
					console.log('price===>', price);
					this.price = price;
				});
			},

			beforeUpload(imgs) {
				this.beforeUploadImgs = imgs.map(v => v.url);
			},

			afterUpload(imgs) {
				this.afterUploadImgs = imgs.map(v => v.url);
			},

			confirmBeforeImgs() {
				if (this.beforeUploadImgs.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '请上传图片'
					});
					return;
				}

				uni.showLoading();

				this.$db['usemall-order']
					.where({
						order_id: this.data.order_id
					})
					.update({
						imgs_engineer_before: this.beforeUploadImgs
					})
					.then(res => {
						uni.showToast({
							title: '上传成功',
							icon: 'none'
						});
						this.changeOrderState('上传维修后照片');
						this.showBeforeUpload = false;
					})
					.finally(() => {
						uni.hideLoading();
					});
			},

			confirmAfterImgs() {
				if (this.afterUploadImgs.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '请上传图片'
					});
					return;
				}

				uni.showLoading();

				this.$db['usemall-order']
					.where({
						order_id: this.data.order_id
					})
					.update({
						imgs_engineer_after: this.afterUploadImgs
					})
					.then(res => {
						uni.showToast({
							title: '上传成功',
							icon: 'none'
						});
						this.showAfterUpload = false;
					})
					.finally(() => {
						uni.hideLoading();
						this.changeOrderState('选择质保卡');
					});
			},

			daohang(id) {
				this.$func.usemall
					.call('order/getOrderAddrDetails', {
						addr_id: id
					})
					.then(res => {
						console.log(res);
						const data = res.datas.data.data[0];
						uni.openLocation({
							latitude: parseFloat(data.latitude),
							longitude: parseFloat(data.longitude),
							success: function() {
								console.log('success');
							}
						});
					});
			},
			async finishOrder() {
				console.log(this.payType);
				uni.showLoading();
				this.changeOrderState('待付款')
					.then(res => {
						this.$db['uni-id-users'].tofirst(this.data.create_uid).then(async res => {
							if (this.payType === 'client_pay') {
								const cidRes = await this.$db['uni-id-device'].where({
									user_id: this.data.scanner
								}).tofirst();

								getApp().pushMsg(cidRes.datas.push_clientid, '维修完成',
										'工程师已完成订单，请及时付款', {
											order_id: this.data.order_id
										}, this.data.order_id)
									.then(() => {
										uni.showToast({
											icon: 'none',
											title: '订单已完成'
										});
										this.showFinishOrderModal = false;
									});
							} else {
								const user = uni.getStorageSync('uni-id-pages-userInfo');
								uni.navigateTo({
									url: `/sub_pages_1/pay/pay?money=${this.price * 100}&order_id=${this.data.order_id}&engineer_id=${user._id}`
								});
							}
						});
					})
					.finally(() => {
						uni.hideLoading();
					});
			},
			takeOrder() {
				uni.showLoading();
				this.takeOrderBtnLoading = true;
				this.changeOrderState('已接单')
					.then(res => {
						uni.showToast({
							icon: 'none',
							title: '成功接单'
						});
					})
					.finally(() => {
						uni.hideLoading();
						this.takeOrderBtnLoading = false;
					});
			},
			priceChange(e) {
				console.log('====》', typeof e);
				this.tmpPrice = e.trim() ? parseFloat(e) : 0;
			},
			checkPriceList(id) {
				const _this = this;
				this.$func.usemall
					.call('order/getOrderGoodPriceList', {
						order_id: id
					})
					.then(async res => {
						console.log('-------------', res.datas.data);
						const result = res.datas.data;
						for (let i = 0; i < result.length; i++) {
							const res1 = await this.$db['usemall-goods']
								.where({
									_id: result[i].goods_id
								})
								.tofirst();
							_this.priceList[result[i]._id] = {
								list: res1.datas.charge_standard,
								name: res1.datas.name,
								value: result[i]._id
							};
						}
					});
				this.$db['usemall-order-detail']
					.where({
						order_id: id
					})
					.tofulllist()
					.then(res => {
						// console.log('收费标准', res.datas);
						this.serviceCheckedOrderList = res.datas.map(v => {
							if (v.charge_standard) {
								return v.charge_standard.map(item => {
									return `${item.name}&${item.price}`;
								});
							}
						});
						this.serviceCheckedOrderList = this.serviceCheckedOrderList.flat();
					});
			},
			// 点击工程师选择
			groupChange(n) {
				this.checkedEngineer = n;
			},
			async confirmSecondEngineer() {
				if (!this.checkedEngineer) {
					this.$api.msg('请选择一位工程师');
					return;
				}
				await this.$db['usemall-order']
					.where({
						order_id: this.data.order_id
					})
					.update({
						second_engineer_id: this.checkedEngineer
					});
				const res = await this.$db['engineers']
					.where({
						user_id: this.checkedEngineer
					})
					.tofirst();
				getApp().sendMessageToEngineer(res.datas.phone);
				const res1 = await this.$db['uni-id-device'].where({
					user_id: this.checkedEngineer
				}).tofirst();
				getApp().pushMsg(res1.datas.push_clientid, '订单协助', '附近有工程师需要协助，请立即处理', {
						order_id: this.data.order_id
					}, this.data.order_id)
					.then(res => {
						console.log(res);
						this.showAddEngineer = false;
					});
			},
			// 获取工程师
			async loadEngineer() {
				let _this = this;
				let engineerList = [];
				const res = await this.$func.usemall.call('order/getOrderAddrDetails', {
					addr_id: this.data.addr_id
				});
				console.log('======>?', this.data.addr_id, res);
				const data = res.datas.data.data[0];
				const user = uni.getStorageSync('uni-id-pages-userInfo');
				let engineers = await db
					.collection('engineers')
					.where({
						point: db.command.geoNear({
							geometry: new db.Geo.Point(parseFloat(data.longitude), parseFloat(data
								.latitude))
						}),
						status: 1,
						audit_status: 1,
						user_id: db.command.neq(user._id)
					})
					.get();
				engineerList = engineers.result.data;
				console.log('=====>', engineers);
				// 接单数量过滤
				engineerList.forEach(async engineer => {
					let count = await _this.getEngineerOrderCount(engineer.user_id);
					console.log('count', count);
					if (count < engineer.limit) {
						this.engineerList.push(engineer);
					}
				});
			},
			// 计算工程师一天的接单数量
			getEngineerOrderCount(engineer_id) {
				let start = new Date(this.start_time).setHours(0, 0, 0, 0);
				let end = new Date(this.end_time).setHours(23, 59, 59, 999);
				let count = 0;
				return new Promise((resolve, reject) => {
					db.collection('usemall-order')
						.where({
							engineer_id: engineer_id,
							state: db.command.nin(['待接单', '已取消', '待改派', '待取消']),
							start_time: db.command.gt(start),
							end_time: db.command.lt(end)
						})
						.count()
						.then(res => {
							count = res.result.total;
							resolve(count);
						});
				});
			},
			pushPrice() {
				if (!this.price) {
					uni.showToast({
						icon: 'none',
						title: '价格不为空'
					});
					return;
				}

				let list = {};

				Object.keys(this.serviceCheckBox).forEach(key => {
					const val = key.split('&')[0];
					if (!list.hasOwnProperty(val)) {
						list[val] = this.serviceCheckBox[key].map(v => {
							const tmp = v.split('&');
							return {
								name: tmp[0],
								price: tmp[1]
							};
						});
					} else {
						list[val] = list[val].concat(
							this.serviceCheckBox[key].map(v => {
								const tmp = v.split('&');
								return {
									name: tmp[0],
									price: tmp[1]
								};
							})
						);
					}
				});

				if (Object.keys(list).length === 0) {
					uni.showToast({
						icon: 'none',
						title: '服务项不为空'
					});
					return;
				}

				console.log('list=======>', list);

				const user = uni.getStorageSync('uni-id-pages-userInfo');
				const p1 = this.$db['uni-id-device']
					.where({
						user_id: this.data.create_uid
					})
					.tofirst();
				const p2 = this.$db['uni-id-device']
					.where({
						user_id: this.data.scanner
					})
					.tofirst();
				Promise.all([p1, p2]).then(vals => {
					getApp().pushMsg(this.data.create_uid === this.data.scanner ? vals[0].datas.push_clientid : [
							vals[0].datas.push_clientid, vals[1].datas.push_clientid
						], '报价推送', '报价已推送，请及时查看', {
							user_id: user._id,
							price: parseFloat(this.price),
							list: list,
							order_id: this.data.order_id,
							scanner: this.data.scanner
						}, this.data.order_id)
						.then(() => {
							this.showFinishOrderModal = false;
							uni.showToast({
								icon: 'none',
								title: '客户已收到报价'
							});
						});
				});
			},
			changeOrderState(state) {
				const user = uni.getStorageSync('uni-id-pages-userInfo');
				this.data.state = state;
				const p1 = this.$db['usemall-order']
					.where({
						order_id: this.data.order_id
					})
					.update({
						state: state
					});
				const p2 = this.$db['usemall-order-log'].add({
					order_id: this.data.order_id,
					is_delete: 0,
					create_uid: user._id,
					current_state: state
				});
				return Promise.all([p1, p2]);
			},
			async reassignEngineer() {
				const user = uni.getStorageSync('uni-id-pages-userInfo');
				getApp().reassignEngineer(this.data.order_id, user._id);
				uni.showToast({
					icon: 'none',
					title: '改派申请已发送'
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1000);
			},
			funcSelect(e) {
				if (e.value === 'reassign') {
					this.reassignEngineer();
					return;
				}

				if (e.value === 'card') {
					this.showDiscountCard = true;
					return;
				}

				if (e.value === 'mounting') {
					uni.navigateTo({
						url: '/sub_pages_1/enginner/home/item-details/mountings/mountings?data=' + JSON.stringify(
							this.data)
					});
					return;
				}

				if (e.value === 'add_engineer') {
					this.showAddEngineer = true;
					return;
				}

				if (e.value === 'active') {
					this.changeOrderState('已接单');
					return;
				}

				if (e.value === 'cancel') {
					uni.showLoading();
					console.log('===========>', this.data.order_id);
					this.$func.usemall
						.call('order/cancel', {
							order_id: this.data.order_id,
							state: '待取消',
							order_cancel_reason: '工程师取消'
						})
						.then(res => {
							uni.navigateBack();
						})
						.finally(() => {
							uni.hideLoading();
						});
					return;
				}

				if (e.value === 'addOrder') {
					uni.showModal({
						title: '加单提示',
						content: '请与用户协商确认无误，确认后跳转服务页下单',
						success() {
							uni.switchTab({
								url: '/pages/tabbar/category'
							});
						}
					});
					return;
				}
			},
			// 选择地图地址
			choiceMapAddr(options) {
				let _this = this;
				// #ifdef APP-PLUS || MP-ALIPAY
				uni.chooseLocation({
					success: res => {
						console.log('位置', res);
						if (res && res.name) {
							let __addr = _this.resolveAddr(res);
							_this.addrData.province_name = __addr.province || '';
							_this.addrData.city_name = __addr.city || '';
							_this.addrData.area_name = __addr.area || '';

							_this.addrData.address = res.name;
							_this.addressName = res.name;

							_this.addrData.longitude = res.longitude + '';
							_this.addrData.latitude = res.latitude + '';

							// _this.addrData.addr_detail = res.name;
						}
					},
					fail(err) {
						console.log(err);
					}
				});
				// #endif

				// #ifdef MP-WEIXIN
				uni.authorize({
					scope: 'scope.userLocation',
					success() {
						uni.chooseLocation({
							success: res => {
								console.log('位置', res);
								if (res && res.name) {
									let __addr = _this.resolveAddr(res);
									_this.addrData.province_name = __addr.province || '';
									_this.addrData.city_name = __addr.city || '';
									_this.addrData.area_name = __addr.area || '';

									_this.addrData.address = res.name;
									_this.addressName = res.name;

									_this.addrData.longitude = res.longitude + '';
									_this.addrData.latitude = res.latitude + '';

									// _this.addrData.addr_detail = res.name;
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
				// #endif
			},
			// #ifdef MP-ALIPAY
			// 选择地图地址
			choiceAlipayMapAddr(options) {
				let _this = this;

				uni.chooseLocation({
					success: res => {
						console.log('位置', res);
						if (res && res.address) {
							let __addr = _this.resolveAddr(res);
							_this.addrData.province_name = res.provinceName || '';
							_this.addrData.city_name = res.cityName || '';
							_this.addrData.area_name = res.adName || '';

							_this.addrData.address = [_this.addrData.province_name, _this.addrData.city_name,
								_this.addrData.area_name
							].filter(x => x).join('-');
							_this.addressName = _this.addrData.address;

							_this.addrData.longitude = res.longitude;
							_this.addrData.latitude = res.latitude;

							_this.addrData.addr_detail = res.name || res.address;
						}
					},
					fail(err) {
						console.log(err);
					}
				});
			},
			// #endif
			// 解析地址
			resolveAddr(options) {
				let _this = this;
				let str = options.address;
				let __addr = {
					addr: ''
				};
				let __idx = 0;
				let __idx_pro = str.indexOf('省');

				if (__idx_pro == -1) {
					__idx = str.indexOf('自治区');
					if (__idx != -1) {
						__addr.province = str.substring(0, __idx + 3);
					} else {
						__addr.province = str.substring(0, 0);
						__idx = 0;
					}
				} else {
					__addr.province = str.substring(0, __idx_pro + 1);
				}

				if (__addr.province) __addr.addr += __addr.province + '-';

				let __idx_city = str.indexOf('市');
				if (__idx_city == -1) {
					__idx = str.indexOf('自治州');
					if (__idx != -1) {
						__addr.city = str.substring(__idx_pro + 1, __idx + 3);
					} else {
						__addr.city = str.substring(__idx + 1, __idx_city + 1);
					}
				} else {
					if (__idx == 0) {
						__addr.city = str.substring(__idx_pro + 1, __idx_city + 1);
					} else {
						__addr.city = str.substring(__idx + 3, __idx_city + 1);
					}
				}

				if (__addr.city) __addr.addr += __addr.city + '-';

				let __idx_area = str.lastIndexOf('区');
				if (__idx_area == -1) {
					__idx_area = str.indexOf('县');
					if (__idx == 0) {
						__addr.area = str.substring(__idx_city + 1, __idx_area + 1);
					} else {
						__addr.area = str.substring(__idx + 3, __idx_area + 1);
					}
				} else {
					if (__idx == 0) {
						__addr.area = str.substring(__idx_city + 1, __idx_area + 1);
					} else {
						__addr.area = str.substring(__idx + 3, __idx_area + 1);
					}
				}

				if (__addr.area) __addr.addr += __addr.area;

				return __addr;
			},
			confirmLocationChange() {
				this.addrData.consignee = this.data.order_consignee;
				this.addrData.mobile = this.data.order_consignee_tel;
				this.addrData.is_default = '否';
				this.$db['usemall-member-address'].add(this.addrData).then(res => {
					console.log('====>', res);
					if (res.code === 200) {
						this.$db['usemall-order']
							.where({
								order_id: this.data.order_id
							})
							.update({
								order_consignee_addr: this.addrData.address,
								order_consignee_addr_detail: this.addrData.addr_detail,
								order_consignee_city_name: this.addrData.city_name,
								order_consignee_district_name: this.addrData.area_name,
								addr_id: res.datas.id
							})
							.then(res1 => {
								this.$api.msg('添加成功');
								this.data.order_consignee_addr = this.addrData.address;
								this.data.addr_id = res.datas.id;
								this.showLocationChange = false;
							});
						return;
					}
				});
			},
			// 初始化上门时间参数
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
				this.chooseTime = [timeDateList[0], timeHourList[0]].join(' ');
			},
			timeChangeHandler(e) {
				const {
					columnIndex,
					value,
					values, // values为当前变化列的数组内容
					index,
					// 微信小程序无法将picker实例传出来���只能通过ref操作
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
			confirmTimeChange(e) {
				this.chooseTime = e.value.join(' ');
				let year = this.$dayjs().year();
				let month = this.chooseTime.split('月')[0];
				let day = this.chooseTime.split('月')[1].split('日')[0];
				let start = this.chooseTime.split(' ')[1].split('~')[0];
				let end = this.chooseTime.split(' ')[1].split('~')[1];
				let start_time = this.$dayjs(year + '-' + month + '-' + day + ' ' + start).valueOf();
				let end_time = this.$dayjs(year + '-' + month + '-' + day + ' ' + end).valueOf();
				this.$db['usemall-order']
					.where({
						order_id: this.data.order_id
					})
					.update({
						start_time: parseInt(start_time),
						end_time: parseInt(end_time),
						time: this.chooseTime
					})
					.then(res => {
						this.showTimeChange = false;
						this.data.start_time = start_time;
						this.data.end_time = end_time;
						uni.showToast({
							icon: 'none',
							title: '修改时间成功'
						});
					});
			},
			getOrderCardList() {
				this.$db['warranty-card'].tofulllist().then(res => {
					console.log('card===>', res);
					this.orderCardList = res.datas.map(v => {
						return {
							name: parseInt(v.duration / (1000 * 60 * 60 * 24)) + '天维修质保',
							value: v._id
						};
					});
				});
			},
			confirmOrderCard() {
				if (!this.orderCardValue) {
					this.$api.msg('请选择质保期限');
					return;
				}
				this.$db['usemall-order']
					.where({
						order_id: this.data.order_id
					})
					.update({
						warranty_card_id: [this.orderCardValue]
					})
					.then(res => {
						this.changeOrderState('待结算');
						this.showOrderCard = false;
					});
			},
			confirmDiscountCard() {
				if (!this.discountCardValue) {
					this.$api.msg('请选择优惠券');
					return;
				}
				console.log('======>123123123', this.discountCardsList.map(v => v.value).filter(i => i !== this
					.discountCardValue));
				const user = uni.getStorageSync('uni-id-pages-userInfo');
				const p1 = this.$db['coupons']
					.where({
						_id: this.discountCardValue
					})
					.update({
						user_id: this.data.create_uid,
						deadline: this.$dayjs()
							.add(3, 'month')
							.valueOf()
					});
				const p2 = this.$db['engineers']
					.where({
						user_id: user._id
					})
					.update({
						coupon_list: this.discountCardsList.map(v => v.value).filter(i => i !== this.discountCardValue)
					});
				Promise.all([p1, p2]).then(vals => {
					this.$api.msg('已发放优惠券');
					this.discountCardsList = this.discountCardsList.filter(v => {
						return v.value !== this.discountCardValue;
					});
					this.showDiscountCard = false;
				});
			},
			getDiscountCards() {
				const dbcmd = uniCloud.database().command;
				const user = uni.getStorageSync('uni-id-pages-userInfo');
				this.$db['engineers']
					.where({
						user_id: user._id
					})
					.tofirst()
					.then(res => {
						console.log(res.datas.coupon_list);
						if (!res.datas.coupon_list) {
							return
						}
						this.$db['coupons']
							.where({
								_id: dbcmd.in(res.datas.coupon_list)
							})
							.tofulllist()
							.then(res1 => {
								console.log('list-----******', res1.datas);
								this.discountCardsList = res1.datas.map(v => {
									return {
										name: v.name,
										value: v._id
									};
								});
							});
					});
			}
		},
		async onLoad(e) {
			const user = uni.getStorageSync('uni-id-pages-userInfo');
			this.orderData = JSON.stringify({
				engineer_id: user._id,
				order_id: e.id
			});
			console.log('************', e.id);
			await this.getDetails(e.id);
			this.checkPriceList(e.id);
			this.initTime();
			this.getOrderCardList();
			this.getDiscountCards();
		},
		mounted() {
			uni.$on('qrcode_updated', res1 => {
				this.data.scanner = res1.user_id;
				this.showQR = false;
				this.data.state = '待推送报价';
			});

			uni.$on('price_confirm_res', res => {
				console.log(res);
				if (res.is_confirm) {
					this.showPricePushModal = false;
					// this.isConfirmPrice = true;
					this.data.state = '已完成报价';
				} else {
					uni.showToast({
						icon: 'none',
						title: '客户不接受报价，请重新报价'
					});
					this.showPricePushModal = true;
				}
			});

			uni.$on('earnest_success', () => {
				this.$api.msg('用户已支付定金');
			});
			
			this.getDetails(this.orderData.order_id);
		}
	};
</script>

<style lang="scss" scoped>
	.footer {
		position: fixed;
		width: 100%;
		bottom: 0;
		z-index: 1024;
		box-shadow: 0 -1upx 6upx rgba(0, 0, 0, 0.1);
	}

	page {
		background: $page-color-base;
	}

	.row {
		background: #fff;
		position: relative;
		height: 110rpx;

		.tit {
			flex-shrink: 0;
			width: 160rpx;
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

	.goods-area {
		.goods-item {
			display: flex;

			.disabled {
				color: #fff !important;
				width: 70%;
				height: 70%;
				background-color: rgba(51, 51, 51, 0.5);
			}

			image {
				flex-shrink: 0;
				display: block;
				width: 180rpx;
				height: 180rpx;
				border-radius: 4rpx;
			}
		}
	}

	.solids::after {
		border: 8upx solid #1890ff;
	}
</style>
