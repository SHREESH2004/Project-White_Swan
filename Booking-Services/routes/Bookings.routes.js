import { createBooking ,processPayment,GetAllBooking} from "../controller/Booking.controller.js";
import express from "express";
import { validateBooking } from "../middleware/booking.middleware.js";
const router = express.Router();  // ONLY create a router here

router.post("/create",validateBooking, createBooking);
router.post("/payments_swan",processPayment);
router.get("/getall",GetAllBooking);
export default router;
