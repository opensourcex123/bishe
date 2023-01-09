<script>
	/**
	 * vuex 管理登陆状态，具体可以参考官方登陆模板示例
	 */
	import $db from './common/db.js';
	import $func from './common/func.js';
	import $api from './common/common.js';
	const db = uniCloud.database();
	const uniIdCo = uniCloud.importObject('uni-id-co', {
		customUI: true
	});
	import uniIdPageInit from '@/sub_pages_2/uni-id-pages/init.js';

	export default {
		globalData: {
			cid: '633e3349f74ea000011e66ef',
			cosUrl: 'https://jiadianweixiu-1302510758.cos.ap-beijing.myqcloud.com'
		},
		data() {
			return {
				timer: null,
				goodsDatas: [],
				skills: [],
				addrData: {}
			};
		},
		methods: {
			// 根据服务的cid获取类型名称
			getCategory(goods) {
				let _this = this;
				this.skills = [];
				return new Promise(async (resolve, reject) => {
					for (var i = 0; i < goods.length; i++) {
						const good = goods[i];
						this.skills.push(good.name);
						const res = await db
							.collection('usemall-goods-category')
							.where({
								_id: good.cid
							})
							.get();
						this.skills.push(res.result.data[0].name);
						const res1 = await db
							.collection('usemall-goods-category')
							.where({
								_id: res.result.data[0].pid
							})
							.get();
						this.skills.push(res1.result.data[0].name);
					}
					resolve(this.skills);
				});
			},
			async getEngineerOrderCount(engineer_id, order_id) {
				const timeRes = await db
					.collection('usemall-order')
					.where({
						order_id: order_id
					})
					.get();
				let start = new Date(timeRes.result.data[0].start_time).setHours(0, 0, 0, 0);
				let end = new Date(timeRes.result.data[0].end_time).setHours(23, 59, 59, 999);
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
			sendMessageToEngineer(phone) {
				uni.request({
					url: 'https://home-service.joyteck.cn/voice_notice',
					method: 'POST',
					data: {
						phone: phone
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log(res);
					},
					fail(err) {
						console.log(err);
					}
				});
			},
			// 重新分配工程师，并且过滤之前工程师，打电话并修改order里的enginerr——id
			async reassignEngineer(order_id, engineer_id) {
				let _this = this;
				let filter_1 = [];
				let goods = [];

				const goodsRes = await db
					.collection('usemall-order-detail')
					.where({
						order_id: order_id
					})
					.get();
				const orderRes = await db
					.collection('usemall-order')
					.where({
						order_id: order_id
					})
					.get();
				const addrRes = await db
					.collection('usemall-member-address')
					.where({
						_id: orderRes.result.data[0].addr_id
					})
					.get();

				for (var i = 0; i < goodsRes.result.data.length; i++) {
					const goods_id = goodsRes.result.data[i].goods_id;
					const good = await db
						.collection('usemall-goods')
						.where({
							_id: goods_id
						})
						.get();
					goods.push(good.result.data[0]);
				}
				await this.getCategory(goods);
				let engineers = await db
					.collection('engineers')
					.where({
						point: db.command.geoNear({
							geometry: new db.Geo.Point(parseFloat(addrRes.result.data[0].longitude),
								parseFloat(addrRes.result.data[0].latitude))
						}),
						status: 1,
						audit_status: 1,
						skill: db.command.in(this.skills)
					})
					.get();
				const engineerList = engineers.result.data;
				for (var i = 0; i < engineerList.length; i++) {
					const engineer = engineerList[i];
					let count = await _this.getEngineerOrderCount(engineer.user_id, order_id);
					if (count < engineer.limit) {
						filter_1.push(engineer);
					}
				}
				const filterEngineer = filter_1.filter(engineer => engineer.user_id !== engineer_id);
				if (filterEngineer.length === 0) {
					$api.msg('当前无空闲工程师，请稍等');
					return;
				}
				const newEngineer = filterEngineer[0];
				console.log('newEngineer:', newEngineer);
				// 打电话 newEngineer.phone
				this.sendMessageToEngineer(newEngineer.phone);
				// 更新order的engineer_id
				db.collection('usemall-order')
					.where({
						order_id: order_id
					})
					.update({
						engineer_id: newEngineer.user_id,
						state: '待接单',
						last_modify_time: new Date().getTime()
					});
				// 给工程师发事件
				const res1 = await db
					.collection('uni-id-device')
					.where({
						user_id: newEngineer.user_id
					})
					.get();
				this.pushMsg(res1.result.data[0].push_clientid, '新订单', '您有新的订单，请注意查收', {
						engineer_id: newEngineer.user_id,
						order_id: order_id
					}, order_id)
					.then(res => {
						console.log(res);
					});
			},
			// 给工程师发消息
			sendMsgToEngineer(engineer_id, title, content, nav) {
				$db['engineers-msg'].add({
					user_id: engineer_id,
					title: title,
					content: content,
					nav: nav,
					create_time: Date.now()
				});
			},

			// 发送unipush和加log
			pushMsg(cid, title, content, payload, order_id) {
				const user = uni.getStorageSync('uni-id-pages-userInfo');
				const p1 = $func.usemall.call('unipush/create', {
						cid: cid,
						title: title,
						content: content,
						payload: payload
					})
				
	
				const p2 = $db['unipush-log'].add({
					push_clientid: Array.isArray(cid) ? cid.join(",") : cid,
					title: title,
					content: content,
					payload: payload,
					order_id: order_id
				})
				return Promise.all([p1, p2]);
			}
		},
		onLaunch: async function(options) {
			await uniIdPageInit();
			const user = uni.getStorageSync('uni-id-pages-userInfo');
			if (!user) {
				if (uni.getSystemInfoSync().platform === 'ios') {
					// #ifdef MP-WEIXIN
					  uni.navigateTo({
					  	url: '/sub_pages_2/uni-id-pages/pages/login/login-withoutpwd?type=weixin'
					  });
					// #endif
					
					// #ifdef APP-PLUS
					uni.navigateTo({
						url: '/sub_pages_2/uni-id-pages/pages/login/login-withoutpwd?type=apple'
					});
					// #endif
				} else {
					uni.navigateTo({
						url: '/sub_pages_2/uni-id-pages/pages/login/login-withoutpwd?type=weixin'
					});
				}
			}

			let _this = this;
			uni.onPushMessage(res => {
				switch (res.data.title) {
					case '维修完成':
						$db['usemall-order']
							.where({
								order_id: res.data.payload.order_id
							})
							.tofirst()
							.then(res1 => {
								_this.sendMsgToEngineer(
									res1.datas.engineer_id,
									'维修完成',
									'您的订单已维修完成',
									`/sub_pages_1/enginner/my/orders/details/details?id=${res.data.payload.order_id}`
								);
							});
						uni.showModal({
							content: '您有新的订单待支付，请点击确认跳转支付页面！',
							showCancel: false,
							success() {
								uni.navigateTo({
									url: '/sub_pages_1/user/order/order-detail?order_id=' + res
										.data.payload.order_id
								});
							}
						});
						break;
					case '订单更新':
						uni.$emit('qrcode_updated', res.data.payload);
						break;
					case '报价推送':
						uni.navigateTo({
							url: `/sub_pages_2/uni-id-pages/pages/modal?data=${JSON.stringify(res.data.payload)}`
						});
						break;
					case '报价确认':
						uni.$emit('price_confirm_res', res.data.payload);
						break;
					case '新订单':
						uni.showModal({
							content: '📢您有新的订单，请及时查看',
							showCancel: false,
							success() {
								uni.navigateTo({
									url: '/sub_pages_1/enginner/home/home'
								});
							}
						});
						break;
					case '订单超时':
						$api.msg('您的订单已超时，但暂无匹配工程师，请耐心等待');
						break;
					case '工程师分配':
						$api.msg('您的订单已超时，已为您分配新的工程师');
						break;
					case '定金推送':
						const payload = res.data.payload;

						// 定金价格有问题，请重新协商
						$db['usemall-order']
							.where({
								order_id: payload.order_id
							})
							.tofirst()
							.then(res => {
								if (payload.price * 100 >= res.datas.order_actural_paid) {
									$api.msg('定金价格有问题，请重新协商');
									return;
								}

								// 将定金更新到order-detail里
								$db['usemall-order-detail']
									.where({
										order_id: payload.order_id,
										goods_id: payload.goods_id,
										goods_sku_id: payload.goods_sku_id
									})
									.update({
										front_money: payload.price * 100
									});
								$func.usemall.call('order/updateActualPaid', {
									order_id: payload.order_id,
									price: -payload.price
								});

								if (payload.price === 0) {
									uni.showModal({
										content: '定金为0',
										showCancel: false
									});
									return;
								}
								uni.showModal({
									content: '请点击确认前往支付定金页面',
									showCancel: false,
									success() {
										uni.navigateTo({
											url: `/sub_pages_1/pay/pay-front?money=${payload.price}&user_id=${payload.user_id}&order_id=${payload.order_id}`
										});
									}
								});
							});
						break;
					case '定金支付':
						uni.$emit('earnest_success');
						break;
					case '订单协助':
						uni.showModal({
							title: '提示',
							content: res.data.content,
							success() {
								uni.navigateTo({
									url: '/sub_pages_1/enginner/home/item-details/item-details?id=' +
										res.data.payload.order_id
								});
							}
						});
						break;
				}
			});

			if (uni.canIUse('getUpdateManager')) {
				const updateManager = uni.getUpdateManager();

				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					console.log(res.hasUpdate);
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function(res) {
							uni.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success(res) {
									if (res.confirm) {
										// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate();
									}
								}
							});
						});

						updateManager.onUpdateFailed(function(res) {
							// 新的版本下载失败
						});
					}
				});
			}

			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
				console.log('设备版本号=====》', widgetInfo.version);
				$func.usemall.call('order/getVersion', {	
					current_version: widgetInfo.version
				}).then(res => {
					console.log('获取版本号=====》', res)
					var data = res.datas;
					if (data.update) {
						$api.msg('正在更新中');
						uni.downloadFile({
							url: data.url,
							success: (downloadResult) => {
								if (downloadResult.statusCode === 200) {
									plus.runtime.install(downloadResult.tempFilePath, {
										force: false
									}, function() {
										console.log('install success...');
										plus.runtime.restart();
									}, function(e) {
										console.error('install fail...', e);
									});
								}
							}
						});
					}
				})
			});
			// #endif

			// this.loadToken();
			if (user) {
				console.log('user_id#################', user);
				uni.getPushClientId({
					success: res => {
						let pushClientId = res.cid;
						const db = uniCloud.database();
						console.log('客户端标识：', pushClientId);
						db.collection('uni-id-device')
							.where({
								user_id: user._id
							})
							.update({
								push_clientid: pushClientId
							})
							.then(res1 => {
								console.log(res1);
							});
					},
					fail(err) {
						console.log(err);
					}
				});
			}

			// 监听事件
			uni.$on('create_order', (order_id, engineer_id, goods_datas, addr_data) => {
				this.goodsDatas = goods_datas;
				this.addrData = addr_data;

				// 给工程师信息表发信息
				_this.sendMsgToEngineer(engineer_id, '新订单', '您有新的订单，请注意查收',
					`/sub_pages_1/enginner/home/item-details/item-details?id=${order_id}`);

				uni.request({
					url: 'https://home-service.joyteck.cn/reassign_engineer',
					// url: 'http://127.0.0.1:8888/reassign_engineer',
					method: 'POST',
					data: {
						order_id: order_id,
						engineer_id: engineer_id,
						cid: goods_datas[0].goods.cid,
						name: goods_datas[0].goods.name,
						longitude: addr_data.longitude,
						latitude: addr_data.latitude
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log('asdfgads神功远程');
					},
					fail(err) {
						console.log('GGGG', err);
					}
				});
			});
		},
		onShow: function(options) {
			// #ifdef MP-WEIXIN
			// this.mpWeixinTologin();
			// #endif
			console.log('App Show');

			if ([1011, 1012, 1013].includes(options.scene) && options.query) {
				uni.setStorageSync('__scene_query_q', options.query.q);
			}

			// #ifdef MP-WEIXIN
			let lopts = uni.getLaunchOptionsSync();
			console.log(options, lopts);

			//
			if (lopts && lopts.query && lopts.query.share) {
				// is_share
				// todo: 调用分享获积分服务-api
			}
			// #endif
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style>
	/* 全局字体图标和公共样式 */
	@import url('/components/iconfont/iconfont.css');
	@import url('/components/iconfont/my.css');
	@import url('/common/common.scss');
	@import url('colorui/icon.css');
	@import url('colorui/main.css');
	@import url('colorui/animation.css');
</style>
