import { Router } from "express";
import { addUser } from "../controllers/users";
import { authentication } from "../middlewares/auth";
const router = Router();

router.post("/", addUser);

export default router;
