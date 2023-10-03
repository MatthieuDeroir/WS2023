import mongoose from "mongoose";

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
        type: Date,
    },
});

const Product = mongoose.model("Product", productSchema);

export default Product;