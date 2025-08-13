// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
const { AdminAuth } = db;

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'yoursecret');

    const user = await AdminAuth.findByPk(decoded.userId, {
      attributes: ['id', 'email']
    });

    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
