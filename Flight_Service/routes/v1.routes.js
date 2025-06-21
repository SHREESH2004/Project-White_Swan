import e from "express";
import { info } from "../controllers/info-controller.js";
import airplaneRoutes from "./airplaneroutes.js";
import cityRoutes from "./cityroutes.js"
import airportRoutes from "./airportroutes.js"
import flightRoutes from "./flight.routes.js"
const router=e.Router();

router.get('/info',info)
router.use('/airplane',airplaneRoutes)
router.use('/cities',cityRoutes)
router.use('/airports',airportRoutes)
router.use('/flights',flightRoutes)
export default router;