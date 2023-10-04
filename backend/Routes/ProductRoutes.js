const express = require('express');
const router = express.Router();
const productController = require('../Controllers/ProductController');
const authMiddleware = require('../Middlewares/AuthMiddleware');

// router.route('/product')
//     .post(authMiddleware.protect, productController.addProduct);
router.post('/product', productController.addProduct);
router.post('/products', productController.addProducts);

router.route('/products')
    .get(productController.getProducts)

router.route('/products/:user')
    .get(productController.getProductsByUser)
//     .post(authMiddleware.protect, productController.addProducts);
//
router.route('/product/:serialNumber')
    .get(productController.getProduct)
    .put(authMiddleware.protect, productController.updateProduct)
    .delete(productController.deleteProduct);

module.exports = router;



