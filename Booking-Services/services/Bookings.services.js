import axios from "axios";
import { StatusCodes } from "http-status-codes";
import db from "../models/index.js";
import { BookingsRepo } from "../repositories/Bookings.repositories.js";
import { configDotenv } from "dotenv";
import { BookingStatus } from "../utils/common/enum.js";
import { where } from "sequelize";
configDotenv();

const { sequelize } = db;
const FlightBaseURL = process.env.FLIGHT;
const UpdateFlightSeatsURL = process.env.FLIGHT_UPDATE_URL;
const bookingsRepo = new BookingsRepo();

class BookingService {
    async createBooking(data) {
        const transaction = await sequelize.transaction();
        try {
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
    async makePayment(data) {
        const transaction = await sequelize.transaction();

        try {
            const bookingDetails = await bookingsRepo.get(data.BookingId, {}, { transaction });

            if (!bookingDetails) {
                return {
                    success: false,
                    message: "Booking ID doesn't exist",
                };
            }
            const booking_date = new Date(bookingDetails.createdAt)
            const Current_date = new Date()
            if (bookingDetails.status == BookingStatus.CANCELLED) {
                return {
                    success: false,
                    message: "Booking Initiated before was cancelled due to booking expiry",
                };

            }
            if (Current_date - booking_date > 300000) {
                await bookingsRepo.update(
                    data.BookingId,
                    { status: BookingStatus.CANCELLED },
                    {},
                    transaction
                );
                await transaction.commit();
                return {
                    success: false,
                    message: "Booking Expired",
                };
            }

            if (bookingDetails.totalCost !== data.totalCost) {
                return {
                    success: false,
                    message: "Total cost mismatch",
                };
            }

            if (bookingDetails.userid != data.userId) {
                return {
                    success: false,
                    message: "User ID mismatch",
                };
            }
            if (bookingDetails.status == 'booked') {
                return {
                    success: false,
                    message: "Already booked"
                }
            }

            console.log("Payment data validated successfully.");
            await bookingsRepo.update(
                data.BookingId,
                { status: BookingStatus.BOOKED },
                {},
                transaction
            );


            await transaction.commit();

            return {
                success: true,
                message: "Payment processed successfully",
                bookingId: bookingDetails.id,
            };

        } catch (error) {
            await transaction.rollback();
            console.error("Payment processing error:", error);
            return {
                success: false,
                message: "An error occurred during payment processing",
                error: error.message,
            };
        }
    }




}

export default BookingService;
