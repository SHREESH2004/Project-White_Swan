import { FlightRepo } from "../repositories/flight-repositories.js";
import { Op, Sequelize } from "sequelize";
import db from '../models/index.js';

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

    async getAll(query) {
        const customFilter = {};
        let sort = []

        // Handle trips query
        if (query.trips && query.trips.includes('-')) {
            const [departureAirportIdRaw, arrivalAirportIdRaw] = query.trips.trim().split('-');
            const departureAirportId = departureAirportIdRaw?.trim();
            const arrivalAirportId = arrivalAirportIdRaw?.trim();

            if (departureAirportId && arrivalAirportId) {
                customFilter.departureAirportId = departureAirportId;
                customFilter.arrivalAirportId = arrivalAirportId;
            }
        }

        // Handle price range query
        if (query.price) {
            const [minPriceRaw, maxPriceRaw] = query.price.trim().split('-');
            const minPrice = minPriceRaw && !isNaN(Number(minPriceRaw.trim())) ? Number(minPriceRaw.trim()) : 0;

            // Use 999999 if maxPriceRaw is missing or invalid
            const maxPrice = maxPriceRaw && !isNaN(Number(maxPriceRaw.trim())) ? Number(maxPriceRaw.trim()) : 999999;

            if (isNaN(minPrice) || isNaN(maxPrice)) {
                throw {
                    statusCode: 400,
                    message: "Invalid price format",
                    explanation: "Price should be in the format 'min-max' with numeric values.",
                };
            }

            if (minPrice > maxPrice) {
                throw {
                    statusCode: 400,
                    message: "Invalid price range",
                    explanation: "Minimum price cannot be greater than maximum price.",
                };
            }

            customFilter.price = {
                [Op.between]: [minPrice, maxPrice]
            };
        }

        // Handle travellers (seats) query
        if (query.travellers) {
            const travellers = Number(query.travellers);

            if (isNaN(travellers) || travellers <= 0) {
                throw {
                    statusCode: 400,
                    message: "Invalid travellers count",
                    explanation: "Travellers must be a positive numeric value.",
                };
            }

            customFilter.totalSeats = {
                [Op.gte]: travellers
            };
        }

        // Handle trip date query
        if (query.tripdate) {
            try {
                const tripDate = query.tripdate;

                // Validate format (basic YYYY-MM-DD format check)
                const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(tripDate);
                if (!isValidFormat) {
                    throw new Error(`Invalid date format for 'tripdate': ${tripDate}. Expected format is YYYY-MM-DD.`);
                }

                const startDate = new Date(`${tripDate}T00:00:00Z`);
                const endDate = new Date(`${tripDate}T23:59:59Z`);

                // Additional check for Invalid Date
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    throw new Error(`Could not parse 'tripdate': ${tripDate}`);
                }

                console.log('Searching flights between:', startDate.toISOString(), 'and', endDate.toISOString());

                customFilter.departureTime = {
                    [Op.between]: [startDate, endDate],
                };

            } catch (error) {
                console.error('Error parsing tripdate:', error.message);
                return res.status(400).json({
                    success: false,
                    message: `Invalid tripdate provided. ${error.message}`,
                });
            }
        }
        if (query.sort) {
            const params = query.sort.split(',');
            sort = params.map(param => param.split('_'));
        }

        try {
            const flights = await this.flightRepo.getAll(
                customFilter,
                sort,
                [{
                    model: db.AirPlane,
                    as: 'Flight Details',
                    required: true
                }, {
                    model: db.Airport,
                    as: 'Airport Details',
                    required: true,
                    /*on: {
                        col: Sequelize.where(Sequelize.col('Flight.departureAirportId'), '=', Sequelize.col('Airport.code')),
                    }*/
                }]
            );


            if (!flights || flights.length === 0) {
                throw {
                    statusCode: 404,
                    message: "No flights found",
                    explanation: "There are no flights matching the given search criteria.",
                };
            }

            return flights;
        } catch (error) {
            throw {
                statusCode: error.statusCode || 500,
                message: error.message || "Unable to fetch flights",
                explanation: error.explanation || "Something went wrong while fetching flight data.",
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
