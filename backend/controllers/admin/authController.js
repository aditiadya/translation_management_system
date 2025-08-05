import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../models/index.js';
const { AdminAuth, AdminDetails } = db;
import { generateAccessToken, generateRefreshToken } from '../../utils/tokenUtils.js';

// Signup controller
export const signup = async (req, res, next) => {
  try {
    const {
      email, password, account_type, company_name,
      country, time_zone, first_name, last_name, username, phone
    } = req.body;

    const existing = await AdminAuth.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 12);

    const adminAuth = await AdminAuth.create({ email, password_hash });

    await AdminDetails.create({
      id: adminAuth.id,
      account_type, company_name, country, time_zone,
      first_name, last_name, username, phone
    });

    return res.status(201).json({ message: "Admin registered successfully" });

  } catch (err) {
    next(err);
  }
};

const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000; // For cookie maxAge


// Login Controller
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await AdminAuth.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await user.update({
      refresh_token: refreshToken,
      refresh_token_expiry: expiryDate
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
      sameSite: 'strict',
      path: '/'
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: TWO_WEEKS,
      sameSite: 'strict',
      path: '/'
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    next(err);
  }
};

// Refresh Token Controller
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: 'Refresh token required' });

    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'yourrefreshtokensecret');

    const user = await AdminAuth.findOne({ where: { id: payload.userId, refresh_token: token } });
    if (!user) return res.status(403).json({ error: 'Invalid refresh token' });

    const now = new Date();
    if (!user.refresh_token_expiry || user.refresh_token_expiry < now) {
      return res.status(403).json({ error: 'Refresh token expired' });
    }

    const accessToken = generateAccessToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
      sameSite: 'strict',
      path: '/'
    });

    res.status(200).json({ message: 'Access token refreshed' });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
};

// Logout Controller
export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(400).json({ error: 'Refresh token required' });

    const user = await AdminAuth.findOne({ where: { refresh_token: token } });
    if (!user) return res.status(400).json({ error: 'Invalid token' });

    await user.update({ refresh_token: null, refresh_token_expiry: null });

    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};
