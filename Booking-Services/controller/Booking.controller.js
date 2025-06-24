import BookingService from "../services/Bookings.services.js";
import { StatusCodes } from "http-status-codes";

const bookingService = new BookingService();

async function createBooking(req, res) {
    try {
        const data = req.body;
        const result = await bookingService.createBooking(data);
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Booking fetched successfully",
            data: result
        });
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
                success: false,
                message: "Flight service unavailable",
                explanation: "Unable to connect to the Flight Service. Please try again later.",
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch booking",
            error: error.message
        });
    }
}
export async function processPayment(req, res) {
    try {
        const BookingId = Number(req.body.BookingId);
        const totalCost = Number(req.body.totalCost);
        const userId = Number(req.body.userId); 

        if (!BookingId || !totalCost || !userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing BookingId, totalCost, or userId"
            });
        }

        const data = { BookingId, totalCost, userId };

        console.log("Processing payment with data:", data);

        const result = await bookingService.makePayment(data);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message,
                error: result.error || null
            });
        }

        return res.status(200).json({
            success: true,
            message: result.message,
            bookingId: result.bookingId
        });

    } catch (err) {
        console.error('Controller error:', err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
}


export { createBooking };

