const {Server} = require("../../server");
const Database = require("../Database");
const Validator = require("../Validator");
const {Auth, USER_ROLE} = require("../Auth");
const {Product} = require("../Product");
const {Review} = require("../Review");
const {Api} = require("../Api");

const Schema = require("../schemas");

Server.on("/api/v1/product/*/create_review", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.CUSTOMER), Validator.matches(Schema.match_id), Validator.body(Schema.review.create)], body => {
		const [product_id] = e.matches;

		Product.getProduct({_id: Database.ID(product_id)})
			.then(product => {
				Review.createReview(product, e.data.user, e.data.valid_body)
					.then(async review => Api.sendResponse(e, {review: await Review.createPayload(review)}))
					.catch(err => Api.sendResponse(e, err));
			})
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});

Server.on("/api/v1/review/*/edit", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.CUSTOMER), Validator.matches(Schema.match_id), Validator.body(Schema.review.edit), Review.checkOwner], body => {
		const [review_id] = e.matches;

		Review.updateReview({_id: Database.ID(review_id), ...e.data.valid_body})
			.then(async review => Api.sendResponse(e, {review: await Review.createPayload(review)}))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});

Server.on("/api/v1/review/*/delete", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.CUSTOMER), Validator.matches(Schema.match_id), Review.checkOwner], body => {
		const [review_id] = e.matches;

		Review.deleteReview({_id: Database.ID(review_id)})
			.then(async review => Api.sendResponse(e))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});

Server.on("/api/v1/review/*/like", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.CUSTOMER), Validator.matches(Schema.match_id)], body => {
		const [review_id] = e.matches;

		Review.likeReview({_id: Database.ID(review_id)}, e.data.user)
			.then(async review => Api.sendResponse(e, {review: await Review.createPayload(review)}))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});