import e from "express";
import { info } from "../controllers/info-controller.js";
import airplaneRoutes from "./airplaneroutes.js"
const app=e();
const router=e.Router();

router.get('/info',info)
router.use('/airplane',airplaneRoutes)
export default router;