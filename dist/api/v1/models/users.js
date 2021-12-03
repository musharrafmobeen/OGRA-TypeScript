"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    userName: {
        type: String,
        required: [true, "userName Field Is Required"],
        unique: true,
    },
    password: { type: String, required: [true, "password Field Is Required"] },
    userType: {
        type: String,
        enum: [
            "OGRA Technical Team",
            "OGRA Senior Management",
            "OMCs Management",
            "OMCs Supply Managers",
            "Data Entry Staff",
        ],
        require: [true, "userType Field Is Required"],
    },
    OMC: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "OMC",
        default: null,
    },
    userIFEMLocation: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "IFEM",
        default: null,
    },
    deployedDepot: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Depots",
        default: null,
    },
    primaryDepot: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Depots",
        default: null,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("User", userSchema);
