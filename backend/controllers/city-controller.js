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

async function getCity(req, res) {
    try {
        const Cities = await cityService.get(req.params.id); // ✅ Fixed: call to `.get()`, not `.getAirplane()`
        return success_response(res, "City fetched successfully", Cities, 200);
    } catch (error) {
        console.error("Error in controller: getCity", error.message);
        return error_response(res, error);
    }
}
async function getAllCity(req, res) {
    try {
        const cities = await cityService.getAll();
        return success_response(res, "Cities fetched successfully", cities, 200);
    } catch (error) {
        console.error("Error in controller: getAllCity", error.message);
        return error_response(res, error);
    }
}
async function destroyCity(req, res) {
    try {
        const id = req.params.id;
        const cities = await cityService.get(req.params.id);
        if (!cities) {
            return error_response(res, error);
        }
        else {

            await cityService.destroy(id);

            return success_response(
                res,
                `City with ID ${id} removed successfully`,
                null,
                200
            );
        }
    }
    catch (error) {
        console.error("Error in controller: destroyCity", error.message);
        return error_response(res, error);
    }
}

export {createCity,getCity,getAllCity,destroyCity};;