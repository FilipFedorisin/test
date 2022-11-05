const {Server} = require("../../server");
const Database = require("../Database");
const Validator = require("../Validator");
const {Auth, USER_ROLE} = require("../Auth");
const {Api} = require("../Api");
const {Utils} = require("../Utils");

const Schema = require("../schemas");

const PAGE_SIZE = 10;


Server.on("/api/v1/user/signup", e => {
	e.post([Api.async, Validator.body(Schema.user.signup)], body => {
		Auth.createUser({...e.data.valid_body, role: USER_ROLE.CUSTOMER})
			.then(async user => Api.sendResponse(e, {user: await Auth.createPayload(user, {includePersonal: true})}))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});

Server.on("/api/v1/user/login", e => {
	e.post([Api.async, Validator.body(Schema.user.login)], body => {
		const {email, password} = body;

		Auth.loginUser({email}, password, e)
			.then(async user => Api.sendResponse(e, {user: await Auth.createPayload(user, {includePersonal: true, includeCarts: true})}))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});

Server.on("/api/v1/user/logout", e => {
	e.post([Api.async], body => {
		Auth.logoutUser(e)
			.then(async user => Api.sendResponse(e))
			.catch(err => Api.sendResponse(e, err));
	});
});


Server.on("/api/v1/user/info", e => {
	e.get([Api.async, Auth.authorize], async query => {
		Api.sendResponse(e, {user: e.data.user ? await Auth.createPayload(e.data.user, {includePersonal: true, includeCarts: true}) : null});
	}, "json");
});

Server.on("/api/v1/user/edit", e => {
	e.post([Api.async, Auth.requireLogin(true), Validator.body(Schema.user.edit)], body => {
		Auth.updateUser({_id: e.data.user._id, ...e.data.valid_body})
			.then(async user => Api.sendResponse(e, {user: await Auth.createPayload(user, {includePersonal: true})}))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});


Server.on("/api/v1/user/*/info", e => {
	e.get([Api.async, Auth.requireRole(USER_ROLE.ADMIN), Validator.matches(Schema.match_id)], query => {
		const [user_id] = e.matches;

		Auth.getUser({_id: Database.ID(user_id)})
			.then(async user => Api.sendResponse(e, {user: await Auth.createPayload(user, {includePersonal: true, includeCarts: true})}))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});

Server.on("/api/v1/user/*/edit", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.ADMIN), Validator.matches(Schema.match_id), Validator.body(Schema.user.edit)], body => {
		const [user_id] = e.matches;

		Auth.updateUser({_id: user_id, ...e.data.valid_body})
			.then(async user => Api.sendResponse(e, {user: await Auth.createPayload(user, {includePersonal: true})}))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});


Server.on("/api/v1/user/search", e => {
	e.get([Api.async, Auth.requireRole(USER_ROLE.ADMIN), Validator.query(Schema.user.search)], query => {
		const text = query.query;
		const last_id = query.last_id;

		Database.getCollection("users")
			.aggregate([
				{$match: {$text: {$search: text}}},
				{$sort: {score: {$meta: "textScore"}}},
				...[last_id ? {$match: {"_id": {$gt: Database.ID(last_id)}}} : false],
				{$limit: PAGE_SIZE}
			].filter(Boolean))
			.toArray()
			.then(async users => Api.sendResponse(e, {users: await Utils.allResolved(users.map(user => Auth.createPayload(user, {includePersonal: true})))}));
	}, "json");
});