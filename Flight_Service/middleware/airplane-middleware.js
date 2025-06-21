import { body, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { error_response } from "../utils/common/error-response.js";

const validateCreateAirplane = [
  body("ModelNo")
    .trim()
    .notEmpty().withMessage("ModelNo is required and must be a non-empty string.")
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage("ModelNo must only contain letters, numbers, hyphens (-), or underscores (_)."),

  body("capacity")
    .trim()
    .notEmpty().withMessage("Capacity is required.")
    .isInt().withMessage("Capacity must be an integer."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const explanation = errors.array().map(err => err.msg);
      return error_response(res, {
        message: "Input validation failed",
        statusCode: StatusCodes.BAD_REQUEST,
        explanation
      });
    }
    next();
  }
];

export default validateCreateAirplane;
