<template>
	<view class="box-sizing-b">
		<!-- 01. 头部组件 -->
		<view class="dflex-b">
			<use-header style="width: 90%" :search-tip="searchTip" :search-auto="searchAuto" @search="search">
			</use-header>
			<view class="btn-area padding-right" @click="scanCode">
				<text class="iconfont-1 icon-scanning"></text>
				<!-- <text>扫码</text> -->
			</view>
		</view>

		<!-- 02. 轮播区 -->
		<view class="swiper-area pos-r" v-if="swiperDatas && swiperDatas.length > 0">
			<!-- 轮播组件 -->
			<swiper class="swiper w-full" autoplay indicator-dots indicator-color="#f7f7f7"
				indicator-active-color="#ff6a6c">
				<swiper-item class="swiper-item padding-lr wh-full box-sizing-b" v-for="(item, index) in swiperDatas"
					:key="index">
					<view class="wh-full" @click.stop="topage(item)">
						<image class="border-radius wh-full" mode="aspectFill" :lazy-load="true" :src="item.img" />
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="gap"></view>
		<view class="bg-main" style="height: 260upx; width: auto; margin-top: 10upx; margin-bottom: 20upx;">
			<view class="order-area padding-bottom-sm padding-lr dflex-a">
				<view class="item dflex dflex-flow-c" @tap="toCategory('633e3349f74ea000011e66ef')">
					<view class="iconfont-1" style="color: #1296db; font-size: 55rpx;">&#xe65d;</view>
					<text>家电维修</text>
				</view>
				<view class="item dflex dflex-flow-c" @click="toCategory('633e335b664ca5000162c0ba')">
					<view class="iconfont-1" style="color: #e44d45; font-size: 55rpx;">&#xe652;</view>
					<text>家电清洗</text>
				</view>
				<view class="item dflex dflex-flow-c" @click="toCategory('633e33b3fcf4a300015c5e2c')">
					<view class="iconfont-1" style="color: #e98f36; font-size: 55rpx;">&#xe69d;</view>
					<text>水电维修</text>
				</view>
				<view class="item dflex dflex-flow-c" @click="toCategory('633e33c7702e9d000135777b')">
					<view class="iconfont-1" style="color: #1296db; font-size: 55rpx;">&#xe60b;</view>
					<text>管道疏通</text>
				</view>
				<view class="item dflex dflex-flow-c" @click="toCategory('633e339ff808ea00018e8450')">
					<view class="iconfont-1" style="color: #e44d45; font-size: 55rpx;">&#xe644;</view>
					<text>家具维保</text>
				</view>
			</view>
			<view class="order-area padding-bottom-sm padding-lr dflex-a">
				<view class="item dflex dflex-flow-c" @click="toCategory('633e3395fcf4a300015c5a4d')">
					<view class="iconfont-1" style="color: #e98f36; font-size: 55rpx;">&#xe69e;</view>
					<text>家电安装</text>
				</view>
				<view class="item dflex dflex-flow-c" @click="toCategory('633e33a97d78ff0001a59ddc')">
					<view class="iconfont-1" style="color: #1296db; font-size: 55rpx;">&#xe61c;</view>
					<text>门窗维保</text>
				</view>
				<view class="item dflex dflex-flow-c" @click="toCategory('633e33dbd2b9120001555a33')">
					<view class="iconfont-1" style="color: #e44d45; font-size: 55rpx;">&#xe63d;</view>
					<text>电脑维修</text>
				</view>
				<view class="item dflex dflex-flow-c" @click="toCategory('633e33bd81076a00013fa0b6')">
					<view class="iconfont-1" style="color: #e98f36; font-size: 55rpx;">&#xe618;</view>
					<text>防水补漏</text>
				</view>
				<view class="item dflex dflex-flow-c" @click="toCategory('633e3349f74ea000011e66ef')">
					<view class="iconfont" style="color: #1296db; font-size: 55rpx;">&#xe6d6;</view>
					<text>全部服务</text>
				</view>
			</view>
		</view>
		<view class="gap"></view>

		<!--家电报修-->
		<text class="text-black text-lg padding-left-sm text-bold" style="line-height: 100rpx;">家电保修</text>
		<!-- <use-list-title title="家电报修" size="32" fwt="600" color="#333" iconfont=" " right=""></use-list-title> -->
		<view class="limit-area dflex-b">
			<image class="border-radius-xs" mode="scaleToFill" :lazy-load="true"
				@click="togoods({ _id: '1665539935240327279' })"
				src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/b3075dd2-aa51-4b4a-b01a-6670f07157bf.jfif">
			</image>
			<image class="border-radius-xs" mode="scaleToFill" :lazy-load="true"
				@click="togoods({ _id: '1665545660815812023' })"
				src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/7d8bdabd-8ad9-4e9f-b557-c9b0d1345211.jpg">
			</image>
			<image class="border-radius-xs" mode="scaleToFill" :lazy-load="true"
				@click="togoods({ _id: '1667289578228169623' })"
				src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/295d19aa-5cb4-4f87-9ba3-2c0fe11b2b76.jpeg">
			</image>
		</view>
		<view class="gap"></view>

		<text class="text-black text-lg padding-left-sm text-bold" style="line-height: 100rpx;">拒绝小病大修</text>
		<!-- <use-list-title title="拒绝小病大修" size="32" fwt="600" color="#333" iconfont=" " right=""></use-list-title> -->
		<view class="limit-area dflex-b">
			<image class="border-radius-xs" mode="scaleToFill" :lazy-load="true"
				@click="togoods({ _id: '1667292436721923230' })"
				src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/f59a2653-1f05-4bb5-8f12-f46e0fcb9bf2.jpeg">
			</image>
			<image class="border-radius-xs" mode="scaleToFill" :lazy-load="true"
				@click="togoods({ _id: '1667292837113579804' })"
				src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/01e0c0d3-d4e4-4cb8-a880-0b3ad139b522.jpeg">
			</image>
			<image class="border-radius-xs" mode="scaleToFill" :lazy-load="true"
				@click="togoods({ _id: '1667292914239734825' })"
				src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/6b608d3b-fd15-4d1b-913e-78430f3a7398.jpeg">
			</image>
		</view>
		<view class="gap"></view>

		<text class="text-black text-lg padding-left-sm text-bold margin-tb" style="line-height: 100rpx;">豪华清洗套餐</text>
		<!-- 		<use-list-title title="豪华清洗套餐" size="32" fwt="600" color="#333" iconfont=" " right=""></use-list-title> -->
		<view class="limit-area dflex-b">
			<image class="border-radius-xs" mode="scaleToFill" :lazy-load="true"
				@click="togoods({ _id: '1667310185612447732' })"
				src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/636e642a-918f-4fde-953c-eda1791be56e.jpeg">
			</image>
			<image class="border-radius-xs" mode="scaleToFill" :lazy-load="true"
				@click="togoods({ _id: '1667310392203256322' })"
				src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/6806c790-5006-43d8-8e1b-8622f4e7ecab.jpeg">
			</image>
			<image class="border-radius-xs" mode="scaleToFill" :lazy-load="true"
				@click="togoods({ _id: '1667310830083458423' })"
				src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/ba8ab7f2-a663-4468-af46-d2c89477eef3.jpeg">
			</image>
		</view>
		<view class="gap"></view>
		<text class="text-black text-lg padding-left-sm text-bold" style="line-height: 100rpx;">清洗单品</text>
		<!-- <use-list-title title="清洗单品" size="32" fwt="600" color="#333" iconfont=" " right=""></use-list-title> -->
		<view class="limit-area dflex-b">
			<image class="border-radius-xs" mode="scaleToFill" :lazy-load="true"
				@click="togoods({ _id: '1667365374418915975' })"
				src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/54a71c96-439a-48f1-8da4-dd6ec27ff3f3.jpeg">
			</image>
			<image class="border-radius-xs" mode="scaleToFill" :lazy-load="true"
				@click="togoods({ _id: '1667365519889114784' })"
				src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/32ebb00a-f07d-4fe2-a140-7629afc8fec9.jpeg">
			</image>
			<image class="border-radius-xs" mode="scaleToFill" :lazy-load="true"
				@click="togoods({ _id: '1667365704620237066' })"
				src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/d5eb8ba1-5995-4742-95ac-e22a3f6dbee4.jpeg">
			</image>
		</view>
		<!-- 维修社区 -->
		<!-- <use-list-title title="维修社区" tip="查看全部" size="32" fwt="600" color="#333" iconfont="" @goto="toCommunity">
		</use-list-title>
		<view v-for="item in repairCommunityDatas" :key='item.id' @click="toCommunityDetail(item.id)">
			<view style="margin-bottom: 10upx;" class="dflex-b">
				<view class="dflex-flow-c dflex-s margin-left">
					<text style="font-size: larger; font-weight: bolder;">{{item.title}}</text>
					<text>{{item.looked}}人看过</text>
				</view>
				<image style="width: 300rpx; height: 180rpx; border-radius: 10%;" class="border-radius-xs"
					mode="aspectFill" :lazy-load="true" :src='item.img'>
				</image>
			</view>
		</view> -->

		<view class="gap"></view>
		<!-- tab页 -->
		<view>
			<u-sticky bgColor="#fff">
				<u-tabs lineWidth="30" :activeStyle="{
						color: '#303133',
						fontWeight: 'bold',
						transform: 'scale(1.05)'
					}" :inactiveStyle="{
						color: '#606266',
						transform: 'scale(1)'
					}" itemStyle="padding-left: 10px; padding-right: 10px; height: 34px;" :scrollable="false" :list="list"
					@click="tabChange"></u-tabs>
			</u-sticky>

			<view class="a">
				<view id="jiaDianQingXi" v-for="item in jiaDianQingXi" :key="item._id">
					<view class="bg-main padding-lg dflex-s border-radius" @click="togoods(item)">
						<view class="image-wrapper pos-r">
							<!-- 商品图片 -->
							<image style="width: 200rpx; height: 200rpx;" class="border-radius-xs wh-full"
								mode="aspectFill" :lazy-load="true" :src="item.img"></image>
						</view>
						<view
							style="flex-direction: column; display: flex; justify-content: space-between; width: 100%; height: 200rpx;">
							<view class="dflex-flow-c dflex-s">
								<text style="font-size: large; font-weight: bolder;">{{ item.title }}</text>
								<text>{{ item.extra }}</text>
							</view>
							<view class="dflex-b w-full">
								<view>
									<text class="price">{{ item.price }}</text>
									<text style="color: red;">/次</text>
								</view>
								<button class="cu-btn round bg-blue"
									@click.stop="toOrderCreate(item._id, item.sku_id)">立即预约</button>
							</view>
						</view>
					</view>
					<view class="gap"></view>
				</view>
			</view>

			<view class="b">
				<view id="jiaDianWeiXiu" v-for="item in jiaDianWeiXiu" :key="item._id">
					<view class="bg-main padding-lg dflex-s border-radius" @click="togoods(item)">
						<view class="image-wrapper pos-r">
							<!-- 商品图片 -->
							<image style="width: 200rpx; height: 200rpx;" class="border-radius-xs wh-full"
								mode="aspectFill" :lazy-load="true" :src="item.img"></image>
						</view>
						<view
							style="flex-direction: column; display: flex; justify-content: space-between; width: 100%; height: 200rpx;">
							<view class="dflex-flow-c dflex-s">
								<text style="font-size: large; font-weight: bolder;">{{ item.title }}</text>
								<text>{{ item.extra }}</text>
							</view>
							<view class="dflex-b w-full">
								<view>
									<text class="price">{{ item.price }}</text>
									<text style="color: red;">/次</text>
								</view>
								<button class="cu-btn round bg-blue"
									@click.stop="toOrderCreate(item._id, item.sku_id)">立即预约</button>
							</view>
						</view>
					</view>
					<view class="gap"></view>
				</view>
			</view>

			<view class="c">
				<view id="guanDaoShuTong" v-for="item in guanDaoShuTong" :key="item._id">
					<view class="bg-main padding-lg dflex-s border-radius" @click="togoods(item)">
						<view class="image-wrapper pos-r">
							<!-- 商品图片 -->
							<image style="width: 200rpx; height: 200rpx;" class="border-radius-xs wh-full"
								mode="aspectFill" :lazy-load="true" :src="item.img"></image>
						</view>
						<view
							style="flex-direction: column; display: flex; justify-content: space-between; width: 100%; height: 200rpx;">
							<view class="dflex-flow-c dflex-s">
								<text style="font-size: large; font-weight: bolder;">{{ item.title }}</text>
								<text>{{ item.extra }}</text>
							</view>
							<view class="dflex-b w-full">
								<view>
									<text class="price">{{ item.price }}</text>
									<text style="color: red;">/次</text>
								</view>
								<button class="cu-btn round bg-blue"
									@click.stop="toOrderCreate(item._id, item.sku_id)">立即预约</button>
							</view>
						</view>
					</view>
					<view class="gap"></view>
				</view>
			</view>

			<view class="d">
				<view id="shuiDianWeiXiu" v-for="item in shuiDianWeiXiu" :key="item._id">
					<view class="bg-main padding-lg dflex-s border-radius" @click="togoods(item)">
						<view class="image-wrapper pos-r">
							<!-- 商品图片 -->
							<image style="width: 200rpx; height: 200rpx;" class="border-radius-xs wh-full"
								mode="aspectFill" :lazy-load="true" :src="item.img"></image>
						</view>
						<view
							style="flex-direction: column; display: flex; justify-content: space-between; width: 100%; height: 200rpx;">
							<view class="dflex-flow-c dflex-s">
								<text style="font-size: large; font-weight: bolder;">{{ item.title }}</text>
								<text>{{ item.extra }}</text>
							</view>
							<view class="dflex-b w-full">
								<view>
									<text class="price">{{ item.price }}</text>
									<text style="color: red;">/次</text>
								</view>
								<button class="cu-btn round bg-blue"
									@click.stop="toOrderCreate(item._id, item.sku_id)">立即预约</button>
							</view>
						</view>
					</view>
					<view class="gap"></view>
				</view>
			</view>
		</view>

		<!-- 05. 热门推荐 -->
		<!-- <use-hot-goods :datas="goodsHotDatas" autoload="none" title="热门推荐"></use-hot-goods> -->

		<button @click="toQuickOrder" class="fixed-btn" size="mini" type="warn">一键下单</button>
		<!-- 置顶 -->
		<use-totop ref="usetop" :style="{ marginBottom: navHeight + 'px' }"></use-totop>

		<!-- #ifdef MP-WEIXIN -->
		<!-- 		<official-account @bindload="wxOAccountLoad" @binderror="wxOAccountErr"></official-account> -->
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				env: {},
				showModal: false,
				payload: {},
				order_detail_id: [],
				order_id: '',
				isCreate: true,
				// 推送的价格数组
				price_list: [],
				// 头部参数
				searchAuto: !0,
				searchTip: '请输入搜索关键字',

				// 轮播区
				swiperDatas: [],
				// 金刚区分类
				categoryDatas: [],
				// 限时精选
				goodsLimitDatas: [],
				// 热门推荐
				goodsHotDatas: [],
				// 维修社区
				repairCommunityDatas: [{
						id: 1,
						title: '广西北海市工信局路晓军一行 调研家庭维修',
						looked: 1072,
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/b3075dd2-aa51-4b4a-b01a-6670f07157bf.jfif'
					},
					{
						id: 2,
						title: '广西北海市工信局路晓军一行 调研家庭维修',
						looked: 1072,
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/b3075dd2-aa51-4b4a-b01a-6670f07157bf.jfif'
					},
					{
						id: 3,
						title: '广西北海市工信局路晓军一行 调研家庭维修',
						looked: 1072,
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/b3075dd2-aa51-4b4a-b01a-6670f07157bf.jfif'
					}
				],
				// 菜单

				scrollTop: 0,
				navHeight: 0,
				list: [{
						name: '家电清洗'
					},
					{
						name: '家电维修'
					},
					{
						name: '管道疏通'
					},
					{
						name: '水电维修'
					}
				],
				jiaDianQingXi: [{
						_id: '1667365859678660854',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/78bb9fa1-5300-44ad-951b-719fb99e163d.jpeg',
						title: '油烟机清洗（拆机洗）',
						extra: '[强力除油污]告别油垢污渍',
						price: 166,
						sku_id: '6361fbe35125130001f0b583'
					},
					{
						_id: '1667365374418915975',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/54a71c96-439a-48f1-8da4-dd6ec27ff3f3.jpeg',
						title: '滚筒洗衣机清洗（不拆机）',
						extra: '[除霉除污垢]去除洗衣桶内壁细...',
						price: 158,
						sku_id: '6361f9fe53a7f30001886755'
					}
				],
				jiaDianWeiXiu: [{
						_id: '1665539935240327279',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/b3075dd2-aa51-4b4a-b01a-6670f07157bf.jfif',
						title: '挂机空调维修',
						extra: '空调不制冷/漏水/噪音大...',
						price: 98,
						sku_id: '63632cc0f1492c00018ce10d'
					},
					{
						_id: '1667292436721923230',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/f59a2653-1f05-4bb5-8f12-f46e0fcb9bf2.jpeg',
						title: '洗衣机维修',
						extra: '[保修90天]告别油垢污渍',
						price: 79,
						sku_id: ''
					}
				],
				guanDaoShuTong: [{
						_id: '1667376462870291812',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/cc68630b-7ac7-4123-9d41-c3adf91ac4d2.jpeg',
						title: '洗菜盆疏通',
						extra: '不通不收费 快速响应',
						price: 156,
						sku_id: ''
					},
					{
						_id: '1667791626022810021',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/bc7c43c9-ad3c-47aa-afb9-de6965a6d21d.jpeg',
						title: '地漏疏通',
						extra: '[不通不收费]告别油垢污渍',
						price: 156,
						sku_id: ''
					}
				],
				shuiDianWeiXiu: [{
						_id: '1668006464029300211',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/36ce2207-69e8-418e-acbe-f4f43b8c7d56.jpg',
						title: '水管维修',
						extra: '上门费30元，线上预约服务',
						price: 30,
						sku_id: ''
					},
					{
						_id: '1667996738724110056',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/07c8a0eb-bdc1-47db-bad2-9b660a6dae4c.jpg',
						title: '普通家用灯具安装、维修',
						extra: '上门费30元，线上预约服务',
						price: 30,
						sku_id: ''
					}
				]
			};
		},
		// 监听页面加载
		onLoad() {
			this.$api.get_env(res => {
				this.env = res;
				this.is_mp = this.env.is_mp;
				this.platform = this.env.platform;
				this.platform_icon = this.env.platform_icon;
				this.platform_name = this.env.platform_name;
			});
		},
		onPageScroll(e) {
			// this.scrollTop = e.scrollTop
			this.$refs.usetop.change(e.scrollTop);
		},
		// 监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
		onShow() {
			this.loadData();

			uni.$on('price_push', async data => {
				let _this = this;
				this.payload = data;
				this.order_detail_id = Object.keys(data.list);
				this.order_id = data.order_id;

				const user = uni.getStorageSync('uni-id-pages-userInfo');
				if (user._id === data.scanner) {
					this.isCreate = true;
				} else {
					this.isCreate = false;
				}
				this.showModal = true;
			});
		},
		// 监听用户下拉刷新
		onPullDownRefresh() {
			this.loadData(() => {
				uni.stopPullDownRefresh();
			});
		},

		methods: {
			// 加载数据
			async loadData(callback) {
				await this.$func.usemall
					.call('app/mp/home', {
						rows: 8
					})
					.then(res => {
						if (res.code === 200) {
							// 轮播图
							this.swiperDatas = res.datas.carousel || [];
							// 分类导航
							this.categoryDatas = res.datas.category || [];
							// 限时精选
							this.goodsLimitDatas = res.datas.limited || [];
							// 热门推荐
							this.goodsHotDatas = res.datas.hot || [];

							if (typeof callback === 'function') {
								// 数据加载完成回调函数
								callback();
							}

							// #ifdef H5 || MP-360
							// if (this.goodsLimitDatas.length > 0) {
							// 	this.$api.dom('.uni-scroll-view-content').children[0].style.width = (uni
							// 		.upx2px(260) * this.goodsLimitDatas.length) + 'px';
							// 	new this.$iscroll('.uni-scroll-view-content', {
							// 		scrollX: true,
							// 		click: true
							// 	});
							// }
							// #endif
						}
					});
			},
			// 调起扫码方法
			async scanCode() {
				const _this = this;
				const user = uni.getStorageSync('uni-id-pages-userInfo');
				if (!user) {
					this.$api.msg('没有查询到当前用户信息');
					return;
				}
				
				uni.scanCode({
					scanType: ['qrCode'],
					success: function(res) {
						const result = JSON.parse(res.result);
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + result.order_id);
						console.log('条码内容：' + result.engineer_id);
						const db = uniCloud.database();
						// 发送事件给工程师端，更新订单状态
						_this.$db['uni-id-device'].where({
							user_id: result.engineer_id
						}).tofirst().then(res1 => {
							getApp().pushMsg(res1.datas.push_clientid, '订单更新', '用户已扫码，请注意订单更新状态', {
									engineer_id: result.engineer_id,
									user_id: user._id
								}, result.order_id)
								.then(async () => {
									await _this.$db['usemall-order'].where({
										order_id: result.order_id
									}).update({
										create_uid: user._id
									});
									await _this.$db['usemall-order'].where({
										order_id: result.order_id
									}).update({
										scanner: user._id
									});
									await _this.changeOrderState(result.order_id, '已上门');
									await _this.changeOrderState(result.order_id, '待推送报价');
								});
						});
					},
					fail(err) {
						console.info(err)
					}
				});
			},
			changeOrderState(order_id, state) {
				const user = uni.getStorageSync('uni-id-pages-userInfo');
				const p1 = this.$db['usemall-order']
					.where({
						order_id: order_id
					})
					.update({
						state: state
					});
				const p2 = this.$db['usemall-order-log'].add({
					order_id: order_id,
					is_delete: 0,
					create_uid: user._id,
					current_state: state
				});
				return Promise.all([p1, p2]);
			},
			// 调起订阅消息
			subscribeMessage() {
				uni.requestSubscribeMessage({
					tmplIds: ['cPKudU2HH2XVYPAqwPMm_k6cmRrlKb1Q6BOKotegJvk'],
					complete: res => {
						console.log('res........', res);
					}
				});
			},
			// 搜索回调函数
			search() {
				console.log('search');
			},
			// 跳转页面
			topage(item) {
				// console.log('分类点击', item);
				if (item && item.type == '网页') {
					uni.navigateTo({
						url: `/sub_pages_1/content/web?url=${item.url}`
					});
				} else if (item && item.type == '页面') {
					uni.navigateTo({
						url: `${item.url}`
					});
				} else {
					if (item.id)
						this.$api.togoods({
							id: item._id
						});
				}
			},
			// 限时精选 -> 商品详情
			togoods(item) {
				// 跳转商品详情
				this.$api.togoods({
					id: item._id
				});
			},
			// 限时精选
			limit() {
				// 跳转商品列表 - 限时精选类目
				this.$api.togoodslist({
					limited: 1
				});
			},
			// 跳转维修社区
			toCommunity() {
				uni.navigateTo({
					url: '/sub_pages_1/community/home'
				});
			},
			// 跳转快速下单
			toQuickOrder() {
				// let _this = this;
				// this.$func.usemall.call('unipush/create', {cid: '11dc4ff5c6246acfe72577ae981f3ab1', title: '定金推送', content: 'asd', payload: {'price': 100, cid: '11dc4ff5c6246acfe72577ae981f3ab1', 'goods_id': '1665545660815812023', 'order_id': '1665972510543388454'}}).then(res => {
				// 	console.log(res);
				// })
				if (!this.loginCheck()) return;
				uni.navigateTo({
					url: '/sub_pages_1/order/quick'
				});
			},
			// 跳转全部服务
			toCategory(cid) {
				getApp().globalData.cid = cid;
				this.$api.tocategory();
			},
			// 跳转社区详情页
			toCommunityDetail(id) {
				console.log('goto');
				uni.navigateTo({
					url: '/sub_pages_1/community/detail?id=' + id
				});
			},
			// 检测是否已登录
			loginCheck() {
				if (!uni.getStorageSync('uni-id-pages-userInfo')) {
					let _this = this;
					uni.showModal({
						title: '授权登录',
						success: function(res) {
							if (res.confirm) {
								_this.$api.tologin();
							}
						}
					});
					return false;
				}

				return true;
			},
			// 跳转创建订单页
			toOrderCreate(goods_id, sku_id) {
				if (!this.loginCheck()) return;
				console.log(goods_id, sku_id);
				uni.navigateTo({
					url: `/sub_pages_1/order/create?goods_id=${goods_id}&sku_id=${sku_id || ''}`
				});
			},
			tabChange(item) {
				switch (item.index) {
					case 0:
						this.$nextTick(() => {
							uni.pageScrollTo({
								selector: '.a',
								duration: 300
								// scrollTop: 100,
							});
						});
						break;
					case 1:
						this.$nextTick(() => {
							uni.pageScrollTo({
								selector: '.b',
								duration: 300
							});
						});
						break;
					case 2:
						this.$nextTick(() => {
							uni.pageScrollTo({
								selector: '.c',
								duration: 300
							});
						});
						break;
					case 3:
						this.$nextTick(() => {
							uni.pageScrollTo({
								selector: '.d',
								duration: 300
							});
						});
						break;
				}
			}
		},
		mounted() {
			// #ifdef H5 || MP-360
			this.navHeight = 50;
			// #endif
		}
	};
</script>

<style lang="scss">
	.u-button {
		width: 40% !important;
	}

	.btn-area {
		font-size: $font-sm;
		color: $font-color-base;
		// width: 10%;

		.iconfont-1 {
			font-size: 60rpx;
			// line-height: 48rpx;
		}
	}

	.fixed-btn {
		border-radius: 8%;
		position: fixed;
		width: 30%;
		bottom: 10vh;
		text-align: center;
		left: 0;
		right: 0;
		z-index: 1000;
		animation: switch 1s ease-out infinite;
	}

	@keyframes switch {

		0%,
		100% {
			transform: scale(1);
		}

		50% {
			transform: scale(0.9);
		}
	}

	/* 轮播图区 */
	.swiper-area {
		.swiper {
			height: 240rpx;
		}
	}

	/* 分类区 */
	.category-area {
		padding: 60rpx 0 30rpx 0;

		.category-item {
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			width: 25%;
		}

		image {
			width: 96rpx;
			height: 96rpx;
		}
	}

	/* 限时精选区 */
	.limit-area {
		min-height: 240rpx;

		image {
			width: 240rpx;
			height: 240rpx;
		}

		.item {
			width: 240rpx;
		}
	}
</style>
