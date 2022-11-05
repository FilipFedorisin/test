const {EventListener, iterate, zip} = require("./JustLib.js");
//const {EventListener, iterate, zip} = require("../justlib/JustLib.js");
const {Command, CommandSegment, GraphNode, MODE} = require("./command");

/**
 * @typedef {import("./command").SegmentMatch} SegmentMatch
 */

/**
 * @typedef {import("./command").GraphMatch} GraphMatch
 */

const ERROR_CODE = {
	UNKNOWN_COMMAND: "UNKNOWN_COMMAND",
	INCOMPLETE_COMMAND: "INCOMPLETE_COMMAND",
	MULTIPLE_INVOKABLE: "MULTIPLE_INVOKABLE"
};

class CLI extends EventListener {
	constructor({stdin, stdout, stderr/*, fixPromises = true*/}, customKeyMap = {}) {
		super();

		/**
		 * @param {String} event Event name
		 * @param {Function} callback Event handler
		 * @type {
				((event: 'command', listener: (event: EventListener.Event & {input: string, command: string, args: string[]}) => void) => EventListener.Listener) &
				((event: 'input', listener: (event: EventListener.Event & {input: string}) => void) => EventListener.Listener) &
				((event: 'stdout', listener: (event: EventListener.Event & {data: string, string: string}) => void) => EventListener.Listener) &
				((event: 'stderr', listener: (event: EventListener.Event & {data: string, string: string}) => void) => EventListener.Listener) &
				((event: 'stderr', listener: (event: EventListener.Event & {data: string, string: string}) => void) => EventListener.Listener) &
				((event: 'unknownCommand', listener: (event: EventListener.Event & {input: string, command: string, args: string[]}) => void) => EventListener.Listener) &
				((event: 'keypress', listener: (event: EventListener.Event & {sequence: string, buffer: string[]}) => void) => EventListener.Listener) &
				((event: 'load', listener: (event: EventListener.Event) => void) => EventListener.Listener)
			}
		*/
		this.on;

		this.stdin = stdin;
		this.stdout = stdout;
		this.stderr = stderr;

		this.prompt = "> ";
		this.promptLines = 1;
		this.autocomplete = "";
		this.hint = "";
		this.buffer = "";
		this.current = "";
		this.cursor = 0;
		this.pointer = 0;
		this.isResumed = false;
		this.printCommand = true;
		this.hasHint = false;

		/** @type {string[]} */
		this.history = [];
		/** @type {Command[]} */
		this.commands = [];
		/** @type {{prompt: string, resolve: (input: string) => void, cachePrompt?: string, isActive?: boolean}[]} */
		this.awaitingInputsQueue = [];

		try {
			const server = require("./server").Server;
			this.formatter = server.formatMessage.bind(server);
		} catch(err) {
			this.formatter = msg => msg;
		}

		this.KEY = {...KEY, ...customKeyMap};
	}

	begin() {
		//Setup stdin
		this.stdin?.setRawMode?.(true);
		this.stdin?.setEncoding?.("utf8");
		this.stdin.on("data", key => this._keyPressed(key, this.stdout));

		//Setup stdout
		this.stdout?.setEncoding?.("utf8");
		this.stdout.__write = this.stdout.write;
		this.stdout.write = (string, encoding, fd) => {
			this.stdout.__write.apply(this.stdout, [(this.isResumed ? "\r\x1b[K" : "") + string, encoding, fd]);
			this._updateCLI();
			this.dispatchEvent("stdout", {data: string, string: this._unescape(string)});
		};

		//Setup stderr
		this.stderr?.setEncoding?.("utf8");
		this.stderr.__write = this.stderr.write;
		this.stderr.write = (string, encoding, fd) => {
			this.stderr.__write.apply(this.stderr, [(this.isResumed ? "\r\x1b[K\r\x1b[K" : "") + string, encoding, fd]);
			this._updateCLI();
			this.dispatchEvent("stderr", {data: string, string: this._unescape(string)});
		};

		//Begin
		this.stdout.write(this.prompt);
		this.resume();

		/* ======= TEST ======= */

		//this.registerCommand(new Command("user <user: string> test"));
		// this.registerCommand(new Command("test foo [abc ssw [baz boo] qaa [oop]] [fab] this bar"));
		this.registerCommand(new Command("aaa [bbb] ccc"));
		//this.registerCommand(new Command("aaa [bbb [ccc]] ddd"));
		// this.registerCommand(new Command("test getUserMedia"));
		// this.registerCommand(new Command("test getUserRealname"));
		// this.registerCommand(new Command("test getMedia"));
		// this.registerCommand(new Command("test getMediaByShortcode test"));
		// this.registerCommand(new Command("test2 getMediaByShortcode test [test2]"));
		// this.registerCommand(new Command("test2 getMediaByShortcode test2"));
		// this.registerCommand(new Command("test2 getMediaByShortcode test2"));
		//this.registerCommand(new Command("qq [aa] bb"));

		//this.registerCommand(new Command("test [foo fab] bar"));
		//this.registerCommand(new Command("test baz qaa llc"));
		//this.registerCommand(new Command("this fab"));
		//this.registerCommand(new Command("faa boo"));
		//this.registerCommand(new Command("faa boom"));
		//this.registerCommand(new Command('faa <bar: "aaa" | "bbb" | "ccc"> <v: boolean>'));

		//this.registerCommand(new Command("fab <n: number> <...values: number>"));
		//this.registerCommand(new Command("fab <s: string> <...values: string>"));
		//this.registerCommand(new Command("fab [bar] <...values: string>"));
		// this.registerCommand(new Command("fab [baz] [bar [foo]] <...values: string>"));
		// this.registerCommand(new Command("fab1 [bar2 [foo3]] baz4"));
		//this.registerCommand(new Command("fab1 [bar2 [foo3]] baz4"));
		//console.dir(this.commands[0], {depth: null});

		//this.registerCommand(new Command("ig user <user: string; #username or id> test", e => console.log("Command invoked!", e)));
		//console.dir(this.commands, {depth: 4});
		// this.registerCommand(new Command("ig user <user: string | number>"));
		// this.registerCommand(new Command("ig user <user: string | number> save story"));
		// this.registerCommand(new Command("ig user <user: string | number> save highlights"));
		// this.registerCommand(new Command("ig user <user: string | number> save posts [limit <limit: number>]"));
		// this.registerCommand(new Command("ig user <user: string | number> save picture"));
		// this.registerCommand(new Command("ig user <user: string | number> save direct"));
		//this.registerCommand(new Command('ig user <user: string | number> save url [type <type: "jpg" | "png" | "mp4">] <...urls: string>', e => { }/* console.dir(e, {depth: 4}) */));
		// this.registerCommand(new Command("ig user <user: string | number> save *"));

		//this.registerCommand(new Command('ig user <user: string | number> save story | highlights | posts [limit <limit: number>] | picture | direct | url [type <type: "jpg" | "png" | "mp4">] <url: string> | *'));
		//this.registerCommand(new Command("ig user <user: string | number> [(save (story|highlights|posts [limit <limit>]|picture|direct|url [type <type>] <url> [...<urls>]|*)|set (priority <priority>|realname <realname>|attribute (private|following|blocked) <value>)|create [custom]|link (ig user <(user_id|username)>|tt user <username>)|unlink (ig|tt)|media <media_id> [(tag <tag_user_id|tag_username> (add|remove)|tags|set type <media_type>)])]"));

		// this.registerCommand(new Command("ig user <user: string | number> set priority <priority: number>"));
		// this.registerCommand(new Command("ig user <user: string | number> set realname <realname: string>"));
		// this.registerCommand(new Command('ig user <user: string | number> set attribute <name: "private" | "following" | "blocked"> <value: boolean>'));
		// this.registerCommand(new Command("ig user <user: string | number> create [custom]"));
		// this.registerCommand(new Command("ig user <user: string | number> link ig user <user: string | number>"));
		// this.registerCommand(new Command("ig user <user: string | number> link tt user <username: string>"));
		// this.registerCommand(new Command("ig user <user: string | number> unlink ig"));
		// this.registerCommand(new Command("ig user <user: string | number> unlink tt"));
		// this.registerCommand(new Command("ig user <user: string | number> media <media_id: string>"));
		// this.registerCommand(new Command("ig user <user: string | number> media <media_id: string> tag <user: string | number> add"));
		// this.registerCommand(new Command("ig user <user: string | number> media <media_id: string> tag <user: string | number> remove"));
		// this.registerCommand(new Command("ig user <user: string | number> media <media_id: string> tags"));
		// this.registerCommand(new Command('ig user <user: string | number> media <media_id: string> set type <type: "jpg" | "png" | "mp4">'));



		//console.dir(this.commands, {depth: null});





		//Add internal event handler for interactive hints and autocomplete
		this.on("keypress", e => {
			return;
			//Input buffer was cleared, so clear the hint and auto completion as well
			if(!this.buffer.length) {
				this.setHint(null);
				this.setAutocomplete(null);
				return;
			}

			//Tokenize the input buffer
			const argv = this.buffer.split(" ");


			/** @type {SegmentMatch[][]} */
			const matches = [];

			//Lookup each command
			for(const command of this.commands) {
				//Match the input with the command graph
				const result = Command.matchGraph(argv, command.graph);

				//Add matching command to the list
				if(result.matches.length) matches.push(result.matches);
			}


			/** @type {Map<string, SegmentMatch>} */
			const map = new Map();

			//Reduce all possible combinations of matched segments to unique segments
			for(const match of matches) {
				for(const node of match) {
					const segment = node.segment;
					const key = `${segment.mode}_${segment.name}`;

					if(!map.has(key)) {
						node.segment = segment.clone();
						map.set(key, node);
					} else {
						map.get(key).segment.merge(segment);
					}
				}
			}

			//Convert the map into an array
			const simplified = Array.from(map.values());


			//Generate command hint
			this.setHint(
				simplified.map(e => {
					const keyword = e.segment.mode == MODE.KEYWORD && "§8Keyword";
					const parameters = e.segment.mode == MODE.PARAMETER && e.segment.types.map(e => `§5${e}`).concat(e.segment.literals.map(l => `§6"${l}"`));
					const eof = e.segment.mode == MODE.EOF && `§eCR`;

					const multParams = parameters.length > 1;

					const name = e.segment.name;
					const type = keyword ||
						parameters && `${multParams ? "§8(" : ""}${parameters.join("§8 | ")}${multParams ? "§8)" : ""}` ||
						eof;

					return type + (name ? ` §3${name}${e.optional ? "§f?" : ""}` : "");
				}).join("§8 | ") || "§4Error"
			);

			//Generate possible completions
			const autocomplete = (function() {
				if(!simplified.length) return null;

				//Create a unique list of possible values
				const lastArg = argv[argv.length - 1];
				const values = [...simplified.reduce((set, e) => ((
					//Select the array of values to add to the list
					e.segment.mode == MODE.KEYWORD ? [e.segment.name] : e.segment.literals.filter(t => t.startsWith(lastArg))
				).forEach(set.add, set), set), new Set())];
				if(!values.length) return null;

				//Lookup characters one by one of the all the matched segments
				for(var i = 0; values[0][i] && values.every(e => e[i] == values[0][i]); i++);

				//Format the completion
				return "§8" + values[0].slice(lastArg.length, i);
			})();

			//Get the comment of the current segment(s)
			const comment = (function() {
				if(!simplified.length) return null;

				//Check if all the segments have the same comment
				const value = simplified.every(e => e.segment.comment == simplified[0].segment.comment) && simplified[0].segment.comment;

				//Format the comment
				return value ? `    §8#${value}` : null;
			})();

			//Set the autocomplete to combination of possible completion and comment
			this.setAutocomplete((autocomplete || "") + (comment || "") || null);
		});

		//Add internal event handler for submitting completion suggestions using tab key
		this.on("keyinput", e => {
			return;
			if(e.key != "\t") return;
			if(!this.autocomplete) return;

			e.key = this.autocomplete.replace(/§[0-9a-fr]/g, "");
			this.setAutocomplete(null);
		});

		this.dispatchEvent("load");
	}

	setParameters({
		prompt = undefined,
		hint = undefined,
		autocomplete = undefined
	} = {}) {
		if(typeof prompt !== "undefined") this.prompt = prompt || "";
		if(typeof hint !== "undefined") this.hint = hint || null;
		if(typeof autocomplete !== "undefined") this.autocomplete = text || null;
		if(this.hint) this.hasHint = true;
		this._updateCLI();
	}

	setPrompt(prompt) {
		this.prompt = prompt || "";
		this.promptLines = this.prompt.split("\n").length;
		this._updateCLI();
	}

	setHint(hint) {
		this.hint = hint || null;
		if(this.hint) this.hasHint = true;
		this._updateCLI();
	}

	setAutocomplete(text) {
		this.autocomplete = text || null;
		this._updateCLI();
	}

	setPrintCommand(state) {
		this.printCommand = !!state;
	}

	pause() {
		this.isResumed = false;
		this.stdin.pause();
	}

	resume() {
		this.isResumed = true;
		this.stdin.resume();
	}

	sendInput(input, cli = this, targetStream = this.stdout) {
		//Output
		if(this.printCommand) this.dispatchEvent("stdout", {
			data: (cli.prompt + input + "\n"),
			string: cli._unescape(cli.prompt + input + "\n")
		});

		//Input
		targetStream.__write.apply(targetStream, ["\r\x1b[K" + (this.printCommand ? cli.prompt + input + "\r\n" : "") + cli.prompt]);

		//Events
		if(this.awaitingInputsQueue.length == 0) {
			//Try to handle the command from input
			try {
				const result = this.parseInput(input);
				if(result) {
					//Command was parsed successfully, emit command event and run the command handler
					this.dispatchEvent("command", {...result}, e => {
						result.command.callback(result);
					});
				}
			} catch(error) {
				//Failed to handle the command, emit an error event or throw an error
				this.dispatchEvent("error", {error}, e => {
					throw error;
				});
			}
		} else if(this.awaitingInputsQueue[0].isActive) {
			const awaitingInput = this.awaitingInputsQueue.shift();
			awaitingInput.resolve(input);
			this.setPrompt(awaitingInput.cachePrompt);
		}

		this.dispatchEvent("input", {input});

		if(this.awaitingInputsQueue.length > 0) {
			const awaitingInput = this.awaitingInputsQueue[0];
			awaitingInput.cachePrompt = this.prompt;
			awaitingInput.isActive = true;
			this.setPrompt(awaitingInput.prompt);
		}
	}


	getInput(prompt = this.prompt) {
		return new Promise((resolve, reject) => {
			this.awaitingInputsQueue.push({
				prompt: prompt,
				resolve: resolve
			});
		});
	}

	parseInput(input) {
		if(!input) return null;

		//Tokenize the input
		const argv = input.split(" ");

		/** @type {{command: Command, result: GraphMatch}[]} */
		const matches = [];

		//Lookup each command
		for(const cmd of this.commands) {
			//Match the input with command graph
			const result = Command.matchGraph(argv, cmd.graph, true);

			//Add matching command to the list
			if(result.matches.length) matches.push({
				command: cmd,
				result: result
			});
		}

		//No matching command found
		if(!matches.length) {
			const error = new Error("Unknown command");
			error.code = ERROR_CODE.UNKNOWN_COMMAND;
			throw error;
		}

		console.dir(matches, {depth: 5});

		//Find out the commands with the most segments matched and filter out non-invokable commands
		const max = matches.reduce((max, e) => Math.max(max, e.result.segments.length), 0);
		const commands = matches.filter(e => e.result.segments.length == max);
		const invokable = commands.filter(e => e.result.invokable);

		//None of the commands are invokable
		if(!invokable.length) {
			const error = new Error("Incomplete command");
			error.code = ERROR_CODE.INCOMPLETE_COMMAND;
			throw error;
		}

		//Multiple invokable commands found
		if(invokable.length > 1) {
			const error = new Error(`Multiple invokable commands matched: '${commands.map(e => e.command.syntax).join("', '")}'`);
			error.code = ERROR_CODE.MULTIPLE_INVOKABLE;
			throw error;
		}

		//console.dir(commands[0], {depth: 4});

		//Return matched results
		return {
			input: input,
			argv: argv,
			command: commands[0].command,
			parameters: commands[0].result.segments.filter(e => e.segment.mode === MODE.PARAMETER).reduce((obj, e) => ((obj[e.segment.name] = CommandSegment.parseValue(e.value, e.segment.types)), obj), {}),
			segments: commands[0].result.segments
		};
	}


	registerCommand(command) {
		this.commands.push(command);
	}

	//eval Server.stdio.cli.setPrompt("test\na>")

	_updateCLI() {
		const offset = this.prompt.length + this.cursor + 1;

		const START = `\x1b[1G`;
		const UP = `\x1bA`;
		const DOWN = `\x1bB`;
		const ERASE_LINE = `\x1b[K`;
		const OFFSET_CURSOR = `\x1b[${offset}G`;

		const autocomplete = this.formatter(this.autocomplete || "");
		const hint = this.hint ? `\n${ERASE_LINE}${this.formatter(this.hint)}${UP}` : this.hasHint && !(this.hasHint = false) ? `\n${ERASE_LINE}${UP}` : "";

		const CLEAR_PROMPT_LINES = this.promptLines == 29 ? `${UP}${ERASE_LINE}\n${UP}\n${DOWN}` : "";
		//`${UP}${START}${ERASE_LINE}`.repeat(this.promptLines - 1); //+ `${DOWN}`;//.repeat(this.promptLines - 1);

		const output = `${START}${ERASE_LINE}${CLEAR_PROMPT_LINES}${this.prompt}${this.buffer}${autocomplete}${START}${hint}${OFFSET_CURSOR}`;

		this.stdout.__write.apply(this.stdout, [output]);
	}

	_unescape(string) {
		return string.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, "");
	}

	_keyCompare(buffer1, buffer2) {
		if(!buffer1 || !buffer2) return false;
		if(buffer1.length != buffer2.length) return false;

		for(var i = 0; i < buffer1.length; i++) {
			if(buffer1[i] != buffer2[i]) return false;
		}
		return true;
	}

	_keyPressed(key, stream = this.stdout) {
		if(key.length > 1 && key.charCodeAt(0) != 27) {
			for(var char of key) {
				this._keyProcess(char, stream);
			}
		} else this._keyProcess(key, stream);
	}

	_keyProcess(key, stream = this.stdout) {
		const buffer = [...key].map(e => e.charCodeAt(0));

		if(this._keyCompare(buffer, this.KEY.SIGINT)) {
			process.kill(process.pid, "SIGINT");
			return null;
		}
		else if(this._keyCompare(buffer, this.KEY.ARROW_UP)) {
			if(this.pointer == this.history.length)
				this.current = this.buffer;
			if(this.pointer) {
				this.buffer = this.history[--this.pointer];
				this.cursor = this.buffer.length;

				this._updateCLI();
			}
		}
		else if(this._keyCompare(buffer, this.KEY.ARROW_DOWN)) {
			if(this.pointer < this.history.length) {
				this.buffer = this.history[++this.pointer] || this.current;
				this.cursor = this.buffer.length;

				this._updateCLI();
			}
		}
		else if(this._keyCompare(buffer, this.KEY.ARROW_LEFT)) {
			this.cursor--;
			if(this.cursor < 0)
				this.cursor = 0;
			else
				stream.__write.apply(stream, [key]);
		}
		else if(this._keyCompare(buffer, this.KEY.ARROW_RIGHT)) {
			this.cursor++;
			if(this.cursor > this.buffer.length)
				this.cursor = this.buffer.length;
			else
				stream.__write.apply(stream, [key]);
		}
		else if(this._keyCompare(buffer, this.KEY.CTRL_ARROW_LEFT)) {
			const jumps = [...this.buffer.matchAll(/\b/g)].map(e => e.index).reverse();
			const index = jumps.find(e => e < this.cursor && this.cursor - e != 1) || 0;

			this.cursor = index;
			this._updateCLI();
		}
		else if(this._keyCompare(buffer, this.KEY.CTRL_ARROW_RIGHT)) {
			const jumps = [...this.buffer.matchAll(/\b/g)].map(e => e.index);
			const index = jumps.find(e => e > this.cursor && e - this.cursor != 1) || this.buffer.length;

			this.cursor = index;
			this._updateCLI();
		}
		else if(this._keyCompare(buffer, this.KEY.BACKSPACE)) {
			this.cursor--;
			if(this.cursor < 0)
				return this.cursor = 0;
			this.buffer = this.buffer.substring(0, this.cursor) + this.buffer.substring(this.cursor + 1);

			this._updateCLI();
		}
		else if(this._keyCompare(buffer, this.KEY.DELETE)) {
			this.buffer = this.buffer.substring(0, this.cursor) + this.buffer.substring(this.cursor + 1);

			this._updateCLI();
		}
		else if(this._keyCompare(buffer, this.KEY.CTRL_BACKSPACE)) {
			const jumps = [...this.buffer.matchAll(/\b/g)].map(e => e.index).reverse();
			const index = jumps.find(e => e < this.cursor && this.cursor - e != 1) || 0;

			this.buffer = this.buffer.substring(0, index) + this.buffer.substring(this.cursor);
			this.cursor = index;

			this._updateCLI();
		}
		else if(this._keyCompare(buffer, this.KEY.CTRL_DELETE)) {
			const jumps = [...this.buffer.matchAll(/\b/g)].map(e => e.index);
			const index = jumps.find(e => e > this.cursor && e - this.cursor != 1) || this.buffer.length;

			this.buffer = this.buffer.substring(0, this.cursor) + this.buffer.substring(index);

			this._updateCLI();
		}
		else if(this._keyCompare(buffer, this.KEY.RETURN)) {
			if(this.buffer && this.buffer != this.history[this.history.length - 1])
				this.pointer = this.history.push(this.buffer);
			else
				this.pointer = this.history.length;

			const input = this.buffer;
			this.buffer = "";
			this.cursor = 0;
			this.sendInput(input, this, this.stdout);
		}
		else {
			this.dispatchEvent("keyinput", {
				key: key,
				buffer: this.buffer
			}, e => {
				//Decode Ctrl+Key keys
				if(e.key.length == 1 && e.key.charCodeAt(0) < 32) {
					e.key = "^" + String.fromCharCode(e.key.charCodeAt(0) + 64);
				}

				//Add key to input buffer
				this.buffer = this.buffer.substring(0, this.cursor) + e.key + this.buffer.substring(this.cursor);
				this.cursor += e.key.length;

				this._updateCLI();
			});
		}

		this.dispatchEvent("keypress", {sequence: key, buffer: buffer});
	}
}

const KEY = {
	SIGINT: [3],
	RETURN: [13],
	BACKSPACE: [8],
	CTRL_BACKSPACE: [127],
	DELETE: [27, 91, 51, 126],
	CTRL_DELETE: [27, 91, 51, 59, 53, 126],
	ARROW_UP: [27, 91, 65],
	ARROW_DOWN: [27, 91, 66],
	ARROW_LEFT: [27, 91, 68],
	CTRL_ARROW_LEFT: [27, 91, 49, 59, 53, 68],
	ARROW_RIGHT: [27, 91, 67],
	CTRL_ARROW_RIGHT: [27, 91, 49, 59, 53, 67]
};

exports.CLI = CLI;
exports.KEY = KEY;
exports.ERROR_CODE = ERROR_CODE;