'use strict';

const uidObj = require('uni-id');
const {
	Controller
} = require('uni-cloud-router');
const dbcmd = uniCloud.database().command;

module.exports = class EngineersController extends Controller {
	async updateLocation() {
		const {
			lng,
			lat
		} = this.ctx.data

		let uid = "";
		if (this.ctx.event.uniIdToken) {
			// 已登录，获取当前登录 uid
			const user = await uidObj.checkToken(this.ctx.event.uniIdToken);
			if (user.code == 0) {
				uid = user.uid;
			}
		}


		if (!uid) {
			return {
				code: 400,
				msg: '当前未登录'
			};
		}

		const res = await this.db.collection("engineers").where({
			user_id: uid
		}).update({
			point: [lng, lat]
		})

		console.log(res)

		return {
			code: 200,
			msg: res
		}
	}
	async checkAuth() {
		// 获取请求数据
		console.log(this.ctx.data)
		let uid = "";
		if (this.ctx.event.uniIdToken) {
			// 已登录，获取当前登录 uid
			const user = await uidObj.checkToken(this.ctx.event.uniIdToken);
			if (user.code == 0) {
				uid = user.uid;
			}
		}


		if (!uid) {
			return {
				code: 400,
				msg: '当前未登录'
			};
		}

		let res = await this.db.collection("engineers").where({
			user_id: uid,
			audit_status: 1
		}).get()

		return {
			code: 200,
			rows: res.affectedDocs
		};
	}

	async create() {
		const {
			name,
			phone,
			id_card_front,
			id_card_back,
			avatar,
			skill,
			type,
			bank_card_type,
			bank_card_number
		} = this.ctx.data

		let uid = "";
		if (this.ctx.event.uniIdToken) {
			// 已登录，获取当前登录 uid
			const user = await uidObj.checkToken(this.ctx.event.uniIdToken);
			if (user.code == 0) {
				uid = user.uid;
			}
		}

		console.log("===========>userid", uid)


		if (!uid) {
			return {
				code: 400,
				msg: '当前未登录'
			};
		}

		const res = await this.db.collection("engineers").add({
			name,
			phone,
			id_card_front,
			id_card_back,
			avatar,
			skill,
			type,
			audit_status: 0,
			status: 1,
			create_time: Date.now(),
			user_id: uid,
			limit: 10,
			bank_card_type,
			bank_card_number
		})

		return {
			code: 200,
			msg: res
		}

	}

	async getInfo() {
		let uid = "";
		if (this.ctx.event.uniIdToken) {
			// 已登录，获取当前登录 uid
			const user = await uidObj.checkToken(this.ctx.event.uniIdToken);
			if (user.code == 0) {
				uid = user.uid;
			}
		}


		if (!uid) {
			return {
				code: 400,
				msg: '当前未登录'
			};
		}

		console.log("===========》", uid)

		const engineerInfo = await this.db.collection("engineers").where({
			user_id: uid
		}).get()

		const successNum = await this.db.collection("usemall-order").where({
			engineer_id: uid,
			state: dbcmd.in(["待评价", "已完成", "待付款", "已付款"])
		}).count()

		const failNum = await this.db.collection("usemall-order").where({
			engineer_id: uid,
			state: "已取消"
		}).count()

		return {
			code: 200,
			data: {
				info: engineerInfo.data[0],
				successNum: successNum.total,
				failNum: failNum.total
			}
		}
	}
}
