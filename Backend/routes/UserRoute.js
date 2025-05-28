import express from 'express'
import { adminLogin, loginUser, registerUser } from '../controllers/UserController.js'
const userRoute = express.Router()

userRoute.post("/register", registerUser)
userRoute.post('/login', loginUser)
userRoute.post('/admin', adminLogin)

export default userRoute