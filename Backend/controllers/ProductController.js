import Product from "../models/ProductModel.js";
import { v2 as cloudinary } from "cloudinary";

// Create Product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, offerPrice, category } = req.body;
        const image1 = req.files.image1 && req.files?.image1?.[0];
        const image2 = req.files.image2 && req.files?.image2?.[0];
        const image3 = req.files.image3 && req.files?.image3?.[0];
        const image4 = req.files.image4 && req.files?.image4?.[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imageUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        );

        await Product.create({
            name,
            description,
            price,
            offerPrice,
            category,
            image: imageUrl
        });

        res.status(201).json({ message: "Product created successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get All Products
export const getAllProduct = async (req, res) => {
    try {
        const product = await Product.find();
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Product by ID
export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get Products by Category
export const getProductsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const product = await Product.find({ category });
        res.status(200).json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update Product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ product: updated });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};
