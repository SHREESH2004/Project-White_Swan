import axios from "axios";
import { StatusCodes } from "http-status-codes";
import db from "../models/index.js";
import { BookingsRepo } from "../repositories/Bookings.repositories.js";
import { configDotenv } from "dotenv";
import { BookingStatus } from "../utils/common/enum.js";

configDotenv();

const { sequelize } = db;
const FlightBaseURL = process.env.FLIGHT;
const UpdateFlightSeatsURL = process.env.FLIGHT_UPDATE_URL;
const bookingsRepo = new BookingsRepo();

class BookingService {
    async createBooking(data) {
        const transaction = await sequelize.transaction();
        try {
            // Fetch flight details
            const flightResponse = await axios.get(`${FlightBaseURL}${data.flightId}`);
            const flight = flightResponse.data.data;
            if (data.noOfSeats > flight.availableSeats) {
                throw {
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: `Requested seats (${data.noOfSeats}) exceed available seats (${flight.availableSeats}).`,
                };
            }
            const totalCost = flight.price * data.noOfSeats;
            const bookingData = {
                flightid: data.flightId,
                userid: data.userId,
                noOfSeats: data.noOfSeats,
                totalCost,
                status: BookingStatus.INITIATED,
            };

            if (data.seatType) {
                bookingData.seatType = data.seatType;
            }
            const booking = await bookingsRepo.create(bookingData, { transaction });
            await axios.patch(UpdateFlightSeatsURL, {
                flightId: Number(data.flightId),
                seats: Number(data.noOfSeats),
                dec: true
            });

            console.log("Updating flight seats with:", {
                flightid: Number(data.flightId),
                noOfSeats: Number(data.noOfSeats),
                dec: true
            });


            // Commit transaction
            await transaction.commit();
            return booking;

        } catch (error) {
            // Rollback in case of failure
            await transaction.rollback();

            // Log and rethrow for centralized error handler
            console.error("Booking creation failed:", error);

            if (!error.statusCode) {
                error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
                error.message = "Something went wrong during booking creation.";
            }

            throw error;
        }
    }
}

export default BookingService;
