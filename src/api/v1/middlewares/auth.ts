import { NextFunction, Request, Response } from "express";
import { getSecretKey } from "../helpers/environmentVariables";
import jwt from "jsonwebtoken";

const authentication = async (userTypes: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const decoded: any = jwt.verify(token, getSecretKey());
        if (decoded) {
          if (userTypes.includes(decoded.userType)) {
            req.body.id = decoded._id;
            req.body.userRole = decoded.userType;
            next();
          } else {
            return res.status(401).json({
              status: 401,
              message: "User Is not authorized.",
            });
          }
        }
      }
    } catch (err) {
      return res.status(401).json({
        status: 401,
        message: "User Is not authorized.",
        error: err,
      });
    }
  };
};

export { authentication };
