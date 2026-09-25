import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cartData: {
        type: Object,
        default: {},
    },
    role: {
        type: String,
        default: "user",
    },
    image: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
    },
    address: {
        type: Object,
        default: {},
    },
}, { minimize: false, timestamps: true });

const User = mongoose.model("user", userSchema)
export default User