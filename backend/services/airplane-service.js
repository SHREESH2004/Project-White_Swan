import { AirPlanesRepo } from "../repositories/airplane-repositories.js";
class AirplaneService {
    constructor() {
        this.airplaneRepo = new AirPlanesRepo();
    }

    async create(data) {
        try {
            const airplane = await this.airplaneRepo.create(data);
            return airplane;
        } catch (error) {
            console.error("Error in AirplaneService: create", error);
            if (error.name === "SequelizeValidationError") {
                throw {
                    statusCode: 400,
                    message: "Max Capacity limit crossed(Max:1000)",
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
            // Other errors
            throw {
                statusCode: 500,
                message: "Something went wrong in airplane creation.",
                explanation: error.message || {},
            };
        }
    }


}

export default AirplaneService;
