import BookingRoutes from "./Bookings.routes.js";
import express from "express";

const router = express.Router();

router.use("/bookings", BookingRoutes);

export default router;
