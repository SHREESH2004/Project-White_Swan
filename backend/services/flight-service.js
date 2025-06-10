import { FlightRepo } from "../repositories/flight-repositories.js";

class FlightService {
    constructor(flightRepo = new FlightRepo()) {
        this.flightRepo = flightRepo;
    }

    async create(data) {
        try {
            const flight = await this.flightRepo.create(data);
            return flight;
        } catch (error) {
            console.error("Error in FlightService: create", error);

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
                    message: "Duplicate entry: Flight number must be unique.",
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
                message: "Something went wrong in flight creation.",
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
                    explanation: "The flight ID must be a valid number.",
                };
            }

            const flight = await this.flightRepo.get(id);

            if (!flight) {
                throw {
                    statusCode: 404,
                    message: "Flight not found",
                    explanation: `No flight found with ID ${id}`,
                };
            }

            return flight;
        } catch (error) {
            if (error.statusCode) throw error;

            console.error("Error in FlightService: get", error);
            throw {
                statusCode: 500,
                message: "Unable to fetch flight",
                explanation: error.message || "Something went wrong",
            };
        }
    }

    async getAll() {
        try {
            const flights = await this.flightRepo.getAll();

            if (!flights || flights.length === 0) {
                throw {
                    statusCode: 404,
                    message: "No flights found",
                    explanation: "There are no flights in the database.",
                };
            }

            return flights;
        } catch (error) {
            if (error.statusCode) throw error;

            console.error("Error in FlightService: getAll", error);

            throw {
                statusCode: 500,
                message: "Unable to fetch flights",
                explanation: error.message || "Something went wrong while fetching flight data.",
            };
        }
    }

    async destroy(id) {
        try {
            if (!id || isNaN(Number(id))) {
                throw {
                    statusCode: 400,
                    message: "Invalid ID format",
                    explanation: "The flight ID must be a valid number.",
                };
            }

            const flight = await this.flightRepo.destroy(id);

            return flight;
        } catch (error) {
            if (error.statusCode) throw error;

            console.error("Error in FlightService: destroy", error);
            throw {
                statusCode: 500,
                message: "Unable to remove flight",
                explanation: error.message || "Something went wrong",
            };
        }
    }
}

export default FlightService;
