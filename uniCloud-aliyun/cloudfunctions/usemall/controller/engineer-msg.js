const uidObj = require('uni-id');
const {
	Controller
} = require('uni-cloud-router');
const dbcmd = uniCloud.database().command;

module.exports = class EngineersMsgController extends Controller {
	    async create() {
			const {
				title,
				content,
				nav,
				user_id
			} = this.ctx.data

			const res = await this.db.collection("engineers-msg").add({
				title,
				content,
				nav,
				user_id,
				create_time: Date.now()
			})

			return {
				code: 200,
				data: res
			}
		}

		async getMsgs() {
			const {
				page,
				pageSize
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
			
			const res = await this.db.collection("engineers-msg").where({
					user_id: uid
				}).skip((page - 1) * pageSize)
				.limit(pageSize).get()

			return {
				code: 200,
				data: res
			}
		}
}
