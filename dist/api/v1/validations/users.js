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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserValidation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const addUserValidation = (userData, req) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.errors = [];
    if (userData.userName.includes(" ") ||
        userData.userName.length > 15 ||
        userData.userName.length < 8) {
        req.body.errors.push({
            error: "Invalid Input",
            location: "userName",
            message: "userName is Invalid. userName should be larger than 8 characters, smaller than 15 characters and should contain no white spaces",
        });
    }
    if (userData.password.includes(" ") ||
        userData.password.length > 15 ||
        userData.password.length < 8) {
        req.body.errors.push({
            error: "Invalid Input",
            location: "password",
            message: "password is Invalid. password should be larger than 8 characters, smaller than 15 characters and should contain no white spaces",
        });
    }
    if (!mongoose_1.default.isValidObjectId(userData.OMC)) {
        req.body.errors.push({
            error: "Invalid Input",
            location: "OMC",
            message: "OMC is not a valid ObjectID",
        });
    }
    if (!mongoose_1.default.isValidObjectId(userData.userIFEMLocation)) {
        req.body.errors.push({
            error: "Invalid Input",
            location: "userIFEMLocation",
            message: "userIFEMLocation is not a valid ObjectID",
        });
    }
    if (!mongoose_1.default.isValidObjectId(userData.deployedDepot)) {
        req.body.errors.push({
            error: "Invalid Input",
            location: "deployedDepot",
            message: "deployedDepot is not a valid ObjectID",
        });
    }
    if (!mongoose_1.default.isValidObjectId(userData.primaryDepot)) {
        req.body.errors.push({
            error: "Invalid Input",
            location: "primaryDepot",
            message: "primaryDepot is not a valid ObjectID",
        });
    }
});
exports.addUserValidation = addUserValidation;
