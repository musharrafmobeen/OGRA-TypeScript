import { NextFunction, Request, Response } from "express";
import { addUserValidation } from "../validations/users";
import { createUser } from "../services/users";

const addUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await addUserValidation(req.body, req);

    if (req.body.errors.length > 0) {
      console.log("asdasdds", req.body.errors);
      return res.status(422).json({
        error: req.body.errors,
        message: "User Data Validation Failed",
      });
    } else {
      createUser(req, res, next);
    }
  } catch (err) {}
};

export { addUser };
