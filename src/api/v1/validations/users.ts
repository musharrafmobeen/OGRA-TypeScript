import { userData } from "../interfaces/users";
// import { body, validationResult } from "express-validator";
import { Request } from "express";
import mongoose from "mongoose";

const addUserValidation = async (userData: userData, req: Request) => {
  req.body.errors = [];

  if (
    userData.userName.includes(" ") ||
    userData.userName.length > 15 ||
    userData.userName.length < 8
  ) {
    req.body.errors.push({
      error: "Invalid Input",
      location: "userName",
      message:
        "userName is Invalid. userName should be larger than 8 characters, smaller than 15 characters and should contain no white spaces",
    });
  }

  if (
    userData.password.includes(" ") ||
    userData.password.length > 15 ||
    userData.password.length < 8
  ) {
    req.body.errors.push({
      error: "Invalid Input",
      location: "password",
      message:
        "password is Invalid. password should be larger than 8 characters, smaller than 15 characters and should contain no white spaces",
    });
  }
  if (!mongoose.isValidObjectId(userData.OMC)) {
    req.body.errors.push({
      error: "Invalid Input",
      location: "OMC",
      message: "OMC is not a valid ObjectID",
    });
  }

  if (!mongoose.isValidObjectId(userData.userIFEMLocation)) {
    req.body.errors.push({
      error: "Invalid Input",
      location: "userIFEMLocation",
      message: "userIFEMLocation is not a valid ObjectID",
    });
  }

  if (!mongoose.isValidObjectId(userData.deployedDepot)) {
    req.body.errors.push({
      error: "Invalid Input",
      location: "deployedDepot",
      message: "deployedDepot is not a valid ObjectID",
    });
  }

  if (!mongoose.isValidObjectId(userData.primaryDepot)) {
    req.body.errors.push({
      error: "Invalid Input",
      location: "primaryDepot",
      message: "primaryDepot is not a valid ObjectID",
    });
  }
};

export { addUserValidation };
