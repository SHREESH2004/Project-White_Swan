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
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch booking",
            error: error.message
        });
    }
}
export {createBooking};

