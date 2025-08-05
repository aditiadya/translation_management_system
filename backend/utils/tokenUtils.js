import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'yourrefreshtokensecret';

// Generate Access Token (short-lived)
export const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate Refresh Token (longer-lived)
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};
