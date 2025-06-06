import express from 'express'
import { createProduct, getAllProduct, getProduct, getProductsByCategory, updateProduct } from '../controllers/ProductController.js'
import upload from '../middlewares/Multer.js'
const productRoute = express.Router()

productRoute.post("/add", upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), createProduct)
productRoute.get("/get", getAllProduct)
productRoute.get("/:id", getProduct)
productRoute.get("/category/:category", getProductsByCategory)
productRoute.put('/update/:id', updateProduct);

export default productRoute