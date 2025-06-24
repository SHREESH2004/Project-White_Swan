import { body, header, validationResult } from 'express-validator';
import { verifyToken } from '../utils/token.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware to validate login or registration credentials
 */
export const validateUserCredentials = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 3 }).withMessage('Password must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
  }
];

export const verifyUserToken = [
  header('authorization')
    .notEmpty().withMessage('Authorization header is required')
    .custom((value) => value.startsWith('Bearer ')).withMessage('Authorization must start with Bearer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ errors: errors.array() });
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token expired. Please log in again.' });
      }
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token.' });
    }
  }
];
