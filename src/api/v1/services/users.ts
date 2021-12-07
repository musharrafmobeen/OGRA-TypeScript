// import { NextFunction, Request, Response } from "express";
// import { createdResponse } from "../helpers/responses";
import { createNewUser } from "../repositories/users";
import userModel from "../models/users";
import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import { throwError } from "../helpers/errorHandler";
import { userData } from "../interfaces/users";
import { getSalt, getSecretKey } from "../helpers/environmentVariables";

const createUser = async (data: userData) => {
  try {
    const user = await userModel.findOne({ userName: data.userName }).exec();
    if (!user) {
      bcrypt.hash(data.password, getSalt(), async (err, password) => {
        if (err) {
          throw new Error(
            '{"status":"Failed", "statusCode":500, "errorMessage":"Error occurred while Registering a User."}'
          );
        }
        if (data.userRole !== "OGRA Technical Team") {
          const userOMC = await userModel.findOne({ _id: data.id }).exec();
          data.OMC = userOMC.OMC;
        }

        const _id = new mongoose.Types.ObjectId(),
          newUser = new userModel({
            _id,
            ...data,
            password,
          });

        await newUser.save();

        return await userModel
          .findOne({ userName: data.userName })
          .populate("OMC userIFEMLocation deployedDepot primaryDepot")
          .exec();
      });
    } else {
      throw new Error(
        '{"status":"Already Exists", "statusCode":403, "errorMessage":"User Has Already Been Registered"}'
      );
    }
  } catch (err: any) {
    try {
      err = JSON.parse(err.message);
      throw new Error(
        `{"error":{"status":"${err.status}", "statusCode":${err.statusCode}, "errorMessage":"${err.errorMessage}"}`
      );
    } catch (err) {
      throw new Error(
        '{"status":"Failed", "statusCode":500, "errorMessage":"Error occurred while Registering a User."}'
      );
    }
  }
};

const userLogIn = async (data: { userName: string; password: string }) => {
  try {
    let userDoc = await userModel
      .findOne({ userName: data.userName })
      .populate("OMC deployedDepot primaryDepot")
      .exec();
    console.log("user", userDoc);

    if (userDoc) {
      bcrypt.compare(data.password, userDoc.password, (err, result) => {
        if (err) {
          throw new Error(
            '{"status":"Failed", "statusCode":500, "errorMessage":"Error occurred while Registering a User."}'
          );
        }
        if (result) {
          const user = {
            userID: userDoc._id,
            userName: userDoc.userName,
            userType: userDoc.userType,
            deployedDepot: userDoc.deployedDepot,
            primaryDepot: userDoc.primaryDepot,
            OMC: userDoc.OMC,
            userIFEMLocation: userDoc.userIFEMLocation,
          };
          const token = jwt.sign(
            {
              userName: userDoc.userName,
              userType: userDoc.userType,
              _id: userDoc._id,
            },
            getSecretKey(),
            {
              expiresIn: "2h",
            }
          );

          return { user, token };
        }
        throw new Error(
          '{"status":"Auth Failed", "statusCode":401, "errorMessage":"No User Found with given Email and Password."}'
        );
      });
    } else {
      throw new Error(
        '{"status":"User Not Found", "statusCode":404, "errorMessage":"No User found with the given credentials."}'
      );
    }
  } catch (err: any) {
    try {
      err = JSON.parse(err.message);
      throw new Error(
        `{"error":{"status":"${err.status}", "statusCode":${err.statusCode}, "errorMessage":"${err.errorMessage}"}`
      );
    } catch (err) {
      throw new Error(
        '{"status":"Failed", "statusCode":500, "errorMessage":"Error occurred while Registering a User."}'
      );
    }
  }
};

export { createUser, userLogIn };
