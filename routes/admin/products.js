const express = require('express');
// const { validationResult } = require('express-validator');
const multer = require('multer');


const { handleErrors, requireAuth } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.get('/admin/products', requireAuth, async (req, res) => {

  const products = await productsRepo.getAll();

  res.send(productsIndexTemplate({ products }))
});

router.get('/admin/products/new', requireAuth, (req, res) => {
  res.send(productsNewTemplate({}))
});

router.post(
  '/admin/products/new',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
  // this is the next() from middlewares
  handleErrors(productsNewTemplate),
  async (req, res) => {


    // get access to file with multer, so we have to string the req.file image and send it to repo/produc then it sends it to prod.json, base64 encoded turns img to string, not great for production apps
    const image = req.file.buffer.toString('base64');

    // pullout title and price from body
    const { title, price } = req.body;

    await productsRepo.create({ title, price, image })

    res.redirect('/admin/products')
  }
);

router.get(
  '/admin/products/:id/edit',
  requireAuth,
  async (req, res) => {
    // captures url 
    // console.log(req.params.id);

    // retrieve product from repository
    const product = await productsRepo.getOne(req.params.id);

    // check if product found
    if (!product) {
      return res.send('Product not found');
    }

    res.send(productsEditTemplate({ product }))

  });

router.post(
  '/admin/products/:id/edit',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
  // 2nd argument helps with handleError bug
  handleErrors(productsEditTemplate, async (req) => {
    const product = await productsRepo.getOne(req.params.id);
    // get {products} into our template
    return { product };
  }),
  async (req, res) => {
    const changes = req.body;

    if (req.file) {
      changes.image = req.file.buffer.toString('base64');
    }

    try {
      await productsRepo.update(req.params.id, changes);
    } catch (err) {
      return res.send('Could not find item');
    }

    res.redirect('/admin/products');
  }
);

router.post(
  '/admin/products/:id/delete',
  requireAuth,
  async (req, res) => {
    await productsRepo.delete(req.params.id);

    res.redirect('/admin/products')
  }
);


module.exports = router;