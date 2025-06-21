import { getAirport,createAirport,getAllAirports,destroyAirport } from "../controllers/airport-controllers.js";
import e from "express";
const app=e();
const router=e.Router();

router.post('/',createAirport)
router.get("/all", getAllAirports); // ✅ Specific route
router.get("/:id", getAirport);    // ✅ Dynamic route (should come after)
router.get("/destroy/:id", destroyAirport);    
export default router;