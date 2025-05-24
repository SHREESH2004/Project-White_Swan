import { StatusCodes } from "http-status-codes";
import AppError from "../utils/api-error.js";
import { error_response } from "../utils/common/error-response.js";

function validateCreateRequest(req, res, next) {
    const { ModelNo } = req.body;

    if (!ModelNo || typeof ModelNo !== 'string' || ModelNo.trim() === "") {
        const error = new AppError("ModelNo is required and must be a non-empty string.", StatusCodes.BAD_REQUEST);
        return error_response(res, error);
    }

    next(); 
}

export default validateCreateRequest;
