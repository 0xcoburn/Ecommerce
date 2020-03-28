const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

//recieve a post request to add an item to a cart
router.post('/cart/products', async (req, res) => {
	//figure out the cart
	let cart;
	if (!req.session.cartId) {
		//we dont have a cart, we need to create one
		//and store the cart id on the req.session.cartId property
		cart = await cartsRepo.create({ items: [] });
		req.session.cartId = cart.id;
	} else {
		//we have a cart lets get it from the repo
		cart = await cartsRepo.getOne(req.session.cartId);
	}
	const existingItem = cart.items.find(
		(item) => item.id === req.body.productId
	);

	if (existingItem) {
		existingItem.quantity++;
	} else {
		cart.items.push({ id: req.body.productId, quantity: 1 });
	}
	await cartsRepo.update(cart.id, {
		items: cart.items
	});
	//either increment quantity for existing product
	//Or add new product to items array
	res.redirect('/cart');
});
//recieve a get request to show all items in cart
router.get('/cart', async (req, res) => {
	if (!req.session.cartId) {
		return res.rediresct('/');
	}

	const cart = await cartsRepo.getOne(req.session.cartId);
	for (item of cart.items) {
		const product = await productsRepo.getOne(item.id);

		item.product = product;
	}
	res.send(cartShowTemplate({ items: cart.items }));
});

router.post('/cart/products/delete', async (req, res) => {
	const { itemId } = req.body;
	const cart = await cartsRepo.getOne(req.session.cartId);

	const items = cart.items.filter((item) => item.id !== itemId);

	await cartsRepo.update(req.session.cartId, { items });
	console.log(itemId);
	res.redirect('/cart');
});
//recieve a post request to delete an item from a cart

module.exports = router;