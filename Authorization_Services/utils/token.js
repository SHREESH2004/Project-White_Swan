import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h';

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // Optional: Log error for debugging
    console.error('JWT Verification Error:', err.message);

    throw {
      statusCode: 401,
      message: 'Invalid or expired token'
    };
  }
};