// import { NextFunction, Request, Response } from "express";
// import { createdResponse } from "../helpers/responses";
import { createNewUser } from "../repositories/users";
import userModel from "../models/users";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { throwError } from "../helpers/errorHandler";
import { userData } from "../interfaces/users";
import { OMC } from "../interfaces/OMC";
import { getSalt, getSecretKey } from "../helpers/environmentVariables";

const createUser = async (data: userData) => {
  try {
    let user = await userModel.findOne({ userName: data.userName }).exec();
    if (!user) {
      bcrypt.hash(
        data.password,
        10,
        async (err, password) => {
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
          user = await userModel.findOne({ userName: data.userName }).exec();
        },
        async (number) => {}
      );

      console.log("user", user);
      return user;
    } else {
      throw new Error(
        '{"status":"Already Exists", "statusCode":403, "errorMessage":"User Has Already Been Registered"}'
      );
    }
  } catch (err: any) {
    try {
      err = JSON.parse(err.message);
    } catch (err) {
      throw new Error(
        '{"status":"Failed", "statusCode":500, "errorMessage":"Error occurred while Registering a User."}'
      );
    }
    throw new Error(
      `{"status":"${err.status}", "statusCode":${err.statusCode}, "errorMessage":"${err.errorMessage}"}`
    );
  }
};

const userLogIn = async (data: { userName: string; password: string }) => {
  try {
    let userDoc = await userModel.findOne({ userName: data.userName }).exec();
    console.log("user", userDoc);

    // .populate("OMC deployedDepot primaryDepot")

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
    } catch (err) {
      throw new Error(
        '{"status":"Failed", "statusCode":500, "errorMessage":"Error occurred while Registering a User."}'
      );
    }
    throw new Error(
      `{"status":"${err.status}", "statusCode":${err.statusCode}, "errorMessage":"${err.errorMessage}"}`
    );
  }
};

export { createUser, userLogIn };
