import userModel from "../models/users";
import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import { throwError } from "../helpers/errorHandler";
import { userData } from "../interfaces/users";
import { getSalt } from "../helpers/environmentVariables";

const createNewUser = async (data: userData) => {
  try {
    const user = await userModel.findOne({ userName: data.userName }).exec();
    console.log("user", user);
    if (user) {
      bcrypt.hash(data.password, getSalt(), async (err, password) => {
        if (err) {
          throwError("Failed", 500, "Error occurred while Registering a User.");
        }
        console.log("adrak");
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

        return newUser;
      });
    } else {
      // throwError("Already Exists", 403, "User Already Exists");
      throw new Error(
        '{status:"Already Exists", statusCode:403, errorMessage:"User Already Exists"}'
      );
    }
  } catch (err) {
    throw new Error(
      '{status:"Already Exists", statusCode:403, errorMessage:"User Already Exists"}'
    );
  }
};

export { createNewUser };
