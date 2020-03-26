const express = require('express');
const cartsRepo = require('../repositories/carts');
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
	res.send('Product added to cart');
});
//recieve a get request to show all items in cart

//recieve a post request to delete an item from a cart

module.exports = router;
