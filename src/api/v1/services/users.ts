// import { NextFunction, Request, Response } from "express";
// import { createdResponse } from "../helpers/responses";
import { userData } from "../interfaces/users";
import { createNewUser } from "../repositories/users";

const createUser = async (data: userData) => {
  return await createNewUser(data);
  // createdResponse(res, 201, req.body);
};

export { createUser };
