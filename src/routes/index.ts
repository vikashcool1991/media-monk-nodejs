import { Router } from "express";
import { getValueByKey } from "../controllers";

const router = Router();
router.get("/key/:key", getValueByKey);

export default router;
