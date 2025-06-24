import express from 'express';
import { UsersController } from '../controllers/User.controller.js';

const router = express.Router();

router.post('/register', UsersController.register);
router.post('/login', UsersController.login);
router.post('/booking', UsersController.createBooking);
router.post('/payments', UsersController.paymentsSwan);


export default router;
