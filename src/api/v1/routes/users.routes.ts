import { Router } from "express";
import { createUser, userLogin } from "../controllers/users.controller";
import { authentication } from "../middlewares/auth";
import { addUserValidation, userLoginValidation } from "../validations/users";
const router = Router();

router.post(
  "/signup",
  authentication(["OGRA Technical Team", "OMCs Management"]),
  addUserValidation,
  createUser
);
router.post("/login", userLoginValidation, userLogin);

export default router;
