import { createFlight ,getAllFlights,getFlight,destroyFlight} from "../controllers/flight-controllers.js";
import e from "express";
import validateCreateFlight from "../middleware/flight-middleware.js"
const app=e();
const router=e.Router();

router.post('/',validateCreateFlight,createFlight)
router.get("/all", getAllFlights); // ✅ Specific route
router.get("/:id", getFlight);    // ✅ Dynamic route (should come after)
router.get("/destroy/:id", destroyFlight);    
export default router;