import jwt from 'jsonwebtoken'

export const generateToken = (userOrId) => {
    const id = userOrId?._id
        ? userOrId._id.toString()
        : (userOrId?.id ? userOrId.id.toString() : String(userOrId || ""));
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};