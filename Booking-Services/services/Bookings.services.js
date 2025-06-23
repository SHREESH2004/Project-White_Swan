import axios from "axios";
import { StatusCodes } from "http-status-codes";
import db from "../models/index.js";
import { BookingsRepo } from "../repositories/Bookings.repositories.js";
import { configDotenv } from "dotenv";
import { BookingStatus } from "../utils/common/enum.js";

configDotenv();

const { sequelize } = db;
const Flight_request = process.env.FLIGHT;
const bookingsRepo = new BookingsRepo();

class BookingService {
    async createBooking(data) {
        const transaction = await db.sequelize.transaction();
        try {
            const flightResponse = await axios.get(`${Flight_request}${data.flightId}`);
            const flight = flightResponse.data.data;

            if (data.noOfSeats > flight.totalSeats) {
                throw new Error(`Requested seats (${data.noOfSeats}) exceed available seats (${flight.totalSeats}).`);
            }

            const totalCost = flight.price * data.noOfSeats;
            const bookingData = {
                flightid: data.flightId,
                userid: data.userId,
                noOfSeats: data.noOfSeats,
                totalCost,
                status: BookingStatus.INITIATED
            };

            if (data.seatType) {
                bookingData.seatType = data.seatType;
            }

            const booking = await bookingsRepo.create(bookingData, { transaction });

            await transaction.commit();
            return booking;
        } catch (error) {
            await transaction.rollback();
            console.error("Booking creation failed:", error);
            throw error;
        }
    }

}

export default BookingService;
