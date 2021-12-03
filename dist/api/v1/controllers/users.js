"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = void 0;
const users_1 = require("../validations/users");
const users_2 = require("../services/users");
const addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, users_1.addUserValidation)(req.body, req);
        if (req.body.errors.length > 0) {
            console.log("asdasdds", req.body.errors);
            return res.status(422).json({
                error: req.body.errors,
                message: "User Data Validation Failed",
            });
        }
        else {
            (0, users_2.createUser)(req, res, next);
        }
    }
    catch (err) { }
});
exports.addUser = addUser;
