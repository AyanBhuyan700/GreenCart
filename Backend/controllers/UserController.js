import User from '../models/UserModel.js'
import { generateToken } from '../config/GenerateToken.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one special character',
            });
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                let newUser = await User.create({
                    username,
                    email,
                    password: hash
                })

                let token = generateToken(newUser);
                res.cookie("token", token, { httpOnly: true });
                res.status(201).json({
                    message: "User created",
                    token,
                    user: {
                        id: newUser._id,
                        username: newUser.username,
                        email: newUser.email,
                        role: newUser.role || "user",
                        image: newUser.image || "",
                        phone: newUser.phone || "",
                        address: newUser.address || {}
                    }
                });

            });
        })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user);
        const role = user.role || (email === process.env.ADMIN_EMAIL || email === "admin@greencart.com" ? "admin" : "user");

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Strict",
        });
        res.status(201).json({
            message: "Login successful",
            token,
            role,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role,
                image: user.image || "",
                phone: user.phone || "",
                address: user.address || {}
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error, please try again" });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server configuration error" });
        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "2h" });

            return res.json({ success: true, token });
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error, please try again" });
    }
};

// Get current user profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please login." });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                image: user.image || "",
                phone: user.phone || "",
                address: user.address || {},
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to fetch profile" });
    }
};

// Update user profile (username, phone, address, profile image)
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please login." });
        }

        const { username, phone, address, image } = req.body;
        const updateData = {};

        if (username) updateData.username = username.trim();
        if (phone !== undefined) updateData.phone = phone.trim();
        if (address) {
            updateData.address = typeof address === "string" ? JSON.parse(address) : address;
        }

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
            updateData.image = result.secure_url;
        } else if (image !== undefined) {
            updateData.image = image;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                image: updatedUser.image || "",
                phone: updatedUser.phone || "",
                address: updatedUser.address || {},
                createdAt: updatedUser.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to update profile" });
    }
};


