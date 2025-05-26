import createAirplane from "../controllers/airplane-controller.js";
import validateCreateAirplane from "../middleware/airplane-middleware.js";
import e from "express";
const app=e();
const router=e.Router();

router.post('/',validateCreateAirplane,createAirplane)
export default router;