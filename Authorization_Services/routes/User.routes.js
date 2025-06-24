import express from 'express';
import { UsersController } from '../controllers/User.controller.js';
import { validateUserCredentials,verifyUserToken } from '../middleware/user.middleware.js';
const router = express.Router();

router.post('/register',validateUserCredentials, UsersController.register);
router.post('/login',validateUserCredentials, UsersController.login);
router.post('/booking', verifyUserToken,UsersController.createBooking);
router.post('/payments', verifyUserToken, UsersController.paymentsSwan);
router.get('/allbookings',verifyUserToken,UsersController.getAllBookingsController)

export default router;
