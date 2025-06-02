import e from "express";
import { info } from "../controllers/info-controller.js";
import airplaneRoutes from "./airplaneroutes.js";
import cityRoutes from "./cityroutes.js"
const router=e.Router();

router.get('/info',info)
router.use('/airplane',airplaneRoutes)
router.use('/cities',cityRoutes)
export default router;