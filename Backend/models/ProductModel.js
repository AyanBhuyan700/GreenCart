import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    offerPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: Array,
        required: true,
    },
    inStock: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })

const Product = mongoose.model("product", productSchema)
export default Product