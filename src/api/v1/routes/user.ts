import { NextFunction, Request, Response, Router } from "express";
import { addUser } from "../controllers/users";
const router = Router();

router.post("/", addUser);

export default router;
