// services/airplane-service.js
import { AirPlanesRepo } from "../repositories/airplane-repositories.js";

class AirplaneService {
    constructor(airplaneRepo = new AirPlanesRepo()) {
        this.airplaneRepo = airplaneRepo;
    }
    async create(data) {
        try {
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
                    message: "Validation error from database",
                    explanation: error.errors.map(e => e.message),
                };
            }

            if (error.name === "SequelizeUniqueConstraintError") {
                throw {
                    statusCode: 400,
                    message: "Duplicate entry: ModelNo must be unique.",
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

    async get(id) {
        try {
            if (!id || isNaN(Number(id))) {
                throw {
                    statusCode: 400,
                    message: "Invalid ID format",
                    explanation: "The airplane ID must be a valid number.",
                };
            }

            const airplane = await this.airplaneRepo.get(id);

            if (!airplane) {
                throw {
                    statusCode: 404,
                    message: "Airplane not found",
                    explanation: `No airplane found with ID ${id}`,
                };
            }

            return airplane;
        } catch (error) {
            if (error.statusCode) throw error;

            console.error("Error in AirplaneService: get", error);
            throw {
                statusCode: 500,
                message: "Unable to fetch airplane",
                explanation: error.message || "Something went wrong",
            };
        }
    }
    async getAll() {
        try {
            const airplanes = await this.airplaneRepo.getAll();

            // Check if any airplanes were returned
            if (!airplanes || airplanes.length === 0) {
                throw {
                    statusCode: 404,
                    message: "No airplanes found",
                    explanation: "There are no airplanes in the database.",
                };
            }

            return airplanes;
        } catch (error) {
            // If error already has a statusCode, it’s a controlled error, re-throw it
            if (error.statusCode) throw error;

            console.error("Error in AirplaneService: getall", error);

            // Generic server error
            throw {
                statusCode: 500,
                message: "Unable to fetch airplanes",
                explanation: error.message || "Something went wrong while fetching airplane data.",
            };
        }
    }
    async destroy(id) {
        try {
            if (!id || isNaN(Number(id))) {
                throw {
                    statusCode: 400,
                    message: "Invalid ID format",
                    explanation: "The airplane ID must be a valid number.",
                };
            }

            const airplane = await this.airplaneRepo.destroy(id);

            return airplane;
        } catch (error) {
            if (error.statusCode) throw error;

            console.error("Error in AirplaneService: destroy", error);
            throw {
                statusCode: 500,
                message: "Unable to remove airplane",
                explanation: error.message || "Something went wrong",
            };
        }
    }

}

export default AirplaneService;
