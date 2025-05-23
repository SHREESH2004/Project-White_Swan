import { StatusCodes } from "http-status-codes";

// Middleware to validate create request
function validateCreateRequest(req, res, next) {
    const { ModelNo } = req.body;

    if (!ModelNo || typeof ModelNo !== 'string' || ModelNo.trim() === "") {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "ModelNo is required and must be a non-empty string."
        });
    }

    next(); 
}

export default validateCreateRequest;
