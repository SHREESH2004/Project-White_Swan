    import {createAirplane,getAirplane,getAllAirplane,destroyAirplane} from "../controllers/airplane-controller.js";
import validateCreateAirplane from "../middleware/airplane-middleware.js";
import e from "express";
const app=e();
const router=e.Router();

router.post('/',validateCreateAirplane,createAirplane)
router.get("/all", getAllAirplane); // ✅ Specific route
router.get("/:id", getAirplane);    // ✅ Dynamic route (should come after)
router.get("/destroy/:id", destroyAirplane);    
export default router;