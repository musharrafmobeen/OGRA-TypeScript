import { NextFunction, Request, Response } from "express";
import { createdResponse } from "../helpers/responses";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  createdResponse(res, 201, req.body);
};

export { createUser };
