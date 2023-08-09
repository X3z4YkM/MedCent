"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicsController = void 0;
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const secret = "12g47JNBAbBVHJDA423ascH7bjqb6574gyiu67rKNjn9B";
const specializzazione_servics_1 = __importDefault(require("../models/specializzazione_servics"));
const doctor_selected_specializzazione_1 = __importDefault(require("../models/doctor_selected_specializzazione"));
class ServicsController {
    constructor() {
        this.specializzazione_based_services = (req, res) => {
            const token = req.body.token;
            jwt.verify(req.body.token, secret, (err, decoded) => {
                if (decoded) {
                    const specializzazione = decoded["_doc"].d_data["specializzazione"];
                    const id = decoded["_doc"]._id;
                    specializzazione_servics_1.default.findOne({ specializzazione: specializzazione }, (err, data) => {
                        if (data) {
                            doctor_selected_specializzazione_1.default.findOne({ docotrId: id }, (err, data_2) => {
                                if (data_2) {
                                    res.status(200)
                                        .json({
                                        status: 200,
                                        services: data["services"],
                                        selected: data_2["services"]
                                    });
                                }
                                else {
                                    res.status(200)
                                        .json({
                                        status: 200,
                                        services: data["services"],
                                        selected: null
                                    });
                                }
                            });
                        }
                        else {
                            console.log("---dsadasdna----");
                            res.status(401).json({
                                status: 401,
                                error_message: err
                            });
                        }
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
        this.upate_doctor = (req, res) => {
            const token = req.body.token;
            const data = req.body.data;
            console.log(data);
            console.log(token);
            jwt.verify(req.body.token, secret, (err, decoded) => {
                if (decoded) {
                    const id = decoded['_doc']._id;
                    console.log(id);
                    data.forEach(element => {
                        if (element.changed == true) {
                            if (element.selected == false) {
                                doctor_selected_specializzazione_1.default.updateOne({ "docotrId": `${id}` }, { $pull: { "services": { "servic_name": `${element.servic_name}` } } }).catch((err) => {
                                    console.log(err);
                                    res.status(401)
                                        .json({
                                        status: 401,
                                        error_message: err
                                    });
                                });
                            }
                            else {
                                try {
                                    doctor_selected_specializzazione_1.default.updateOne({ "docotrId": `${id}` }, { $push: { "services": { "servic_name": `${element.servic_name}`, "description": "New service description" } } }).catch((err) => {
                                        console.log(err);
                                        res.status(401)
                                            .json({
                                            status: 401,
                                            error_message: err
                                        });
                                    });
                                }
                                catch (error) {
                                    console.error("Error:", error);
                                    res.status(500).json({
                                        status: 500,
                                        message: "Error"
                                    });
                                }
                            }
                        }
                    });
                    data.forEach(element => {
                        if (element.changed == true) {
                            if (element.selected == false) {
                                element.changed = false;
                                element.selected = false;
                            }
                            else {
                                element.changed = false;
                                element.selected = true;
                            }
                        }
                    });
                    res.status(200)
                        .json({
                        status: 200,
                        message: "updated",
                        data: data
                    });
                }
            });
        };
    }
}
exports.ServicsController = ServicsController;
//# sourceMappingURL=servics.controller.js.map