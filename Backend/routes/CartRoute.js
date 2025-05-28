import express from 'express'
import { AuthMiddleware } from '../middlewares/AuthMiddleware.js'
import { addToCart, getUserCart, removeCartItem, updateCart } from '../controllers/CartController.js'
const cartRoute = express.Router()

cartRoute.post("/add", AuthMiddleware, addToCart)
cartRoute.put("/update", AuthMiddleware, updateCart)
cartRoute.delete("/remove", AuthMiddleware, removeCartItem)
cartRoute.get("/get", AuthMiddleware, getUserCart)

export default cartRoute