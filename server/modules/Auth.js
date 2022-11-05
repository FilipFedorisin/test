//@ts-check

const {Server, RequestEvent, CookieJar} = require("../server");
const {Api, RESULT_CODE} = require("./Api");
const Database = require("./Database");
const crypto = require("crypto");
const {Utils} = require("./Utils");

/** @type {typeof import("./Cart").Cart} */
let Cart;

Server.on("load", e => {
	//This stupid way of importing is required because of circular dependencies
	const {Cart: _cart} = require("./Cart");
	Cart = _cart;
});

const USER_TYPE = {
	NATIVE: 0,
	FACEBOOK: 1,
	GOOGLE: 2
};

const USER_ROLE = {
	GUEST: 0,
	CUSTOMER: 1,
	ADMIN: 2
};

const SESSION_TOKEN_DURATION = 1000 * 60 * 60 * 24 * 365;
const SESSION_MAX_COUNT = 5;

/**
 * @typedef {import("../server").ObjectLiteral} ObjectLiteral
 */

/**
 * @typedef {import("./Api").MiddlewareCallback} MiddlewareCallback
 */

class Auth {
	static createUser(user) {
		return new Promise(async (resolve, reject) => {
			//Create a hash for the password
			const salt = crypto.randomBytes(16).toString("hex");
			const hash = await this.createHash(user.password, salt).catch(err => reject(err)); if(!hash) return;

			//Get general data
			const {
				firstname,
				lastname,
				email,
				mobile,
				privacy,
				role = USER_ROLE.CUSTOMER
			} = user;

			//Construct the user object
			const record = {
				//General attributes
				firstname,
				lastname,
				email,
				mobile,
				role,
				password: `${salt}$${hash}`,
				privacy,
				type: USER_TYPE.NATIVE,

				//Internal attributes
				cart: [],
				created: Date.now()
			};

			//Insert the user into the database
			Database.getCollection("users")
				.insertOne(record)
				.then(result => {
					if(!result.insertedId) return reject({
						error: new Error("Failed to create user"),
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

	static updateUser(user) {
		return new Promise(async (resolve, reject) => {
			const id = user._id;
			delete user._id;
			Database.getCollection("users")
				.findOneAndUpdate({_id: Database.ID(id)}, {$set: user}, {returnDocument: "after"})
				.then(result => {
					if(!result.lastErrorObject.n) return reject({
						error: new Error("User not found"),
						code: RESULT_CODE.ERROR_USER_NOT_FOUND
					});

					resolve(result.value);
				}).catch(err => {
					reject({
						error: err,
						code: RESULT_CODE.INTERNAL_ERROR
					});
				}).then(() => {
					user._id = id;
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
	static getUser(query) {
		return new Promise(async (resolve, reject) => {
			Database.getCollection("users")
				.findOne(query)
				.then(result => {
					if(!result) return reject({
						error: new Error("User not found"),
						code: RESULT_CODE.ERROR_USER_NOT_FOUND
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

	static loginUser(query, password, event, force = false) {
		return new Promise(async (resolve, reject) => {
			//Query the user
			const user = await this.getUser(query).catch(err => reject(err)); if(!user) return;

			if(!force) {
				//Get hashes to compare
				const [salt, hash] = user.password.split("$");
				const newHash = await this.createHash(password, salt).catch(err => reject(err)); if(!newHash) return;

				//Compare password hashes
				if(!this.compareHashes(hash, newHash)) return reject({
					error: new Error("Incorrect password"),
					code: RESULT_CODE.ERROR_INCORRECT_PASSWORD
				});
			}

			//Create a session for the user
			const session = await this.createSession(user, event).catch(err => reject(err)); if(!session) return;
			new CookieJar()
				.setCookie("session", session.token, {
					path: "/",
					secure: true,
					expires: new Date(Date.now() + SESSION_TOKEN_DURATION).toUTCString(),
					SameSite: Server.environment === "development" ? "none" : undefined
				})
				.sendCookies(event.res, true);

			//Login was successful
			resolve(user);
		});
	}

	static logoutUser(event) {
		return new Promise(async (resolve, reject) => {
			//Authorize the request if needed
			await Auth.authorize(event);

			//User is not logged in
			if(!event.data.user) return resolve(null);
			if(!event.data.session) return resolve(null);

			//Delete the session
			Database.getCollection("sessions")
				.deleteOne({_id: Database.ID(event.data.session._id)})
				.then(result => {
					if(!result.deletedCount) return reject({
						error: new Error("Session not found"),
						code: RESULT_CODE.ERROR_SESSION_NOT_FOUND
					});

					resolve(event.data.user);
				}).catch(err => {
					reject({
						error: err,
						code: RESULT_CODE.INTERNAL_ERROR
					});
				});
		});
	}


	/* Middlewares */

	/**
	 *
	 * @static
	 * @param {boolean} [isApiEndpoint=false]
	 * @return {function} 
	 * @memberof Auth
	 */
	static requireLogin(isApiEndpoint = false) {
		return async (/**@type {RequestEvent}*/event, next) => {
			//Authorize the request if needed
			await Auth.authorize(event);

			//User is logged in
			if(event.data.user) return next();

			//Redirect to login page
			if(isApiEndpoint) {
				return Api.sendResponse(event, {
					error: new Error("To access this endpoint you must be logged in!"),
					code: RESULT_CODE.ERROR_UNAUTHORIZED,
					redirect: "/login"
				});
			} else {
				return event.redirectURL("/login");
			}
		};
	}

	/**
	 *
	 * @static
	 * @param {number} role
	 * @return {MiddlewareCallback} 
	 * @memberof Auth
	 */
	static requireRole(role) {
		//TODO: Make some mechanism to require a specific role only
		return async (/**@type {RequestEvent}*/event, next) => {
			//No need to authorize the guest
			if(role === USER_ROLE.GUEST) return next();

			//Authorize the request if needed
			await Auth.authorize(event);

			//User is logged in
			if(!event.data.user) return Api.sendUnauthorized(event);

			//Check if the user has the required role
			if(event.data.user.role < role) return Api.sendForbidden(event);

			next();
		};
	}

	/**
	 * Authorizes the request. Can be used as a middleware or as a function.
	 * @static
	 * @param {RequestEvent} event
	 * @param {function} [next]
	 * @return {Promise<void>}
	 * @memberof Auth
	 */
	static async authorize(event, next = null) {
		return new Promise(async resolve => {
			//Request hasn't been authorized yet
			if(!("user" in event.data)) {
				event.data.session = null;
				event.data.user = null;

				//Get the session from the request
				const session = await Auth.getSessionFromRequest(event);
				if(!session) return (next && next(), resolve());
				event.data.session = session;

				//Check if the user is logged in
				const user = await Auth.getUser(session.user).catch(err => 0);
				if(!user) return (next && next(), resolve());
				event.data.user = user;
			}

			next && next();
			resolve();
		});
	}

	/* Utils */

	/**
	 *
	 * @static
	 * @param {RequestEvent} event
	 * @return {Promise<ObjectLiteral>} 
	 * @memberof Auth
	 */
	static async getSessionFromRequest(event) {
		//Parse the cookies if needed
		if(!event.data.cookies) event.data.cookies = new CookieJar(event.req);

		//Get the session cookie and query session
		const token = event.data.cookies.getCookie("session")?.value; if(!token) return null;
		const session = await this.getSessionByToken(token).catch(err => 0); if(!session) return null;

		//Return the session
		return session;
	}

	/**
	 *
	 * @static
	 * @param {string} token
	 * @return {Promise<any>} 
	 * @memberof Auth
	 */
	static getSessionByToken(token) {
		return new Promise(async (resolve, reject) => {
			Database.getCollection("sessions")
				.findOne({token})
				.then(result => {
					if(!result) return reject({
						error: new Error("Session not found"),
						code: RESULT_CODE.ERROR_SESSION_NOT_FOUND
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

	/**
	 *
	 * @static
	 * @param {*} user
	 * @param {RequestEvent} event
	 * @return {*} 
	 * @memberof Auth
	 */
	static createSession(user, event) {
		return new Promise((resolve, reject) => {
			//Create a new session object
			const session = {
				user: user._id,
				token: crypto.randomBytes(32).toString("hex"),
				ip: event.IP,
				user_agent: event.headers["user-agent"],
				last_activity: Date.now(),
				created: Date.now()
			};

			//Insert the session into the database
			Database.getCollection("sessions")
				.insertOne(session)
				.then(result => {
					if(!result.insertedId) return reject({
						error: new Error("Failed to create session"),
						code: RESULT_CODE.INTERNAL_ERROR
					});

					session._id = result.insertedId;
					resolve(session);
				}).catch(err => {
					reject({
						error: err,
						code: RESULT_CODE.INTERNAL_ERROR
					});
				});

			//Remove old sessions
			Database.getCollection("sessions")
				.find({user: user._id})
				.sort({last_activity: -1})
				.limit(SESSION_MAX_COUNT)
				.toArray()
				.then(sessions => {
					if(sessions.length >= SESSION_MAX_COUNT) {
						Database.getCollection("sessions")
							.deleteMany({_id: {$nin: sessions.map(s => s._id)}})
							.catch(err => {
								Server.error(`[Auth] Failed to remove old sessions:`, err);
							});
					}
				}).catch(err => {
					Server.error(`[Auth] Failed to query old sessions:`, err);
				});

		});
	}

	static createHash(password, salt) {
		return new Promise((resolve, reject) =>
			crypto.pbkdf2(password, salt, 10000, 64, "sha512", (err, hash) => {
				if(err) return reject({
					error: err,
					code: RESULT_CODE.INTERNAL_ERROR
				});
				resolve(hash.toString("hex"));
			})
		);
	}

	static compareHashes(hash1, hash2) {
		return crypto.timingSafeEqual(Buffer.from(hash1), Buffer.from(hash2));
	}

	static async createPayload(user, options = {}) {
		if(options.includePersonal) {
			return {
				id: user._id,
				firstname: user.firstname,
				lastname: user.lastname,
				email: user.email,
				mobile: user.mobile,
				type: user.type,
				role: user.role,
				carts: options.includeCarts ? await Utils.allResolved(
					(await Cart.getCart({user: user._id}, true)).map(Cart.createPayload)
				) : undefined,
				created: user.created
			};
		} else {
			return {
				id: user._id,
				firstname: user.firstname,
				type: user.type,
				role: user.role,
				created: user.created
			};
		}
	}
}

module.exports = {
	Auth,
	USER_TYPE,
	USER_ROLE
};