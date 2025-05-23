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
            throw error;
        }
    }
}

export default AirplaneService;
