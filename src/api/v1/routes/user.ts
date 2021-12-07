import { Router } from "express";
import { addUser, userLogin } from "../controllers/users";
import { authentication } from "../middlewares/auth";
const router = Router();

router.post(
  "/signup",
  authentication(["OGRA Technical Team", "OMCs Management"]),
  addUser
);
router.post("/login", userLogin);

export default router;
