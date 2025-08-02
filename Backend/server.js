import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import connectCloudinary from './config/Cloudinary.js'
import productRoute from './routes/ProductRoute.js'
import userRoute from './routes/UserRoute.js'
import cartRoute from './routes/CartRoute.js'
dotenv.config()
const app = express()


const port = process.env.PORT || 5000
connectCloudinary()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("hello world")
})


app.use('/api/product', productRoute)
app.use('/api/user', userRoute)
app.use('/api/cart', cartRoute)

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
}).then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});