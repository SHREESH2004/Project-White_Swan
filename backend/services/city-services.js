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
    async get(id) {
        try {
            if (!id || isNaN(Number(id))) {
                throw {
                    statusCode: 400,
                    message: "Invalid ID format",
                    explanation: "The city ID must be a valid number.",
                };
            }

            const city = await this.cityRepo.get(id);

            if (!city) {
                throw {
                    statusCode: 404,
                    message: "City not found",
                    explanation: `No city found with ID ${id}`,
                };
            }

            return city;
        } catch (error) {
            if (error.statusCode) throw error;

            console.error("Error in CityService: get", error);
            throw {
                statusCode: 500,
                message: "Unable to fetch cities",
                explanation: error.message || "Something went wrong",
            };
        }
    }
    async getAll() {
        try {
            const cities = await this.cityRepo.getAll();

            // Check if any airplanes were returned
            if (!cities || cities.length === 0) {
                throw {
                    statusCode: 404,
                    message: "No city found",
                    explanation: "There are no cities in the database.",
                };
            }

            return cities;
        } catch (error) {
            // If error already has a statusCode, it’s a controlled error, re-throw it
            if (error.statusCode) throw error;

            console.error("Error in cityService: getall", error);

            // Generic server error
            throw {
                statusCode: 500,
                message: "Unable to fetch cities",
                explanation: error.message || "Something went wrong while fetching cities data.",
            };
        }
    }
    async destroy(id) {
        try {
            if (!id || isNaN(Number(id))) {
                throw {
                    statusCode: 400,
                    message: "Invalid ID format",
                    explanation: "The city ID must be a valid number.",
                };
            }

            const city = await this.cityRepo.destroy(id);

            return city;
        } catch (error) {
            if (error.statusCode) throw error;

            console.error("Error in cityService: destroy", error);
            throw {
                statusCode: 500,
                message: "Unable to remove cities",
                explanation: error.message || "Something went wrong",
            };
        }
    }

}
export default CityService