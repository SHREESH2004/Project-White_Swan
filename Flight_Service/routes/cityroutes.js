import { createCity,getAllCity,getCity,destroyCity} from "../controllers/city-controller.js";

import e from "express";
import validateCreateCity from "../middleware/city-middleware.js";
const router=e.Router();

router.post('/create',validateCreateCity,createCity);
router.get("/all", getAllCity); // ✅ Specific route
router.get("/:id", getCity);    // ✅ Dynamic route (should come after)
router.get("/destroy/:id", destroyCity);    
export default router;