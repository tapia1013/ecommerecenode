const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');


const router = express.Router();


// Receive a post request to add an item to a cart
router.post('/cart/products', async (req, res) => {
  // console.log(req.body.productId);

  // Figure out the cart! // req.sess.cartId aka cookie
  let cart;
  if (!req.session.cartId) {
    // we dont have a cart we need to create 1 and store the cartId on the req.sess.cartID... property
    cart = await cartsRepo.create({ items: [] });

    req.session.cartId = cart.id;

  } else {
    // We have a cart! Lets get it from the repository
    cart = await cartsRepo.getOne(req.session.cartId);

  }
  // console.log(cart);


  // Either increment quant for existing product OR add product to items array
  const existingItem = cart.items.find(item => item.id === req.body.productId);
  if (existingItem) {
    // increment quant and save cart
    existingItem.quantity++;
  } else {
    // add new product id to items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }

  await cartsRepo.update(cart.id, {
    items: cart.items
  });



  res.redirect('/cart');
});






// Receive a GET request to show all items in cart
router.get('/cart', async (req, res) => {
  if (!req.session.cartId) {
    return res.redirect('/');
  }

  const cart = await cartsRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    // item === {id: , quantity:}
    const product = await productsRepo.getOne(item.id);

    item.product = product;

  }

  res.send(cartShowTemplate({ items: cart.items }))
});





// Receive a post request to delete an items from a cart
router.post('/cart/products/delete', async (req, res) => {
  // console.log(req.body.itemId);

  const { itemId } = req.body;

  const cart = await cartsRepo.getOne(req.session.cartId);

  const items = cart.items.filter((item) => {
    return item.id !== itemId
  })

  await cartsRepo.update(req.session.cartId, { items });


  res.redirect('/cart');
})


module.exports = router;