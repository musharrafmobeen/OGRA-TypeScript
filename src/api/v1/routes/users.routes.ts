import { Router } from "express";
import { createUser, userLogin } from "../controllers/users.controller";
import { authentication } from "../middlewares/auth";
const router = Router();

router.post(
  "/signup",
  authentication(["OGRA Technical Team", "OMCs Management"]),
  createUser
);
router.post("/login", userLogin);

export default router;
