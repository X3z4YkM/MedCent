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
exports.ServicsController = void 0;
const jwt = require("jsonwebtoken");
const secret = "12g47JNBAbBVHJDA423ascH7bjqb6574gyiu67rKNjn9B";
const specializzazione_servics_1 = __importDefault(require("../models/specializzazione_servics"));
const doctor_selected_specializzazione_1 = __importDefault(require("../models/doctor_selected_specializzazione"));
const offline_date_1 = __importDefault(require("../models/offline_date"));
const services_request_new_servic_1 = __importDefault(require("../models/services.request_new_servic"));
const report_1 = __importDefault(require("../models/report"));
const doctor_calender_1 = __importDefault(require("../models/doctor.calender"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const jspdf_1 = require("jspdf");
const qrcode = require('qrcode-generator');
const { createCanvas } = require('canvas');
const nodemailer = require('nodemailer');
const notification_1 = __importDefault(require("../models/notification"));
class ServicsController {
    constructor() {
        this.specializzazione_based_services = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.body.token;
            jwt.verify(req.body.token, secret, (err, decoded) => {
                if (decoded) {
                    const specializzazione = decoded["_doc"].d_data["specializzazione"];
                    const id = decoded["_doc"]._id;
                    specializzazione_servics_1.default.aggregate([
                        {
                            $match: {
                                specializzazione: specializzazione
                            }
                        },
                        {
                            $addFields: {
                                servicesIds: {
                                    $map: {
                                        input: "$services",
                                        as: "serviceId",
                                        in: {
                                            $toObjectId: "$$serviceId"
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "srvices",
                                localField: "servicesIds",
                                foreignField: "_id",
                                as: "matched_services"
                            }
                        },
                        {
                            $unwind: "$matched_services"
                        },
                        {
                            $project: {
                                "matched_services._id": 1,
                                "matched_services.servic_name": 1,
                                "matched_services.cost": 1,
                                "matched_services.description": 1,
                                "matched_services.time": 1
                            }
                        }
                    ])
                        .exec((err, result_1) => {
                        if (err) {
                            console.error(err);
                            res.status(500).json({
                                status: 500,
                                error_message: "Internal Server Error"
                            });
                        }
                        else {
                            doctor_selected_specializzazione_1.default.aggregate([
                                {
                                    $match: {
                                        docotrId: id
                                    }
                                },
                                {
                                    $unwind: "$services"
                                },
                                {
                                    $addFields: {
                                        servicesObjectId: {
                                            $toObjectId: "$services.services_id"
                                        }
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "srvices",
                                        localField: "servicesObjectId",
                                        foreignField: "_id",
                                        as: "matched_services"
                                    }
                                },
                                {
                                    $unwind: "$matched_services"
                                },
                                {
                                    $project: {
                                        "matched_services._id": 1,
                                        "matched_services.servic_name": 1,
                                        "matched_services.cost": 1,
                                        "matched_services.description": 1,
                                        "matched_services.time": 1
                                    }
                                }
                            ])
                                .exec((err, result) => {
                                if (result.length > 0) {
                                    const arr1 = result_1.map(item => item.matched_services);
                                    const arr2 = result.map(item => item.matched_services);
                                    console.log(arr1);
                                    console.log(arr2);
                                    res.status(200)
                                        .json({
                                        status: 200,
                                        services: arr1,
                                        selected: arr2
                                    });
                                }
                                else {
                                    const arr1 = result_1.map(item => item.matched_services);
                                    res.status(200)
                                        .json({
                                        status: 200,
                                        services: arr1,
                                        selected: []
                                    });
                                }
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
        });
        this.pet_doc_specializzazione_based_services = (req, res) => {
            const id = req.body.id;
            doctor_selected_specializzazione_1.default.aggregate([
                {
                    $match: {
                        docotrId: id
                    }
                },
                {
                    $unwind: "$services"
                },
                {
                    $addFields: {
                        servicesObjectId: {
                            $toObjectId: "$services.services_id"
                        }
                    }
                },
                {
                    $lookup: {
                        from: "srvices",
                        localField: "servicesObjectId",
                        foreignField: "_id",
                        as: "matched_services"
                    }
                },
                {
                    $unwind: "$matched_services"
                },
                {
                    $project: {
                        "matched_services._id": 1,
                        "matched_services.servic_name": 1,
                        "matched_services.cost": 1,
                        "matched_services.description": 1,
                        "matched_services.time": 1
                    }
                }
            ])
                .exec((err, result) => {
                if (result.length > 0) {
                    const arr2 = result.map(item => item.matched_services);
                    console.log(arr2);
                    res.status(200)
                        .json({
                        status: 200,
                        services: arr2
                    });
                }
                else {
                    res.status(200)
                        .json({
                        status: 200,
                        services: []
                    });
                }
            });
        };
        this.upate_doctor = (req, res) => {
            const token = req.body.token;
            const data = req.body.data;
            jwt.verify(req.body.token, secret, (err, decoded) => {
                if (decoded) {
                    const id = decoded['_doc']._id;
                    data.forEach(element => {
                        if (element.changed == true) {
                            if (element.selected == false) {
                                doctor_selected_specializzazione_1.default.updateOne({ "docotrId": `${id}` }, { $pull: { "services": { "services_id": `${element._id}` } } }).catch((err) => {
                                    res.status(401)
                                        .json({
                                        status: 401,
                                        error_message: err
                                    });
                                });
                            }
                            else {
                                try {
                                    doctor_selected_specializzazione_1.default.updateOne({ "docotrId": `${id}` }, { $push: { "services": { "services_id": `${element._id}` } } }).catch((err) => {
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
        this.add_workoff = (req, res) => {
            const token = req.body.token;
            const start_date = req.body.start_date;
            const end_date = req.body.end_date;
            jwt.verify(req.body.token, secret, (err, decoded) => {
                if (decoded) {
                    const id = decoded['_doc']._id;
                    offline_date_1.default.findOne({ "doctor_id": id }, (err, data) => {
                        console.log(data);
                        if (data) {
                            //update
                            let arr_dates = data['offline_dates'];
                            let newStartDate = new Date(start_date);
                            let newEndDate = new Date(end_date);
                            const isOverlap = arr_dates.some(existingDate => {
                                const existingStartDate = new Date(existingDate.start_date);
                                const existingEndDate = new Date(existingDate.end_date);
                                const startOverlap = newStartDate <= existingEndDate && newStartDate >= existingStartDate;
                                const endOverlap = newEndDate >= existingStartDate && newEndDate <= existingEndDate;
                                const encompassOverlap = newStartDate <= existingStartDate && newEndDate >= existingEndDate;
                                return startOverlap || endOverlap || encompassOverlap;
                            });
                            if (!isOverlap) {
                                offline_date_1.default.updateOne({ "doctor_id": id }, { $push: {
                                        "offline_dates": {
                                            "start_date": new Date(start_date),
                                            "end_date": new Date(end_date)
                                        }
                                    } }).then(() => {
                                    res.status(200).json({
                                        status: 200,
                                        response_message: "Offline was successfully update",
                                    });
                                }).catch((err) => {
                                    res.status(400).json({
                                        status: 400,
                                        casue: "Trying to update offline",
                                        error_message: err,
                                    });
                                });
                            }
                            else {
                                res.status(200).json({
                                    status: 400,
                                    casue: "Error while comparing dates for overlaping",
                                    error_message: err,
                                });
                            }
                        }
                        else if (err) {
                            // error foudn
                            res.status(400).json({
                                status: 400,
                                casue: "Error while findOne doctor",
                                error_message: err,
                            });
                        }
                        else {
                            // create a new entry for doctor
                            console.log(new Date(start_date));
                            let offline = new offline_date_1.default({
                                "doctor_id": id,
                                "offline_dates": [
                                    {
                                        "start_date": new Date(start_date),
                                        "end_date": new Date(end_date)
                                    }
                                ]
                            });
                            console.log(offline);
                            offline.save((err, data) => {
                                if (data) {
                                    res.status(200).json({
                                        status: 200,
                                        response_message: "Offline was successfully added",
                                    });
                                }
                                else {
                                    res.status(400).json({
                                        status: 400,
                                        casue: "Trying to add offline",
                                        error_message: err,
                                    });
                                }
                            });
                        }
                    });
                }
            });
        };
        this.add_req_spec = (req, res) => {
            const request = req.body.request;
            const specializzazione = req.body.specializzazione;
            services_request_new_servic_1.default.findOne({ "specializzazione": specializzazione }, (err, data) => {
                if (data) {
                    console.log(request);
                    services_request_new_servic_1.default.findOne({
                        "specializzazione": specializzazione,
                        "requests": request
                    }, (err, datainer) => {
                        if (datainer) {
                            res.status(200)
                                .json({
                                status: 200,
                                message: "addedd a new request "
                            });
                        }
                        else {
                            services_request_new_servic_1.default.updateOne({ "specializzazione": specializzazione }, { $push: { "requests": request } }).then(() => {
                                res.status(200)
                                    .json({
                                    status: 200,
                                    message: "addedd a new request "
                                });
                            }).catch((err) => {
                                res.status(500)
                                    .json({
                                    status: 500,
                                    message: "error while saving new req and new spec",
                                    error_message: err
                                });
                            });
                        }
                    });
                }
                else {
                    const request_new = new services_request_new_servic_1.default({
                        "specializzazione": specializzazione,
                        "requests": [request]
                    });
                    request_new.save()
                        .then(() => {
                        res.status(200)
                            .json({
                            status: 200,
                            message: "addedd a new request "
                        });
                    }).catch((err) => {
                        res.status(500)
                            .json({
                            status: 500,
                            message: "error while saving new req and new spec",
                            error_message: err
                        });
                    });
                }
            });
        };
        this.get_req_spec = (req, res) => {
            services_request_new_servic_1.default.find({}, (err, data) => {
                res.status(200)
                    .json({
                    status: 200,
                    data: data
                });
            });
        };
        this.generate_report = (req, res) => {
            const data = req.body.data;
            const my_a = req.body.my_ap;
            my_a.date_start = new Date(my_a.date_start);
            my_a.date_end = new Date(my_a.date_end);
            my_a.status = "finished";
            my_a.doctorts_note = true;
            const report = new report_1.default({
                date_of_report: data["date_of_report"],
                doctors_name: data["doctors_name"],
                specializzazione: data["specializzazione"],
                reason_for_comming: data["reason_for_comming"],
                diagnosis: data["diagnosis"],
                therapy: data["therapy"],
                next_session: data["next_session"],
                patient_id: data["patient_id"],
                date_of_schedule: data["date_of_schedule"]
            });
            console.log("#######");
            console.log(my_a);
            console.log("#######");
            console.log(data);
            console.log(report);
            report.save((err, datas) => {
                if (datas) {
                    console.log("generate_report");
                    // update doctors calander
                    // Calender.findOneAndUpdate(
                    // {
                    //     doctor_id: data['doctor_id'],
                    //     'reservations.patient_id': data['patient_id'],
                    //     'reservations.date_start': new Date(data['date_of_schedule']),
                    // },
                    // {
                    // $set: { 'reservations.$.doctorts_note': true }
                    // }, (err, dataf)=>{
                    //     console.log(dataf)
                    //     if(err){
                    //         res.status(200)
                    //         .json({
                    //             status: 401,
                    //             error_message: err
                    //         })
                    //     }else
                    //         if(dataf){
                    //             res.status(200)
                    //             .json({
                    //                 status: 200
                    //             })
                    //         }
                    // })
                    doctor_calender_1.default.findOne({ doctor_id: data['doctor_id'] }, (err, dataFind) => {
                        if (dataFind) {
                            console.log(dataFind);
                            let temp_array = [];
                            temp_array = dataFind['reservations'].filter(elem => new Date(elem.date_start).getDate() != new Date(my_a['date_start']).getDate());
                            console.log('---_$------');
                            console.log(temp_array.length);
                            console.log('---_$------');
                            temp_array.push(my_a);
                            doctor_calender_1.default.updateOne({ doctor_id: data['doctor_id'] }, { $set: { reservations: temp_array } }, (err, data) => {
                                if (data) {
                                    let reportObj = new report_1.default(report);
                                    delete reportObj._id;
                                    delete reportObj.__v;
                                    console.log(reportObj);
                                    reportObj.save();
                                    res.status(200)
                                        .json({
                                        staus: 200
                                    });
                                }
                                else {
                                    console.log('error');
                                    if (err) {
                                        res.status(400)
                                            .json({
                                            status: 400,
                                            error_message: err
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
                else {
                    console.log("nsa");
                    res.status(200)
                        .json({
                        status: 401,
                        error_message: err
                    });
                }
            });
        };
        this.cancle_appoinment_docotr = (req, res) => {
            const data = req.body.data;
            const patient_id = data['patient_id'];
            console.log(data);
            const query = {
                doctor_id: data['doctor_id'],
                'reservations.patient_id': data['patient_id'],
                'reservations.date_start': new Date(data['date_of_start']),
                'reservations.date_end': new Date(data['date_of_end'])
            };
            // Remove the element from the array and retrieve the removed element
            doctor_calender_1.default.findOneAndUpdate(query, {
                $pull: {
                    reservations: {
                        patient_id: data['patient_id'],
                        date_start: new Date(data['date_of_start']),
                        date_end: new Date(data['date_of_end'])
                    }
                }
            }, { new: true }, // This option returns the updated document
            (err, removedData) => {
                if (err) {
                    console.log(err);
                    res.status(401).json({
                        status: 401,
                        error_message: err
                    });
                }
                else {
                    if (!removedData) {
                        console.log(removedData);
                        res.status(404).json({
                            status: 404,
                            error_message: "Document not found"
                        });
                    }
                    else {
                        // Update the removed element and re-insert it back into the array
                        console.log("some shit");
                        const removedReservation = data['elemnt'];
                        removedReservation.cancled = true;
                        removedReservation.status = 'cancled';
                        removedReservation.cancled_note = data['text'];
                        removedReservation.date_start = new Date(removedReservation.date_start);
                        removedReservation.date_end = new Date(removedReservation.date_end);
                        console.log("---removedReservation---");
                        console.log(removedReservation);
                        console.log('-----------------------------');
                        doctor_calender_1.default.updateOne({ doctor_id: data['doctor_id'] }, {
                            $push: {
                                reservations: removedReservation
                            }
                        }, (err, data) => {
                            console.log(data);
                            if (err) {
                                res.status(200).json({
                                    status: 401,
                                    error_message: err
                                });
                            }
                            else {
                                const paiload = {
                                    type: "cancelation",
                                    servics: removedReservation.servics,
                                    date_start: removedReservation.date_start,
                                    date_end: removedReservation.date_end,
                                    firstname: removedReservation.firstname,
                                    lastname: removedReservation.lastname,
                                    cancled_note: removedReservation.cancled_note,
                                    seen: false,
                                    time_stamp: new Date()
                                };
                                console.log('-----notification-----');
                                console.log(paiload);
                                notification_1.default.updateOne({ patient_id: patient_id }, {
                                    $push: {
                                        notifications: paiload
                                    }
                                }, (err1, data) => {
                                    if (data) {
                                        console.log(data);
                                        res.status(200).json({
                                            status: 200,
                                            data: removedReservation
                                        });
                                    }
                                    else {
                                        res.status(20).json({
                                            status: 401,
                                            error_message: err1
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        };
        this.add_sale_to_service = (req, res) => {
            const service_id = req.body.sid;
            const off = req.body.off;
            console.log("-----------add_sale_to_service----------");
            let paiload = {
                type: "sale",
                service_id: service_id,
                off: off,
                seen: false,
                time_stamp: new Date()
            };
            console.log(paiload);
            notification_1.default.find({}, (err, data) => {
                if (data) {
                    console.log(`----${data}-----`);
                    const NotiPromises = data.map(user => {
                        return notification_1.default.updateOne({
                            patient_id: user.patient_id,
                        }, { $push: {
                                notifications: paiload
                            } });
                    });
                    Promise.all(NotiPromises)
                        .then(() => {
                        console.log("uso");
                        res.status(200).json({
                            status: 200
                        });
                    })
                        .catch(updateErrors => {
                        res.status(200).json({
                            status: 400
                        });
                    });
                }
            });
        };
        this.get_all_reports_for_user = (req, res) => {
            const user_id = req.body.id;
            report_1.default.find({ patient_id: user_id }, (err, data) => {
                if (data) {
                    res.status(200).
                        json({
                        status: 200,
                        data: data
                    });
                }
                else {
                    res.status(200).
                        json({
                        status: 400,
                    });
                }
            });
        };
        this.update_dates = (req, res) => {
            const data = req.body.date;
            const doctorid = req.body.doctorid;
            console.log("-----update_dates----");
            console.log(data);
            console.log(doctorid);
            console.log(data['patient_id']);
            console.log(new Date(data['date_start']));
            console.log(new Date(data['date_end']));
            const query = {
                doctor_id: doctorid,
                'reservations.patient_id': data['patient_id'],
                'reservations.date_start': new Date(data['date_start']),
                'reservations.date_end': new Date(data['date_end'])
            };
            // Remove the element from the array and retrieve the removed element
            doctor_calender_1.default.findOneAndUpdate(query, {
                $pull: {
                    reservations: {
                        patient_id: data['patient_id'],
                        date_start: new Date(data['date_start']),
                        date_end: new Date(data['date_end'])
                    }
                }
            }, { new: true }, // This option returns the updated document
            (err, removedData) => {
                if (err) {
                    console.log(err);
                    res.status(401).json({
                        status: 401,
                        error_message: err
                    });
                }
                else {
                    if (!removedData) {
                        console.log('here error');
                        console.log(removedData);
                        res.status(404).json({
                            status: 404,
                            error_message: "Document not found"
                        });
                    }
                    else {
                        // Update the removed element and re-insert it back into the array
                        console.log("some shit");
                        data['date_start'] = new Date(data['date_start']);
                        data['date_end'] = new Date(data['date_end']);
                        const removedReservation = data;
                        console.log(removedReservation);
                        doctor_calender_1.default.updateOne({ doctor_id: doctorid }, {
                            $push: {
                                reservations: removedReservation
                            }
                        }, (err, data) => {
                            console.log(data);
                            if (err) {
                                console.log("here 2 error");
                                res.status(401).json({
                                    status: 401,
                                    error_message: err
                                });
                            }
                            else {
                                res.status(200).json({
                                    status: 200
                                });
                            }
                        });
                    }
                }
            });
        };
        this.set_user_reservation = (req, res) => {
            const doctorId = req.body.doctor_id;
            const user = req.body.udata;
            const servic_name = req.body.servic_name;
            const date_s = new Date(req.body.date_start);
            const date_e = new Date(req.body.date_end);
            const paiload = {
                patient_id: user._id,
                servics: servic_name,
                date_start: date_s,
                date_end: date_e,
                firstname: user.firstname,
                lastname: user.lastname,
                status: "ongoing",
                doctorts_note: false,
                cancled: false,
                cancled_note: ""
            };
            doctor_calender_1.default.updateOne({ doctor_id: doctorId }, { $push: { reservations: paiload } }, (err, result) => {
                if (err) {
                    res.status(200).
                        json({
                        status: 500,
                        error: "when adding user reservation",
                        error_message: err
                    });
                }
                else {
                    if (result) {
                        res.status(200).
                            json({
                            status: 200,
                            data: paiload
                        });
                    }
                    else {
                        res.status(200).
                            json({
                            status: 401,
                            error: "when adding user reservation",
                            error_message: err
                        });
                    }
                }
            });
        };
        this.cancle_appoinment_patient = (req, res) => {
            const data = req.body.data;
            console.log('-------cancle_appoinment_patient------');
            console.log(data);
            const query = {
                doctor_id: data['doctor_id'],
                'reservations.patient_id': data['patient_id'],
                'reservations.date_start': new Date(data['date_of_start']),
                'reservations.date_end': new Date(data['date_of_end'])
            };
            // Remove the element from the array and retrieve the removed element
            doctor_calender_1.default.findOneAndUpdate(query, {
                $pull: {
                    reservations: {
                        patient_id: data['patient_id'],
                        date_start: new Date(data['date_of_start']),
                        date_end: new Date(data['date_of_end'])
                    }
                }
            }, { new: true }, // This option returns the updated document
            (err, removedData) => {
                if (err) {
                    console.log(err);
                    res.status(401).json({
                        status: 401,
                        error_message: err
                    });
                }
                else {
                    if (!removedData) {
                        console.log(removedData);
                        res.status(404).json({
                            status: 404,
                            error_message: "Document not found"
                        });
                    }
                    else {
                        console.log("some shit patient");
                        console.log(removedData);
                        // Update the removed element and re-insert it back into the array
                        console.log("some shit patient");
                        const removedReservation = data['cal_data'];
                        removedReservation.cancled = true;
                        removedReservation.status = 'cancled';
                        console.log(removedReservation);
                        doctor_calender_1.default.updateOne({ doctor_id: data['doctor_id'] }, {
                            $push: {
                                reservations: removedReservation
                            }
                        }, (err, data) => {
                            console.log(data);
                            if (err) {
                                res.status(401).json({
                                    status: 401,
                                    error_message: err
                                });
                            }
                            else {
                                res.status(200).json({
                                    status: 200
                                });
                            }
                        });
                    }
                }
            });
        };
        this.get_my_reports = (req, res) => {
            const token = req.body.token;
            jwt.verify(req.body.token, secret, (err, decoded) => {
                if (decoded) {
                    const id = decoded["_doc"]._id; // my id
                    report_1.default.find({ patient_id: id }, (err, data) => {
                        if (data) {
                            res.status(200)
                                .json({
                                status: 200,
                                data: data
                            });
                        }
                        else {
                            res.status(200)
                                .json({
                                status: 401,
                                error_message: err,
                                data: null
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
        this.get_my_apointments = (req, res) => {
            const token = req.body.token;
            jwt.verify(req.body.token, secret, (err, decoded) => {
                if (decoded) {
                    const id = decoded["_doc"]._id; // my id
                    doctor_calender_1.default.aggregate([
                        {
                            $match: {
                                "reservations.patient_id": id,
                                "reservations.cancled": false
                            }
                        },
                        {
                            $unwind: "$reservations"
                        },
                        {
                            $match: {
                                "reservations.patient_id": id
                            }
                        },
                        {
                            $addFields: {
                                doctor_id_obj: { $toObjectId: "$doctor_id" }
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "doctor_id_obj",
                                foreignField: "_id",
                                as: "doctor"
                            }
                        },
                        {
                            $unwind: "$doctor"
                        },
                        {
                            $project: {
                                "_id": 1,
                                "patient_id": "$reservations.patient_id",
                                "servics": "$reservations.servics",
                                "date_start": "$reservations.date_start",
                                "date_end": "$reservations.date_end",
                                "firstname": "$reservations.firstname",
                                "lastname": "$reservations.lastname",
                                "status": "$reservations.status",
                                "doctorts_note": "$reservations.doctorts_note",
                                "cancled": "$reservations.cancled",
                                "cancled_note": "$reservations.cancled_note",
                                "doctor_firstname": "$doctor.firstname",
                                "doctor_lastname": "$doctor.lastname",
                                "office_branch": "$doctor.d_data.office_branch"
                            }
                        }
                    ]).exec((err, result) => {
                        if (err) {
                            res.status(200).json({
                                status: 401,
                                error_message: err
                            });
                        }
                        else {
                            res.status(200).json({
                                status: 200,
                                data: result
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
        this.create_one_pdf = (req, res) => {
            const data = req.body.data;
            delete data._id;
            delete data.__v;
            delete data.patient_id;
            const id = req.body.id;
            const me = req.body.me;
            const pdf = new jspdf_1.jsPDF();
            const email = me.email;
            pdf.text("Generated PDF", 10, 10);
            const fomater = JSON.stringify(data, null, 2);
            const lines = fomater.split('\n');
            let vp = 30;
            lines.forEach(line => {
                pdf.text(line, 10, vp);
                vp += 10;
            });
            const path_to_pdf = path_1.default.join(__dirname, `../../src/assets/pdfs/${id}.pdf`);
            fs_1.default.writeFileSync(path_to_pdf, pdf.output());
            let uri = `http://localhost:4000/servics/patient/download/pdf/make?data=${path_to_pdf}`;
            uri = 'https://youtu.be/dQw4w9WgXcQ?feature=shared&t=43';
            const canvas = createCanvas(200, 200);
            const qr = qrcode(0, 'H');
            qr.addData(uri);
            qr.make();
            const dataUrl = qr.createDataURL(4); // Size of QR code (1 to 10)
            const html = `<img src="${dataUrl}" alt="QR Code" width="150" height="150">`;
            const tr = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                requireTLS: false,
                auth: {
                    user: 'lessie67@ethereal.email',
                    pass: 'h1R3vcbhprA7k2PW6f',
                },
            });
            const paiload = {
                from: 'lessie67@ethereal.email',
                to: email,
                subject: 'PDF Attachment',
                text: 'Attached is the PDF you requested.',
                attachments: [
                    {
                        filename: `${id}.pdf`,
                        path: path_to_pdf,
                    },
                ],
            };
            tr.sendMail(paiload, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    res.status(200).json({
                        status: 400,
                        err: error
                    });
                }
                else {
                    console.log('Email sent:', info.response);
                    res.status(200)
                        .json({
                        status: 200,
                        html: html
                    });
                }
            });
        };
        this.create_all_pdf = (req, res) => {
            const data_all = req.body.data;
            console.log(data_all);
            data_all.forEach(data => {
                delete data._id;
                delete data.__v;
                delete data.patient_id;
            });
            const id = req.body.id;
            const me = req.body.me;
            const pdf = new jspdf_1.jsPDF();
            const email = me.email;
            pdf.text("Generated PDF", 10, 10);
            data_all.forEach((data, index) => {
                const fomater = JSON.stringify(data, null, 2);
                const lines = fomater.split('\n');
                let vp = 30;
                if (index > 0) {
                    pdf.addPage();
                }
                lines.forEach(line => {
                    pdf.text(line, 10, vp);
                    vp += 15;
                });
            });
            const path_to_pdf = path_1.default.join(__dirname, `../../src/assets/pdfs/all_records.pdf`);
            fs_1.default.writeFileSync(path_to_pdf, pdf.output());
            const uri = `http://localhost:4000/servics/patient/download/pdf/make?data=${path_to_pdf}`;
            const canvas = createCanvas(200, 200);
            const qr = qrcode(0, 'H');
            qr.addData(uri);
            qr.make();
            const dataUrl = qr.createDataURL(4); // Size of QR code (1 to 10)
            const html = `<img src="${dataUrl}" alt="QR Code" width="150" height="150">`;
            const tr = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                requireTLS: false,
                auth: {
                    user: 'lessie67@ethereal.email',
                    pass: 'h1R3vcbhprA7k2PW6f',
                },
            });
            const paiload = {
                from: 'lessie67@ethereal.email',
                to: email,
                subject: 'PDF Attachment',
                text: 'Attached is the PDF you requested.',
                attachments: [
                    {
                        filename: `all_records.pdf`,
                        path: path_to_pdf,
                    },
                ],
            };
            tr.sendMail(paiload, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    res.status(200).json({
                        status: 400,
                        err: error
                    });
                }
                else {
                    console.log('Email sent:', info.response);
                    res.status(200)
                        .json({
                        status: 200,
                        html: html
                    });
                }
            });
        };
        this.get_all_new_service = (req, res) => {
            services_request_new_servic_1.default.find({}, (err, data) => {
                if (data) {
                    res.status(200)
                        .json({
                        status: 200,
                        data: data
                    });
                }
                else {
                    res.status(200)
                        .json({
                        status: 400,
                        data: data
                    });
                }
            });
        };
        this.get_users_noti = (req, res) => {
            const token = req.body.token;
            jwt.verify(req.body.token, secret, (err, decoded) => {
                if (decoded) {
                    const id = decoded["_doc"]._id; // my id
                    // Notification.findOne(
                    //   {patient_id: id},
                    //   (err, data) => {
                    //     if(data){
                    //       const paiload = data['notifications'].sort((a, b) => {
                    //         if (a.seen === false && b.seen === true) {
                    //           return -1; 
                    //       } else if (a.seen === true && b.seen === false) {
                    //           return 1; 
                    //       } else {
                    //           const time_a = new Date(a.time_stamp["time_stamp"]).getTime();
                    //           const time_b = new Date(b.time_stamp["time_stamp"]).getTime();
                    //           return time_b - time_a; 
                    //       }
                    //     });
                    //   res.status(200)
                    //   .json({
                    //     status:200,
                    //     data: paiload
                    //   })
                    // }else{
                    //   if(err){
                    //     res.status(500).
                    //     json({
                    //       status: 500,
                    //       error_message: err.message
                    //     })
                    //   }
                    // }
                    // }
                    // )
                    notification_1.default.aggregate([
                        {
                            $match: { "patient_id": id } // Replace with actual patient_id
                        },
                        {
                            $unwind: "$notifications"
                        },
                        {
                            $addFields: {
                                "notifications.service_id": {
                                    $cond: {
                                        if: { $eq: ["$notifications.service_id", ""] },
                                        then: "$notifications.service_id",
                                        else: { $toObjectId: "$notifications.service_id" }
                                    }
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "srvices",
                                localField: "notifications.service_id",
                                foreignField: "_id",
                                as: "matched_services"
                            }
                        },
                        {
                            $unwind: { path: "$matched_services", preserveNullAndEmptyArrays: true }
                        },
                        {
                            $sort: { "notifications.time_stamp": 1 }
                        },
                        {
                            $addFields: {
                                "notifications.matched_service_name": "$matched_services.servic_name",
                                "notifications.matched_service_cost": "$matched_services.cost"
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    _id: "$_id",
                                    patient_id: "$patient_id"
                                },
                                notifications: { $push: "$notifications" }
                            }
                        },
                        {
                            $project: {
                                notifications: 1
                            }
                        }
                    ]).exec((err, data) => {
                        if (data) {
                            const updatePromises = data[0].notifications.map(n => notification_1.default.updateOne({ patient_id: id, "notifications.time_stamp": n.time_stamp }, { $set: { "notifications.$.seen": true } }));
                            Promise.all(updatePromises)
                                .then(results => {
                                res.status(200)
                                    .json({
                                    status: 200,
                                    data: data[0].notifications
                                });
                            })
                                .catch(updateErr => {
                                res.status(500).
                                    json({
                                    status: 500,
                                    error_message: err.message
                                });
                            });
                        }
                        else {
                            if (err) {
                                res.status(500).
                                    json({
                                    status: 500,
                                    error_message: err.message
                                });
                            }
                        }
                    });
                }
                else {
                    if (err) {
                        res.status(200).
                            json({
                            status: 400,
                            error_message: "missing token"
                        });
                    }
                }
            });
        };
    }
}
exports.ServicsController = ServicsController;
//# sourceMappingURL=servics.controller.js.map