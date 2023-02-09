const uidObj = require('uni-id');
const {
	Controller
} = require('uni-cloud-router');
const dbcmd = uniCloud.database().command;
const uniPush = uniCloud.getPushManager({
	appId: "__UNI__7F65F38"
}) //注意这里需要传入你的应用appId

module.exports = class UniPushController extends Controller {
	async create() {
		const {
			cid,
			title,
			content,
			payload
		} = this.ctx.data

		return await uniPush.sendMessage({
			"push_clientid": cid, //填写上一步在uni-app客户端获取到的客户端推送标识push_clientid
			"title": title,
			"content": content,
			"force_notification": false,
			"payload": payload,
			"sound": "pushsound"
		})
	}
}
