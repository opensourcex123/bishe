'use strict';

const uidObj = require('uni-id');
const {
	Controller
} = require('uni-cloud-router');
const dbcmd = uniCloud.database().command;

module.exports = class HealthInfoController extends Controller {
	async create() {
		let response = {}
		// 获取请求数据
		console.log(this.ctx.data)
		const {
			yimiao,
			url,
			doc_id
		} = this.ctx.data
		
		let uid = '';
		if (this.ctx.event.uniIdToken) {
			// 已登录，获取当前登录 uid
			const user = await uidObj.checkToken(this.ctx.event.uniIdToken);
			if (user.code == 0) {
				uid = user.uid;
			}
		}
		
		if (!uid) {
			response.msg = '当前未登录'
			return response;
		}
		
		
		this.db.collection("health-info").doc(doc_id).set({
			create_uid: uid,
			yimiao: yimiao,
			image: url
		})
	}
}
