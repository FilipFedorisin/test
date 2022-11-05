const validate = require("schema-validator-json");
const {Server} = require("../server");
const {Api, RESULT_CODE} = require("./Api");


/**
 * Validation Middleware Factory Method
 * @class Validator
 */
class Validator {
	/**
	 * Builds a middleware that validates the body of a request
	 * @static
	 * @param {validate.Schema} schema Schema to validate request body against
	 * @return {function} Middleware function
	 * @memberof Validator
	 */
	static body(schema) {
		return function(event, next) {
			if(event.method === "POST") {
				//Handle request body
				Server.POST_BODY_HANDLER(event, () => {
					const result = validate(event.body, schema);

					if(!result.valid) return Api.sendResponse(event, {
						code: RESULT_CODE.INVALID_PARAMETERS,
						error: new Error("Invalid body parameters"),
						message: Server.environment === "development" ? result.message : undefined,
						path: Server.environment === "development" ? (result.path || []).join(".") : undefined
					});

					event.data.valid_body = result.matched;
					next();
				});
			} else {
				next();
			}
		};
	}

	/**
	 * Builds a middleware that validates the query of a request
	 * @static
	 * @param {validate.Schema} schema
	 * @return {function} 
	 * @memberof Validator
	 */
	static query(schema) {
		return function(event, next) {
			const result = validate(event.query, schema);

			// if(!result.valid) return event.send({
			// 	success: false,
			// 	message: result.message || "Invalid data provided",
			// 	path: (result.path || []).join(".")
			// });

			if(!result.valid) return Api.sendResponse(event, {
				code: RESULT_CODE.INVALID_PARAMETERS,
				error: new Error("Invalid query parameters"),
				message: Server.environment === "development" ? result.message : undefined,
				path: Server.environment === "development" ? (result.path || []).join(".") : undefined
			});

			event.data.valid_query = result.matched;
			next();
		};
	}

	/**
	 * Builds a middleware that validates the matches of a request
	 * @static
	 * @param {validate.Schema} schema
	 * @return {function} 
	 * @memberof Validator
	 */
	static matches(schema) {
		return function(event, next) {
			const result = validate(event.matches, schema);

			// if(!result.valid) return event.send({
			// 	success: false,
			// 	message: result.message || "Invalid data provided",
			// 	path: (result.path || []).join(".")
			// });

			if(!result.valid) return Api.sendResponse(event, {
				code: RESULT_CODE.INVALID_PARAMETERS,
				error: new Error("Invalid url parameters"),
				message: Server.environment === "development" ? result.message : undefined,
				path: Server.environment === "development" ? (result.path || []).join(".") : undefined
			});

			event.data.valid_matches = result.matched;
			next();
		};
	}
}

module.exports = Validator;