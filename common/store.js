import pagesJson from '@/pages.json'
import config from '@/common/config.js'
import $db from '@/common/db.js';
import $func from '@/common/func.js';

const uniIdCo = uniCloud.importObject("uni-id-co")
const db = uniCloud.database();
const usersTable = db.collection('uni-id-users')

let hostUserInfo = uni.getStorageSync('uni-id-pages-userInfo') || {}
console.log(hostUserInfo);
const data = {
	userInfo: hostUserInfo,
	hasLogin: Object.keys(hostUserInfo).length != 0
}

console.log('data', data);
// 定义 mutations, 修改属性
export const mutations = {
	addCoupon() {
		let _this = this;
		const user = uni.getStorageSync('uni-id-pages-userInfo');
		let coupons = [{
				name: '满100-20',
				price: 20,
				amount: 100,
				deadline: new Date().getTime() + 7776000000,
				user_id: user._id
			},
			{
				name: '满200-50',
				price: 50,
				amount: 200,
				deadline: new Date().getTime() + 7776000000,
				user_id: user._id
			},
			{
				name: '满300-80',
				price: 80,
				amount: 300,
				deadline: new Date().getTime() + 7776000000,
				user_id: user._id
			},
			{
				name: '满500-100',
				price: 100,
				amount: 500,
				deadline: new Date().getTime() + 7776000000,
				user_id: user._id
			}
		];
		$db['usemall-member']
			.where('_id == $env.uid')
			.tofirst()
			.then(res => {
				if (res.datas.app_login_cnt === 1) {
					coupons.forEach(coupon => {
						$db['coupons'].add(coupon);
					});
				}
			});
	},
	// data不为空，表示传递要更新的值(注意不是覆盖是合并),什么也不传时，直接查库获取更新
	async updateUserInfo(data = false) {
		if (data) {
			usersTable.where('_id==$env.uid').update(data).then(e => {
				console.log(e);
				if (e.result.updated) {
					uni.showToast({
						title: "更新成功",
						icon: 'none',
						duration: 3000
					});
					this.setUserInfo(data)
				} else {
					uni.showToast({
						title: "没有改变",
						icon: 'none',
						duration: 3000
					});
				}
			})

		} else {
			try {
				let res = await usersTable.where("'_id' == $cloudEnv_uid")
					.field('mobile,nickname,username,email,avatar_file,avatar')
					.get()
				console.log('fromDbData', res.result.data);
				this.setUserInfo(res.result.data[0])
			} catch (e) {
				this.setUserInfo({}, {
					cover: true
				})
				console.error(e.message, e.errCode);
			}
		}
	},
	async setUserInfo(data, {
		cover
	} = {
		cover: false
	}) {
		let _this = this;
		if (data) {
			// #ifdef APP
			$func.usemall.call('member/oneClick', {
				res: data
			}).then(() => {
				_this.addCoupon();
			})
			// #endif
			// #ifndef APP
			console.log('sadgsddadff')
			$func.usemall.call('member/loginByWeixin', {
				res: data
			}).then(() => {
				_this.addCoupon();
			})
			// #endif
		}

		console.log('set-userInfoasdfdsag', data);
		let userInfo = cover ? data : Object.assign(store.userInfo, data)
		store.userInfo = Object.assign({}, userInfo)
		store.hasLogin = Object.keys(store.userInfo).length != 0
		console.log('store.userInfo', store.userInfo);
		uni.setStorage({
			key: "uni-id-pages-userInfo",
			data: store.userInfo
		})
		return data
	},
	async logout() {
		await uniIdCo.logout()
		uni.removeStorageSync('uni_id_token');
		uni.setStorageSync('uni_id_token_expired', 0)
		uni.redirectTo({
			url: `/${pagesJson.uniIdRouter?.loginPage ?? 'uni_modules/uni-id-pages/pages/login/login-withoutpwd'}`,
		});
		uni.$emit('uni-id-pages-logout')
		this.setUserInfo({}, {
			cover: true
		})
	},

	loginBack(e = {}) {
		const {
			uniIdRedirectUrl = ''
		} = e
		let delta = 0; //判断需要返回几层
		let pages = getCurrentPages();
		// console.log(pages);
		pages.forEach((page, index) => {
			if (pages[pages.length - index - 1].route.split('/')[3] == 'login') {
				delta++
			}
		})
		// console.log('判断需要返回几层:', delta);
		if (uniIdRedirectUrl) {
			return uni.reLaunch({
				url: uniIdRedirectUrl
			})
		}
		// #ifdef H5
		if (e.loginType == 'weixin') {
			console.log('window.history', window.history);
			return window.history.go(-3)
		}
		// #endif

		if (delta) {
			const page = pagesJson.pages[0]
			return uni.reLaunch({
				url: `/${page.path}`
			})
		}

		uni.navigateBack({
			delta
		})
	},
	loginSuccess(e = {}) {
		const {
			showToast = true, toastText = '登录成功', autoBack = true, uniIdRedirectUrl = '', passwordConfirmed
		} = e
		console.log({
			toastText,
			autoBack
		});
		if (showToast) {
			uni.showToast({
				title: toastText,
				icon: 'none',
				duration: 3000
			});
		}
		this.updateUserInfo()

		uni.$emit('uni-id-pages-login-success')

		if (config.setPasswordAfterLogin && !passwordConfirmed) {
			return uni.redirectTo({
				url: uniIdRedirectUrl ?
					`/uni_modules/uni-id-pages/pages/userinfo/set-pwd/set-pwd?uniIdRedirectUrl=${uniIdRedirectUrl}&loginType=${e.loginType}` :
					`/uni_modules/uni-id-pages/pages/userinfo/set-pwd/set-pwd?loginType=${e.loginType}`,
				fail: (err) => {
					console.log(err)
				}
			})
		}

		if (autoBack) {
			this.loginBack(uniIdRedirectUrl)
		}
	}

}

// #ifdef VUE2
import Vue from 'vue'
// 通过Vue.observable创建一个可响应的对象
export const store = Vue.observable(data)
// #endif

// #ifdef VUE3
import {
	reactive
} from 'vue'
// 通过Vue.observable创建一个可响应的对象
export const store = reactive(data)
// #endif
