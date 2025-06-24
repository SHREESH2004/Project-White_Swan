import { UsersRepo } from '../repositories/Users.repositories.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken, verifyToken } from '../utils/token.js';
import { StatusCodes } from 'http-status-codes';
import axios from 'axios';
const userRepo = new UsersRepo();
const BASE_URL = 'http://localhost:3000/WhiteSwan/bookings';
export class UserService {
  static async createUser(userData) {
    userData.password = await hashPassword(userData.password);
    const user = await userRepo.create(userData);
    const token = generateToken({ id: user.id, email: user.email });
    await userRepo.update(user.id, { token });
    return {
      user: { id: user.id, email: user.email, username: user.username },
      token,
    };
  }


  static async loginUser({ email, password, token }) {
    const users = await userRepo.getAll({ email });
    const user = users[0];

    if (!user) {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid email or password',
      };
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid email or password',
      };
    }
    if (!token || token.trim() === '') {

      const newToken = generateToken({ id: user.id, email: user.email });
      await userRepo.update(user.id, { token: newToken });

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        token: newToken,
      };
    }

    try {
      const decoded = verifyToken(token);
      if (decoded.id !== user.id || decoded.email !== user.email) {
        throw new Error('Token payload mismatch');
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw {
          statusCode: StatusCodes.UNAUTHORIZED,
          message: 'Token expired. Please login again.',
        };
      }
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid token.',
      };
    }

    // ✅ If token is valid
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token: user.token,
    };
  }
  static async createBooking({ flightId, noOfSeats, seatType }) {
    userId=user
    try {
      const response = await axios.post(`${BASE_URL}/create`, {
        flightId,
        userId,
        noOfSeats,
        seatType,
      });
      return response.data;
    } catch (error) {
      console.error('Create Booking Error:', error.response?.data || error.message);
      throw error;
    }
  }

  static async paymentsSwan({ BookingId, totalCost, userId }) {
    try {
      const response = await axios.post(`${BASE_URL}/payments_swan`, {
        BookingId,
        totalCost,
        userId,
      });
      return response.data;
    } catch (error) {
      console.error('Payment Error:', error.response?.data || error.message);
      throw error;
    }
  }
}


