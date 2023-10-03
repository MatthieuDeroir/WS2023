const productSchema = require('../models/ProductModel');


// when a product is added with its serial number and its manufacturer, it triggers a function that will search for its expiration date and its product name

exports.addProduct = async (req, res) => {
    try {
        const product = new productSchema({
            serialNumber: req.body.serialNumber,
            manufacturer: req.body.manufacturer,
            productName: req.body.productName,
            warrantyExpirationDate: req.body.warrantyExpirationDate,
        });
        await product.save();
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.addProducts = async (req, res) => {
    try {
        const products = req.body;
        products.forEach(async (product) => {
            const newProduct = new productSchema({
                serialNumber: product.serialNumber,
                manufacturer: product.manufacturer,
                productName: product.productName,
                warrantyExpirationDate: product.warrantyExpirationDate,
            });
            await newProduct.save();
        });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getProducts = async (req, res) => {
    try {
        const products = await productSchema.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getProduct = async (req, res) => {
    try {
        const product = await productSchema.findOne({ serialNumber: req.params.serialNumber });
        if (!product) throw new Error('Product not found');
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const product = await productSchema.findOne({ serialNumber: req.params.serialNumber });
        if (!product) throw new Error('Product not found');

        product.serialNumber = req.body.serialNumber;
        product.manufacturer = req.body.manufacturer;
        product.productName = req.body.productName;
        product.warrantyExpirationDate = req.body.warrantyExpirationDate;

        await product.save();
        res.status(200).json(product);
    } catch (err) {

    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await productSchema.findOne({ serialNumber: req.params.serialNumber });
        if (!product) throw new Error('Product not found');

        await product.delete();
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}