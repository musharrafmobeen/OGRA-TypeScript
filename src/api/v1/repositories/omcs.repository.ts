import OMCsModel from "../models/omcs.model";
import allowedDepotModel from "../models/allowedDepots.model";
import mongoose from "mongoose";

const createOMCRespository = async (data: any) => {
  try {
    let {
      OMCType,
      OMCLogo,
      OMCShortName,
      OMCName,
      provinceWiseROQuota,
      carriageContractors,
      permissions,
    } = data;

    if (carriageContractors === "") {
      carriageContractors = null;
    }

    if (permissions === "") {
      permissions = {
        pr03Dashboard: {
          createPR03: true,
          viewPR03: true,
          updatePR03: true,
          deletePR03: true,
          changeDestination: true,
        },
        pr03Form: {
          registerTankLorry: true,
          saveAndDispatchTankLorry: true,
          updatePR03: true,
        },
      };
    }

    const OMC = await OMCsModel.findOne({ OMCName }).exec();
    if (!OMC) {
      const _id = new mongoose.Types.ObjectId();
      const newOMC = new OMCsModel({
        _id,
        OMCType,
        OMCLogo: "OMC Logo",
        OMCShortName,
        OMCName,
        provinceWiseROQuota,
        carriageContractors,
        permissions,
      });
      await newOMC.save();
      return await OMCsModel.findOne({ _id }).exec();
    }

    throw new Error(
      '{"status":"Already Exists", "statusCode":403, "errorMessage":"OMC Have Already Been Registered"}'
    );
  } catch (err: any) {
    try {
      err = JSON.parse(err.message);
    } catch (err) {
      throw new Error(
        '{"status":"Failed", "statusCode":500, "errorMessage":"Error occurred while Creating New Allowed Depot."}'
      );
    }
    throw new Error(
      `{"status":"${err.status}", "statusCode":${err.statusCode}, "errorMessage":"${err.errorMessage}"}`
    );
  }
};

const getOMCsRespository = async () => {
  try {
    const OMCs = await OMCsModel.find().exec();

    return OMCs;
  } catch (error) {
    throw new Error(
      '{"status":"Failed", "statusCode":500, "errorMessage":"Error occurred while Creating New Allowed Depot."}'
    );
  }
};

const getAvailableDepotsRespository = async (OMC: mongoose.ObjectId) => {
  try {
    const depots = await allowedDepotModel.find({ OMC }).populate("OMC").exec();

    return depots;
  } catch (error) {
    throw new Error(
      '{"status":"Failed", "statusCode":500, "errorMessage":"Error occurred while Creating New Allowed Depot."}'
    );
  }
};

const updateOMCRespository = async (_id: mongoose.ObjectId, data: any) => {
  try {
    const OMC = await OMCsModel.findOneAndUpdate(
      { _id },
      { $set: { ...data } }
    ).exec();
    if (OMC) {
      return await OMCsModel.findOne({ _id }).exec();
    } else {
      throw new Error(
        '{"status":"User Not Found", "statusCode":404, "errorMessage":"No OMC found with the given credentials."}'
      );
    }
  } catch (err: any) {
    try {
      err = JSON.parse(err.message);
    } catch (err) {
      throw new Error(
        '{"status":"Failed", "statusCode":500, "errorMessage":"Error occurred while Creating New Allowed Depot."}'
      );
    }
    throw new Error(
      `{"status":"${err.status}", "statusCode":${err.statusCode}, "errorMessage":"${err.errorMessage}"}`
    );
  }
};

const deleteOMCRespository = async (_id: mongoose.ObjectId) => {
  try {
    const OMC = await OMCsModel.findOneAndDelete({ _id }).exec();
    if (OMC) {
      return OMC;
    } else {
      throw new Error(
        '{"status":"User Not Found", "statusCode":404, "errorMessage":"No OMC found with the given credentials."}'
      );
    }
  } catch (err: any) {
    try {
      err = JSON.parse(err.message);
    } catch (err) {
      throw new Error(
        '{"status":"Failed", "statusCode":500, "errorMessage":"Error occurred while Creating New Allowed Depot."}'
      );
    }
    throw new Error(
      `{"status":"${err.status}", "statusCode":${err.statusCode}, "errorMessage":"${err.errorMessage}"}`
    );
  }
};

export {
  createOMCRespository,
  getOMCsRespository,
  getAvailableDepotsRespository,
  updateOMCRespository,
  deleteOMCRespository,
};
