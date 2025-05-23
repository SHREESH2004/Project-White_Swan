import createAirplane from "../controllers/airplane-controller.js";
import validateCreateRequest from "../middleware/airplane-middleware.js";
import e from "express";
const app=e();
const router=e.Router();

router.post('/',validateCreateRequest,createAirplane)
export default router;