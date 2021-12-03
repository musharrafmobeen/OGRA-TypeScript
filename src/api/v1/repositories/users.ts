import { NextFunction, Response } from "express";
import userModel from "../models/users";
import mongoose from "mongoose";
import { userData } from "../interfaces/users";

const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: userData = req.body as userData;
    const { id } = body;
    const user = new userModel({});

    await user.save();
  } catch (err) {}
};
