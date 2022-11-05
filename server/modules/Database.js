const {MongoClient, ObjectID, Db} = require("mongodb");

class Database {
	static isConnected = false;

	/** @type {MongoClient} */
	static client = null;

	/** @type {Db} */
	static db = null;

	static initConnection(url, name, options = {}) {
		return MongoClient.connect(url, options).then(client => {
			this.isConnected = true;
			this.connection = client;
			this.db = client.db(name);

			return this.db;
		});
	}

	static getCollection(name) {
		return this.db.collection(name);
	}

	static ID(id) {
		try {
			return new ObjectID(id);
		} catch(err) {
			return new ObjectID(0);
		}
	}
}

module.exports = Database;