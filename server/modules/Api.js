const {Server, RequestEvent, CookieJar} = require("../server");

const RESULT_CODE = {
	SUCCESS: "OK",
	NOT_FOUND: "NOT_FOUND",
	INTERNAL_ERROR: "INTERNAL_ERROR",

	INVALID_PARAMETERS: "INVALID_PARAMETERS",
	PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",

	ALREADY_EXISTS: "ALREADY_EXISTS",
	ERROR_USER_NOT_FOUND: "ERROR_USER_NOT_FOUND",

	ERROR_INCORRECT_PASSWORD: "ERROR_INCORRECT_PASSWORD",

	ERROR_SESSION_NOT_FOUND: "ERROR_SESSION_NOT_FOUND",

	ERROR_UNAUTHORIZED: "ERROR_UNAUTHORIZED",
	ERROR_FORBIDDEN: "ERROR_FORBIDDEN",
};

/**
 * @typedef {import("../server").ObjectLiteral} ObjectLiteral
 */

/**
 * @typedef {(event: RequestEvent, next: Function) => void} MiddlewareCallback
 */

/**
 * @typedef {ObjectLiteral & {status?: string, message?: string, redirect?: string}} ResponseData
 */

class Api {
	/**
	 *
	 * @static
	 * @param {RequestEvent} event
	 * @param {ResponseData} [data={}]
	 * @param {number} [status=Server.STATUS.SUCCESS.OK]
	 * @memberof Api
	 */
	static sendResponse(event, data = {}, status = Server.STATUS.SUCCESS.OK) {
		//Handle internal errors
		if(data instanceof Error) {
			const error = data;
			data = {
				status: RESULT_CODE.INTERNAL_ERROR,
				message: error.message
			};
			Server.error(`API call caused an error:`, error);
		}

		//Replace 'error' with 'message'
		const error = data.error;
		if(error instanceof Error) {
			delete data.error;
			if(!data.message) data.message = error.message;
			if(!data.status) data.status = RESULT_CODE.INTERNAL_ERROR;
		}

		//Replace 'code' with 'status'
		const code = data.code;
		if(code) {
			delete data.code;
			data.status = code;
		}

		//Resolve status code from result code
		if(status == Server.STATUS.SUCCESS.OK && data.status !== RESULT_CODE.SUCCESS) {
			status = ({
				[RESULT_CODE.SUCCESS]: Server.STATUS.SUCCESS.OK,
				[RESULT_CODE.NOT_FOUND]: Server.STATUS.CLIENT.NOT_FOUND,
				[RESULT_CODE.INTERNAL_ERROR]: Server.STATUS.SERVER.INTERNAL_ERROR,
				[RESULT_CODE.INVALID_PARAMETERS]: Server.STATUS.CLIENT.BAD_REQUEST,
				[RESULT_CODE.PAYLOAD_TOO_LARGE]: Server.STATUS.CLIENT.PAYLOAD_TOO_LARGE,
				[RESULT_CODE.ALREADY_EXISTS]: Server.STATUS.CLIENT.CONFLICT,
				[RESULT_CODE.ERROR_UNAUTHORIZED]: Server.STATUS.CLIENT.UNAUTHORIZED,
				[RESULT_CODE.ERROR_FORBIDDEN]: Server.STATUS.CLIENT.FORBIDDEN,
				[RESULT_CODE.ERROR_USER_NOT_FOUND]: Server.STATUS.CLIENT.NOT_FOUND,
				[RESULT_CODE.ERROR_SESSION_NOT_FOUND]: Server.STATUS.CLIENT.NOT_FOUND,
				[RESULT_CODE.ERROR_INCORRECT_PASSWORD]: Server.STATUS.CLIENT.UNAUTHORIZED
			})[data.status] || status;
		}

		//Send response
		event.send(Object.assign({
			status: RESULT_CODE.SUCCESS,
			message: undefined
		}, data), status);
	}

	/**
	 *
	 * @static
	 * @param {RequestEvent} event
	 * @param {ResponseData} [data={}]
	 * @memberof Api
	 */
	static sendForbidden(event, data = {}) {
		data.status = RESULT_CODE.ERROR_FORBIDDEN;
		if(!data.message) data.message = "You do not have permissions for this action! Please contact the administrator if you believe this is an error!";

		Api.sendResponse(event, data);
	}

	static sendUnauthorized(event, data = {}) {
		data.status = RESULT_CODE.ERROR_UNAUTHORIZED;
		if(!data.message) data.message = "You are not authorized to perform this action! Please contact the administrator if you believe this is an error!";
		if(!data.redirect) data.redirect = "/login";

		Api.sendResponse(event, data);
	}

	/**
	 * Middleware to mark API endpoints (or any other) as async handles.
	 * Forces request to wait for the response. (Useful for async or callback based handlers).
	 * Internally calls `event.preventDefault()`.
	 * @static
	 * @param {RequestEvent} event
	 * @param {function} next
	 * @memberof Api
	 */
	static async(event, next) {
		event.preventDefault();
		next();
	}
}

module.exports = {
	Api,
	RESULT_CODE
};