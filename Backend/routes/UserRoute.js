import express from 'express'
import { adminLogin, loginUser, registerUser, getUserProfile, updateUserProfile } from '../controllers/UserController.js'
import { AuthMiddleware } from '../middlewares/AuthMiddleware.js'
import upload from '../middlewares/Multer.js'

const userRoute = express.Router()

userRoute.post("/register", registerUser)
userRoute.post('/login', loginUser)
userRoute.post('/admin', adminLogin)

// User Profile routes
userRoute.get('/profile', AuthMiddleware, getUserProfile)
userRoute.put('/profile', AuthMiddleware, upload.single('image'), updateUserProfile)
userRoute.post('/profile', AuthMiddleware, upload.single('image'), updateUserProfile)

export default userRoute