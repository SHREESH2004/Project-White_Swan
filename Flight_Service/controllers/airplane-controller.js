// controllers/airplane-controller.js
import AirplaneService from "../services/airplane-service.js";
import { error_response } from "../utils/common/error-response.js";
import { success_response } from "../utils/common/success-response.js";

const airplaneService = new AirplaneService();

// CREATE airplane
async function createAirplane(req, res) {
    try {
        const airplane = await airplaneService.create({
            ModelNo: req.body.ModelNo, // ✅ Correct key
            capacity: req.body.capacity
        });

        return success_response(res, "Airplane created successfully", airplane, 201);
    } catch (error) {
        console.error("Error in controller: createAirplane", error.message);
        return error_response(res, error);
    }
}

// GET airplane by ID
async function getAirplane(req, res) {
    try {
        const airplane = await airplaneService.get(req.params.id); // ✅ Fixed: call to `.get()`, not `.getAirplane()`
        return success_response(res, "Airplane fetched successfully", airplane, 200);
    } catch (error) {
        console.error("Error in controller: getAirplane", error.message);
        return error_response(res, error);
    }
}
async function getAllAirplane(req, res) {
    try {
        const airplanes = await airplaneService.getAll();
        return success_response(res, "Airplanes fetched successfully", airplanes, 200);
    } catch (error) {
        console.error("Error in controller: getAllAirplane", error.message);
        return error_response(res, error);
    }
}
async function destroyAirplane(req, res) {
    try {
        const id = req.params.id;
        const airplane = await airplaneService.get(req.params.id);
        if (!airplane) {
            return error_response(res, error);
        }
        else {

            await airplaneService.destroy(id);

            return success_response(
                res,
                `Airplane with ID ${id} removed successfully`,
                null,
                200
            );
        }
    }
    catch (error) {
        console.error("Error in controller: destroyAirplane", error.message);
        return error_response(res, error);
    }
}

export { createAirplane, getAirplane, getAllAirplane, destroyAirplane };
