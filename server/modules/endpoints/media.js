const {Server} = require("../../server");
const Database = require("../Database");
const Validator = require("../Validator");
const {Auth, USER_ROLE} = require("../Auth");
const {Api} = require("../Api");
const {Media} = require("../Media");

const Schema = require("../schemas");

//50 MB
const MAX_PAYLOAD_SIZE_B = 50 * 1024 * 1024;

Server.on("/api/v1/media/upload", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.ADMIN), Media.limitSize(MAX_PAYLOAD_SIZE_B)/*, Validator.body(Schema.user.signup)*/], async body => {

		const files = body["files"].files;
		const promises = [];
		const results = [];

		for(const {mimetype, filepath, originalFilename} of files) {
			const _media = {
				mimetype,
				filepath,
				filename: originalFilename
			};

			const promise = Media.saveMedia(_media);
			promises.push(promise);

			promise.then(async media => {
				results.push({
					filename: media.filename,
					uploaded: true,
					media: await Media.createPayload(media)
				});
			}).catch(err => {
				results.push({
					filename: originalFilename,
					uploaded: false,
					error: {
						message: err.error.message,
						code: err.code
					}
				});
			});
		}

		//Wait for all promises to resolve
		await Promise.allSettled(promises);

		Api.sendResponse(e, {
			files: results
		});
	}, "multipart");
});

Server.on("/api/v1/media/*/remove", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.ADMIN), Validator.matches(Schema.match_id)], async body => {
		const media_id = e.matches[0];

		Media.getMedia({_id: Database.ID(media_id)}).then(async media => {
			await Media.removeMedia(media).then(() => {
				Api.sendResponse(e, {removed: true});
			});
		}).catch(err => {
			Api.sendResponse(e, err);
		});
	}, "json");
});

Server.on("/media/*", e => {
	e.get([Api.async], async query => {
		const media_file = e.matches[0];

		e.streamFile(Media.getMediaSystemPath(media_file));
	});
});