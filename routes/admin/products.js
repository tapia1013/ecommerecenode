const express = require('express');
const { validationResult } = require('express-validator');
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.get('/admin/products', (req, res) => { });

router.get('/admin/products/new', (req, res) => {
  res.send(productsNewTemplate({}))
});

router.post(
  '/admin/products/new',
  upload.single('image'),
  [requireTitle, requirePrice],
  async (req, res) => {
    const errors = validationResult(req);

    // // to see the form data, we use req.on cause bodyParder wont allow us to see it with req.body
    // req.on('data', data => {
    //   console.log(data.toString());
    // })



    if (!errors.isEmpty()) {
      return res.send(productsNewTemplate({ errors }))
    }



    // get access to file with multer, so we have to string the req.file image and send it to repo/produc then it sends it to prod.json, base64 encoded turns img to string, not great for production apps
    const image = req.file.buffer.toString('base64');

    // pullout title and price from body
    const { title, price } = req.body;

    await productsRepo.create({ title, price, image })


    res.send('submitted');
  })

module.exports = router;