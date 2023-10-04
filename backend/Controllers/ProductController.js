const productSchema = require('../models/ProductModel');
const fetchExpirationDateFromWebsite = require("../WebsiteAutomation");


// when a product is added with its serial number and its manufacturer, it triggers a function that will search for its expiration date and its product name

exports.addProduct = async (req, res) => {
    try {
        // Fetch warranty expiration date from website
        const data = await fetchExpirationDateFromWebsite(req.body.serialNumber, req.body.manufacturer)
        const product = new productSchema({
            serialNumber: req.body.serialNumber,
            manufacturer: req.body.manufacturer,
            user: req.body.user,
            productName: data.name,
            warrantyExpirationDate: data.endDate,
        });
        await product.save();
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.addProducts = async (req, res) => {
    try {
        const products = req.body;
        for (let i = 0; i < products.length; i++) {
            // Fetch warranty expiration date from website
            const data = await fetchExpirationDateFromWebsite(products[i].serialNumber, products[i].manufacturer)
            console.log('data', data)
            const product = new productSchema({
                serialNumber: products[i].serialNumber,
                manufacturer: products[i].manufacturer,
                productName: data.endDate,
                warrantyExpirationDate: data.name,
            });
            await product.save();
        }
        res.status(200).json({ message: 'Products added' });
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

exports.getProductsByUser = async (req, res) => {
    try {
        const products = await productSchema.find({ user: req.params.user });
        if (!products) throw new Error('Products not found');
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateProduct = async (req, res) => {
    console.log('body', req.body)
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
        const product = await productSchema.findOneAndDelete({ serialNumber: req.params.serialNumber });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
