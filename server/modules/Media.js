const {Server, RequestEvent, getFileFormat} = require("../server");
const {RESULT_CODE, Api} = require("./Api");
const Database = require("./Database");
const path = require("path");
const fs = require("fs");
const {ImageProcessor} = require("./ImageProcessor");

const PATH_MEDIA = path.join(__dirname, "/media");
const PATH_IMAGES = path.join(PATH_MEDIA, "/images");
const REQUEST_OVERHEAD_B = 1024;

/**
 * @typedef {import("../server").ObjectLiteral} ObjectLiteral
 */

/**
 * @typedef {Object} Media
 * @prop {string} _id 
 * @prop {string} filename
 * @prop {string} mimetype
 * @prop {string} extension
 * @prop {string} created
 */

class Media {
	static IMAGE_EXTENSIONS = Server.config.media.image_extensions || ["png", "jpg", "jpeg"];
	static IMAGE_VERSIONS = Server.config.media.image_versions || [1600, 1200, 800, 640, 320, 240, 160];

	static limitSize(size) {
		return async (/**@type {RequestEvent}*/event, next) => {
			if(parseInt(event.headers["content-length"]) + REQUEST_OVERHEAD_B > size) return Api.sendResponse(event, {
				code: RESULT_CODE.PAYLOAD_TOO_LARGE,
				error: new Error("Payload is too large.")
			}, Server.STATUS.CLIENT.PAYLOAD_TOO_LARGE);

			next();
		};
	}

	//TODO: Add image alts

	static saveMedia(_media) {
		return new Promise(async (resolve, reject) => {
			//Create a new media object
			const media = {
				filename: _media.filename,
				mimetype: _media.mimetype,
				extension: getFileFormat(_media.mimetype),
				created: Date.now(),
				versions: []
			};

			const shouldGenerateVersions = Media.IMAGE_EXTENSIONS.includes(media.extension);

			//Add image versions if applicable
			if(shouldGenerateVersions) {
				media.versions = Media.IMAGE_VERSIONS.slice();
			}

			//Insert the media into the database
			Database.getCollection("media")
				.insertOne(media)
				.then(result => {
					if(!result.insertedId) return reject({
						error: new Error("Failed to create media"),
						code: RESULT_CODE.INTERNAL_ERROR
					});

					//Save the media file
					media._id = result.insertedId;
					fs.promises.rename(_media.filepath, Media.getMediaSystemPath(media))
						.then(async () => {
							//Generate a lower resolution versions of the image
							if(shouldGenerateVersions) {
								await fs.promises.mkdir(Media.getImageSystemDir(media));

								const result = await Promise.all(
									Media.IMAGE_VERSIONS.map(size =>
										ImageProcessor.resize(
											Media.getMediaSystemPath(media),
											Media.getImageSystemPath(media, size),
											`if(gte(a\\,1)\\,${size}\\,-2)`,
											`if(gte(a\\,1)\\,-2\\,${size})`
										)
									)
								).catch(err => err);
								if(result.error) return reject({
									error: result,
									code: RESULT_CODE.INTERNAL_ERROR
								}), Server.error(`Error while generating image version for ${media.filename}`, result);
							}

							resolve(media);
						})
						.catch(err => {
							//Delete the media from the database if the file could not be saved
							Database.getCollection("media")
								.deleteOne({_id: media._id})
								.then(() => {
									reject({
										error: new Error("Failed to save media"),
										code: RESULT_CODE.INTERNAL_ERROR
									});
									Server.error(`[Media] Failed to move file:`, err);
								}).catch(err => {
									reject({
										error: err,
										code: RESULT_CODE.INTERNAL_ERROR
									});
								});
						});
				}).catch(err => {
					reject({
						error: err,
						code: RESULT_CODE.INTERNAL_ERROR
					});
				});
		});
	}

	static getMedia(query, multiple = false) {
		return new Promise(async (resolve, reject) => {
			const collection = Database.getCollection("media");
			const media = await (multiple ? collection.find(query).toArray() : collection.findOne(query));

			if(!media) return reject({
				error: new Error("Media not found"),
				code: RESULT_CODE.NOT_FOUND
			});

			resolve(media);
		});
	}

	static removeMedia(media) {
		return new Promise((resolve, reject) => {
			Promise.all([
				fs.promises.unlink(Media.getMediaSystemPath(media)),
				...media.versions.length ? [fs.promises.rmdir(Media.getImageSystemDir(media), {recursive: true})] : []
			])
				.then(() => {
					Database.getCollection("media")
						.deleteOne({_id: media._id})
						.then(() => resolve())
						.catch(err => {
							reject({
								error: err,
								code: RESULT_CODE.INTERNAL_ERROR
							});
						});
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
	 * @param {Media | ObjectLiteral & {_id: string}} media
	 * @return {string} 
	 * @memberof Media
	 */
	static getImageSystemDir(media) {
		return path.join(PATH_IMAGES, media._id.toString());
	}

	// eslint-disable-next-line valid-jsdoc
	/**
	 *
	 * @static
	 * @param {Media | ObjectLiteral & {_id: string, extension: string} | string} media
	 * @return {string} 
	 * @memberof Media
	 */
	static getImageSystemPath(media, size = Media.IMAGE_EXTENSIONS[0]) {
		if(typeof media === "string") return path.join(PATH_IMAGES, media); //TODO: ?
		else return path.join(PATH_IMAGES, media._id.toString(), `${size}.jpg`);
	}

	// eslint-disable-next-line valid-jsdoc
	/**
	 *
	 * @static
	 * @param {Media | ObjectLiteral & {_id: string, extension: string} | string} media
	 * @return {string} 
	 * @memberof Media
	 */
	static getMediaSystemPath(media) {
		if(typeof media === "string") return path.join(PATH_MEDIA, media);
		else return path.join(PATH_MEDIA, `${media._id}.${media.extension}`);
	}

	static getMediaURL(media) {
		return `/media/${media._id}.${media.extension}`;
	}

	static getImageURL(media, size = Media.IMAGE_EXTENSIONS[0]) {
		return `/media/images/${media._id}/${size}.jpg`;
	}

	static async createPayload(media, options = {}) {
		return {
			id: media._id,
			filename: media.filename,
			mimetype: media.mimetype,
			url: Media.getMediaURL(media),
			versions: media.versions.map(e => ({
				size: e,
				url: Media.getImageURL(media, e)
			})),
			created: media.created,
		};
	}
}

Server.on("load", e => {
	if(!fs.existsSync(PATH_MEDIA)) fs.mkdirSync(PATH_MEDIA);
	if(!fs.existsSync(PATH_IMAGES)) fs.mkdirSync(PATH_IMAGES);
});

module.exports = {Media};