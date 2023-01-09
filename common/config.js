'use strict';

let config = {
	debug: !0,
	version: '1.0.9.211112',
	
	route: {
		home: '/pages/tabbar/home',
		cart: '/pages/tabbar/cart',
		category: '/pages/tabbar/category',
		login: '/sub_pages_2/uni-id-pages/pages/login/login-withoutpwd',
		order: '/sub_pages_1/user/order/order',
		pay: '/sub_pages_1/pay/pay',
		search: '/sub_pages_1/home/search/search',
		goods: '/sub_pages_1/goods/goods',
		goodslist: '/sub_pages_1/goods/goods-list'
	},
	provider: '',
	provider_names: {
		'weixin': '微信',
		'qq': 'QQ',
		'alipay': '支付宝',
		'baidu': '百度',
		'toutiao': '头条',
	},
	
	const: {
		__app: '__app',
		__member: '__member',
		__access_token: 'USE_ACCESS_TOKEN'
	},
	
};

export default config