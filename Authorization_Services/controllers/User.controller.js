import { UserService } from '../services/User.services.js';
import { StatusCodes } from 'http-status-codes';

export class UsersController {
  static async register(req, res) {
    try {
      const { email, username, password,name } = req.body;
      if (!email || !password || !username||!name) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing required fields' });
      }

      const result = await UserService.createUser({ name,email, username, password});
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 hour
      });

      return res.status(StatusCodes.CREATED).json({
        message: 'User created successfully',
        data: result.user,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
        error: err.error || err,
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing email or password' });
      }

      const result = await UserService.loginUser({ email, password });

      // ✅ Set token in cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
      });

      return res.status(StatusCodes.OK).json({
        message: 'Login successful',
        data: result.user,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message || 'Login failed',
        error: err.error || err,
      });
    }
  }
}
