// src/middlewares/validators/flight-validator.js

import { body, validationResult } from 'express-validator';

// Validation rules for creating a flight
const validateCreateFlight = [
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

export default validateCreateFlight;
