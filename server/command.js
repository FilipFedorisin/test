const {EventListener, iterate} = require("./JustLib.js");
//const {EventListener, iterate, zip} = require("../justlib/JustLib.js");

/**
 * @typedef {number} CommandParserMode
 */

/**
 * @typedef {Object} SegmentMatch
 * @prop {CommandSegment} segment
 * @prop {boolean} optional
 */

/**
 * @typedef {Object} GraphMatch
 * @prop {boolean} invokable
 * @prop {SegmentMatch[]} matches
 * @prop {{segment: CommandSegment, value: string}[]} segments
 */

/**
 * @typedef {Object} CommandCallback
 */

/**
 * @enum {CommandParserMode}
 */
const MODE = {
	NONE: 1 << 1,
	BOF: 1 << 2,
	EOF: 1 << 3,
	KEYWORD: 1 << 4,
	PARAMETER: 1 << 5,
	IDENTIFIER: 1 << 6,
	TYPE: 1 << 7,
	OPTIONAL: 1 << 8,
	PROPERTIES: 1 << 9,
	COMMENT: 1 << 10
};
// const MODE = {
// 	NONE: 0,
// 	BOF: 1,
// 	EOF: 2,
// 	KEYWORD: 3,
// 	PARAMETER: 4,
// 	PARAMETER_NAME: 5,
// 	PARAMETER_TYPE: 6,
// 	OPTIONAL: 7,
// 	PARAMETER_PROPS: 8,
// 	PARAMETER_COMMENT: 9
// };

class Command extends EventListener {
	/**
	 * Creates an instance of Command.
	 * @param {string} syntax
	 * @param {Function | Object<string, any>} callback_options
	 * @param {Function} [callback=undefined]
	 * @memberof Command
	 */
	constructor(syntax, callback_options, callback = undefined) {
		super();

		//Constructor overloading
		if(typeof callback_options === "function") {
			this.options = {};
			this.callback = callback_options;
		} else if(typeof callback_options === "object") {
			this.options = callback_options;
			this.callback = callback;
		} else {
			this.callback = () => { };
			//throw new Error("Invalid arguments: Second argument must be a function or an object");
		}

		/** @type {string} */
		this.syntax = syntax;

		/** @type {Object<string, any>} */
		this.options;

		/** @type {Function} */
		this.callback;


		/** @type {CommandSegment[]} */
		this.segments = Command.parse(this.syntax);

		/** @type {GraphNode} */
		this.graph = Command.generateGraph(this.segments);
	}

	/**
	 *
	 * @static
	 * @param {CommandSegment[]} segments
	 * @returns {GraphNode}
	 * @memberof Command
	 */
	static generateGraph(segments) {
		//Create additional BOF and EOF nodes
		segments = segments.slice();
		segments.unshift(new CommandSegment({mode: MODE.BOF}));
		segments.push(new CommandSegment({mode: MODE.EOF}));

		//Make sure to clear the cache memory
		this.__clear_cache();
		const graph = this.__generate_graph(segments);
		this.__clear_cache();

		return graph;
	}

	//"aaa [bbb [ccc]] ddd"
	//"aaa [bbb] ccc"
	static __generate_graph(input, rid = 0) {
		if(input instanceof CommandSegment) input = [input];

		//Create the root node
		const graph = this.__create_node(input[0]);
		let parent = graph;

		//parent.children.push("SOF-" + rid);

		/** @type {GraphNode[]} */
		let prev = [];

		//Iterate through the segments
		for(let i = 0/*1*/; i < input.length; i++) {
			const child = input[i];

			if(Array.isArray(child)) {
				const node = this.__generate_graph(child);

				let ch = [node.children];

				while(ch.length) {
					const a = ch.shift();
					for(const b of a) {
						//do proccessing

						if(b === "EOF-0") {
							a.splice(a.indexOf(b), 1, ...prev);
						} else {
							ch.push(b.children);
						}
					}
				}

				prev.push(node);

				// let last = node.children[node.children.length - 1] || node;
				// while(last && last.children.length) last = last.children[last.children.length - 1];

				// if(last && input[i + 1]) {
				// 	let next = input[i + 1];

				// 	if(Array.isArray(next)) {
				// 		for(let j = i; Array.isArray(next = input[j + 1]); j++) {
				// 			last.children.push(this.__generate_graph(next));
				// 		}
				// 	}

				// 	if(next) last.children.push(this.__create_node(next));
				// }

				//parent.children.push(node);
			} else {
				//parent.children.push(parent = this.__create_node(child));
				const node = this.__create_node(child);
				// parent.children.push(node);
				// parent = node;

				prev.forEach(e => {
					e.children.push(node);
				});

				prev = [node];
			}



			//console.dir({prev}, {depth: 3});
		}

		parent.children.push("EOF-" + rid);

		// for(let i = 1; i < input.length; i++) {
		// 	const child = input[i];

		// 	if(Array.isArray(child)) {
		// 		const node = this.__generate_graph(child);
		// 		prev.push(node);

		// 		// let last = node.children[node.children.length - 1] || node;
		// 		// while(last && last.children.length) last = last.children[last.children.length - 1];

		// 		// if(last && input[i + 1]) {
		// 		// 	let next = input[i + 1];

		// 		// 	if(Array.isArray(next)) {
		// 		// 		for(let j = i; Array.isArray(next = input[j + 1]); j++) {
		// 		// 			last.children.push(this.__generate_graph(next));
		// 		// 		}
		// 		// 	}

		// 		// 	if(next) last.children.push(this.__create_node(next));
		// 		// }

		// 		parent.children.push(node);
		// 	} else {
		// 		parent.children.push(parent = this.__create_node(child));
		// 		prev = [parent];
		// 	}
		// }

		return graph;
	}

	static __create_node(segment) {
		//Check for cached node
		const cached = this.__nodes_cache.get(segment);
		if(cached) return cached;

		//Create new node and cache it
		const node = {
			segment: segment,
			children: []
		};
		this.__nodes_cache.set(segment, node);

		//Return the node
		return node;
	}

	static __clear_cache() {
		this.__nodes_cache.clear();
	}

	static __nodes_cache = new Map();

	/**
	 *
	 * @static
	 * @param {string} syntax
	 * @param {string} [delimiter=" "]
	 * @return {CommandSegment[]} 
	 * @memberof Command
	 */
	static parse(syntax, delimiter = " ") {
		let index = -1;
		let ch = "";
		let buffer = "";
		let stringBuffer = "";
		let mode = MODE.NONE;
		let optionalLevel = 0;
		let isRest = false;
		let isString = false;
		let parameter = null;
		const segments = [];

		syntax += " ";

		function flushBuffer() {
			const tmp = buffer.trim();
			buffer = "";
			return tmp;
		}

		function flushStringBuffer() {
			const tmp = stringBuffer;
			stringBuffer = "";
			return tmp;
		}

		while(ch = syntax[++index]) {
			buffer += ch;
			if(isString) stringBuffer += ch;

			if(!(mode & MODE.OPTIONAL) && !isString && !optionalLevel) {
				if(ch == "]") throw new SyntaxError(`Unexpected token '${ch}' at 1:${index}`);
			}

			if(mode & MODE.NONE) {
				if(ch == "[") {
					mode = MODE.OPTIONAL;
				} else if(ch == "<") {
					flushBuffer();
					mode = MODE.PARAMETER | MODE.IDENTIFIER;
				} else if(ch != delimiter) {
					mode = MODE.KEYWORD;
				}
			}

			if(mode & MODE.OPTIONAL) {
				if(ch == "[") {
					optionalLevel++;
				} else if(ch == "]") {
					optionalLevel--;
					if(!optionalLevel) {
						const optionalSyntax = flushBuffer().slice(1, -1);
						segments.push(this.parse(optionalSyntax));
						mode = MODE.NONE;
					}
				}
			}

			if(mode & MODE.KEYWORD) {
				if(ch == delimiter) {
					segments.push(new CommandSegment({
						mode: MODE.KEYWORD,
						name: flushBuffer()
					}));
					mode = MODE.NONE;
				}
			}

			if(mode & MODE.PARAMETER) {

				if(mode & MODE.IDENTIFIER) {
					if(syntax.slice(index - 2, index + 1) == "...") {
						flushBuffer();
						isRest = true;
					} else if(ch == ":" || ch == ";") {
						parameter = {
							mode: MODE.PARAMETER,
							name: flushBuffer().slice(0, -1).trim(),
							types: [],
							literals: [],
							isRest: isRest
						};

						isRest = false;
						if(ch == ":") mode = MODE.PARAMETER | MODE.TYPE;
						else if(ch == ";") mode = MODE.PARAMETER | MODE.PROPERTIES; //Type definition omitted
					}
				}

				//Parameter type defintion ends
				if((ch == ">" || ch == ";") && !isString) {
					//Flush the buffer and add the type or literal to the parameter
					if(mode & MODE.TYPE) {
						const bufferContent = flushBuffer();

						if(stringBuffer) parameter.literals.push(flushStringBuffer());
						else parameter.types.push(bufferContent.slice(0, -1).trim());

						if(ch == ";") mode = MODE.PARAMETER | MODE.PROPERTIES;
					}
				}



				// if(ch == ";" && !isString) {
				// 	if(mode & MODE.PROPERTIES) {
				// 		const bufferContent = flushBuffer();

				// 		if(stringBuffer) parameter.literals.push(flushStringBuffer());
				// 		else parameter.types.push(bufferContent.slice(0, -1).trim());
				// 	}
				// }

				//Defining a parameter type
				if(mode & MODE.TYPE) {
					/*if((ch == ">" || ch == ";") && !isString) {
						const bufferContent = flushBuffer();

						if(stringBuffer) parameter.literals.push(flushStringBuffer());
						else parameter.types.push(bufferContent.slice(0, -1).trim());

						if(ch == ">") {
							segments.push(new CommandSegment(parameter));

							parameter = null;
							mode = MODE.NONE;
						} else if(ch == ";") {
							mode = MODE.PROPERTIES;
						}
					} else */if(ch == "|" && !isString) {
						const bufferContent = flushBuffer();

						if(stringBuffer) parameter.literals.push(flushStringBuffer());
						else parameter.types.push(bufferContent.slice(0, -1).trim());
					} else if(ch == "\"" && syntax[index - 1] != "\\"/* TODO: Extract to constant */) {
						isString = !isString;
						if(!isString) stringBuffer = stringBuffer.slice(0, -1);
					}
				}

				if(mode & MODE.PROPERTIES) {
					//Next property
					if((ch == ";" || ch == ">"/* Don't need to put ';' at the end */) && syntax[index - 1] != "\\") {

						//End of comment
						if(mode & MODE.COMMENT) {
							parameter.comment = flushBuffer().slice(0, -1).trim();
							//console.log(parameter);
						}

						//Reset the flags
						isString = false;
						mode = MODE.PARAMETER | MODE.PROPERTIES;
					}

					//Enable capturing for comments
					if(ch == "#" && !isString) {
						flushBuffer();
						isString = true;
						mode = MODE.PARAMETER | MODE.PROPERTIES | MODE.COMMENT;
					}
				}

				//Parameter defintion ends
				if(ch == ">" && !isString) {
					//The parameter is now defined, add it to the list
					flushBuffer();
					segments.push(new CommandSegment(parameter));
					parameter = null;
					mode = MODE.NONE;
				}
			}
		}

		const segmentsFlat = segments.flat(Infinity);
		const restIndex = segmentsFlat.findIndex(e => e.isRest);

		if(restIndex != segmentsFlat.length - 1 && restIndex != -1) throw new SyntaxError(`Rest parameter must be last formal parameter`);
		if(isString) throw new SyntaxError(`Unexpected end of the string`);
		if(optionalLevel) throw new SyntaxError(`Unexpected end of optional group`);

		return segments;
	}



	/**
	*
	* @static
	* @param {string[]} args
	* @param {GraphNode} graph
	* @param {number} _d
	* @returns {GraphMatch}
	*/
	static matchGraph(args, graph, debug = false) {
		const result = {
			invokable: false,
			matches: [],
			segments: []
		};

		//Create a LIFO stack
		let stack = [...graph.children.map(e => ({
			node: e,
			args: args.slice()
		}))];

		//Loop until there are no more nodes to process
		while(stack.length) {
			const {node, args} = stack.pop();
			const arg = args.shift();

			const isRest = node.segment.isRest;
			const isEof = node.segment.mode === MODE.EOF;
			const hasFullMatch = node.segment.match(arg);
			const hasPartialMatch = node.segment.match(arg, true);
			const hasArgs = args.length;

			debug && console.log("==============");
			debug && console.log({
				node,
				arg,
				isRest,
				isEof,
				hasFullMatch,
				hasPartialMatch,
				hasArgs
			});

			if(hasFullMatch && hasArgs) {
				//Segment has a full match and there are still arguments left ('> foo |'), so need new matches.
				//In such case, we need to lookup all the children of this node.

				//Pick next nodes to lookup (if the segment is rest, just keep looping it).
				//Need to use reverse in order to keep the original order of segments, because of nature of the stack.
				//Use sort to make sure that the rest parameter has the lowest priority and is always processed last.
				const children = isRest ? [node] : node.children.slice().reverse().sort((a, b) => b.segment.isRest - a.segment.isRest);
				debug && console.dir({
					children: children
				}, {depth: 3});

				//If non-rest segment is beeing processed and its children contain a rest segment,
				//we successfully matched the whole branch. But there is a case when this branch
				//is optional and the rest segment is reachable from upper branches. That means that
				//the stack already contains a node with a rest segment. To prevent matching optional
				//branch as rest parameters, we need to remove the rest segment from upper branches from
				//the stack. This will ensure that the rest segment will be processed as the last option.
				if(children.some(e => e.segment.isRest) && stack.some(e => e.node.segment.isRest)) {
					debug && console.log("Rest node in stack and in children");
					stack = stack.filter(e => !e.node.segment.isRest);
				}

				//If rest segment is beeing processed and stack still contains non-rest segments,
				//we can clear the stack since we can consider the branched fully matched.
				//Without this check, after finishing processing of the rest segment, the stack would
				//still contain already matched segments.
				if(isRest && stack.some(e => !e.node.segment.isRest)) {
					debug && console.log("Processing rest node but stack contains non-rest nodes");
					stack = [];
				}

				//Collect all children and stack them for next iteration
				// stack.push(...children.map(e => ({
				// 	node: e,
				// 	args: args.slice()
				// })));
				for(const child of children) {
					const index = stack.findIndex(e => e.node.segment === child.segment);
					if(index > -1) {
						debug && console.log("Found child in stack, replacing");
						stack.splice(index, 1);
					}

					stack.push({
						node: child,
						args: args.slice()
					});
				}
			} else if(hasPartialMatch && !hasArgs) {
				//Segment has a partial match and there are no arguments left ('> foo|').
				//In such case, we need to collect partially matching (or potentially fully matching) children of this node.

				//Register a new match
				if(!isRest && hasFullMatch && stack.some(e => e.node.segment.isRest)) { //?
					stack = stack.filter(e => !e.node.segment.isRest);
				}

				result.matches.push({
					segment: node.segment,
					optional: false
				});

				// if(isRest && hasFullMatch) {
				// 	result.matches.push({
				// 		segment: node.children.find(e => e.segment.mode === MODE.EOF).segment,
				// 		optional: false
				// 	});
				// }

				// const children = isRest ? [node] : node.children.slice().reverse().sort((a, b) => b.segment.isRest - a.segment.isRest);
				// for(const child of children) {
				// 	const index = stack.findIndex(e => e.node.segment === child.segment);
				// 	if(index > -1) {
				// 		debug && console.log("Found child in stack, replacing");
				// 		stack.splice(index, 1);
				// 	}

				// 	stack.push({
				// 		node: child,
				// 		args: args.slice()
				// 	});
				// }
			}

			if(isRest && !hasFullMatch && !hasPartialMatch) {
				result.invokable = false;
				result.matches = [];
				result.segments = [];
				return result;
			}


			if(isRest && result.segments[result.segments.length - 1]?.segment === node.segment) {
				result.segments[result.segments.length - 1].value.push(arg);
			} else if(!isEof && hasFullMatch) {
				debug && console.log({
					segment: node.segment,
					isRest,
					hasFullMatch,
					hasPartialMatch,
					arg
				});
				result.segments.push({
					segment: node.segment,
					value: isRest ? [arg] : arg
				});
			}

			if(isEof || hasFullMatch && node.children.some(e => e.segment.mode === MODE.EOF)) result.invokable = true;

			debug && console.dir({
				stack
			}, {depth: 4});
		}

		//Return all registered matches
		return result;
	}
}

class CommandSegment {
	constructor({
		mode = MODE.NONE,
		name = "",
		comment = "",
		types = [],
		literals = [],
		isRest = false
	} = {}) {
		/**
		 * @type {CommandParserMode}
		 */
		this.mode = mode;

		/**
		 * @type {string}
		 */
		this.name = name;

		/**
		 * @type {string}
		 */
		this.comment = comment;

		/**
		 * @type {string[]}
		 */
		this.types = types;

		/**
		 * @type {string[]}
		 */
		this.literals = literals;

		/**
		 * @type {boolean}
		 */
		this.isRest = isRest;
	}

	/**
	 *
	 * @param {string} input
	 * @param {boolean} [partial=false]
	 * @return {boolean} 
	 * @memberof CommandSegment
	 */
	match(input, partial = false) {
		if(partial && input.trim() === "") return true;

		if(this.mode === MODE.KEYWORD) {
			if(partial) return this.name.startsWith(input);
			else return input == this.name;
		} else if(this.mode === MODE.PARAMETER) {
			let match = 1;

			//Match typings
			if(this.types.length/* && !partial*/) match *= this.types.some(e => CommandSegment.compareType(input, e));

			//console.log(this.name, input, match, partial);

			//Match literal values
			if(partial) {
				if(this.literals.length) match *= this.literals.some(e => e.startsWith(input));
			} else {
				if(this.literals.length) match *= this.literals.some(e => e == input);
			}

			return !!match;
		} else if(this.mode === MODE.BOF || this.mode === MODE.EOF) {
			return input.trim() === "";
		}
	}

	/**
	 *
	 * @param {CommandSegment} segment
	 * @return {CommandSegment} 
	 * @memberof CommandSegment
	 */
	merge(segment) {
		if(this.mode !== segment.mode) throw new SyntaxError(`Cannot merge segments of different types`);

		this.name = segment.name;
		this.types = this.types.concat(segment.types.filter(e => this.types.indexOf(e) < 0));
		this.literals = this.literals.concat(segment.literals.filter(e => this.literals.indexOf(e) < 0));
		if(this.isRest || segment.isRest) this.isRest = true;

		return this;
	}

	/**
	 *
	 * @return {CommandSegment} 
	 * @memberof CommandSegment
	 */
	clone() {
		return new CommandSegment(this);
	}

	/**
	 * Compares value with type
	 * @static
	 * @param {string} value
	 * @param {string} type
	 * @returns {boolean}
	 * @memberof CommandSegment
	 */
	static compareType(value, type) {
		if(type === "number") {
			return !isNaN(value) && value !== "";
		} else if(type === "string") {
			return typeof value === "string";
		} else if(type === "boolean") {
			return typeof value === "boolean" || value === "true" || value === "false";
		} else if(type === "date") {
			return value && !isNaN(Date.parse(value));
		}
	}

	/**
	 * Tries to parse value as type
	 * @static
	 * @param {string} value
	 * @param {string[]} types
	 * @returns {boolean}
	 * @memberof CommandSegment
	 */
	static parseValue(value, types) {
		if(types.includes("number") && this.compareType(value, "number")) {
			return parseFloat(value);
		} else if(types.includes("boolean") && this.compareType(value, "boolean")) {
			return value === "true";
		} else if(types.includes("date") && this.compareType(value, "date")) {
			return new Date(value);
		} else if(types.includes("string")) {
			return value + "";
		}
	}
}

class GraphNode {
	constructor(segment) {
		/**
		 * @type {CommandSegment}
		 */
		this.segment = segment;

		/**
		 * @type {GraphNode[]}
		 */
		this.children = [];
	}
}

module.exports = {
	Command,
	CommandSegment,
	GraphNode,
	MODE
};