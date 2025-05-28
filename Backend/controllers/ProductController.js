import Product from "../models/ProductModel.js";
import { v2 as cloudinary } from "cloudinary";
import redisClient from "../config/RedisClient.js";

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, offerPrice, category } = req.body
        const image1 = req.files.image1 && req.files?.image1?.[0]
        const image2 = req.files.image2 && req.files?.image2?.[0]
        const image3 = req.files.image3 && req.files?.image3?.[0]
        const image4 = req.files.image4 && req.files?.image4?.[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imageUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url
            })
        )

        const productData = await Product.create({
            name,
            description,
            price,
            offerPrice,
            category,
            image: imageUrl
        })

        res.status(201).json({ message: "Product created successfully" });
        await redisClient.del('all_products');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getAllProduct = async (req, res) => {
    try {

        const cacheKey = 'all_products';

        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.json({ success: true, product: JSON.parse(cachedData), cached: true });
        }

        const product = await Product.find()
        await redisClient.set(cacheKey, JSON.stringify(product), { EX: 3600 });
        res.json({ success: true, product })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `product_${id}`;

        const cachedProduct = await redisClient.get(cacheKey);
        if (cachedProduct) {
            return res.status(200).json({ success: true, product: JSON.parse(cachedProduct), cached: true });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        await redisClient.set(cacheKey, JSON.stringify(product), { EX: 3600 });
        res.status(200).json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const category = req.params.category
        const product = await Product.find({ category })
        res.status(200).json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ product: updated });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
}