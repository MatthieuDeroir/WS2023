const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const authMiddleware = require('../Middlewares/authMiddleware');

router.route('/product')
    .post(authMiddleware.protect, productController.addProduct);
router.route('/products')
    .get(authMiddleware.protect, productController.getProducts)
    .post(authMiddleware.protect, productController.addProducts);

router.route('/product/:serialnumber')
    .get(authMiddleware.protect, productController.getProduct)
    .put(authMiddleware.protect, productController.updateProduct)
    .delete(authMiddleware.protect, productController.deleteProduct);



