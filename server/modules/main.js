const {Server} = require("../server");
const Database = require("./Database");


//Handle load event
Server.on("load", async e => {
	//Connect to database
	Server.log("Connecting to database...");
	await Database.initConnection(Server.config.database.url, Server.config.database.name).then(client => {
		Server.log("Connected to database!");
	}).catch(err => {
		Server.error("Failed to connect to database: " + err.message);
		process.exit(1);
	});

	//Create the indexes
	Database.getCollection("users").createIndex({email: 1}, {unique: true});
	Database.getCollection("users").createIndex({firstname: "text", lastname: "text", email: "text", mobile: "text"});
	Database.getCollection("products").createIndex({name: 1}, {unique: true});
	Database.getCollection("products").createIndex({name: "text", description: "text"});
});

process.env.NODE_ENV = "development";
if(process.env.NODE_ENV === "development") {
	Server.on("request", async e => {
		e.setHeader("Access-Control-Allow-Origin", "*");

		if(e.method === "OPTIONS") {
			e.preventDefault();
			e.send("", 200);
		}
	});
}