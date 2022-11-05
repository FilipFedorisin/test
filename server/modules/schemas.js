const schema = {};

schema.id = {
	type: "string",
	length: 24,
	match: /^[0-9a-f]{24}$/
};

schema.match_id = {
	type: "array",
	keepOrder: true,
	keepLength: true,
	items: [schema.id]
};

schema.sku = {
	type: "string",
	length: 12,
	match: /^[A-Z]{3}-[A-Z0-9]{5}-[0-9]{2}$/
};

schema.user = {
	"signup": {
		properties: {
			"firstname": {
				type: "string",
				min: 3,
				max: 32
			},
			"lastname": {
				type: "string",
				min: 3,
				max: 32
			},
			"email": {
				type: "string",
				match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
			},
			"mobile": {
				type: "string",
				min: 8,
				max: 16
			},
			"password": {
				type: "string",
				min: 8,
				max: 64
			},
			"privacy": {
				type: "boolean",
				equals: true
			}
		}
	},
	"edit": {
		properties: {
			"firstname": {
				type: "string",
				min: 3,
				max: 32
			},
			"lastname": {
				type: "string",
				min: 3,
				max: 32
			},
			"email": {
				type: "string",
				match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
			},
			"mobile": {
				type: "string",
				min: 8,
				max: 16
			}
		}
	},
	"login": {
		properties: {
			"email": {
				type: "string",
				empty: false
			},
			"password": {
				type: "string",
				empty: false,
				min: 8,
				max: 64
			}
		}
	},
	"search": {
		properties: {
			"query": {
				type: "string",
				min: 2,
				max: 64
			},
			"last_id": {
				...schema.id,
				optional: true,
				defaultValue: null
			}
		}
	}
};

schema.product = {
	"create": {
		properties: {
			"name": {
				type: "string",
				min: 4,
				max: 64
			},
			"description": {
				type: "string",
				min: 16,
				max: 4096
			},
			"short_description": {
				type: "string",
				min: 8,
				max: 256
			},
			"category": {
				type: "string",
				min: 4,
				max: 64
			},
			"unit": {
				type: "string",
				//TODO: add unit validation
			},
			"unit_price": {
				type: "float",
				min: 0
			},
			"quantity": {
				type: "number",
				min: 0
			},
			"vat": {
				type: "float",
				optional: true,
				defaultValue: 20,
				min: 0,
				max: 100
			},
			"thumbnail": schema.id,
			"gallery": {
				type: "array",
				min: 1,
				max: 16,
				items: [schema.id]
			},
			"variants": {
				type: "array",
				items: [{
					properties: {
						"color": {type: "string", optional: true},
						"size": {type: "string", optional: true}
					}
				}]
			},
			"parameters": {
				type: "array",
				optional: true,
				defaultValue: [],
				items: [{
					type: "object",
					optional: true,
					properties: {
						"name": {
							type: "string",
							min: 1,
							max: 64
						},
						"value": {
							type: "string",
							min: 0,
							max: 256
						}
					}
				}]
			}
		}
	},
	"edit": undefined,
	"update_stock": {
		properties: {
			"quantity": {
				type: "number",
				min: 0
			},
			"description": {
				type: "string",
				optional: true,
				defaultValue: "",
				min: 16,
				max: 1024
			}
		}
	},
	"search": {
		properties: {
			"query": {
				type: "string",
				min: 2,
				max: 64
			},
			"last_id": {
				...schema.id,
				optional: true,
				defaultValue: null
			}
		}
	}
};
schema.product.edit = schema.product.create;

schema.review = {
	"create": {
		properties: {
			"content": {
				type: "string",
				min: 16,
				max: 1024
			},
			"rating": {
				type: "float",
				min: 0,
				max: 1
			},
			"cons": {
				type: "array",
				//Outer empty has higher priority than inner
				empty: true,
				items: [{
					type: "string",
					min: 4,
					max: 128
				}]
			},
			"pros": {
				type: "array",
				//Outer empty has higher priority than inner
				empty: true,
				items: [{
					type: "string",
					min: 4,
					max: 128
				}]
			},
		}
	},
	"edit": {
		properties: {
			"content": {
				type: "string",
				min: 16,
				max: 1024
			}
		}
	},
	"delete": {},
	"like": {}
};

schema.media = {
	"upload": {}
};

schema.cart = {
	"create": {
		properties: {
			"name": {
				type: "string",
				min: 2,
				max: 64
			}
		}
	},
	"edit": {
		properties: {
			"name": {
				type: "string",
				min: 2,
				max: 64
			}
		}
	},
	"update": {
		properties: {
			"product": schema.id,
			"variant": schema.sku,
			"quantity": {
				type: "number",
				min: 0
			}
		}
	}
};

module.exports = schema;