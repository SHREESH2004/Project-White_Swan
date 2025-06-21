import { body, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { error_response } from "../utils/common/error-response.js";

const validateCreateCity = [
  body("name")
    .trim()
    .notEmpty().withMessage("name is required and must be a non-empty string.")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("name must only contain letters (a–z or A–Z), no digits or special characters."),

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

export default validateCreateCity;
