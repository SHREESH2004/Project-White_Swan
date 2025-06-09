import AirportService from "../services/airport-service.js";
import { error_response } from "../utils/common/error-response.js";
import { success_response } from "../utils/common/success-response.js";

const airportService = new AirportService();

// CREATE airport
async function createAirport(req, res) {
  try {
    const airportData = {
      name: req.body.name,
      code: req.body.code,
      address: req.body.address,
      cityId: req.body.cityId,
    };

    const airport = await airportService.create(airportData);

    return success_response(res, "Airport created successfully", airport, 201);
  } catch (error) {
    console.error("Error in controller: createAirport", error.message);
    return error_response(res, error);
  }
}

// GET airport by ID
async function getAirport(req, res) {
  try {
    const airport = await airportService.get(req.params.id);
    return success_response(res, "Airport fetched successfully", airport, 200);
  } catch (error) {
    console.error("Error in controller: getAirport", error.message);
    return error_response(res, error);
  }
}

// GET all airports
async function getAllAirports(req, res) {
  try {
    const airports = await airportService.getAll();
    return success_response(res, "Airports fetched successfully", airports, 200);
  } catch (error) {
    console.error("Error in controller: getAllAirports", error.message);
    return error_response(res, error);
  }
}

// DELETE airport by ID
async function destroyAirport(req, res) {
  try {
    const id = req.params.id;

    const airport = await airportService.get(id);
    if (!airport) {
      return error_response(res, {
        statusCode: 404,
        message: "Airport not found",
        explanation: `No airport found with ID ${id}`,
      });
    }

    await airportService.destroy(id);

    return success_response(
      res,
      `Airport with ID ${id} removed successfully`,
      null,
      200
    );
  } catch (error) {
    console.error("Error in controller: destroyAirport", error.message);
    return error_response(res, error);
  }
}

export { createAirport, getAirport, getAllAirports, destroyAirport };
