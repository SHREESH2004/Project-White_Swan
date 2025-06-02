import { createCity } from "../controllers/city-controller.js";

import e from "express";
import validateCreateCity from "../middleware/city-middleware.js";
const router=e.Router();

router.post('/create',validateCreateCity,createCity);
export default router;