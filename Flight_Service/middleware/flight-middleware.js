// src/middlewares/validators/flight-validator.js

import { body, validationResult } from 'express-validator';

// Validation rules for creating a flight
export const validateCreateFlight = [
  body('flightNumber')
    .notEmpty().withMessage('Flight number is required')
    .isString().withMessage('Flight number must be a string')
    .trim(),

  body('airplaneId')
    .notEmpty().withMessage('Airplane ID is required')
    .isInt({ gt: 0 }).withMessage('Airplane ID must be a positive integer'),

  body('departureAirportId')
    .notEmpty().withMessage('Departure airport ID is required')
    .isString().withMessage('Departure airport ID must be a string')
    .trim(),

  body('arrivalAirportId')
    .notEmpty().withMessage('Arrival airport ID is required')
    .isString().withMessage('Arrival airport ID must be a string')
    .trim(),

  body('departureTime')
    .notEmpty().withMessage('Departure time is required')
    .isISO8601().withMessage('Departure time must be a valid ISO 8601 date'),

  body('arrivalTime')
    .notEmpty().withMessage('Arrival time is required')
    .isISO8601().withMessage('Arrival time must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.departureTime)) {
        throw new Error('Arrival time must be after departure time');
      }
      return true;
    }),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),

  body('boardingGate')
    .notEmpty().withMessage('Boarding gate is required')
    .isString().withMessage('Boarding gate must be a string')
    .trim(),

  body('totalSeats')
    .notEmpty().withMessage('Total seats is required')
    .isInt({ gt: 0 }).withMessage('Total seats must be a positive integer'),

  // Custom middleware to handle validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }
    next();
  },
];

export const validateUpdateSeats = (req, res, next) => {
  const { flightId, seats } = req.body;
  let { dec } = req.body;

  // Validate flightId
  if (!flightId || isNaN(Number(flightId))) {
    return res.status(400).json({
      success: false,
      message: "Invalid flightId",
      explanation: "flightId must be a valid number.",
    });
  }

  // Validate seats
  if (!seats || isNaN(Number(seats)) || seats <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid seats value",
      explanation: "seats must be a positive number.",
    });
  }

  // Coerce 'dec' string to boolean if it's a string
  if (typeof dec === 'string') {
    if (dec.toLowerCase() === 'true') {
      dec = true;
    } else if (dec.toLowerCase() === 'false') {
      dec = false;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid dec value",
        explanation: "dec must be a boolean (true/false).",
      });
    }
  }

  // Validate 'dec' if it's present and not boolean
  if (dec !== undefined && typeof dec !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: "Invalid dec value",
      explanation: "dec must be a boolean if provided.",
    });
  }

  // Set coerced value back to req.body
  req.body.dec = dec;

  next();
};


