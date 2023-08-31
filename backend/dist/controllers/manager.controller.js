"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerController = void 0;
const user_1 = __importDefault(require("../models/user"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const services_request_new_servic_1 = __importDefault(require("../models/services.request_new_servic"));
const services_1 = __importDefault(require("../models/services"));
const specializzazione_servics_1 = __importDefault(require("../models/specializzazione_servics"));
const mongodb_1 = require("mongodb");
const doctor_selected_specializzazione_1 = __importDefault(require("../models/doctor_selected_specializzazione"));
const specializzaziones_1 = __importDefault(require("../models/specializzaziones"));
const jwt = require("jsonwebtoken");
const secret = "12g47JNBAbBVHJDA423ascH7bjqb6574gyiu67rKNjn9B";
class ManagerController {
    constructor() {
        this.get_manager = (req, res) => {
            jwt.verify(req.body.token, secret, (err, decoded) => {
                if (decoded) {
                    console.log(decoded);
                    res.status(200).json({
                        status: 200,
                        user: decoded["_doc"]
                    });
                }
                else {
                    res.status(401).json({
                        status: 401,
                        error_message: err
                    });
                }
            });
        };
        this.get_all_services = (req, res) => {
            services_1.default.find({}, (err, data) => {
                if (data) {
                    res.status(200)
                        .json({
                        status: 200,
                        data: data
                    });
                }
                else {
                    if (err) {
                        res.status(200)
                            .json({
                            status: 200,
                            error_message: err
                        });
                    }
                    else {
                        res.status(200)
                            .json({
                            status: 401,
                            err: "not found"
                        });
                    }
                }
            });
        };
        this.get_all_users = (req, res) => {
            user_1.default.find({ type: { $ne: "Manager" }, status: true }, (err, data) => {
                if (data) {
                    let newdata = data.map((data) => {
                        const path_to_images = path_1.default.join(__dirname, `../../src/assets/profile_pictures/${data["img_src"]}`);
                        let image = fs.readFileSync(path_to_images);
                        return Object.assign(Object.assign({}, data), { img_profile: image });
                    });
                    res.status(200).json({
                        status: 200,
                        cause: "getting all user data except manager",
                        data: newdata,
                    });
                }
                else {
                    res.status(401).json({
                        status: 401,
                        cause: "getting all user data except manager",
                        error_message: err,
                    });
                }
            }).lean();
        };
        this.get_all_requests = (req, res) => {
            user_1.default.find({ type: { $ne: "manager" }, status: false }, (err, data) => {
                if (data) {
                    let newdata = data.map((data) => {
                        const path_to_images = path_1.default.join(__dirname, `../../src/assets/profile_pictures/${data["img_src"]}`);
                        let image = fs.readFileSync(path_to_images);
                        return Object.assign(Object.assign({}, data), { img_profile: image });
                    });
                    res.status(200).json({
                        status: 200,
                        cause: "getting all user data except manager",
                        data: newdata,
                    });
                }
                else {
                    res.status(401).json({
                        status: 401,
                        cause: "getting all user data except manager",
                        error_message: err,
                    });
                }
            }).lean();
        };
        this.renameFilePromise = (oldPath, newPath) => {
            const path_to_images_new = path_1.default.join(__dirname, `../../src/assets/profile_pictures/${newPath}`);
            const path_to_images_old = path_1.default.join(__dirname, `../../src/assets/profile_pictures/${oldPath}`);
            return new Promise((resolve, reject) => {
                fs.rename(path_to_images_old, path_to_images_new, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(1);
                    }
                });
            });
        };
        this.update_user = (req, res) => {
            const new_user_data = req.body.new_user_data;
            user_1.default.findOne({ _id: new_user_data._id }, (err, data) => {
                if (data) {
                    const updateFields = {};
                    Object.keys(data).forEach((key) => {
                        if (key !== "_id") {
                            if (key === "d_data") {
                                let indic = false;
                                Object.keys(data[key]).forEach((key_iner) => {
                                    if (data[key][key_iner] !== new_user_data[key][key_iner]) {
                                        if (!indic) {
                                            updateFields[key] = {};
                                            updateFields[key] = new_user_data[key];
                                            indic != indic;
                                        }
                                        updateFields[key][key_iner] = new_user_data[key][key_iner];
                                    }
                                });
                            }
                            else {
                                if (data[key] !== new_user_data[key]) {
                                    updateFields[key] = new_user_data[key];
                                    if (key === "username") {
                                        let extension = data["img_src"].split(".")[1];
                                        updateFields["img_src"] = `${new_user_data.username}.${extension}`;
                                        Promise.all([
                                            this.renameFilePromise(data["img_src"], updateFields["img_src"]),
                                        ]);
                                        console.log(updateFields["img_src"]);
                                        console.log(data["img_src"]);
                                    }
                                }
                            }
                        }
                    });
                    if (req.body.img != null) {
                        const imageSrc = req.body.img;
                        const extension = new_user_data.extension;
                        let user = null;
                        if (imageSrc) {
                            const path_to_images = path_1.default.join(__dirname, `../../src/assets/profile_pictures/${new_user_data.username}.${new_user_data.file_extension}`);
                            console.log(path_to_images);
                            const base64Data = imageSrc.replace(/^data:image\/png;base64,/, "");
                            const imageBuffer = Buffer.from(base64Data, "base64");
                            fs.writeFileSync(path_to_images, imageBuffer);
                            updateFields["img_src"] = `${new_user_data.username}.${new_user_data.file_extension}`;
                            let image = fs.readFileSync(path_to_images);
                            //new_user_data.img_path = `${new_user_data.username}.${new_user_data.file_extension}`
                            new_user_data.img_profile = image;
                        }
                    }
                    if (Object.keys(updateFields).length === 0) {
                        console.log(222);
                        res.status(200).json({
                            status: 200,
                            cause: "no data was changed",
                        });
                    }
                    else {
                        user_1.default.updateOne({ _id: data._id }, { $set: updateFields })
                            .then(() => {
                            res.status(200).json({
                                status: 200,
                                cause: "fileds updated",
                                return_data: new_user_data,
                            });
                        })
                            .catch((err) => {
                            res.status(401).json({
                                status: 401,
                                cause: "failed to updated",
                            });
                        });
                    }
                }
                else {
                    // internal server error
                    res.status(500).json({
                        status: 500,
                        cause: "user not found",
                        error_message: err,
                    });
                }
            }).lean();
        };
        this.remove_service_request = (req, res) => {
            const spec = req.body.specializzazione;
            const data = req.body.data;
            console.log(data);
            services_request_new_servic_1.default.updateOne({ specializzazione: spec }, {
                $pull: {
                    requests: {
                        service_name: data["service_name"],
                        servic_cost: data["servic_cost"],
                        service_dur: data["service_dur"],
                        service_des: data["service_des"],
                    },
                },
            }, (error, result) => {
                if (error) {
                    res.status(200).json({
                        status: 401,
                        cause: "getting all user data except manager",
                        error_message: error,
                    });
                }
                else {
                    console.log(result);
                    res.status(200).json({
                        status: 200,
                        after: result,
                    });
                }
            });
        };
        this.aprove_service_request = (req, res) => {
            const spec = req.body.specializzazione;
            const data = req.body.data;
            const paiload = new services_1.default({
                servic_name: data["service_name"],
                cost: data["servic_cost"],
                time: data["service_dur"],
                description: data["service_des"],
            });
            console.log(paiload);
            paiload.save((err, data) => {
                if (err) {
                    console.log(err);
                    res.status(200).json({
                        status: 401,
                        error_message: err,
                    });
                }
                else {
                    console.log(`============${data}`);
                    const id = data._id;
                    specializzazione_servics_1.default.find({ specializzazione: spec }, (err, data2) => {
                        if (err) {
                            res.status(200).json({
                                status: 401,
                                error_message: err,
                            });
                        }
                        else if (!data) {
                            // ubaci novi entryy
                            console.log("ubaci novi entryy");
                            let spec_se = new specializzazione_servics_1.default({
                                specializzazione: spec,
                                services: [id],
                            });
                            spec_se.save((err, data) => {
                                if (err) {
                                    res.status(200).json({
                                        status: 401,
                                        error_message: err,
                                    });
                                }
                                else {
                                    console.log(`-----${data}------`);
                                    services_request_new_servic_1.default.updateOne({ specializzazione: spec }, {
                                        $pull: {
                                            requests: {
                                                service_name: data["service_name"],
                                                servic_cost: data["servic_cost"],
                                                service_dur: data["service_dur"],
                                                service_des: data["service_des"],
                                            },
                                        },
                                    }, (error, result) => {
                                        if (error) {
                                            res.status(200).json({
                                                status: 401,
                                                cause: "getting all user data except manager",
                                                error_message: error,
                                            });
                                        }
                                        else {
                                            console.log(result);
                                            res.status(200).json({
                                                status: 200,
                                                after: result,
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            // ubaci u array
                            console.log("ubaci u arr");
                            specializzazione_servics_1.default.updateOne({ specializzazione: spec }, { $push: { services: id.toString() } }, (err, data) => {
                                if (err) {
                                    res.status(200).json({
                                        status: 401,
                                        error_message: err,
                                    });
                                }
                                else {
                                    services_request_new_servic_1.default.updateOne({ specializzazione: spec }, {
                                        $pull: {
                                            requests: {
                                                service_name: data["service_name"],
                                                servic_cost: data["servic_cost"],
                                                service_dur: data["service_dur"],
                                                service_des: data["service_des"],
                                            },
                                        },
                                    }, (error, result) => {
                                        if (error) {
                                            res.status(200).json({
                                                status: 401,
                                                cause: "getting all user data except manager",
                                                error_message: error,
                                            });
                                        }
                                        else {
                                            console.log(result);
                                            res.status(200).json({
                                                status: 200,
                                                after: result,
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        };
        this.get_data_spec_ser = (req, res) => {
            specializzazione_servics_1.default.aggregate([
                {
                    $addFields: {
                        servicesObjectId: {
                            $map: {
                                input: "$services",
                                as: "serviceId",
                                in: { $toObjectId: "$$serviceId" },
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: "srvices",
                        localField: "servicesObjectId",
                        foreignField: "_id",
                        as: "all_services",
                    },
                },
                {
                    $project: {
                        _id: 0,
                        specializzazione: "$specializzazione",
                        all_services: {
                            $map: {
                                input: "$all_services",
                                as: "service",
                                in: {
                                    id: "$$service._id",
                                    service_name: "$$service.servic_name",
                                    cost: "$$service.cost",
                                    time: "$$service.time",
                                    description: "$$service.description",
                                    edit: false,
                                    changes: false,
                                },
                            },
                        },
                    },
                },
            ]).exec((err, data) => {
                if (err) {
                    res.status(200).json({
                        status: 401,
                        error_message: err,
                    });
                }
                else {
                    res.status(200).json({
                        status: 200,
                        data: data,
                    });
                }
            });
        };
        this.update_service_data = (req, res) => {
            const id = new mongodb_1.ObjectId(req.body.data["id"]);
            const data = req.body.data;
            services_1.default.findOneAndUpdate({ _id: id }, {
                $set: {
                    servic_name: data.service_name,
                    cost: data.servic_cost,
                    time: data.service_dur,
                    description: data.service_des,
                },
            }, { new: true }, (error, data) => {
                if (error) {
                    res.status(200).json({
                        status: 401,
                        error_message: error,
                    });
                }
                res.status(200).json({
                    status: 200,
                    data: data,
                });
            });
        };
        this.delete_servic = (req, res) => {
            const id = req.body.id;
            const spec = req.body.spec;
            const id_o = new mongodb_1.ObjectId(id);
            console.log("wookrs");
            services_1.default.deleteOne({ _id: id_o }, (err, data) => {
                console.log(data);
                if (err) {
                    res.status(500).json({
                        status: 500,
                        error_message: err,
                    });
                }
                else {
                    specializzazione_servics_1.default.updateOne({ specializzazione: spec }, { $pull: { services: id } }, (err, data) => {
                        console.log(data);
                        if (err) {
                            res.status(500).json({
                                status: 500,
                                error_message: err,
                            });
                        }
                        else {
                            doctor_selected_specializzazione_1.default.updateOne({ "services.services_id": id }, { $pull: { services: { services_id: id } } }, (err, data) => {
                                console.log(data);
                                if (err) {
                                    res.status(500).json({
                                        status: 500,
                                        error_message: err,
                                    });
                                }
                                else {
                                    res.status(200).json({
                                        status: 200,
                                    });
                                }
                            });
                        }
                    });
                }
            });
        };
        this.add_new_spec = (req, res) => {
            const name = req.body.name;
            specializzaziones_1.default.findOne({ name: name }, (err, data) => {
                if (err) {
                    res.status(500).json({
                        status: 500,
                        error_message: err,
                    });
                    return;
                }
                if (!data) {
                    let spec_new = new specializzaziones_1.default({ name: name });
                    spec_new.save((err, data) => {
                        if (err) {
                            res.status(500).json({
                                status: 500,
                                error_message: err,
                            });
                            return;
                        }
                        else {
                            if (data) {
                                res.status(200).json({
                                    status: 200,
                                });
                            }
                            else {
                                res.status(200).json({
                                    status: 400,
                                });
                            }
                        }
                    });
                }
                else {
                    res.status(200).json({
                        status: 200,
                    });
                }
            });
        };
        this.get_all_spec = (req, res) => {
            specializzaziones_1.default.find({}, (err, data) => {
                if (err) {
                    res.status(500).json({
                        status: 500,
                        error_message: err,
                    });
                    return;
                }
                if (data) {
                    res.status(200).json({
                        status: 200,
                        data: data,
                    });
                }
            });
        };
        this.add_ser_speserv = (req, res) => {
            const spec = req.body.specializzazione;
            const data = req.body.data;
            const paiload = new services_1.default({
                servic_name: data["service_name"],
                cost: data["servic_cost"],
                time: data["service_dur"],
                description: data["service_des"],
            });
            console.log(paiload);
            paiload.save((err, data) => {
                if (err) {
                    console.log(err);
                    res.status(200).json({
                        status: 401,
                        error_message: err,
                    });
                }
                else {
                    console.log(`============${data}`);
                    const id = data._id;
                    specializzazione_servics_1.default.find({ specializzazione: spec }, (err, data2) => {
                        if (err) {
                            res.status(200).json({
                                status: 401,
                                error_message: err,
                            });
                        }
                        else if (!data) {
                            // ubaci novi entryy
                            console.log("ubaci novi entry");
                            let spec_se = new specializzazione_servics_1.default({
                                specializzazione: spec,
                                services: [id],
                            });
                            spec_se.save((err, data) => {
                                if (err) {
                                    res.status(200).json({
                                        status: 401,
                                        error_message: err,
                                    });
                                }
                                else {
                                    console.log(`-----${data}------`);
                                    res.status(200).json({
                                        status: 200,
                                        data: data
                                    });
                                }
                            });
                        }
                        else {
                            // ubaci u array
                            console.log("ubaci u arr");
                            specializzazione_servics_1.default.updateOne({ specializzazione: spec }, { $push: { services: id.toString() } }, (err, data) => {
                                if (err) {
                                    res.status(200).json({
                                        status: 401,
                                        error_message: err,
                                    });
                                }
                                else {
                                    services_request_new_servic_1.default.updateOne({ specializzazione: spec }, {
                                        $pull: {
                                            requests: {
                                                service_name: data["service_name"],
                                                servic_cost: data["servic_cost"],
                                                service_dur: data["service_dur"],
                                                service_des: data["service_des"],
                                            },
                                        },
                                    }, (error, result) => {
                                        if (error) {
                                            res.status(200).json({
                                                status: 401,
                                                cause: "getting all user data except manager",
                                                error_message: error,
                                            });
                                        }
                                        else {
                                            console.log(result);
                                            res.status(200).json({
                                                status: 200,
                                                after: result,
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        };
    }
}
exports.ManagerController = ManagerController;
//# sourceMappingURL=manager.controller.js.map