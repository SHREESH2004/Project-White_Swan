import { createFlight ,getAllFlights,getFlight,destroyFlight,updateSeats} from "../controllers/flight-controllers.js";
import e from "express";
import { validateCreateFlight,validateUpdateSeats } from "../middleware/flight-middleware.js";
const app=e();
const router=e.Router();

router.post('/', validateCreateFlight, createFlight);
router.get("/all", getAllFlights);       // ✅ FIRST: static path
router.get("/destroy/:id", destroyFlight); // ✅ static + param
router.get("/:id", getFlight);     
router.patch("/updateseats",validateUpdateSeats,updateSeats)     // ✅ LAST: dynamic catch-all
  
export default router;