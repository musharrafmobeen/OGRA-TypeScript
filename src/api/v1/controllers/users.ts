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
      createUser(req.body);
    }
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while Registering a User.",
    });
  }
};

export { addUser };
