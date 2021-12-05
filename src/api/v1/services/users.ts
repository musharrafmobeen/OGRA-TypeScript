// import { NextFunction, Request, Response } from "express";
// import { createdResponse } from "../helpers/responses";
import { createNewUser } from "../repositories/users";

const createUser = async (data: any) => {
  createNewUser(data);
  // createdResponse(res, 201, req.body);
};

export { createUser };
