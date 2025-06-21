import { createFlight ,getAllFlights,getFlight,destroyFlight} from "../controllers/flight-controllers.js";
import e from "express";
import validateCreateFlight from "../middleware/flight-middleware.js"
const app=e();
const router=e.Router();

router.post('/', validateCreateFlight, createFlight);
router.get("/all", getAllFlights);       // ✅ FIRST: static path
router.get("/destroy/:id", destroyFlight); // ✅ static + param
router.get("/:id", getFlight);           // ✅ LAST: dynamic catch-all
  
export default router;