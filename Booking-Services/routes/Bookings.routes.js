import { createBooking ,processPayment} from "../controller/Booking.controller.js";
import express from "express";
import { validateBooking } from "../middleware/booking.middleware.js";
const router = express.Router();  // ONLY create a router here

router.post("/create",validateBooking, createBooking);
router.post("/payments_swan",processPayment);
export default router;
