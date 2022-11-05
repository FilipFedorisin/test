const {Server} = require("../../server.js");
const {Api, RESULT_CODE} = require("../Api.js");

//TODO: Handle basic routes like /user, /store etc.
//Root handler
Server.on("/", e => {
	e.send("Hello World, from the server!");
});

//Handle 404 Not Found
Server.on("404", e => {
	if(e.path.startsWith("/api")) {
		Api.sendResponse(e, {
			message: "API endpoint not found",
			status: RESULT_CODE.NOT_FOUND
		}, Server.STATUS.CLIENT.NOT_FOUND);
	} else if(e.path.startsWith("/media")) {
		e.send("404 Resource not found", Server.STATUS.CLIENT.NOT_FOUND);
	} else {
		//TODO: Implement 404 page
		e.send("There's nothing you see here :(", Server.STATUS.CLIENT.NOT_FOUND);
	}
});

