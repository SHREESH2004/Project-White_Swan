import AirplaneService from "../services/airplane-service.js";

const airplaneService = new AirplaneService(); // instantiate the service

async function createAirplane(req, res) {
    try {
        const airplane = await airplaneService.create({
            ModelNo: req.body.ModelNo,
            capacity: req.body.capacity
        });

        res.status(201).json({
            success: true,
            message: "Airplane created successfully",
            data: airplane
        });
    } catch (error) {
        console.error("Error in controller: createAirplane", error);

        res.status(500).json({
            success: false,
            message: "Failed to create airplane",
            error: error.message
        });
    }
}

export default createAirplane;
