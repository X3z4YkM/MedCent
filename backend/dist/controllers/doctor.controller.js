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
exports.DoctorController = void 0;
const user_1 = __importDefault(require("../models/user"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const secret = "12g47JNBAbBVHJDA423ascH7bjqb6574gyiu67rKNjn9B";
class DoctorController {
    constructor() {
        this.get_all = (req, res) => {
            user_1.default.find({ type: 'Doctor', status: "true" }, (err, data) => {
                if (data) {
                    let new_data = data.map(doctor => {
                        const path_to_images = path_1.default.join(__dirname, `../../src/assets/profile_pictures/${doctor['img_src']}`);
                        let image = fs.readFileSync(path_to_images);
                        return {
                            firstname: doctor['firstname'],
                            lastname: doctor['lastname'],
                            specializzazione: doctor['d_data'].specializzazione,
                            img_profile: image
                        };
                    });
                    res.status(200)
                        .json({
                        status: 200,
                        executed: "getting all docotrs from db",
                        doctors: new_data
                    });
                }
                else {
                    res.status(401)
                        .json({
                        status: 401,
                        executed: "error happened when getting all doctors ",
                        error_message: err
                    });
                }
            });
        };
        this.getDoctor = (req, res) => {
            jwt.verify(req.body.token, secret, (err, decoded) => {
                if (decoded) {
                    const path_to_images = path_1.default.join(__dirname, `../../src/assets/profile_pictures/${decoded["_doc"].img_src}`);
                    let image = fs.readFileSync(path_to_images);
                    res.status(200).json({
                        status: 200,
                        user: decoded["_doc"],
                        image: image,
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
        this.updateProfile = (req, res) => {
            const new_user_data = req.body.new_user_data;
            user_1.default.findOne({ _id: new_user_data._id }, (err, data) => {
                console.log(1);
                if (data) {
                    console.log(11);
                    const updateFields = {};
                    Object.keys(data).forEach((key) => {
                        if (key !== '_id') {
                            if (key === 'd_data') {
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
                                        let extension = data["img_src"].split('.')[1];
                                        updateFields["img_src"] = `${new_user_data.username}.${extension}`;
                                        Promise.all([this.renameFilePromise(data["img_src"], updateFields["img_src"])]);
                                        console.log(updateFields["img_src"]);
                                        console.log(data["img_src"]);
                                    }
                                }
                            }
                        }
                    });
                    console.log(updateFields);
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
                        res.status(200)
                            .json({
                            status: 200,
                            cause: "no data was changed",
                        });
                    }
                    else {
                        user_1.default.findOneAndUpdate({ _id: data._id }, { $set: updateFields }, { new: true }, (err, data) => {
                            if (data) {
                                const payload = Object.assign(Object.assign({}, data), { _id: data._id.toString() });
                                console.log(`------this is user\n ${data}\n------------`);
                                jwt.sign(payload, secret, { expiresIn: "1h" }, (err, token) => {
                                    jwt.verify(token, secret, (err, decoded) => {
                                        console.log(`this is decoded\n ${decoded}\n----------`);
                                    });
                                    res.status(200)
                                        .json({
                                        token: token,
                                        status: 200,
                                        cause: "fileds updated",
                                        return_data: new_user_data
                                    });
                                });
                            }
                            else {
                                res.status(401)
                                    .json({
                                    status: 401,
                                    cause: "failed to updated"
                                });
                            }
                        });
                    }
                }
                else {
                    // internal server error
                    res.status(500)
                        .json({
                        status: 500,
                        cause: "user not found",
                        error_message: err
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
    }
}
exports.DoctorController = DoctorController;
//# sourceMappingURL=doctor.controller.js.map