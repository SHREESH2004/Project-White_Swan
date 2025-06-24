import { UserService } from '../services/User.services.js';
import { StatusCodes } from 'http-status-codes';

export class UsersController {
  static async register(req, res) {
    try {
      const { email, username, password, name } = req.body;
      if (!email || !password || !username || !name) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing required fields' });
      }

      const result = await UserService.createUser({ name, email, username, password });
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
      const { email, password, token } = req.body;
      console.log(token);

      if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing email, password, or token' });
      }

      const result = await UserService.loginUser({ email, password, token });
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 hour
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
  static async createBooking(req, res) {
    try {
      const { flightId, userId, noOfSeats, seatType } = req.body;

      if (!flightId || !userId || !noOfSeats || !seatType) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing required booking fields' });
      }

      const result = await UserService.createBooking({ flightId, userId, noOfSeats, seatType });

      return res.status(StatusCodes.CREATED).json({
        message: 'Booking created successfully',
        data: result,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: err.message || 'Booking creation failed',
        error: err.error || err,
      });
    }
  }

  static async paymentsSwan(req, res) {
    try {
      const { BookingId, totalCost, userId } = req.body;

      if (!BookingId || !totalCost || !userId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing required payment fields' });
      }

      const result = await UserService.paymentsSwan({ BookingId, totalCost, userId });

      return res.status(StatusCodes.OK).json({
        message: 'Payment processed successfully',
        data: result,
      });
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
          message: 'Booking Service is down for maintenance',
          error: err.message,
        });
      }
      return res.status(err.statusCode || 500).json({
        message: err.message || 'Payment processing failed',
        error: err.error || err,
      });
    }
  }
  static async getAllBookingsController(req, res) {
    try {
      const { userId } = req.query; // ✅ GET uses query, not body

      if (!userId) {
        return res.status(400).json({ success: false, message: 'userId is required' });
      }

      const bookings = await UserService.GetAllBookings({ userId });

      return res.status(200).json({
        success: true,
        message: 'Bookings fetched successfully',
        data: bookings,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch bookings',
      });
    }
  }



}
