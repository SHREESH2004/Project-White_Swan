import { UsersRepo } from '../repositories/Users.repositories.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken, verifyToken } from '../utils/token.js';
import { StatusCodes } from 'http-status-codes';

const userRepo = new UsersRepo();

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

  static async loginUser({ email, password }) {
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

    const token = generateToken({ id: user.id, email: user.email });
    await userRepo.update(user.id, { token });

    return {
      user: { id: user.id, email: user.email, username: user.username },
      token,
    };
  }
}


