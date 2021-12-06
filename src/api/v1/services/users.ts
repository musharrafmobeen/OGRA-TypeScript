// import { NextFunction, Request, Response } from "express";
// import { createdResponse } from "../helpers/responses";
import { createNewUser } from "../repositories/users";
import userModel from "../models/users";
import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import { throwError } from "../helpers/errorHandler";
import { userData } from "../interfaces/users";
import { getSalt } from "../helpers/environmentVariables";

const createUser = async (data: userData) => {
  try {
    const user = await userModel.findOne({ userName: data.userName }).exec();
    if (!user) {
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
      throw new Error(
        '{"status":"Already Exists", "statusCode":403, "errorMessage":"User Already Exists"}'
      );
    }
  } catch (err: any) {
    err = JSON.parse(err.message);
    throw new Error(
      `{"status":"${err.status}", "statusCode":${err.statusCode}, "errorMessage":"${err.errorMessage}"}`
    );
  }
};

// const userLogIn = async (req, res, next) => {
//   try {
//     let userDoc = await userModel
//       .findOne({ userName: req.body.userName })
//       .populate("OMC userIFEMLocation deployedDepot primaryDepot")
//       .exec();

//     if (userDoc) {
//       bcrypt.compare(req.body.password, userDoc.password, (err, result) => {
//         if (err) {
//           return res.status(401).json({
//             error: {
//               status: "Auth Failed",
//               statusCode: 401,
//               errorMessage: err,
//             },
//             message: "Wrong Credentials.",
//           });
//         }
//         if (result) {
//           const user = {
//             userID: userDoc._id,
//             userName: userDoc.userName,
//             userType: userDoc.userType,
//             deployedDepot: userDoc.deployedDepot,
//             primaryDepot: userDoc.primaryDepot,
//             OMC: userDoc.OMC,
//             userIFEMLocation: userDoc.userIFEMLocation,
//           };

//           const token = jwt.sign(
//             {
//               userName: userDoc.userName,
//               userType: userDoc.userType,
//               _id: userDoc._id,
//             },
//             process.env.JWT_KEY,
//             {
//               expiresIn: "2h",
//             }
//           );

//           return res.status(200).json({
//             user,
//             token,
//             request: {
//               type: "POST",
//               description: "Logging in",
//               URL: process.env.URL + "users/login",
//             },
//           });
//         }
//         return res.status(401).json({
//           error: {
//             status: "Auth Failed",
//             statusCode: 401,
//           },
//           message: "No User Found with given Email and Password.",
//         });
//       });
//     } else {
//       return res.status(404).json({
//         status: "User Not Found",
//         statusCode: 404,
//         message: "No User found with the given credentials.",
//       });
//     }
//   } catch (err) {
//     return res.status(500).json({
//       error: {
//         status: "Failed",
//         statusCode: 500,
//         errorMessage: err,
//       },
//       message: "Error occured while trying to Log In.",
//     });
//   }
// };

export { createUser };
