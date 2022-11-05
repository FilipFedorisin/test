const {Server} = require("../server");
const {spawn} = require("child_process");
const path = require("path");
const fs = require("fs");

const PATH_FFMPEG = process.env.FFMPEGPATH || Server.config.path.ffmpeg || process.env.SystemDrive + "/FFmpeg/bin/ffmpeg.exe";
const PATH_FFPROBE = process.env.FFPROBEPATH || Server.config.path.ffprobe || process.env.SystemDrive + "/FFmpeg/bin/ffprobe.exe";

class ImageProcessor {
	static async resize(input, output, width = -1, height = -1) {
		return new Promise((resolve, reject) => {
			const args = String.raw`-hide_banner -loglevel error -i ${input} -vf scale='${width}:${height}' -y ${output}`;
			const error = new Error();
			error.message += `{input: ${input}, output: ${output}, width: ${width}, height: ${height}}\n`;

			const ffmpeg = spawn(PATH_FFMPEG, args.split(" "));
			ffmpeg.stderr.on("data", data => {
				error.message += data.toString("utf8");
			});
			ffmpeg.on("error", error => {
				reject({code: -1, error});
			});
			ffmpeg.on("close", code => {
				if(code === 0) resolve(output);
				else reject({code, error});
			});
		});
	}
}

module.exports = {ImageProcessor};