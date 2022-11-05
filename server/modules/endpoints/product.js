const {Server} = require("../../server");
const Database = require("../Database");
const Validator = require("../Validator");
const {Auth, USER_ROLE} = require("../Auth");
const {Product} = require("../Product");
const {Api} = require("../Api");
const {Utils} = require("../Utils");

const Schema = require("../schemas");

const PAGE_SIZE = 10;

//TODO: Hook this up to the superfaktura api

Server.on("/api/v1/product/create", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.ADMIN), Validator.body(Schema.product.create)], body => {
		Product.createProduct(e.data.valid_body)
			.then(async product => Api.sendResponse(e, {product: await Product.createPayload(product, {includeReviews: true})}))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});

Server.on("/api/v1/product/*/info", e => {
	e.get([Api.async, Auth.requireRole(USER_ROLE.GUEST), Validator.matches(Schema.match_id)], query => {
		const [product_id] = e.matches;

		Product.getProduct({_id: Database.ID(product_id)})
			.then(async product => Api.sendResponse(e, {product: await Product.createPayload(product, {includeReviews: true})}))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});

Server.on("/api/v1/product/*/edit", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.ADMIN), Validator.matches(Schema.match_id), Validator.body(Schema.product.edit)], body => {
		const [product_id] = e.matches;

		Product.updateProduct({_id: product_id, ...e.data.valid_body})
			.then(async product => Api.sendResponse(e, {product: await Product.createPayload(product, {includeReviews: true})}))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});

Server.on("/api/v1/product/*/delete", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.ADMIN), Validator.matches(Schema.match_id)], body => {
		const [product_id] = e.matches;

		Product.deleteProduct({_id: Database.ID(product_id)})
			.then(product => Api.sendResponse(e))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});

Server.on("/api/v1/product/*/update_stock", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.ADMIN), Validator.matches(Schema.match_id), Validator.body(Schema.product.update_stock)], body => {
		const [product_id] = e.matches;

		Product.updateProduct({_id: product_id, quantity: e.data.valid_body.quantity})
			.then(async product => Api.sendResponse(e, {product: await Product.createPayload(product, {includeReviews: true})}))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});


Server.on("/api/v1/product/search", e => {
	e.get([Api.async, Auth.requireRole(USER_ROLE.ADMIN), Validator.query(Schema.product.search)], query => {
		const text = query.query;
		const last_id = query.last_id;

		Database.getCollection("products")
			.aggregate([
				{$match: {$text: {$search: text}}},
				{$sort: {score: {$meta: "textScore"}}},
				...[last_id ? {$match: {"_id": {$gt: Database.ID(last_id)}}} : false],
				{$limit: PAGE_SIZE}
			].filter(Boolean))
			.toArray()
			.then(async products => Api.sendResponse(e, {products: await Utils.allResolved(products.map(Product.createPayload))}));
	}, "json");
});

Server.on("/api/v1/product/dump", e => {
	e.get([Api.async], query => {
		e.auth(() => {
			Product.getProduct({}, true)
				.then(async products => Api.sendResponse(e, {products: await Utils.allResolved(products.map(Product.createPayload))}))
				.catch(err => Api.sendResponse(e, err));
		}, "dump", {token: Server.config.access.token});
	}, "json");
});