import { RequestHandler } from "express";
import { addUserValidation, userLoginValidation } from "../validations/users";
import { createUser, userLogIn } from "../services/users";

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
      message: err.errorMessage,
    });
  }
};

const userLogin: RequestHandler = async (req, res, next) => {
  try {
    await userLoginValidation(req.body, req);

    if (req.body.errors.length > 0) {
      return res.status(422).json({
        error: req.body.errors,
        message: "User Data Validation Failed",
      });
    } else {
      const user: any = await userLogIn(req.body);
      return res.status(200).json({
        user: user.user,
        token: user.token,
        request: {
          type: "POST",
          description: "Logging in",
          URL: process.env.URL + "users/login",
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
      message: err.errorMessage,
    });
  }
};

export { addUser, userLogin };
