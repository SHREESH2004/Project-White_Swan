import axios from "axios";
import { StatusCodes } from "http-status-codes";
import db from "../models/index.js";
import { BookingsRepo } from "../repositories/Bookings.repositories.js";
import { configDotenv } from "dotenv";

configDotenv();

const { sequelize } = db;
const Flight_request = process.env.FLIGHT;
const bookingsRepo = new BookingsRepo();

class BookingService {
  createBooking(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await sequelize.transaction(async (t) => {
          const flightResponse = await axios.get(`${Flight_request}${data.flightId}`);
          const flight = flightResponse.data.data;

          if (data.noOfSeats > flight.totalSeats) {
            return reject(new Error(`Requested seats (${data.noOfSeats}) exceed available seats (${flight.totalSeats}).`));
          }

          const totalCost = flight.price * data.noOfSeats;

          const booking = await bookingsRepo.create(
            {
              flightid: data.flightId,
              userid: data.userId,
              noOfSeats: data.noOfSeats,
              totalCost: totalCost,
            },
            { transaction: t }
          );

          return booking;
        });

        resolve(result);
      } catch (error) {
        console.error("Booking creation failed:", error.message);
        reject(error);
      }
    });
  }
}

export default BookingService;
