const {Server, RequestEvent, CookieJar} = require("../server");
const {Api, RESULT_CODE} = require("./Api");
const {Auth, USER_ROLE} = require("./Auth");
const Database = require("./Database");

/**
 * @typedef {import("../server").ObjectLiteral} ObjectLiteral
 */

/**
 * @typedef {import("./Api").MiddlewareCallback} MiddlewareCallback
 */


class Review {
	static createReview(product, user, review) {
		return new Promise(async (resolve, reject) => {

			//Get general data
			const {
				content,
				rating,
				cons,
				pros,
			} = review;

			//Construct the review object
			const record = {
				user: user._id,
				product: product._id,
				content,
				rating,
				cons,
				pros,
				likes: [],
				updated: 0,
				created: Date.now()
			};

			//Insert the review into the database
			Database.getCollection("reviews")
				.insertOne(record)
				.then(result => {
					if(!result.insertedId) return reject({
						error: new Error("Failed to create review"),
						code: RESULT_CODE.INTERNAL_ERROR
					});

					record._id = result.insertedId;
					resolve(record);
				}).catch(err => {
					if(err.code === 11000) return reject({
						error: err,
						code: RESULT_CODE.ALREADY_EXISTS
					});

					reject({
						error: err,
						code: RESULT_CODE.INTERNAL_ERROR
					});
				});
		});
	}

	static updateReview(review, updateDate = true) {
		return new Promise(async (resolve, reject) => {
			const id = review._id;
			delete review._id;

			if(updateDate) review.updated = Date.now();

			Database.getCollection("reviews")
				.findOneAndUpdate({_id: Database.ID(id)}, {$set: review}, {returnDocument: "after"})
				.then(result => {
					if(!result.lastErrorObject.n) return reject({
						error: new Error("Review not found"),
						code: RESULT_CODE.NOT_FOUND
					});

					resolve(result.value);
				}).catch(err => {
					reject({
						error: err,
						code: RESULT_CODE.INTERNAL_ERROR
					});
				}).then(() => {
					review._id = id;
				});
		});
	}

	/**
	 *
	 * @static
	 * @param {ObjectLiteral} query
	 * @return {*} 
	 * @memberof Auth
	 */
	static getReview(query) {
		return new Promise(async (resolve, reject) => {
			Database.getCollection("reviews")
				.findOne(query)
				.then(result => {
					if(!result) return reject({
						error: new Error("Review not found"),
						code: RESULT_CODE.NOT_FOUND
					});

					resolve(result);
				}).catch(err => {
					reject({
						error: err,
						code: RESULT_CODE.INTERNAL_ERROR
					});
				});
		});
	}

	// eslint-disable-next-line valid-jsdoc
	/**
	 *
	 * @static
	 * @param {ObjectLiteral} query
	 * @return {*} 
	 * @memberof Auth
	 */
	static deleteReview(query) {
		return new Promise(async (resolve, reject) => {
			Database.getCollection("reviews")
				.deleteOne(query)
				.then(result => {
					if(!result.deletedCount) return reject({
						error: new Error("Review not found"),
						code: RESULT_CODE.NOT_FOUND
					});

					resolve();
				}).catch(err => {
					reject({
						error: err,
						code: RESULT_CODE.INTERNAL_ERROR
					});
				});
		});
	}

	static likeReview(query, user) {
		return new Promise(async (resolve, reject) => {
			const review = await Review.getReview(query).catch(reject); if(!review) return;

			//Check if the user has already liked the review
			if(this.isReviewLiked(review, user)) return reject({
				error: new Error("User has already liked this review"),
				code: RESULT_CODE.ALREADY_EXISTS
			});

			//Add the user to the likes array
			review.likes.push({
				user: user._id,
				created: Date.now()
			});
			resolve(Review.updateReview(review, false));
		});
	}

	static isReviewLiked(review, user) {
		return review && user && review.likes.some(like => like.user.equals(user._id)) || false;
	}

	/**
	 *
	 * @static
	 * @param {RequestEvent} event
	 * @param {Function} next
	 * @return {MiddlewareCallback} 
	 * @memberof Review
	 */
	static async checkOwner(event, next) {
		const [review_id] = event.matches;

		//Admin has full rights
		if(event.data.user.role === USER_ROLE.ADMIN) return next();

		//Get the review
		Review.getReview({_id: Database.ID(review_id)})
			.then(async review => {
				//Cache the review for later use
				event.data.review = review;

				//Check if the user is the creator of the review
				if(!review.user.equals(event.data.user._id)) return Api.sendForbidden(event, {
					message: "You are not the creator of this review"
				});

				next();
			})
			.catch(err => Api.sendResponse(event, err));
	}

	// eslint-disable-next-line valid-jsdoc
	/**
	 *
	 * @static
	 * @param {*} review
	 * @param {ObjectLiteral & {visitor: User}} options
	 * @return {*} 
	 * @memberof Review
	 */
	static async createPayload(review, options = {}) {
		return {
			id: review._id,
			user: await Auth.createPayload(/*typeof review.user === "string" ? */await Auth.getUser({_id: review.user})/* : review.user*/),
			content: review.content,
			rating: review.rating,
			cons: review.cons,
			pros: review.pros,
			likes: review.likes.length,
			is_liked: Review.isReviewLiked(review, options.visitor),
			created: review.created,
			updated: review.updated,
		};
	}
}

module.exports = {Review};