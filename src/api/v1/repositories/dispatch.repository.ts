import dispatchModel from "../models/dispatch.js";
import userModel from "../models/userManagement&AccessRights.js";
import depotModel from "../models/depots.js";
import omcModel from "../models/OMCs.js";
import vehiclesModel from "../models/vehicles.js";
import driversModel from "../models/drivers.js";
import mongoose from "mongoose";
import NodeCache from "node-cache";
const cache = new NodeCache();

const driversUpdate = async (Drivers, _id) => {
  let data = [];

  for (let i = 0; i < Drivers.length; i++) {
    data.push(
      await driversModel
        .findOneAndUpdate(
          { _id: Drivers[i] },
          { $set: { currentlyAssignedJob: _id } }
        )
        .exec()
    );
  }

  return data;
  // const drivers = Drivers.map(async (driver) => {
  //   const data = await driversModel
  //     .findOneAndUpdate(
  //       { _id: driver },
  //       { $set: { currentlyAssignedJob: _id } }
  //     )
  //     .exec();

  //   console.log(data);
  //   return data;
  // });
  // return drivers;
};

const addDispatch = async (req, res, next) => {
  try {
    let { id, vehicle, Drivers, destinationDepot } = req.body;
    const { OMC } = await userModel.findOne({ _id: id }).exec();
    const OMC_OBJ = await omcModel.findById(OMC).exec();
    if (OMC_OBJ.permissions.pr03Dashboard.createPR03) {
      const dispatch = await dispatchModel
        .findOne({ vehicle, status: "D" })
        .exec();

      if (!dispatch) {
        const dispatchDataEntryUserId = await userModel
          .findOne({ _id: id })
          .exec();

        const recieveDataEntryUserId = await userModel
          .find({ deployedDepot: destinationDepot })
          .exec();

        const destinationDpt = await depotModel
          .findOne({ _id: destinationDepot })
          .exec();
        const sourceDpt = await depotModel
          .findOne({ _id: dispatchDataEntryUserId.primaryDepot })
          .exec();

        const _id = new mongoose.Types.ObjectId();

        const updatedVehicle = await vehiclesModel
          .findOneAndUpdate(
            { _id: vehicle._id },
            { $set: { currentlyAssignedJob: _id } }
          )
          .populate("associatedDrivers");

        const drivers = await driversUpdate(Drivers, _id);

        for (let i = 0; i < drivers.length; i++) {
          drivers[i]["currentlyAssignedJob"] = _id;
        }

        const newDispatch = new dispatchModel({
          _id,
          OMC: OMC_OBJ,
          dispatchDataEntryUserId,
          recieveDataEntryUserId,
          vehicle: {
            ...vehicle,
            currentlyAssignedJob: updatedVehicle.currentlyAssignedJob,
          },
          Drivers: drivers,
          sourceDepot: sourceDpt,
          destinationDepot: destinationDpt,
          statusByInspector: [],
          status: "D",
        });

        await newDispatch.save();

        cache.set("updated", true);

        cache.set("personalupdated", true);

        cache.set("recupdated", true);

        cache.set("omcUpdated", true);

        return res.status(201).json({
          message: "Dispatch Added",
          dispatch: await dispatchModel.findOne({ _id }).exec(),
          request: {
            type: "POST",
            description: "Dispatch Added",
            URL: process.env.URL + "dispatches",
          },
        });
      }
      return res.status(403).json({
        error: {
          status: "Dispatch Present",
          statusCode: 403,
        },
        message: "Dispatch Has Already Been Added.",
      });
    } else {
      return res.status(401).json({
        error: {
          status: "Not Authorized",
          statusCode: 401,
        },
        message: "OMC Does Not Have Permission to Create Dispatches.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: error,
      },
      message: "Error occured while Adding A Dispatch.",
    });
  }
};

const getDispatches = async (req, res, next) => {
  try {
    const { userRole, id } = req.body;
    if (userRole === "OGRA Technical Team") {
      const updated = cache.get("updated");
      // if (updated === true || updated == undefined) {
      const dispatches = await dispatchModel.find().exec();

      cache.set("Tech", dispatches);
      cache.set("updated", false);

      return res.status(200).json({
        message: "Dispatch Returned",
        dispatches: dispatches,
        request: {
          type: "GET",
          description: "Dispatch Returned",
          URL: process.env.URL + "dispatches",
        },
      });
      // } else {
      //   const data = cache.get("Tech");

      //   return res.status(200).json({
      //     message: "Dispatch Returned",
      //     dispatches: data,
      //     request: {
      //       type: "GET",
      //       description: "Dispatch Returned",
      //       URL: process.env.URL + "dispatches",
      //     },
      //   });
      // }
    } else {
      const updated = cache.get("omcUpdated");
      const { OMC } = await userModel
        .findOne({ _id: id })
        .populate("OMC")
        .exec();
      if (OMC.permissions.pr03Dashboard.viewPR03) {
        // if (updated === true || updated === undefined) {
        const dispatches = await dispatchModel
          .find({ "OMC._id": OMC._id })
          .exec();
        cache.set(OMC.OMCName, dispatches);
        cache.set("omcUpdated", false);
        return res.status(200).json({
          message: "Dispatch Returned",
          dispatches,
          request: {
            type: "GET",
            description: "Dispatch Returned",
            URL: process.env.URL + "dispatches",
          },
        });
        // } else {
        //   const data = cache.get(OMC.OMCName);
        //   return res.status(200).json({
        //     message: "Dispatch Returned",
        //     dispatches: data,
        //     request: {
        //       type: "GET",
        //       description: "Dispatch Returned",
        //       URL: process.env.URL + "dispatches",
        //     },
        //   });
        // }
      } else {
        return res.status(401).json({
          error: {
            status: "Not Authorized",
            statusCode: 401,
          },
          message: "OMC Does Not Have Permission to Get Dispatches.",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: error,
      },
      message: "Error occured while Trying To Get All Dispatch",
    });
  }
};

const getPersonalDispatches = async (req, res, next) => {
  try {
    const { id } = req.body;
    const updated = cache.get("personalupdated");
    const { primaryDepot, OMC } = await userModel
      .findOne({ _id: id })
      .populate("OMC")
      .exec();
    if (OMC.permissions.pr03Dashboard.viewPR03) {
      // if (updated === true || updated === undefined) {
      const dispatches = await dispatchModel
        .find({ "sourceDepot._id": primaryDepot })
        .exec();
      cache.set(`PersonalDispatches${primaryDepot}`, dispatches);
      cache.set("updated", false);
      return res.status(200).json({
        message: "Dispatch Returned",
        dispatches,
        request: {
          type: "GET",
          description: "Dispatch Returned",
          URL: process.env.URL + "dispatches",
        },
      });
      // } else {
      //   const data = cache.get(`PersonalDispatches${primaryDepot}`);
      //   return res.status(200).json({
      //     message: "Dispatch Returned",
      //     dispatches: data,
      //     request: {
      //       type: "GET",
      //       description: "Dispatch Returned",
      //       URL: process.env.URL + "dispatches",
      //     },
      //   });
      // }
    } else {
      return res.status(401).json({
        error: {
          status: "Not Authorized",
          statusCode: 401,
        },
        message: "OMC Does Not Have Permission to Get Dispatches.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: error,
      },
      message: "Error occured while Trying To Get All Dispatch",
    });
  }
};

const getReceivingDispatches = async (req, res, next) => {
  try {
    const { id } = req.body;
    const updated = cache.get("recupdated");
    const { deployedDepot, OMC } = await userModel
      .findOne({ _id: id })
      .populate("OMC")
      .exec();
    if (OMC.permissions.pr03Dashboard.viewPR03) {
      // if (updated === true || updated === undefined) {
      const dispatches = await dispatchModel
        .find({ "destinationDepot._id": deployedDepot })
        .exec();
      cache.set("ReceivingDispatches", dispatches);
      cache.set("updated", false);
      return res.status(200).json({
        message: "Dispatch Returned",
        dispatches,
        request: {
          type: "GET",
          description: "Dispatch Returned",
          URL: process.env.URL + "dispatches",
        },
      });
      // } else {
      //   const data = cache.get("ReceivingDispatches");
      //   return res.status(200).json({
      //     message: "Dispatch Returned",
      //     dispatches: data,
      //     request: {
      //       type: "GET",
      //       description: "Dispatch Returned",
      //       URL: process.env.URL + "dispatches",
      //     },
      //   });
      // }
    } else {
      return res.status(401).json({
        error: {
          status: "Not Authorized",
          statusCode: 401,
        },
        message: "OMC Does Not Have Permission to Get Dispatches.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: error,
      },
      message: "Error occured while Trying To Get All Dispatch",
    });
  }
};

const updateDispatch = async (req, res, next) => {
  try {
    const { id } = req.body;
    const { OMC } = await userModel.findOne({ _id: id }).populate("OMC").exec();
    if (OMC.permissions.pr03Dashboard.updatePR03) {
      const { _id } = req.params;
      const recieveDataEntryUserId = req.body.id;
      let updateData = [];
      if (req.body.hasOwnProperty("userStatus")) {
        updateData = [
          { _id },
          { $set: { ...req.body } },
          {
            $push: {
              statusByInspector: {
                userID: recieveDataEntryUserId,
                userStatus: req.body.userStatus,
                comment: req.body.comment,
              },
            },
          },
        ];
      } else {
        updateData = [{ _id }, { $set: { ...req.body } }];
      }

      const dispatch = await dispatchModel
        .findOneAndUpdate(...updateData)
        .exec();

      if (dispatch) {
        cache.set("updated", true);
        return res.status(200).json({
          message: "Dispatch Updated",
          dispatch: await dispatchModel.findOne({ _id }).exec(),
          request: {
            type: "PATCH",
            description: "Dispatch Updated",
            URL: process.env.URL + "dispatches",
          },
        });
      } else {
        return res.status(404).json({
          error: {
            status: "Not Found",
            statusCode: 404,
          },
          message: "No Dispatch With Given Id Was Found.",
        });
      }
    } else {
      return res.status(401).json({
        error: {
          status: "Not Authorized",
          statusCode: 401,
        },
        message: "OMC Does Not Have Permission to Update Dispatches.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: error,
      },
      message: "Error occured while Updating Dispatch.",
    });
  }
};

const deleteDispatch = async (req, res, next) => {
  try {
    const { id } = req.body;
    const { OMC } = await userModel.findOne({ _id: id }).populate("OMC").exec();
    if (OMC.permissions.pr03Dashboard.deletePR03) {
      const { _id } = req.params;
      const dispatch = await dispatchModel
        .findOneAndDelete({ _id })
        .populate("OMC storagePoint sourceIFEMLocation destinationIFEMLocation")
        .exec();
      if (dispatch) {
        cache.set("updated", true);
        return res.status(200).json({
          message: "Dispatch Deleted",
          dispatch,
          request: {
            type: "DELETE",
            description: "Dispatch Deleted",
            URL: process.env.URL + "dispatches",
          },
        });
      } else {
        return res.status(404).json({
          error: {
            status: "Not Found",
            statusCode: 404,
          },
          message: "No Dispatch With Given Id Was Found.",
        });
      }
    } else {
      return res.status(401).json({
        error: {
          status: "Not Authorized",
          statusCode: 401,
        },
        message: "OMC Does Not Have Permission to Update Dispatches.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: error,
      },
      message: "Error occured while Deleting Dispatch.",
    });
  }
};

export {
  addDispatch,
  getDispatches,
  updateDispatch,
  deleteDispatch,
  getPersonalDispatches,
  getReceivingDispatches,
};
