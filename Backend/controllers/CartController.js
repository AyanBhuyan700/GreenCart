import User from '../models/UserModel.js'

export const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        const userData = await User.findById(userId);
        let cartData = userData.cartData || {};

        cartData[itemId] = (cartData[itemId] || 0) + 1;


        await User.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Added to cart", cartData });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateCart = async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body;

        const userData = await User.findById(userId);
        let cartData = userData.cartData || {};

        if (quantity <= 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }

        await User.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Cart updated", cartData });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const userData = await User.findById(userId);
        const cartData = userData.cartData || {};

        res.json({ success: true, cartData });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        const userData = await User.findById(userId);
        let cartData = userData.cartData || {};

        if (cartData[itemId]) {
            delete cartData[itemId];

            await User.findByIdAndUpdate(userId, { cartData });

            res.json({ success: true, message: "Item removed from cart", cartData });
        } else {
            res.status(404).json({ success: false, message: "Item not found in cart" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
