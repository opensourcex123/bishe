'use strict';

const uidObj = require('uni-id');
const {
	Controller
} = require('uni-cloud-router');
const dbcmd = uniCloud.database().command;

module.exports = class OrderFollowController extends Controller {
	async create() {
		const {
			main,
			reason,
			extra,
			order_id
		} = this.ctx.data

		const res = await this.db.collection("order-follow").add({
			main,
			reason,
			extra,
			order_id,
			status: "处理中",
			create_time: Date.now()
		})

		return {
			code: 200,
			msg: "success"
		}
	}
}
