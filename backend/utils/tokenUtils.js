import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'yoursecret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'yourrefreshtokensecret';

// Generate Access Token
export const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate Refresh Token 
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};
