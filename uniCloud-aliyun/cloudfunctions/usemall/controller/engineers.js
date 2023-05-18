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
		}).get()

		return {
			code: 200,
			data: res.data,
			row: res.affectedDocs,
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
			state: dbcmd.in(["已取消", "待取消"])
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

	getLastWeekDate(type) {
		let now = new Date()
		let day = now.getDay() //返回星期几的某一天;
		if (!type) {
			let dayNumber = day == 0 ? 6 : day - 1
			now.setDate(now.getDate() - dayNumber - 7)
			now.setHours(0, 0, 0, 0);
		} else {
			let dayNumber = day == 0 ? 6 : day - 1
			now.setDate(now.getDate() - dayNumber - 7 + 6)
			now.setHours(23, 59, 59, 999);
		}
		return now.getTime();
	}

	getWeekDate(type) {
		let now = new Date()
		let day = now.getDay() //返回星期几的某一天;
		if (!type) {
			let dayNumber = day == 0 ? 6 : day - 1
			now.setDate(now.getDate() - dayNumber)
			now.setHours(0, 0, 0, 0);
		} else {
			let dayNumber = day == 0 ? 0 : 7 - day
			now.setDate(now.getDate() + dayNumber)
			now.setHours(23, 59, 59, 999);
		}
		return now.getTime();
	}

	getMonthDate(type) {
		if (type === 0) {
			let date = new Date();
			date.setDate(1);
			date.setHours(0, 0, 0, 0);
			return date.getTime();
		} else {
			let date = new Date();
			if ([0, 2, 4, 6, 7, 9, 11].includes(date.getMonth())) {
				date.setDate(31);
			} else if ([3, 5, 8, 10].includes(date.getMonth())) {
				date.setDate(30);
			} else {
				date.setDate(29);
			}
			date.setHours(23, 59, 59, 999);
			return date.getTime();
		}
	}

	async getLastWeekSalary() {
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

		const weekStart = this.getLastWeekDate(0);
		const weekEnd = this.getLastWeekDate(1);
		const orderIdAsEngineer = [];
		const orderIdAsSecondEngineer = [];
		const orderIdAsIntroduceEngineer = [];
		let incomeAsEngineerNumber = 0;
		let incomeAsSecondEngineerNumber = 0;
		let incomeAsIntroduceEngineerNumber = 0;

		// 查order表获取orderid
		const weekOrdersAsEngineer = await this.db.collection("usemall-order").where({
			create_time: dbcmd.gte(weekStart).and(dbcmd.lte(weekEnd)),
			engineer_id: uid
		}).get();
		weekOrdersAsEngineer.data.forEach(item => {
			orderIdAsEngineer.push(item.order_id);
		});
		const weekOrdersAsSecondEngineer = await this.db.collection("usemall-order").where({
			create_time: dbcmd.gte(weekStart).and(dbcmd.lte(weekEnd)),
			second_engineer_id: uid
		}).get();
		weekOrdersAsSecondEngineer.data.forEach(item => {
			orderIdAsSecondEngineer.push(item.order_id);
		});
		const weekOrdersAsIntroduceEngineer = await this.db.collection("usemall-order").where({
			create_time: dbcmd.gte(weekStart).and(dbcmd.lte(weekEnd)),
			introduce_engineer_id: uid
		}).get();
		weekOrdersAsIntroduceEngineer.data.forEach(item => {
			orderIdAsIntroduceEngineer.push(item.order_id);
		});

		// 查income表
		const incomeAsEngineer = await this.db.collection("income").where({
			order_id: dbcmd.in(orderIdAsEngineer)
		}).get();
		incomeAsEngineer.data.forEach(item => {
			incomeAsEngineerNumber += item.engineer_income;
		})
		const incomeAsSecondEngineer = await this.db.collection("income").where({
			order_id: dbcmd.in(orderIdAsSecondEngineer)
		}).get();
		incomeAsSecondEngineer.data.forEach(item => {
			incomeAsSecondEngineerNumber += item.second_engineer_income;
		})
		const incomeAsIntroduceEngineer = await this.db.collection("income").where({
			order_id: dbcmd.in(orderIdAsIntroduceEngineer)
		}).get();
		incomeAsIntroduceEngineer.data.forEach(item => {
			incomeAsIntroduceEngineerNumber += item.introduce_engineer_income;
		})

		return {
			code: 200,
			data: {
				salary: (incomeAsEngineerNumber + incomeAsSecondEngineerNumber +
					incomeAsIntroduceEngineerNumber) / 100
			}
		}
	}

	async getWeekSalary() {
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

		const weekStart = this.getWeekDate(0);
		const weekEnd = this.getWeekDate(1);
		const orderIdAsEngineer = [];
		const orderIdAsSecondEngineer = [];
		const orderIdAsIntroduceEngineer = [];
		let incomeAsEngineerNumber = 0;
		let incomeAsSecondEngineerNumber = 0;
		let incomeAsIntroduceEngineerNumber = 0;

		// 查order表获取orderid
		const weekOrdersAsEngineer = await this.db.collection("usemall-order").where({
			create_time: dbcmd.gte(weekStart).and(dbcmd.lte(weekEnd)),
			engineer_id: uid
		}).get();
		weekOrdersAsEngineer.data.forEach(item => {
			orderIdAsEngineer.push(item.order_id);
		});
		const weekOrdersAsSecondEngineer = await this.db.collection("usemall-order").where({
			create_time: dbcmd.gte(weekStart).and(dbcmd.lte(weekEnd)),
			second_engineer_id: uid
		}).get();
		weekOrdersAsSecondEngineer.data.forEach(item => {
			orderIdAsSecondEngineer.push(item.order_id);
		});
		const weekOrdersAsIntroduceEngineer = await this.db.collection("usemall-order").where({
			create_time: dbcmd.gte(weekStart).and(dbcmd.lte(weekEnd)),
			introduce_engineer_id: uid
		}).get();
		weekOrdersAsIntroduceEngineer.data.forEach(item => {
			orderIdAsIntroduceEngineer.push(item.order_id);
		});

		// 查income表
		const incomeAsEngineer = await this.db.collection("income").where({
			order_id: dbcmd.in(orderIdAsEngineer)
		}).get();
		incomeAsEngineer.data.forEach(item => {
			incomeAsEngineerNumber += item.engineer_income;
		})
		const incomeAsSecondEngineer = await this.db.collection("income").where({
			order_id: dbcmd.in(orderIdAsSecondEngineer)
		}).get();
		incomeAsSecondEngineer.data.forEach(item => {
			incomeAsSecondEngineerNumber += item.second_engineer_income;
		})
		const incomeAsIntroduceEngineer = await this.db.collection("income").where({
			order_id: dbcmd.in(orderIdAsIntroduceEngineer)
		}).get();
		incomeAsIntroduceEngineer.data.forEach(item => {
			incomeAsIntroduceEngineerNumber += item.introduce_engineer_income;
		})

		return {
			code: 200,
			data: {
				salary: (incomeAsEngineerNumber + incomeAsSecondEngineerNumber +
					incomeAsIntroduceEngineerNumber) / 100
			}
		}
	}

	async getMonthSalary() {
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

		const monthStart = this.getMonthDate(0);
		const monthEnd = this.getMonthDate(1);
		const orderIdAsEngineer = [];
		const orderIdAsSecondEngineer = [];
		const orderIdAsIntroduceEngineer = [];
		let incomeAsEngineerNumber = 0;
		let incomeAsSecondEngineerNumber = 0;
		let incomeAsIntroduceEngineerNumber = 0;

		// 查order表获取orderid
		const monthOrdersAsEngineer = await this.db.collection("usemall-order").where({
			create_time: dbcmd.gte(monthStart).and(dbcmd.lte(monthEnd)),
			engineer_id: uid
		}).get();
		monthOrdersAsEngineer.data.forEach(item => {
			orderIdAsEngineer.push(item.order_id);
		});
		const monthOrdersAsSecondEngineer = await this.db.collection("usemall-order").where({
			create_time: dbcmd.gte(monthStart).and(dbcmd.lte(monthEnd)),
			second_engineer_id: uid
		}).get();
		monthOrdersAsSecondEngineer.data.forEach(item => {
			orderIdAsSecondEngineer.push(item.order_id);
		});
		const monthOrdersAsIntroduceEngineer = await this.db.collection("usemall-order").where({
			create_time: dbcmd.gte(monthStart).and(dbcmd.lte(monthEnd)),
			introduce_engineer_id: uid
		}).get();
		monthOrdersAsIntroduceEngineer.data.forEach(item => {
			orderIdAsIntroduceEngineer.push(item.order_id);
		});

		// 查income表
		const incomeAsEngineer = await this.db.collection("income").where({
			order_id: dbcmd.in(orderIdAsEngineer)
		}).get();
		incomeAsEngineer.data.forEach(item => {
			incomeAsEngineerNumber += item.engineer_income;
		})
		const incomeAsSecondEngineer = await this.db.collection("income").where({
			order_id: dbcmd.in(orderIdAsSecondEngineer)
		}).get();
		incomeAsSecondEngineer.data.forEach(item => {
			incomeAsSecondEngineerNumber += item.second_engineer_income;
		})
		const incomeAsIntroduceEngineer = await this.db.collection("income").where({
			order_id: dbcmd.in(orderIdAsIntroduceEngineer)
		}).get();
		incomeAsIntroduceEngineer.data.forEach(item => {
			incomeAsIntroduceEngineerNumber += item.introduce_engineer_income;
		})

		return {
			code: 200,
			data: {
				salary: (incomeAsEngineerNumber + incomeAsSecondEngineerNumber +
					incomeAsIntroduceEngineerNumber) / 100
			}
		}
	}
}