const {uniquify} = require("../JustLib");
const {Server, RequestEvent, CookieJar} = require("../server");
const {Api, RESULT_CODE} = require("./Api");
const {Auth, USER_ROLE} = require("./Auth");
const Database = require("./Database");
const {Product} = require("./Product");
const {Utils} = require("./Utils");

/**
 * @typedef {import("../server").ObjectLiteral} ObjectLiteral
 */

/**
 * @typedef {import("./Api").MiddlewareCallback} MiddlewareCallback
 */

class Cart {
	static createCart(cart) {
		return new Promise(async (resolve, reject) => {

			//Get general data
			const {
				name,
				user,
				items = []
			} = cart;

			//Construct the cart object
			const record = {
				name,
				user,
				items,
				created: Date.now()
			};

			//Insert the cart into the database
			Database.getCollection("carts")
				.insertOne(record)
				.then(result => {
					if(!result.insertedId) return reject({
						error: new Error("Failed to create cart"),
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

	static updateCart(cart) {
		return new Promise(async (resolve, reject) => {
			const id = cart._id;
			delete cart._id;

			Database.getCollection("carts")
				.findOneAndUpdate({_id: Database.ID(id)}, {$set: cart}, {returnDocument: "after"})
				.then(result => {
					if(!result.lastErrorObject.n) return reject({
						error: new Error("Cart not found"),
						code: RESULT_CODE.NOT_FOUND
					});

					resolve(result.value);
				}).catch(err => {
					reject({
						error: err,
						code: RESULT_CODE.INTERNAL_ERROR
					});
				}).then(() => {
					cart._id = id;
				});
		});
	}

	/**
	 *
	 * @static
	 * @param {ObjectLiteral} query
	 * @param {boolean} [multiple=false]
	 * @return {*} 
	 * @memberof Cart
	 */
	static getCart(query, multiple = false) {
		return new Promise(async (resolve, reject) => {
			const collection = Database.getCollection("carts");
			const cart = await (multiple ? collection.find(query).toArray() : collection.findOne(query));

			if(!cart) return reject({
				error: new Error("Cart not found"),
				code: RESULT_CODE.NOT_FOUND
			});

			resolve(cart);
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
	static deleteCart(query) {
		return new Promise(async (resolve, reject) => {
			Database.getCollection("carts")
				.deleteOne(query)
				.then(result => {
					if(!result.deletedCount) return reject({
						error: new Error("Cart not found"),
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

	/**
	 *
	 * @static
	 * @param {RequestEvent} event
	 * @param {Function} next
	 * @return {MiddlewareCallback} 
	 * @memberof Cart
	 */
	static async checkOwner(event, next) {
		const [cart_id] = event.matches;

		//Admin has full rights
		if(event.data.user.role === USER_ROLE.ADMIN) return next();

		//Get the cart
		Cart.getCart({_id: Database.ID(cart_id)})
			.then(async cart => {
				//Cache the cart for later use
				event.data.cart = cart;

				//Check if the user is the creator of the cart
				if(!cart.user.equals(event.data.user._id)) return Api.sendForbidden(event, {
					message: "You are not the creator of this cart"
				});

				next();
			})
			.catch(err => Api.sendResponse(event, err));
	}

	static async createPayload(cart, options = {}) {
		return {
			id: cart._id,
			name: cart.name,
			user: options.includeUser ? await Auth.createPayload(await Auth.getUser({_id: cart.user})) : undefined,
			items: await Utils.allResolved(
				cart.items.map(async e => ({
					product: options.fetchItems ? await Product.createPayload(await Product.getProduct({_id: Database.ID(e.product)})) : e.product,
					variant: e.variant,
					quantity: e.quantity
				}))
			),
			created: cart.created
		};
	}
}

module.exports = {Cart};