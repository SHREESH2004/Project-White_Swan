import { CityRepo } from "../repositories/city-repositories.js";

class CityService {
    constructor(cityRepo = new CityRepo()) {
        this.cityRepo = cityRepo;
    }
        async create(data) {
        try {
            const city = await this.cityRepo.create(data);
            return city;
        } catch (error) {
            console.error("Error in CityService: create", error);

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
                    message: "Validation error from database",
                    explanation: error.errors.map(e => e.message),
                };
            }

            if (error.name === "SequelizeUniqueConstraintError") {
                throw {
                    statusCode: 400,
                    message: "Duplicate entry: Cities Name must be unique.",
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
                message: "Something went wrong in City creation.",
                explanation: error.message || {},
            };
        }
    }

}
export default CityService