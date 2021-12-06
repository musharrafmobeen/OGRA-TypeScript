import { RequestHandler } from "express";
import { addUserValidation } from "../validations/users";
import { createUser } from "../services/users";

const addUser: RequestHandler = async (req, res, next) => {
  try {
    await addUserValidation(req.body, req);

    if (req.body.errors.length > 0) {
      return res.status(422).json({
        error: req.body.errors,
        message: "User Data Validation Failed",
      });
    } else {
      const createdUser = await createUser(req.body);
      return res.status(200).json({
        message: "User Registered",
        user: createdUser,
        request: {
          type: "POST",
          description: "Register User",
          URL: process.env.URL + "users/signup",
        },
      });
    }
  } catch (err: any) {
    err = JSON.parse(err.message);

    return res.status(err.statusCode).json({
      error: {
        status: err.status,
        statusCode: err.statusCode,
        errorMessage: err.errorMessage,
      },
      message: "Error occured while Registering a User.",
    });
  }
};

export { addUser };
