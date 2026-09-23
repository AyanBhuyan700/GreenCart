import Order from '../models/OrderModel.js';
import User from '../models/UserModel.js';

// Placing orders using COD or Online Payment
export const placeOrder = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { items, amount, address, paymentMethod, paymentStatus, transactionId } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: "Order must contain at least one item." });
        }

        const newOrder = new Order({
            userId,
            items,
            amount: Number(amount) || 0,
            address: address || {},
            paymentMethod: paymentMethod || "COD",
            payment: paymentStatus === "Paid" || paymentMethod === "Online",
            transactionId: transactionId || null,
            status: "Order Placed",
            date: new Date()
        });

        await newOrder.save();

        // Clear user's cartData in database
        if (userId) {
            await User.findByIdAndUpdate(userId, { cartData: {} });
        }

        res.json({ success: true, message: "Order placed successfully", order: newOrder });
    } catch (err) {
        console.error("Order placement error:", err);
        res.status(500).json({ success: false, message: err.message || "Failed to place order" });
    }
};

// User order history for frontend
export const userOrders = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID missing" });
        }
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        console.error("User orders fetch error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// All orders for Admin panel
export const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        console.error("All orders fetch error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update order status by Admin
export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await Order.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status updated successfully" });
    } catch (err) {
        console.error("Status update error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
