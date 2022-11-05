const crypto = require("crypto");
const {uniquify} = require("../JustLib");
const {Server, RequestEvent, CookieJar} = require("../server");
const {Api, RESULT_CODE} = require("./Api");
const Database = require("./Database");
const {Media} = require("./Media");
const {Review} = require("./Review");
const {Utils} = require("./Utils");

/**
 * @typedef {import("../server").ObjectLiteral} ObjectLiteral
 */

class Product {
	static createProduct(product) {
		return new Promise(async (resolve, reject) => {

			//Get general data
			const {
				name,
				description,
				short_description,
				category,
				unit,
				unit_price,
				quantity,
				vat,
				thumbnail,
				gallery,
				variants,
				parameters
			} = product;

			//Construct the product object
			const record = {
				name,
				description,
				short_description,
				category,
				unit,
				unit_price,
				quantity,
				vat,
				thumbnail: typeof thumbnail === "string" ? Database.ID(thumbnail) : thumbnail,
				gallery: gallery.map(id => typeof id === "string" ? Database.ID(id) : id),
				variants: (variants.length ? variants : [{default: true}]).map(variant => ((variant.sku = Product.generateSKU(product, variant), variant))),
				parameters,
				created: Date.now()
			};

			//Insert the product into the database
			Database.getCollection("products")
				.insertOne(record)
				.then(result => {
					if(!result.insertedId) return reject({
						error: new Error("Failed to create product"),
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

	static updateProduct(product) {
		return new Promise(async (resolve, reject) => {
			const id = product._id;
			delete product._id;

			product.thumbnail = typeof product.thumbnail === "string" ? Database.ID(product.thumbnail) : product.thumbnail;
			product.gallery = product.gallery.map(id => typeof id === "string" ? Database.ID(id) : id);

			Database.getCollection("products")
				.findOneAndUpdate({_id: Database.ID(id)}, {$set: product}, {returnDocument: "after"})
				.then(result => {
					if(!result.lastErrorObject.n) return reject({
						error: new Error("Product not found"),
						code: RESULT_CODE.NOT_FOUND
					});

					resolve(result.value);
				}).catch(err => {
					reject({
						error: err,
						code: RESULT_CODE.INTERNAL_ERROR
					});
				}).then(() => {
					product._id = id;
				});
		});
	}

	/**
	 *
	 * @static
	 * @param {ObjectLiteral} query
	 * @param {boolean} [multiple=false]
	 * @return {*} 
	 * @memberof Product
	 */
	static getProduct(query, multiple = false) {
		return new Promise(async (resolve, reject) => {
			const collection = Database.getCollection("products");
			const product = await (multiple ? collection.find(query).toArray() : collection.findOne(query));

			if(!product) return reject({
				error: new Error("Product not found"),
				code: RESULT_CODE.NOT_FOUND
			});

			resolve(product);
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
	static deleteProduct(query) {
		return new Promise(async (resolve, reject) => {
			Database.getCollection("products")
				.deleteOne(query)
				.then(result => {
					if(!result.deletedCount) return reject({
						error: new Error("Product not found"),
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

	static generateSKU(product, variant) {
		const mappings = [
			e => e % 25 + 65,
			e => (e % 42 > 9 && e % 42 < 17 ? e + 7 : e) % 42 + 48,
			e => e % 10 + 48
		];
		const ranges = [3, 5, 2];

		return [
			product.category,
			product.name,
			Object.values(variant).join("")
		].map((value, i) => crypto
			.createHash("md5")
			.update(value)
			.digest("bin")
			.map(mappings[i])
			.toString("ascii")
			.slice(0, ranges[i])
		).join("-");
	}

	static async createPayload(product, options = {}) {
		//Query and cache all required media data
		const mediaArray = await Utils.allResolved(
			(await Media.getMedia({
				_id: {
					$in: uniquify([product.thumbnail, ...product.gallery].map(String)).map(Database.ID)
				}
			}, true))
				.map(Media.createPayload)
		);
		const media = mediaArray.reduce((obj, media) => (obj[media.id] = media, obj), {});

		return {
			id: product._id,
			name: product.name,
			description: product.description,
			//short_description: product.short_description,
			category: product.category,
			unit: product.unit,
			unit_price: product.unit_price,
			quantity: product.quantity,
			//vat: product.vat,
			thumbnail: media[product.thumbnail] || null,
			gallery: product.gallery.map(id => media[id]).filter(Boolean),
			parameters: product.parameters,
			variants: product.variants,
			//TODO: Make this quering using joins?
			/*reviews: (await Promise.allSettled(
				product.reviews.map(Review.createPayload)
			)).filter(e => e.status === "fulfilled").map(e => e.value),*/
			reviews: options.includeReviews ? await Utils.allResolved(
				(await Database.getCollection("reviews").find({product: product._id}).toArray())
					.map(Review.createPayload)
			) : undefined,
			created: product.created
		};
	}
}

module.exports = {Product};