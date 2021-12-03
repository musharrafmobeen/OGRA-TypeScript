"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createdResponse = void 0;
const createdResponse = (res, statusCode, createdObj) => {
    return res.status(statusCode).json({
        createdObj,
    });
};
exports.createdResponse = createdResponse;
