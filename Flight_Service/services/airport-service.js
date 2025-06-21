import { AirportsRepo } from "../repositories/airport-repositories.js";

class AirportService {
  constructor(
    airportsRepo = new AirportsRepo()
  ) {
    this.airportsRepo = airportsRepo;
  }

  async create(data) {
    try {
      const airport = await this.airportsRepo.create(data);
      return airport;
    } catch (error) {
      console.error("Error in AirportService: create", error);

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
          message: "Duplicate entry: Airport fields must be unique.",
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
      if (error.name === "SequelizeForeignKeyConstraintError") {
        throw {
          statusCode: 400,
          message: "City-ID does not exist in database",
          explanation: error.parent.sqlMessage,
        };
      }

      throw {
        statusCode: 500,
        message: "Something went wrong in airport creation.",
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
          explanation: "The airport ID must be a valid number.",
        };
      }

      const airport = await this.airportsRepo.get(id);

      if (!airport) {
        throw {
          statusCode: 404,
          message: "Airport not found",
          explanation: `No airport found with ID ${id}`,
        };
      }

      return airport;
    } catch (error) {
      if (error.statusCode) throw error;

      console.error("Error in AirportService: get", error);
      throw {
        statusCode: 500,
        message: "Unable to fetch airport",
        explanation: error.message || "Something went wrong",
      };
    }
  }

  async getAll() {
    try {
      const airports = await this.airportsRepo.getAll();

      if (!airports || airports.length === 0) {
        throw {
          statusCode: 404,
          message: "No airports found",
          explanation: "There are no airports in the database.",
        };
      }

      return airports;
    } catch (error) {
      if (error.statusCode) throw error;

      console.error("Error in AirportService: getAll", error);

      throw {
        statusCode: 500,
        message: "Unable to fetch airports",
        explanation: error.message || "Something went wrong while fetching airport data.",
      };
    }
  }

  async destroy(id) {
    try {
      if (!id || isNaN(Number(id))) {
        throw {
          statusCode: 400,
          message: "Invalid ID format",
          explanation: "The airport ID must be a valid number.",
        };
      }

      const deletedAirport = await this.airportsRepo.destroy(id);

      if (!deletedAirport) {
        throw {
          statusCode: 404,
          message: "Airport not found",
          explanation: `No airport found with ID ${id} to delete.`,
        };
      }

      return deletedAirport;
    } catch (error) {
      if (error.statusCode) throw error;

      console.error("Error in AirportService: destroy", error);
      throw {
        statusCode: 500,
        message: "Unable to remove airport",
        explanation: error.message || "Something went wrong",
      };
    }
  }
}

export default AirportService;
