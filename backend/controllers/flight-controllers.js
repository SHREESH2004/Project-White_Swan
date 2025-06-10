import FlightService from "../services/flight-service.js";
import { error_response } from "../utils/common/error-response.js";
import { success_response } from "../utils/common/success-response.js";

const flightService = new FlightService();

// CREATE flight
async function createFlight(req, res) {
  try {
    const flightData = {
      flightNumber: req.body.flightNumber,
      airplaneId: req.body.airplaneId,
      departureAirportId: req.body.departureAirportId,
      arrivalAirportId: req.body.arrivalAirportId,
      arrivalTime: req.body.arrivalTime,
      departureTime: req.body.departureTime,
      price: req.body.price,
      boardingGate: req.body.boardingGate,
      totalSeats: req.body.totalSeats,
    };

    const flight = await flightService.create(flightData);

    return success_response(res, "Flight created successfully", flight, 201);
  } catch (error) {
    console.error("Error in controller: createFlight", error.message);
    return error_response(res, error);
  }
}

// GET flight by ID
async function getFlight(req, res) {
  try {
    const flight = await flightService.get(req.params.id);
    return success_response(res, "Flight fetched successfully", flight, 200);
  } catch (error) {
    console.error("Error in controller: getFlight", error.message);
    return error_response(res, error);
  }
}

// GET all flights
async function getAllFlights(req, res) {
  try {
    const flights = await flightService.getAll();
    return success_response(res, "Flights fetched successfully", flights, 200);
  } catch (error) {
    console.error("Error in controller: getAllFlights", error.message);
    return error_response(res, error);
  }
}

// DELETE flight by ID
async function destroyFlight(req, res) {
  try {
    const id = req.params.id;

    const flight = await flightService.get(id);
    if (!flight) {
      return error_response(res, {
        statusCode: 404,
        message: "Flight not found",
        explanation: `No flight found with ID ${id}`,
      });
    }

    await flightService.destroy(id);

    return success_response(
      res,
      `Flight with ID ${id} removed successfully`,
      null,
      200
    );
  } catch (error) {
    console.error("Error in controller: destroyFlight", error.message);
    return error_response(res, error);
  }
}

export { createFlight, getFlight, getAllFlights, destroyFlight };
