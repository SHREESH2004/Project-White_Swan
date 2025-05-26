import { AirPlanesRepo } from "../repositories/airplane-repositories.js";

class AirplaneService {
    constructor() {
        this.airplaneRepo = new AirPlanesRepo();
    }

    validateInput(data) {
        const errors = [];

        if (!/^\d+$/.test(data.capacity)) {
            errors.push("Capacity must contain digits only. No letters or special characters allowed.");
        }

        if (!/^[a-zA-Z0-9-_]+$/.test(data.modelNumber)) {
            errors.push("Model number must contain only letters, numbers, hyphens, or underscores. No other special characters allowed.");
        }

        if (errors.length > 0) {
            const error = new Error("Validation Error");
            error.name = "CustomValidationError";
            error.explanation = errors;
            throw error;
        }
    }

    async create(data) {
        try {
            this.validateInput(data);
            const airplane = await this.airplaneRepo.create(data);
            return airplane;
        } catch (error) {
            console.error("Error in AirplaneService: create", error);

            if (error.name === "CustomValidationError") {
                throw {
                    statusCode: 400,
                    message: "Input validation failed",
                    explanation: error.explanation,
                };
            }

            if (error.name === "SequelizeValidationError") {
                throw {
                    statusCode: 400,
                    message: "Max Capacity limit crossed (Max:1000)",
                    explanation: error.errors.map(e => e.message),
                };
            }

            if (error.name === "SequelizeUniqueConstraintError") {
                throw {
                    statusCode: 400,
                    message: "Duplicate entry: Model number must be unique.",
                    explanation: error.errors.map(e => e.message),
                };
            }

            if (error.name === "SequelizeDatabaseError" && error.parent?.code === "WARN_DATA_TRUNCATED") {
                throw {
                    statusCode: 400,
                    message: "Invalid data type for one or more fields.",
                    explanation: error.parent.sqlMessage,
                };
            }

            throw {
                statusCode: 500,
                message: "Something went wrong in airplane creation.",
                explanation: error.message || {},
            };
        }
    }
}

export default AirplaneService;
