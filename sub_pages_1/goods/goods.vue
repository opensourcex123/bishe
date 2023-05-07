<template>
    <view>
        <!-- 01. 轮播区 -->
        <view class="swiper-area w-full pos-f">
            <swiper class="h-full pos-r" indicator-dots circular="true" duration="400">
                <swiper-item v-for="(item, index) in swiperDatas" :key="index">
                    <view class="wh-full">
                        <image :src="item.url" class="wh-full loaded" lazy-load="true" mode="aspectFill"></image>
                    </view>
                </swiper-item>
            </swiper>
        </view>

        <!-- 02. 商品数据区 -->
        <view class="goods-area bg-main padding">
            <view class="price-box dflex-b">
                <view>
                    <text class="price fwb fs-big">{{ goods.price / 100 || '' }}{{ goods.unit }}</text>
                </view>
            </view>
            <text class="title fs">{{ goods.name || '' }}</text>
        </view>
        <!-- <view class="gap"></view> -->

        <!-- 03. 分类区 -->
        <view class="flex justify-center align-center" style="width: 100%;background-color: white;"
            v-if="skuDatas.length !== 0">
            <scroll-view class="scroll-view_H" scroll-x="true">
                <view @click="selectSKU(item, index)" v-for="(item, index) in skuDatas" :key="index" 
				class="category"
                :style="choiceIndex === index ? 'border: 5rpx solid #F76560;': ''">
                    <text class="category-name">
                        {{item.name}}
                    </text>
                    <view>
                        <text class="category-price">{{item.price / 100}}</text>
                        <text style="color: #F76560;">{{item.unit}}</text>
                    </view>
                </view>
            </scroll-view>
        </view>

        <!-- 04.02 服务标签 -->
        <view v-if="tagDatas.length > 0" class="bg-main padding-lr padding-top padding-bottom-xs pos-r" @click="tagShow = true">
            <view class="dflex dflex-wrap-w">
                <view v-for="(item, index) in tagDatas" :key="index" class="margin-right-sm margin-bottom-sm dflex">
                    <view class="iconfont iconyiwancheng- fwb fs-xs ft-base margin-right-xs"></view>
                    <text class="fs-xs">{{ item.name }}</text>
                </view>
            </view>
            <view class="icon-detail pos-a">
                <view class="iconfont iconxiangqing ft-dark fs-sm"></view>
            </view>
        </view>
        <view class="gap"></view>
        <!-- 04.02 服务标签弹出层 -->
        <use-popup mode="bottom" v-model="tagShow">
            <view class="tac w-full padding-sm">服务说明</view>
            <view class="padding-lr padding-bottom-sm">
                <view v-for="(item, index) in tagDatas" :key="index"
                    class="margin-right-sm margin-bottom-sm dflex dflex-s">
                    <view class="iconfont iconyiwancheng- fwb fs ft-base margin-right-xs"></view>
                    <view>
                        <view class="fs-sm">{{ item.name }}</view>
                        <view class="fs-xs">服务标签对应的描述</view>
                    </view>
                </view>
            </view>
        </use-popup>

        <!-- 05.01 服务信息 填写地址 -->
        <use-list-title v-if="!(addrData && addrData._id)" color="#3491FA" title="选择上门地址" iconfont="iconfont-1 icon-map"
            @goto="toaddr"></use-list-title>
        <view v-else class="padding dflex-b bg-main" @click="toaddr">
            <view class="dflex">
                <view class="iconfont-1 icon-map margin-right ft-main" style="color: #3491FA;"></view>
                <view class="w-full dflex-wrap-w">
                    <view class="margin-bottom-xs">
                        <text>{{ addrData.address }} {{ addrData.addr_detail }}</text>
                    </view>
                    <view>
                        <text>{{ addrData.consignee }}</text>
                        <text class="margin-left">{{ addrData.mobile }}</text>
                    </view>
                </view>
            </view>

            <view class="iconfont iconjiantou-01 fs-sm"></view>
        </view>

        <!-- 05.02 上门时间填写 -->
        <use-list-title :title="chooseTime + ' 上门'" color="#3491FA" iconfont="iconfont-1 icon-ontimeshipment"
            @goto="showTime = true">
        </use-list-title>

        <view>
            <u-picker :show="showTime" title="选择上门时间" ref="uPicker" :columns="timeColumns" @confirm="confirm"
                @change="changeHandler" @cancel="close">
            </u-picker>
        </view>
        <view class="gap"></view>

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
                    @click="tabChange">
                </u-tabs>
            </u-sticky>

            <!-- 05. 评价区 -->
            <view class="evaluate-area" v-if="evaluateDatas.length === 0">
                <use-list-title :title="evaluateTitle" tip="好评率 100%" color="#ff6a6c" iconfont=" " @goto="toevaluate">
                </use-list-title>
                <view class="padding-lr bg-main">
                    <view class="eva-box dflex-s padding-bottom-lg" v-for="(item, index) in evaluateDatas" :key="index">
                        <image class="portrait border-radius-c" :src="item.member_headimg"></image>
                        <view class="right-area flex1 padding-left-sm">
                            <view class="dflex-b ft-dark">
                                <view class="dflex">
                                    <text class="name margin-right">{{ item.member_name }}</text>
                                    <use-rate :value="item.review_cnt" disabled></use-rate>
                                </view>
                                <text class="time fs-xs">{{ $api.format(item.create_time, 'yyyy-MM-dd') }}</text>
                            </view>
                            <view class="fs-sm ft-main padding-top-xs padding-bottom-sm">{{ item.review_content }}
                            </view>
                            <view class="dflex dflex-wrap-w">
                                <image class="" mode="widthFix" v-for="(img, i) in item.review_imgs" :lazy-load="true"
                                    :key="i" :src="img" @click="preview(item.review_imgs, img)"></image>
                            </view>
                            <view class="">
                                <text class="fs-xs ft-dark">{{ item.goods_type || '套餐1' }}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="gap"></view>
            </view>

            <!-- 06. 详情区 -->
            <view class="detail-area bg-main">
                <view class="d-header padding dflex-c"><text>图文详情</text></view>
                <rich-text class="pro-detail" :nodes="html_nodes"></rich-text>
            </view>
            <view class="gap"></view>

            <!-- 收费标准 -->
            <view id="charge_standard" class="detail-area bg-main" v-if="Object.keys(goods).length !== 0">
                <view class="d-header padding dflex-c"><text>收费标准</text></view>
                <u-collapse :value="[goods.charge_standard[0].big_title]">
                    <u-collapse-item v-for="(item, index) in goods.charge_standard" :key="index" :title="item.big_title"
                        :name="item.big_title">
                        <view v-for="(item1, index1) in item.sort" :key="index1" class="dflex-s dflex-flow-c"
                            :class="(index1 + 1) % item.sort.length == 0 ?'':'margin-bottom'">
                            <view class="dflex-b w-full">
                                <text>{{item1.small_title}}</text>
                                <text>{{item1.price}}{{item1.unit}}</text>
                            </view>
                            <text style="color: grey; margin-top: 5rpx;">{{item1.content}}</text>
                        </view>
                        <!-- <text class="u-collapse-content">涵盖uniapp各个方面，给开发者方向指导和设计理念，让您茅塞顿开，一马平川</text> -->
                    </u-collapse-item>
                </u-collapse>
            </view>
        </view>

        <!-- 07. 操作区 -->
        <view class="oper-area pos-f dflex-b w-full padding-lr-sm">
            <view class="btn-area dflex dflex-flow-c" @click="tohome">
                <text class="iconfont iconshouye-1"></text>
                <text>首页</text>
            </view>
            <view class="btn-area dflex dflex-flow-c" :class="{ active: favorite }" @click="toCart">
                <text class="iconfont icongouwuche-"></text>
                <text>购物车</text>
            </view>
			<button class="btn no-border dflex" @click="showAddOrderModal">
			    <view class="btn-area dflex-c dflex-flow-c">
			        <text class="iconfont iconjia"></text>
			        <text>加单</text>
			    </view>
			</button>
            <view class="flex1 btn-container dflex-b border-radius-big">
                <view class="tac padding-tb-sm flex1 bg-warn" @click="tocart(goods)">加入购物车
                </view>
                <view class="tac padding-tb-sm flex1 bg-base" @click="tobuy(goods)">立即预约
                </view>
            </view>
        </view>

		<view class="cu-modal" :class="showModal ? 'show':''" v-if="showModal">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">请选择加单方式</view>
					<view class="action" @tap="showModal = false"><text class="cuIcon-close text-grey"></text></view>
				</view>
				<view class="padding-xl flex flex-direction"> 
					<view class="flex justify-around">
						<u-radio-group 
						    v-model="plusOrderWay"
						    placement="row">
							<u-radio
								  :customStyle="{marginBottom: '8px'}"
							      v-for="(item, index) in ['客户加单','工程师加单']"
							      :key="index"
							      :label="item"
							      :name="item"
							      @change="radioChange"
							    >
							    </u-radio>
						</u-radio-group>
					</view>
					<view class="flex justify-around">
						<button class="cu-btn lg margin-top" @click="cancelOrder">取消</button>
						<button class="cu-btn bg-blue lg margin-top" @click="confirmOrder">确认</button>
					</view>
				</view> 
			</view> 
		</view>
        <!-- 置顶 -->
        <use-totop ref="usetop" bottom="120"></use-totop>
    </view>
</template>

<script>
    // #ifdef MP-ALIPAY
    import aliParse from 'mini-html-parser2';
    // #endif

    // 收获人地址
    const _address = 'usemall-member-address'

    export default {
        data() {
            return {
				showModal: false,
				plusOrderWay: '客户加单',
				checkedOrder: -1,
                list: [{
                        name: "用户评价"
                    },
                    {
                        name: "服务内容"
                    },
                    {
                        name: "收费标准"
                    }
                ],
                // 选中分类的序号
                choiceIndex: 0,
                // 商品ID
                id: 0,
                // 分享ID
                mid: 0,
                // 商品数据
                goods: {},
                // 轮播图
                swiperDatas: [],
                // SKU
                sku: {},
                skuDatas: [],
                // 分享
                shareShow: false,

                // 服务标签
                tagShow: false,
                tagDatas: [],

                // 服务信息, 时间, 地址
                showTime: false,
                timeColumns: [],
                timeData: [],
                chooseTime: "",
                addrData: {},

                // 商品评价
                evaluateDatas: [],
                evaluateTitle: '评价',
                // 商品详情
                html_nodes: '',
                // 收藏
                favorite: false,

                scrollTop: 0
            };
        },
        watch: {
            sku(e) {
                this.goods.price = e.price;
                this.goods.stock_num = e.num;
                this.goods.unit = e.unit;
                this.goods.name = e.name;
            }
        },
        onPageScroll(e) {
            //this.scrollTop = e.scrollTop;
            this.$refs.usetop.change(e.scrollTop);
        },
        onLoad(options) {
            console.log('onload opts', options);

            if (options) {
                this.mid = options.mid || '';
                if (options.id) {
                    this.id = options.id;
                } else if (options.q) {
                    let query = decodeURIComponent(options.q) || decodeURIComponent(uni.getStorageInfoSync(
                        '__scene_query_q'));
                    this.resolveQueryq(query);
                }
            }

            if (!this.id) {
                this.$api.msg('商品ID无效');
                return;
            }

            this.initTime();

            uni.$on('__event_choice_address', data => {
                this.addrData = data;
            })
        },

        onShow(options) {
            if (!this.id) {
                const query = decodeURIComponent(uni.getStorageInfoSync('__scene_query_q'));
                this.resolveQueryq(query);
            }
			
			this.showModal = false;
            this.loadData();
        },

        methods: {
			radioChange(name) {
				this.plusOrderWay = name;
				console.log(this.plusOrderWay)
			},
			// 打开加单modal
			showAddOrderModal() {
				if (!this.loginCheck()) return;
				
				this.showModal = true;
			},
            confirmOrder() {
				uni.navigateTo({
				    url: `/sub_pages_1/order/choose-plus-order?plus_way=${this.plusOrderWay}&goods_id=${this.id}&sku_id=${this.sku.id || ''}`
				});
			},
			cancelOrder() {
				this.showModal = false;
			},
			toaddr() {
                uni.navigateTo({
                    url: '/sub_pages_1/user/address/address?source=1',
                    complete() {}
                });
            },

            close() {
                this.showTime = false
            },

            // 初始化上门时间参数
            initTime() {
                this.timeColumns = []
                this.timeData = []

                var date = new Date()
                let timeDateList = []
                let timeHourList = []
                let currentHour = date.getHours() + 2
                let initHour = 0
                let initDay = 0
                let interval = ""

                if (currentHour <= 9) {
                    initHour = 9
                } else {
                    initHour = currentHour
                }

                if (currentHour >= 23) {
                    initDay = date.getDate() + 1
                } else {
                    initDay = date.getDate()
                }

                for (let i = 0; i < 7; i++) {
                    timeDateList.push((date.getMonth() + 1) + "月" + initDay + "日")
                    date = date.setDate(initDay + 1);
                    date = new Date(date);
                    initDay = date.getDate()
                }

                if (initHour >= 23) {
                    timeHourList = ["9:00~10:00", "10:00~11:00", "11:00~12:00", "12:00~13:00", "13:00~14:00",
                        "14:00~15:00",
                        "15:00~16:00",
                        "16:00~17:00", "17:00~18:00", "18:00~19:00", "19:00~20:00", "20:00~21:00", "21:00~22:00"
                    ]
                } else {
                    for (initHour; initHour < 22; initHour++) {
                        interval = initHour + ":00" + "~" + (initHour + 1) + ":00"
                        timeHourList.push(interval)
                    }
                }

                this.timeColumns.push(timeDateList)
                this.timeColumns.push(timeHourList)
                this.timeData.push(timeHourList)
                this.timeData.push(["9:00~10:00", "10:00~11:00", "11:00~12:00", "12:00~13:00", "13:00~14:00",
                    "14:00~15:00",
                    "15:00~16:00",
                    "16:00~17:00", "17:00~18:00", "18:00~19:00", "19:00~20:00", "20:00~21:00", "21:00~22:00"
                ])
                this.chooseTime = [timeDateList[0], timeHourList[0]].join(" ")

                if (this.addrData && this.addrData._id) return;
                this.$db[_address].where('create_uid == $env.uid').where("is_default == '是'").tofirst()
                    .then(res => {
                        console.log('res', res);
                        if (res && res.code === 200) {
                            this.addrData = res.datas;
                        }
                    })
            },

            changeHandler(e) {
                const {
                    columnIndex,
                    value,
                    values, // values为当前变化列的数组内容
                    index,
                    // 微信小程序无法将picker实例传出来，只能通过ref操作
                    picker = this.$refs.uPicker
                } = e

                if (columnIndex === 0 && index === 0) {
                    // picker为选择器this实例，变化第二列对应的选项
                    picker.setColumnValues(1, this.timeData[0])
                } else if (columnIndex === 0 && index != 0) {
                    picker.setColumnValues(1, this.timeData[1])
                }
            },

            // 回调参数为包含columnIndex、value、values
            confirm(e) {
                this.chooseTime = e.value.join(" ")
                this.showTime = false
            },

            async loadData() {

                await this.$func.usemall
                    .call('goods/detail', {
                        goods_id: this.id,
                        share_mid: this.mid
                    })
                    .then(res => {
                        if (res.code === 200) {
                            // 商品评价
                            this.evaluateDatas = res.datas.evaluate;
                            if (res.datas.evaluate_cnt) this.evaluateTitle = `评价(${res.datas.evaluate_cnt})`;

                            if (typeof res.datas.goods.imgs === 'string') {
                                this.swiperDatas = res.datas.goods.imgs.split(',').filter(x => x);
                            } else {
                                this.swiperDatas = res.datas.goods.imgs;
                            }
                            this.goods = res.datas.goods;
                            // 商品详情
                            let __goods_detail = res.datas.goods_detail;
                            // #ifndef MP-ALIPAY
                            this.html_nodes = __goods_detail.desc_mobile;
                            // #endif

                            // #ifdef MP-ALIPAY
                            this.html_nodes = [];
                            aliParse(__goods_detail.desc_mobile.replace(/"><*/gi, '"/><'), (err, nodes) => {
                                if (!err) {
                                    this.html_nodes = nodes;
                                }
                            });
                            // #endif

                            // 商品SKU
                            console.log("sku:", res.datas.goods_skus);
                            let __goods_skus = res.datas.goods_skus;
                            if (__goods_skus.length > 0) {
                                let __skuDatas = [];
                                __goods_skus.forEach((sku, index) => {
                                    // 	{ id: 1, name: '45寸（大规格）', price: 788, market_price: 999, num: 0, selected: !0 },
                                    __skuDatas.push({
                                        id: sku._id,
                                        sku: sku.goods_sku,
                                        name: sku.spec,
                                        unit: sku.unit,
                                        price: sku.price,
                                        market_price: sku.market_price || this.goods
                                            .market_price,
                                        num: sku.stock_num,
                                        selected: index == 0
                                    });
                                });
                                this.skuDatas = __skuDatas;
                            }

                            // SKU
                            if (this.skuDatas.length > 0) {
                                this.sku = this.skuDatas[0];
                            }

                            // 服务标签
                            if (typeof this.goods.tags === 'string') {
                                this.goods.tags = this.goods.tags.split(',').filter(x => x);
                            }

                            let __tagDatas = [];

                            this.goods.tags.forEach((data, index) => {
                                __tagDatas.push({
                                    name: data,
                                    selected: index == 0
                                });
                            });

                            this.tagDatas = __tagDatas;

                            // 收藏状态
                            this.favorite = this.goods.collected === 1;
                            return;
                        }
                        this.$api.msg(res.msg);
                    });
            },
            // 处理 query q 数据
            resolveQueryq(query) {
                const arr = query
                    .split('/')
                    .slice(-1)[0]
                    .split('_');
                if (arr.length == 2) this.mid = arr[1];
                this.id = arr[0];
            },
            // 图片预览
            preview(imgs, cur) {
                if (!imgs) return;

                uni.previewImage({
                    urls: imgs,
                    current: cur,
                    longPressActions: {
                        itemList: ['发送给朋友', '保存图片', '收藏'],
                        success: function(data) {
                            console.log(res);
                        },
                        fail: function(err) {
                            console.log(err);
                        }
                    }
                });
            },

            // 打开分享
            shareOpen() {
                if (!this.loginCheck()) return;

                this.shareShow = true;
            },

            // 商品SKU
            selectSKU(res, index) {
                this.choiceIndex = index;
                this.skuDatas.forEach(item => {
                    if (res.sku == item.sku) {
                        this.$set(item, 'selected', true);
                    } else {
                        this.$set(item, 'selected', false);
                    }
                });

                this.sku = res;
            },

            // 评论
            toevaluate() {
                uni.navigateTo({
                    url: `/sub_pages_1/goods/goods-evaluate?id=${this.id}`
                });
            },
            // 首页
            tohome() {
                this.$api.tohome();
            },
            checkSource() {
                uni.navigateTo({
                    url: "/sub_pages_1/goods/trace-source/trace-source"
                })
            },
            // 加入购物车
            tocart(params) {
                if (!this.loginCheck()) return;

                this.$func.usemall
                    .call('goods/addcart', {
                        goods_id: params._id,
                        goods_num: 1,
                        goods_sku: this.sku.id
                    })
                    .then(res => {
                        if (res.code === 200) {
                            this.$api.msg(res.datas.msg);
                            return;
                        }

                        this.$api.msg(res.msg);
                    });
            },

            // 前往购物车页
            toCart() {
                this.$api.tocart();
            },
            // 立即购买
            tobuy(item) {
                let _this = this;
                if (!this.loginCheck()) return;

                let addr = JSON.stringify(this.addrData);

                uni.navigateTo({
                    url: `/sub_pages_1/order/create?goods_id=${this.id}&sku_id=${this.sku.id || ''}&addr=${addr}&time=${this.chooseTime}`
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
            tabChange(item) {
                switch (item.index) {
                    case 0:
                        this.$nextTick(() => {
                            uni.pageScrollTo({
                                selector: ".evaluate-area",
                                duration: 300,
                            });
                        });
                        break;
                    case 1:
                        this.$nextTick(() => {
                            uni.pageScrollTo({
                                selector: ".detail-area",
                                duration: 300,
                            });
                        });
                        break;
                    case 2:
                        this.$nextTick(() => {
                            uni.pageScrollTo({
                                selector: "#charge_standard",
                                duration: 300,
                            });
                        });
                        break;
                }
            }
        }
    };
</script>

<style lang="scss">
    page {
        background: $page-color-base;
        padding-bottom: 120rpx;
    }

	.u-radio-group--row.data-v-97ce24d6 {
		justify-content: space-around;
	}

	.solids::after {
		border: 8upx solid #1890ff;
	}
	
    .u-cell__title-text {
        font-size: $font-base + 2upx !important;
        font-weight: bolder;
    }

    .u-collapse-content {
        font-size: $font-base + 1upx !important;
    }

    contact-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
    }

    .fixed-top {
        bottom: 230rpx;
    }

    /* 01. 轮播区 */
    .swiper-area {
        height: 720rpx;
        top: 0;
        z-index: -1;
    }

    /* #ifndef MP */
    .swiper-area {
        margin-top: calc(44px + env(safe-area-inset-top));
        margin-top: 44px;
    }

    /* #endif */

    /* #ifdef APP-PLUS */
    .swiper-area {
        margin-top: 0;
    }

    /* #endif */

    /* 02. 商品数据区 */
    .goods-area {
        margin-top: 720rpx;

        .price-box {
            display: flex;
            align-items: baseline;
        }

        .title {
            color: $font-color-dark;
            height: 46rpx;
            line-height: 46rpx;
        }
    }

    .share-area {
        .vertical-line {
            right: 50%;
            height: 40%;
        }
    }

    /* 03. 分类区 */

    .scroll-view_H {
        white-space: nowrap;
        width: 100%;
        padding: 10rpx;
    }

    .category {
        display: inline-block;
        background-color: white;
        border: 3rpx solid #C9CDD4;
        border-radius: 15rpx;
        padding: 20rpx 70rpx 20rpx 20rpx;
        margin: 10rpx 10rpx;
    }

    .category-name {
        padding-bottom: 5rpx;
        font-size: 30rpx;
    }

    .category-price {
        padding-top: 5rpx;
        font-size: 40rpx;
        color: red;
    }

    /* 05.服务信息 */
    .u-form-item__body__left__content__label {
        font-size: 10rpx;
        width: 20%;
        border: 5rpx solid #5EDFD6;
    }


    /* 03. 规格区 */
    .sku-area .active {
        background: $base-color;
        color: #fff !important;
    }

    /* 04. 服务区 */
    .icon-detail {
        right: 30rpx;
        top: 24rpx;
    }

    /* 05. 评价 */
    .evaluate-area {
        .portrait {
            flex-shrink: 0;
            width: 80rpx;
            height: 80rpx;
        }

        .right-area {
            image {
                margin-right: 10rpx;
                margin-bottom: 10rpx;
                height: 200rpx;
                width: 30%;
            }
        }
    }

    /* 06. 详情区 */
    .detail-area {
        .d-header {
            font-size: $font-base + 2upx;
            color: $font-color-dark;
            position: relative;

            text {
                padding: 0 20rpx;
                background: #fff;
                position: relative;
                z-index: 1;
            }

            &:after {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translateX(-50%);
                width: 300rpx;
                height: 0;
                content: '';
                border-bottom: 1px solid #ccc;
            }
        }

        /* 产品详情 */
        .pro-detail {
            width: 100%;
            overflow: hidden;
            -webkit-touch-callout: none;

            img {
                width: 100%;
                max-width: 100%;
                overflow: hidden;
            }
        }
    }

    /* 07. 操作区 */
    .oper-area {
        left: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 0 20rpx 0 #f0f0f0;
        height: 100rpx;
        z-index: 1000;

        .btn-area {
            font-size: $font-sm;
            color: $font-color-base;
            width: 96rpx;

            .iconfont {
                font-size: 40rpx;
                line-height: 48rpx;
            }
        }
    }

    /* 优惠券区 */
    .coupon-area {
        max-height: 60vh;
        min-height: 30vh;

        .coupon-item {
            margin-bottom: 20rpx;

            &:last-child {
                margin-bottom: 0;
            }

            .content {
                &:after {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    content: '';
                    width: 100%;
                    height: 0;
                    border-bottom: 1px dashed #f3f3f3;
                    transform: scaleY(50%);
                }
            }

            .circle {
                position: absolute;
                bottom: -10rpx;
                z-index: 10;
                width: 20rpx;
                height: 20rpx;
                background: #f5f5f5;
                border-radius: 50%;

                &.r {
                    right: -6rpx;
                }

                &.l {
                    left: -6rpx;
                }
            }
        }
    }



    .origin-card {
        width: 95%;
        height: 70upx;
        border-radius: 10px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
        background-color: #5EDFD6;
    }
</style>
