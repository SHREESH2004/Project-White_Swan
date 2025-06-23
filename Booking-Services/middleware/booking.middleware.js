import { body, validationResult } from "express-validator";
import axios from "axios";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

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
        // Handle flight service unavailable
        if (error.code === 'ECONNREFUSED') {
          throw new Error("Flight Server under maintenance. PLease try again later");
        }

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
      // Check if service unavailable is one of the errors
      const serviceDown = errors.array().some(err =>
        err.msg.includes("Flight service unavailable")
      );

      return res.status(serviceDown ? StatusCodes.SERVICE_UNAVAILABLE : StatusCodes.BAD_REQUEST).json({
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
