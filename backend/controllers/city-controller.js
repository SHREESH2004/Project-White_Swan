import CityService from "../services/city-services.js";
import { error_response } from "../utils/common/error-response.js";
import { success_response } from "../utils/common/success-response.js";

const cityService = new CityService();
async function createCity(req, res) {
    try {
        const city = await cityService.create({
            name: req.body.name, // ✅ Correct key
        });

        return success_response(res, "City added successfully", city, 201);
    } catch (error) {
        console.error("Error in controller: createCity", error.message);
        return error_response(res, error);
    }
}

export {createCity};