import userModel from "../models/users";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createNewUser = async (data: any) => {
  try {
    const keys: string[] = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] in data) {
        if (data.keys[i] === "") {
          data.keys[i] = null;
        }
      }
    }

    const user = await userModel.findOne({ userName: data.userName }).exec();
    if (!user) {
      bcrypt.hash(data.password, 10, async (err, password) => {
        if (err) {
          throw new Error("User Registration Failed");
        }
        let OMC = null;
        if (data.userRole === "OGRA Technical Team") {
          OMC = data.OMC;
        } else {
          const userOMC = await userModel.findOne({ _id: data.id }).exec();
          OMC = userOMC.OMC;
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
    }

    // const user = new userModel({ ...data });
    await user.save();
  } catch (err) {}
};

export { createNewUser };
