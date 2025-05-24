import AirplaneService from "../services/airplane-service.js";
import { error_response } from "../utils/common/error-response.js";

const airplaneService = new AirplaneService(); 
import { success_response } from "../utils/common/success-response.js";// instantiate the service

async function createAirplane(req, res) {
    try {
        const airplane = await airplaneService.create({
            ModelNo: req.body.ModelNo,
            capacity: req.body.capacity
        });

        return success_response(res, "Airplane created successfully", airplane, 201);
    } catch (error) {
        console.error("Error in controller: createAirplane", error);
        return error_response(res,error)
    }
}

export default createAirplane;
