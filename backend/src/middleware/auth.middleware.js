import jwt, { decode } from 'jsonwebtoken'
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(400).json({ success: false, message: "no token found" })
    }

    const decoded = jwt.verify(token, process.env.secretKey)

    if (!decoded) {
      return res.status(400).json({ success: false, message: "secret key is not correct " })
    }
    const user = await User.findById(decoded.userId).select('-password')


    if (!user) {
      return res.status(400).json({ success: false, message: "user not found" })
    }

    req.user = user

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error })
  }
}