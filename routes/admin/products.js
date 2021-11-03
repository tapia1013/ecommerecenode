const express = require('express');
const { validationResult } = require('express-validator')
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();

router.get('/admin/products', (req, res) => {
  res.send(`<h1>Admin page</h1>`)
});

router.get('/admin/products/new', (req, res) => {
  res.send(productsNewTemplate({}))
});

router.post('/admin/products/new', [requireTitle, requirePrice], () => {
  const errors = validationResult(req);

  // to see the form data, we use req.on cause bodyParder wont allow us to see it with req.body
  req.on('data', data => {
    console.log(data.toString());
  })


  res.send('submitted');
})

module.exports = router;