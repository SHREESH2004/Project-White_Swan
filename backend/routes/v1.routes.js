import e from "express";
import { info } from "../controllers/info-controller.js";
const app=e();
const router=e.Router();

router.get('/info',info)
export default router;