const {Server} = require("../../server");
const Database = require("../Database");
const Validator = require("../Validator");
const {Auth, USER_ROLE} = require("../Auth");
const {Product} = require("../Product");
const {Cart} = require("../Cart");
const {Api, RESULT_CODE} = require("../Api");

const Schema = require("../schemas");

/* Cart itself */

Server.on("/api/v1/cart/create", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.CUSTOMER), Validator.body(Schema.cart.create)], body => {
		Cart.createCart({user: e.data.user._id, ...e.data.valid_body})
			.then(async cart => Api.sendResponse(e, {cart: await Cart.createPayload(cart)}))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});

Server.on("/api/v1/cart/*/edit", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.CUSTOMER), Validator.matches(Schema.match_id), Validator.body(Schema.cart.edit), Cart.checkOwner], body => {
		const [cart_id] = e.matches;

		Cart.updateCart({_id: cart_id, ...e.data.valid_body})
			.then(async cart => Api.sendResponse(e, {cart: await Cart.createPayload(cart)}))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});

Server.on("/api/v1/cart/*/delete", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.CUSTOMER), Validator.matches(Schema.match_id), Cart.checkOwner], body => {
		const [cart_id] = e.matches;

		Cart.deleteCart({_id: Database.ID(cart_id)})
			.then(() => Api.sendResponse(e))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});


/* Cart content (products) */

Server.on("/api/v1/cart/*/info", e => {
	e.get([Api.async, Auth.requireRole(USER_ROLE.CUSTOMER), Cart.checkOwner], async query => {
		Api.sendResponse(e, {cart: await Cart.createPayload(e.data.cart)});
	}, "json");
});

Server.on("/api/v1/cart/*/clear", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.CUSTOMER), Cart.checkOwner], body => {
		e.data.cart.items = [];

		Cart.updateCart(e.data.cart)
			.then(async cart => Api.sendResponse(e, {cart: await Cart.createPayload(cart)}))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});

Server.on("/api/v1/cart/*/update", e => {
	e.post([Api.async, Auth.requireRole(USER_ROLE.CUSTOMER), Validator.body(Schema.cart.update), Cart.checkOwner], async body => {
		const product = await Product.getProduct({_id: Database.ID(body.product)}).catch(err => err);
		if(product.error) return Api.sendResponse(e, product);

		const variant = product.variants.find(v => v.sku === body.variant);
		if(!variant) return Api.sendResponse(e, {
			status: RESULT_CODE.NOT_FOUND,
			message: "Variant not found"
		});

		const productInCart = e.data.cart.items.find(e => e.product === body.product && e.variant === body.variant);

		if(productInCart) {
			if(body.quantity === 0) {
				e.data.cart.items = e.data.cart.items.filter(e => e.product !== body.product || e.variant !== body.variant);
			} else {
				productInCart.quantity = body.quantity;
			}
		} else {
			e.data.cart.items.push({
				product: body.product,
				variant: body.variant,
				quantity: body.quantity
			});
		}

		Cart.updateCart(e.data.cart)
			.then(async cart => Api.sendResponse(e, {cart: await Cart.createPayload(cart)}))
			.catch(err => Api.sendResponse(e, err));
	}, "json");
});

