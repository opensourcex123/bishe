<template>
	<view class="bg-drak">
		<view class="bg-main">
			<use-list-title @goto="toCategory" tip="全部服务" title="选择你需要的服务" size="32" fwt="600" color="#333"
				iconfont=" ">
			</use-list-title>
			<view class="dflex-b padding-lr">
				<view class="item dflex dflex-flow-c" @click="changeTab(1)">
					<view v-if="tabIndex === 1" class="iconfont-1" style="font-size: 70rpx; color: #3491FA;">&#xe65d;
					</view>
					<view v-else class="iconfont-1" style="font-size: 70rpx;">&#xe65d;</view>
					<text>家庭维修</text>
				</view>
				<view class="item dflex dflex-flow-c" @click="changeTab(2)">
					<view v-if="tabIndex === 2" class="iconfont-1" style="font-size: 70rpx; color: #14C9C9;">&#xe652;
					</view>
					<view v-else class="iconfont-1" style="font-size: 70rpx;">&#xe652;</view>
					<text>家电清洗</text>
				</view>
				<view class="item dflex dflex-flow-c" @click="changeTab(3)">
					<view v-if="tabIndex === 3" class="iconfont-1" style="font-size: 70rpx; color: #F7BA1E;">&#xe69d;
					</view>
					<view v-else class="iconfont-1" style="font-size: 70rpx;">&#xe69d;</view>
					<text>上门安装</text>
				</view>
				<view class="item dflex dflex-flow-c" @click="changeTab(4)">
					<view v-if="tabIndex === 4" class="iconfont" style="font-size: 70rpx; color: #F53F3F;">&#xe76c;
					</view>
					<view v-else class="iconfont" style="font-size: 70rpx;">&#xe76c;</view>
					<text>便民服务</text>
				</view>
			</view>
			<view class="padding-lr margin-top-big" v-if="tabIndex === 1">
				<text style="font-weight: bolder;">家电维修</text>
				<view class="dflex-s margin-top flex-wrap">
					<view @click="showDetailService(item, index)" class="dflex-flow-c dflex margin-bottom"
						style="width: 33%;" v-for="(item, index) in jiaDianWeiXiu">
						<image style="width: 200rpx; height: 200rpx;" mode="aspectFill" :lazy-load="true"
							:src="item.img">
						</image>
						<text>{{item.title}}</text>
					</view>
				</view>
				<text style="font-weight: bolder;">水电维修</text>
				<view class="dflex-s margin-top flex-wrap">
					<view @click="showDetailService(item, index)" class="dflex-flow-c dflex margin-bottom"
						style="width: 33%;" v-for="(item, index) in shuiDianWeiXiu">
						<image style="width: 200rpx; height: 200rpx;" mode="aspectFill" :lazy-load="true"
							:src="item.img">
						</image>
						<text>{{item.title}}</text>
					</view>
				</view>
				<text style="font-weight: bolder;">家具维修</text>
				<view class="dflex-s margin-top flex-wrap">
					<view @click="showDetailService(item, index)" class="dflex-flow-c dflex margin-bottom"
						style="width: 33%;" v-for="(item, index) in jiaJuWeiXiu">
						<image style="width: 200rpx; height: 200rpx;" mode="aspectFill" :lazy-load="true"
							:src="item.img">
						</image>
						<text>{{item.title}}</text>
					</view>
				</view>
			</view>
			<view class="padding-lr margin-top-big" v-if="tabIndex === 2">
				<text style="font-weight: bolder;">清洗套餐</text>
				<view class="dflex-s margin-top flex-wrap">
					<view @click="showDetailService(item, index)" class="dflex-flow-c dflex margin-bottom"
						style="width: 33%;" v-for="(item, index) in qingXiTaoCan">
						<image style="width: 200rpx; height: 200rpx;" mode="aspectFill" :lazy-load="true"
							:src="item.img">
						</image>
						<text>{{item.title}}</text>
					</view>
				</view>
				<text style="font-weight: bolder;">家电清洗</text>
				<view class="dflex-s margin-top flex-wrap">
					<view @click="showDetailService(item, index)" class="dflex-flow-c dflex margin-bottom"
						style="width: 33%;" v-for="(item, index) in jiaDianQingXi">
						<image style="width: 200rpx; height: 200rpx;" mode="aspectFill" :lazy-load="true"
							:src="item.img">
						</image>
						<text>{{item.title}}</text>
					</view>
				</view>
			</view>
			<view class="padding-lr margin-top-big" v-if="tabIndex === 3">
				<text style="font-weight: bolder;">水电安装</text>
				<view class="dflex-s margin-top flex-wrap">
					<view @click="showDetailService(item, index)" class="dflex-flow-c dflex margin-bottom"
						style="width: 33%;" v-for="(item, index) in shuiDianAnZhuang">
						<image style="width: 200rpx; height: 200rpx;" mode="aspectFill" :lazy-load="true"
							:src="item.img">
						</image>
						<text>{{item.title}}</text>
					</view>
				</view>
				<text style="font-weight: bolder;">家电安装</text>
				<view class="dflex-s margin-top flex-wrap">
					<view @click="showDetailService(item, index)" class="dflex-flow-c dflex margin-bottom"
						style="width: 33%;" v-for="(item, index) in jiaDianAnZhuang">
						<image style="width: 200rpx; height: 200rpx;" mode="aspectFill" :lazy-load="true"
							:src="item.img">
						</image>
						<text>{{item.title}}</text>
					</view>
				</view>
				<text style="font-weight: bolder;">家具安装</text>
				<view class="dflex-s margin-top flex-wrap">
					<view @click="showDetailService(item, index)" class="dflex-flow-c dflex margin-bottom"
						style="width: 33%;" v-for="(item, index) in jiaJuAnZhuang">
						<image style="width: 200rpx; height: 200rpx;" mode="aspectFill" :lazy-load="true"
							:src="item.img">
						</image>
						<text>{{item.title}}</text>
					</view>
				</view>
				<text style="font-weight: bolder;">门窗安装</text>
				<view class="dflex-s margin-top flex-wrap">
					<view @click="showDetailService(item, index)" class="dflex-flow-c dflex margin-bottom"
						style="width: 33%;" v-for="(item, index) in menChuangAnZhuang">
						<image style="width: 200rpx; height: 200rpx;" mode="aspectFill" :lazy-load="true"
							:src="item.img">
						</image>
						<text>{{item.title}}</text>
					</view>
				</view>
			</view>
			<view class="padding-lr margin-top-big" v-if="tabIndex === 4">
				<text style="font-weight: bolder;">紧急疏通</text>
				<view class="dflex-s margin-top flex-wrap">
					<view @click="showDetailService(item, index)" class="dflex-flow-c dflex margin-bottom"
						style="width: 33%;" v-for="(item, index) in jinJiShuTong">
						<image style="width: 200rpx; height: 200rpx;" mode="aspectFill" :lazy-load="true"
							:src="item.img">
						</image>
						<text>{{item.title}}</text>
					</view>
				</view>
				<text style="font-weight: bolder;">开锁换锁</text>
				<view class="dflex-s margin-top flex-wrap">
					<view @click="showDetailService(item, index)" class="dflex-flow-c dflex margin-bottom"
						style="width: 33%;" v-for="(item, index) in kaiSuoHuanSuo">
						<image style="width: 200rpx; height: 200rpx;" mode="aspectFill" :lazy-load="true"
							:src="item.img">
						</image>
						<text>{{item.title}}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-show="isChecked === 1">
			<view class="gap"></view>
			<use-list-title title="选择具体的服务产品" size="32" fwt="600" color="#333"
				iconfont=" " rightIcon="">
			</use-list-title>			<view id="service" v-for="item in concreteService">
				<use-list-title @goto="toOrderCreate(item.goods_id, item.sku_id)" :title="item.title" size="32"
					color="#333" iconfont=" ">
				</use-list-title>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabIndex: 0,
				isChecked: 0,
				serviceIndexx: -1,
				concreteService: [],

				jiaDianWeiXiu: [{
						title: '空调地暖',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/ba8ab7f2-a663-4468-af46-d2c89477eef3.jpeg',
						service: [{
								title: '挂机空调维修',
								goods_id: '1665539935240327279',
								sku_id: '63632cc0f1492c00018ce10d'
							},
							{
								title: '柜机空调维修',
								goods_id: '1665539935240327279',
								sku_id: '63632cc0f1492c00018ce10e'
							},
							{
								title: '地暖维修',
								goods_id: '1667294139092728326',
								sku_id: ''
							}
						]
					},
					{
						title: '冰箱冰柜',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/126683bf-4e66-4ae7-9430-417d297883a8.jpeg',
						service: [{
								title: '冰箱维修',
								goods_id: '1667289578228169623',
								sku_id: ''
							},
							{
								title: '冰柜维修',
								goods_id: '1667305965942578547',
								sku_id: ''
							}
						]
					},
					{
						title: '洗衣烘干',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/54a71c96-439a-48f1-8da4-dd6ec27ff3f3.jpeg',
						service: [{
								title: '洗衣机维修',
								goods_id: '1667292436721923230',
								sku_id: ''
							},
							{
								title: '甩干机维修',
								goods_id: '1667303801320313680',
								sku_id: ''
							}
						]
					},
					{
						title: '厨房电器',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/636e642a-918f-4fde-953c-eda1791be56e.jpeg',
						service: [{
								title: '油烟机维修',
								goods_id: '1667292970934654201',
								sku_id: ''
							},
							{
								title: '燃气灶维修',
								goods_id: '1667292914239734825',
								sku_id: ''
							},
							{
								title: '微波炉维修',
								goods_id: '1667293018082451608',
								sku_id: ''
							},
							{
								title: '电饭煲维修',
								goods_id: '1667293379459437736',
								sku_id: ''
							}
						]
					},
					{
						title: '家庭影音',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/01e0c0d3-d4e4-4cb8-a880-0b3ad139b522.jpeg',
						service: [{
								title: '电视维修',
								goods_id: '1667292837113579804',
								sku_id: ''
							},
							{
								title: 'windows台式电脑维修',
								goods_id: '1667796023391538939',
								sku_id: '63688c5de7f27c000159c365'
							},
							{
								title: 'windows笔记本电脑维修',
								goods_id: '1667796023391538939',
								sku_id: '63688c5de7f27c000159c366'
							},
						]
					},
				],
				shuiDianWeiXiu: [{
						title: '电路维修',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/d6dfd20f-e03f-4840-8c12-b657a0a1851d.jpg',
						service: [{
								title: '电路安装维修',
								goods_id: '1667996678902567148',
								sku_id: '636b9c06ff2a5400013b16a0'
							},
							{
								title: '开关插座安装，维修',
								goods_id: '1667996678902567148',
								sku_id: '636b9c06ff2a5400013b16a1'
							}
						]
					},
					{
						title: '卫洁浴具',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/d223211f-3fd3-4132-b73c-4ef8d1b97aab.jpg',
						service: [{
								title: '壁挂式马桶安装',
								goods_id: '1667997104613198529',
								sku_id: '636b9db026b3d800018c1332'
							},
							{
								title: '普通马桶拆卸，安装，维修',
								goods_id: '1667997104613198529',
								sku_id: '636b9db026b3d800018c1333'
							},
							{
								title: '智能马桶安装维修',
								goods_id: '1667997104613198529',
								sku_id: '636b9db026b3d800018c1334'
							},
							{
								title: '小便器拆卸，安装，维修',
								goods_id: '1667997399779979458',
								sku_id: ''
							},
							{
								title: '蹲便器拆卸，安装，维修',
								goods_id: '1668004271289588019',
								sku_id: ''
							},
							{
								title: '换气扇拆卸，安装',
								goods_id: '1668004323386210335',
								sku_id: ''
							}
						]
					},
					{
						title: '厨卫洁具',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/edab4c3c-e5a2-4e7d-ad31-0c048d74b925.jpg',
						service: [{
								title: '洗漱台拆卸，安装，维修',
								goods_id: '1668005452894687728',
								sku_id: ''
							},
							{
								title: '水管维修',
								goods_id: '1668006464029300211',
								sku_id: ''
							},
							{
								title: '洗手盆维修',
								goods_id: '1668004853091759577',
								sku_id: '636bbbf553a7f30001c0ec96'
							},
							{
								title: '洗衣槽维修',
								goods_id: '1668004916874934175',
								sku_id: '636bbc346742b700019ad23d'
							}
						]
					},
					{
						title: '五金挂件',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/2b564ff9-f888-4cfe-90d3-d53f9cc025f5.jpg',
						service: [{
								title: '普通五金挂件安装',
								goods_id: '1668006416042995298',
								sku_id: '636bc210188fab00016c43fe'
							},
							{
								title: '相框/装饰画拆卸，安装',
								goods_id: '1668006416042995298',
								sku_id: '636bc210188fab00016c43ff'
							},
							{
								title: '挂件安装工程业务',
								goods_id: '1668006416042995298',
								sku_id: '636bc210188fab00016c4400'
							},
							{
								title: '晾衣杆维修',
								goods_id: '1668005795499631750',
								sku_id: '636bbfa3188fab00016bfad8'
							},
							{
								title: '窗帘浴帘安装',
								goods_id: '1668006332198476886',
								sku_id: ''
							}
						]
					},
				],
				jiaJuWeiXiu: [{
						title: '桌椅维修',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/e24170d5-f252-4c22-9717-36d273996bff.jpg',
						service: [{
								title: '餐桌维修',
								goods_id: '1667530402142372192',
								sku_id: ''
							},
							{
								title: '普通办公桌维修',
								goods_id: '1667530150398722900',
								sku_id: ''
							},
							{
								title: '电脑桌维修',
								goods_id: '1667530244380303282',
								sku_id: ''
							},
							{
								title: '化妆桌维修',
								goods_id: '1667530486033077495',
								sku_id: ''
							}
						]
					},
					{
						title: '柜类维修',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/4ed07343-a3a5-4774-9479-d44a2be1e39d.jpg',
						service: [{
								title: '橱柜维修',
								goods_id: '1667531337876784729',
								sku_id: ''
							},
							{
								title: '衣柜维修',
								goods_id: '1667530967238945186',
								sku_id: ''
							},
							{
								title: '鞋柜维修',
								goods_id: '1667531111412455523',
								sku_id: ''
							},
							{
								title: '书柜维修',
								goods_id: '1667531214197595979',
								sku_id: ''
							}
						]
					},
					{
						title: '床类维修',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/06ca9c66-8472-4f31-a8ba-8425bb8c4b4d.jpg',
						service: [{
								title: '简易床维修',
								goods_id: '1667530757893587505',
								sku_id: ''
							},
							{
								title: '上下床维修',
								goods_id: '1667530841548758386',
								sku_id: ''
							},
							{
								title: '子母床维修',
								goods_id: '1667530919475805980',
								sku_id: ''
							}
						]
					},
					{
						title: '家具翻新',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/aca7f734-6917-4c10-8963-fc4eed2ff2c3.jpg',
						service: [{
								title: '沙发翻新',
								goods_id: '1667791426522077065',
								sku_id: ''
							},
							{
								title: '柜类补漆',
								goods_id: '1667791558574884847',
								sku_id: ''
							},
							{
								title: '桌椅补漆',
								goods_id: '1667791492792195782',
								sku_id: ''
							}
						]
					},
				],
				qingXiTaoCan: [{
						title: '挂机套餐',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/14c2bf1f-1ad3-471d-aee8-21033f499ad3.jpeg',
						service: [{
								title: '2台挂机清洗',
								goods_id: '1667310830083458423',
								sku_id: '636124ee3aeb53000150c1d2'
							},
							{
								title: '3台挂机清洗',
								goods_id: '1667310830083458423',
								sku_id: '636124ee3aeb53000150c1d3'
							}
						]
					},
					{
						title: '挂柜套餐',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/126683bf-4e66-4ae7-9430-417d297883a8.jpeg',
						service: [{
							title: '一挂一方柜',
							goods_id: '1667310830083458423',
							sku_id: '636124ee3aeb53000150c1d4'
						}]
					},
				],
				jiaDianQingXi: [{
						title: '冰箱清洗',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/126683bf-4e66-4ae7-9430-417d297883a8.jpeg',
						service: [{
								title: '冰箱清洗（三门）',
								goods_id: '1667365208783880131',
								sku_id: '6361f958c7989d000146e665'
							},
							{
								title: '冰箱清洗【单/双（上下）开门】',
								goods_id: '1667365208783880131',
								sku_id: '6361f958c7989d000146e664'
							},
							{
								title: '冰箱清洗【对开门/四开门】',
								goods_id: '1667365208783880131',
								sku_id: '6361f958c7989d000146e666'
							},
						]
					},
					{
						title: '洗衣机',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/54a71c96-439a-48f1-8da4-dd6ec27ff3f3.jpeg',
						service: [{
								title: '波轮洗衣机清洗（不拆机）',
								goods_id: '1667365374418915975',
								sku_id: '6361f9fe53a7f30001886754'
							},
							{
								title: '波轮洗衣机清洗（拆机）',
								goods_id: '1667365374418915975',
								sku_id: '6361f9fe53a7f30001886753'
							},
							{
								title: '滚筒洗衣机（不拆机）',
								goods_id: '1667365374418915975',
								sku_id: '6361f9fe53a7f30001886755'
							}
						]
					},
					{
						title: '热水器',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/32ebb00a-f07d-4fe2-a140-7629afc8fec9.jpeg',
						service: [{
								title: '燃气热水器清洗',
								goods_id: '1667365519889114784',
								sku_id: '6361fa90d69bc100014ade21'
							},
							{
								title: '电热水器清洗（不拆机）',
								goods_id: '1667365519889114784',
								sku_id: '6361fa90d69bc100014ade1f'
							},
							{
								title: '电热水器清洗（拆机洗）',
								goods_id: '1667365519889114784',
								sku_id: '6361fa90d69bc100014ade20'
							},
						]
					},
					{
						title: '地暖清洗',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/c82c8b79-fcdb-4d70-81ae-db0149cad1dc.jpg',
						service: [{
								title: '地暖清洗疏通2回路',
								goods_id: '1667368146402217896',
								sku_id: '636204d290b26d00017c15c1'
							},
							{
								title: '地暖清洗疏通3回路',
								goods_id: '1667368146402217896',
								sku_id: '636204d290b26d00017c15c2'
							}
						]
					},
				],
				shuiDianAnZhuang: [{
						title: '电路安装',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/07c8a0eb-bdc1-47db-bad2-9b660a6dae4c.jpg',
						service: [{
								title: '电路安装维修',
								goods_id: '1667996678902567148',
								sku_id: '636b9c06ff2a5400013b16a0'
							},
							{
								title: '开关插座安装，维修',
								goods_id: '1667996678902567148',
								sku_id: '636b9c06ff2a5400013b16a1'
							},
							{
								title: '灯具安装',
								goods_id: '1667996738724110056',
								sku_id: ''
							},
							{
								title: '多功能浴霸拆卸，安装',
								goods_id: '1667996972715163668',
								sku_id: '636b9d2c1e4b66000115c3e6'
							},
							{
								title: '监控摄像头安装',
								goods_id: '1667795901591949068',
								sku_id: '63688be386569700017a9cc8'
							},
						]
					},
					{
						title: '卫洁浴具',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/d223211f-3fd3-4132-b73c-4ef8d1b97aab.jpg',
						service: [
							{
								title: '普通马桶拆卸，安装，维修',
								goods_id: '1667997104613198529',
								sku_id: '636b9db026b3d800018c1333'
							},
							{
								title: '小便器拆卸，安装，维修',
								goods_id: '1667997399779979458',
								sku_id: ''
							},
							{
								title: '蹲便器拆卸，安装，维修',
								goods_id: '1668004271289588019',
								sku_id: ''
							},
							{
								title: '换气扇拆卸，安装',
								goods_id: '1668004323386210335',
								sku_id: ''
							}
						]
					},
					{
						title: '厨卫洁具',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/edab4c3c-e5a2-4e7d-ad31-0c048d74b925.jpg',
						service: [{
								title: '洗漱台拆卸，安装，维修',
								goods_id: '1668005452894687728',
								sku_id: ''
							},
							{
								title: '淋浴花洒拆卸，安装',
								goods_id: '1668004656027943813',
								sku_id: '636bbb305125130001288ec7'
							},
							{
								title: '浴缸安装',
								goods_id: '1668004956671541935',
								sku_id: ''
							}
						]
					},
					{
						title: '五金挂件',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/2b564ff9-f888-4cfe-90d3-d53f9cc025f5.jpg',
						service: [{
								title: '普通五金挂件安装',
								goods_id: '1668006416042995298',
								sku_id: '636bc210188fab00016c43fe'
							},
							{
								title: '相框/装饰画拆卸，安装',
								goods_id: '1668006416042995298',
								sku_id: '636bc210188fab00016c43ff'
							},
							{
								title: '挂件安装工程业务',
								goods_id: '1668006416042995298',
								sku_id: '636bc210188fab00016c4400'
							},
							{
								title: '窗帘浴帘安装',
								goods_id: '1668006332198476886',
								sku_id: ''
							}
						]
					},
				],
				jiaDianAnZhuang: [{
						title: '空调安装',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/14c2bf1f-1ad3-471d-aee8-21033f499ad3.jpeg',
						service: [{
								title: '挂机空调拆卸、安装',
								goods_id: '1667439223445738437',
								sku_id: '63631a77ce2777000195e0fe'
							},
							{
								title: '柜机空调拆卸、安装',
								goods_id: '1667439223445738437',
								sku_id: '63631a77ce2777000195e0ff'
							},
							{
								title: '风管机、天井机拆卸、安装',
								goods_id: '1667439223445738437',
								sku_id: '63631a77ce2777000195e100'
							}
						]
					},
					{
						title: '大家电',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/5b00a8d9-215f-4b44-a3a7-3d95080b882b.jpeg',
						service: [{
								title: '冰箱拆卸、安装',
								goods_id: '1667439275985756161',
								sku_id: ''
							},
							{
								title: '洗衣机安装',
								goods_id: '1667439324201812417',
								sku_id: ''
							},
							{
								title: '电视安装',
								goods_id: '1667439356256612762',
								sku_id: ''
							},
							{
								title: '燃气灶拆卸、安装',
								goods_id: '1667439478095415013',
								sku_id: ''
							},
							{
								title: '油烟机拆卸、安装',
								goods_id: '1667439513426488294',
								sku_id: ''
							}
						]
					},
					{
						title: '厨房电器',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/2615debd-e7c2-498e-8cb6-45317a3c3279.jpeg',
						service: [{
								title: '洗碗机拆卸、安装',
								goods_id: '1667439568187482925',
								sku_id: ''
							},
							{
								title: '消毒柜拆卸、安装',
								goods_id: '1667439615273252125',
								sku_id: ''
							},
							{
								title: '电热水龙头安装',
								goods_id: '1667439677680846088',
								sku_id: ''
							},
							{
								title: '净水器安装',
								goods_id: '1667439720041623958',
								sku_id: ''
							}
						]
					},
					{
						title: '生活电器',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/1fa1ef59-2b29-4560-885f-e68b451ef64f.jpeg',
						service: [{
								title: '电视安装',
								goods_id: '1667439356256612762',
								sku_id: ''
							},
							{
								title: '干手器拆卸、安装',
								goods_id: '1667439771446351604',
								sku_id: ''
							},
							{
								title: '按摩椅安装',
								goods_id: '1667439824022558568',
								sku_id: ''
							},
							{
								title: '跑步机安装',
								goods_id: '1667439964555577835',
								sku_id: ''
							},
						]
					},
				],
				jiaJuAnZhuang: [{
						title: '座椅安装',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/e24170d5-f252-4c22-9717-36d273996bff.jpg',
						service: [{
								title: '餐桌组装',
								goods_id: '1667459944115894508',
								sku_id: ''
							},
							{
								title: '电脑桌组装',
								goods_id: '1667458443331471822',
								sku_id: ''
							},
							{
								title: '普通办公桌组装',
								goods_id: '1667376322588807998',
								sku_id: ''
							}
						]
					},
					{
						title: '床类安装',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/ea77860f-b537-426b-b5ec-4e55639a00fc.jpg',
						service: [{
								title: '简易床组装',
								goods_id: '1667461107290438179',
								sku_id: ''
							},
							{
								title: '上下床组装',
								goods_id: '1667461319014175014',
								sku_id: ''
							},
							{
								title: '子母床组装',
								goods_id: '1667462325343872507',
								sku_id: ''
							}
						]
					},
					{
						title: '柜类维修',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/4ed07343-a3a5-4774-9479-d44a2be1e39d.jpg',
						service: [{
								title: '衣柜组装',
								goods_id: '1667465318360766859',
								sku_id: ''
							},
							{
								title: '橱柜组装',
								goods_id: '1667466642042622420',
								sku_id: ''
							},
							{
								title: '书柜组装',
								goods_id: '1667466361960385701',
								sku_id: ''
							},
							{
								title: '鞋柜组装',
								goods_id: '1667465983053787873',
								sku_id: ''
							}
						]
					},
				],
				menChuangAnZhuang: [{
						title: '窗类组装',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/2275b53c-fe52-40ce-8750-4b19d7c26448.jpg',
						service: [{
								title: '木窗组装',
								goods_id: '1667798305603892972',
								sku_id: ''
							},
							{
								title: '铝合金窗组装',
								goods_id: '1667798378242669946',
								sku_id: ''
							},
							{
								title: '纱窗组装',
								goods_id: '1667798244231693480',
								sku_id: ''
							}
						]
					},
					{
						title: '门类组装',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/5725f750-3a50-43d1-bd10-08428ccf80cc.jpg',
						service: [{
								title: '木门组装',
								goods_id: '1667798628217413089',
								sku_id: ''
							},
							{
								title: '防盗门组装',
								goods_id: '1667798682410304688',
								sku_id: ''
							},
							{
								title: '防火门组装',
								goods_id: '1667799146749877849',
								sku_id: ''
							},
							{
								title: '旋转门组装',
								goods_id: '1667799214168049053',
								sku_id: ''
							},
							{
								title: '推拉门组装',
								goods_id: '1667799263138228861',
								sku_id: ''
							},
							{
								title: '玻璃门组装',
								goods_id: '1667798882098380337',
								sku_id: ''
							},
							{
								title: '铝合金门组装',
								goods_id: '1667799084109101395',
								sku_id: ''
							}
						]
					},
				],
				jinJiShuTong: [{
						title: '厕所疏通',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/eab6a098-e673-45af-886f-678fd7dbdb35.png',
						service: [{
								title: '马桶疏通',
								goods_id: '1667791786144404291',
								sku_id: '63631a77ce2777000195e0fe'
							},
							{
								title: '蹲便疏通',
								goods_id: '1667791274145872462',
								sku_id: ''
							},
							{
								title: '小便斗疏通',
								goods_id: '1667794393242058932',
								sku_id: ''
							},
							{
								title: '地漏疏通',
								goods_id: '1667791626022810021',
								sku_id: ''
							},
						]
					},
					{
						title: '洗浴疏通',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/cc68630b-7ac7-4123-9d41-c3adf91ac4d2.jpeg',
						service: [{
								title: '洗手盆疏通',
								goods_id: '1667791066247345462',
								sku_id: ''
							},
							{
								title: '浴缸疏通',
								goods_id: '1667791459361398708',
								sku_id: ''
							}
						]
					},
					{
						title: '厨房疏通',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/50fe7839-fdcb-4236-b661-9d8392c672f3.jpeg',
						service: [{
								title: '洗菜盆疏通',
								goods_id: '1667376462870291812',
								sku_id: ''
							},
							{
								title: '地漏疏通',
								goods_id: '1667791626022810021',
								sku_id: ''
							}
						]
					}
				],
				kaiSuoHuanSuo: [{
						title: '开锁',
						img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-9996c376-000d-4ad5-a52d-549d0e9c9ce6/1a6d5c7a-8008-4903-8e7a-39852d22dbdf.png',
						service: [{
								title: '家具锁开锁',
								goods_id: '1667795673005273931',
								sku_id: '63688b0d188fab0001018733'
							},
							{
								title: '房门锁开锁',
								goods_id: '1667795673005273931',
								sku_id: '63688b0d188fab0001018734'
							},
							{
								title: '车门锁开锁',
								goods_id: '1667795673005273931',
								sku_id: '63688b0d188fab0001018735'
							}
						]
					}
				],
			}
		},
		methods: {
			changeTab(index) {
				this.tabIndex = index;
			},
			toCategory() {
				this.$api.tocategory();
			},
			toOrderCreate(goods_id, sku_id) {
				console.log(goods_id, sku_id);
				uni.navigateTo({
					url: `/sub_pages_1/order/create?goods_id=${goods_id}&sku_id=${sku_id || ''}`
				});
			},
			showDetailService(item, index) {
				console.log(item);
				this.serviceIndexx = index;
				this.concreteService = item.service;
				this.isChecked = 1;
				this.$nextTick(() => {
					uni.pageScrollTo({
						selector: "#service",
						duration: 100,
					})
				});
			}
		}
	}
</script>

<style>

</style>
