import { body, validationResult } from "express-validator";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const Flight_request = process.env.FLIGHT;

export const validateBooking = [
  body("flightId")
    .notEmpty().withMessage("flightId is required"),

  body("userId")
    .notEmpty().withMessage("userId is required"),

  body("noOfSeats")
    .isInt({ gt: 0 }).withMessage("noOfSeats must be a positive integer")
    .custom(async (value, { req }) => {
      try {
        const response = await axios.get(`${Flight_request}${req.body.flightId}`);
        const flight = response.data?.data;

        if (!flight) {
          throw new Error("Flight not found");
        }

        if (value > flight.totalSeats) {
          throw new Error(`Requested seats (${value}) exceed available seats (${flight.totalSeats})`);
        }

        return true;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          throw new Error("Flight not found");
        }

        throw new Error(
          error.message || "Failed to validate flight data"
        );
      }
    }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg,
        }))
      });
    }

    next();
  }
];
