const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true
    },
    manufacturer: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
    },
    warrantyExpirationDate: {
        type: String,
    },
    user: {
        type: String,
        required: true,
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;