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
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const secret = "12g47JNBAbBVHJDA423ascH7bjqb6574gyiu67rKNjn9B";
class UserController {
    constructor() {
        this.login = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            let type = req.body.role;
            user_1.default.findOne({ username: username, password: password, type: type }, (err, user) => {
                if (err) {
                    res.status(401).json({
                        status: 401,
                        cause: "User with provided credentials was not found",
                        error_message: err,
                        data: {
                            username: req.body.username,
                            password: req.body.password,
                            type: req.body.role
                        }
                    });
                }
                else {
                    if (user) {
                        const payload = Object.assign(Object.assign({}, user), { _id: user._id.toString() });
                        jwt.sign(payload, secret, { expiresIn: "1h" }, (err, token) => {
                            res.status(200).json({
                                status: 200,
                                casue: "User was successfully founded",
                                return_token: token,
                                user_type: user.type,
                                user_status: user.status,
                            });
                        });
                    }
                    else {
                        res.status(200).json({
                            status: 401,
                            casue: "User wasnt founded",
                            error_message: err,
                            data: {
                                username: req.body.username,
                                password: req.body.password,
                                type: req.body.role
                            }
                        });
                    }
                }
            });
        };
        this.get_token_data = (req, res) => {
            const token = req.body.token;
            jwt.verify(token, secret, (err, decoded) => {
                if (decoded) {
                    res.status(200)
                        .json({
                        status: 200,
                        type: decoded['_doc'].type
                    });
                }
                else {
                    res.status(401).
                        json({
                        status: 401,
                        cause: "geting token data",
                        error_message: err
                    });
                }
            });
        };
        this.register_patient = (req, res) => {
            let username = req.body.username;
            let name = req.body.name;
            let surname = req.body.surname;
            let email = req.body.email;
            let mobile = req.body.mobile;
            let password = req.body.password;
            let street = req.body.street;
            user_1.default.findOne({ username: username }, (err, user) => {
                if (user) {
                    res.status(400).json({
                        status: 400,
                        casue: "Trying to add user that exists",
                        error_message: "User alllready exists in database",
                    });
                }
                else {
                    const imageSrc = req.body.img_src;
                    const extension = req.body.extension;
                    let user = null;
                    console.log(req.body);
                    if (imageSrc) {
                        const path_to_images = path.join(__dirname, `../../src/assets/profile_pictures/${req.body.username}.${extension}`);
                        console.log(path_to_images);
                        const base64Data = imageSrc.replace(/^data:image\/png;base64,/, "");
                        const imageBuffer = Buffer.from(base64Data, "base64");
                        fs.writeFileSync(path_to_images, imageBuffer);
                        user = new user_1.default({
                            username: username,
                            lastname: surname,
                            firstname: name,
                            password: password,
                            address: street,
                            mobile_phone: mobile,
                            email: email,
                            type: "Patient",
                            status: false,
                            d_data: {
                                number_doctor_licenc: null,
                                specializzazione: null,
                                office_branch: null,
                            },
                            img_src: `${username}.${extension}`,
                        });
                    }
                    else {
                        user = new user_1.default({
                            username: username,
                            lastname: surname,
                            firstname: name,
                            password: password,
                            address: street,
                            mobile_phone: mobile,
                            email: email,
                            type: "Patient",
                            d_data: {
                                number_doctor_licenc: null,
                                specializzazione: null,
                                office_branch: null,
                            },
                            status: false,
                            img_src: "generic_avatar.jpg",
                        });
                    }
                    user.save((err, user) => {
                        if (user) {
                            res.status(200).json({
                                status: 200,
                                response_message: "User was successfully added",
                                username: username,
                            });
                        }
                        else {
                            res.status(400).json({
                                status: 400,
                                casue: "Trying to add user to the database",
                                error_message: err,
                            });
                        }
                    });
                }
            });
        };
        this.set_profile_img = (req, res) => {
            const imageSrc = req.body.img_src;
            const extension = req.body.extension;
            const path_to_images = path.join(__dirname, `../../src/assets/profile_pictures/${req.body.usrename}.${extension}`);
            const base64Data = imageSrc.replace(/^data:image\/png;base64,/, "");
            const imageBuffer = Buffer.from(base64Data, "base64");
            fs.writeFileSync(path_to_images, imageBuffer);
            const result = Promise.all([
                new Promise((resolve, reject) => user_1.default.findOneAndUpdate({ username: req.body.username }, { img_src: `${req.body.usrename}.${extension}` }, { new: true })
                    .then(() => {
                    console.log("STIGO");
                    res.json({ status: 200 });
                })
                    .catch(() => {
                    res.json({ status: 500 });
                })),
            ]);
        };
        this.get_profile_img = (req, res) => {
            jwt.verify(req.body.token, secret, (err, decoded) => {
                const path_to_images = path.join(__dirname, `../../src/assets/profile_pictures/${decoded["_doc"].img_src}`);
                let image = fs.readFileSync(path_to_images);
                res.json({
                    image: image,
                });
            });
        };
        this.get_expr_status = (req, res) => {
            try {
                const token = req.body.token;
                const decodedToken = jwt.verify(token, secret);
                const expirationTime = new Date(decodedToken.exp * 1000);
                const currentTime = new Date();
                const expirationTime2 = decodedToken.exp * 1000;
                const currentTime2 = new Date().getTime();
                const timeLeftInSeconds2 = Math.floor((expirationTime2 - currentTime2) / 1000);
                const hoursLeft = Math.floor(timeLeftInSeconds2 / 3600);
                const minutesLeft = Math.floor(timeLeftInSeconds2 / 60);
                const secondsLeft = timeLeftInSeconds2 % 60;
                if (expirationTime <= currentTime) {
                    res.status(200).json({
                        status: 200,
                        casue: "Chechking sesssion expirtaion",
                        data: {
                            houers: 0,
                            minuttes: 0,
                            seconds: 0,
                        },
                        message: "Token has expired",
                    });
                }
                else {
                    res.status(200).json({
                        status: 200,
                        casue: "Chechking sesssion expirtaion",
                        data: {
                            houers: hoursLeft,
                            minuttes: minutesLeft,
                            seconds: secondsLeft,
                        },
                        message: "Token is valid",
                    });
                }
            }
            catch (err) {
                console.error("Token verification failed:", err.message);
                res.status(500).json({
                    status: 500,
                    casue: "Chechking sesssion expirtaion",
                    message: "Token verification failed",
                    error_message: err.message,
                });
            }
        };
        this.update_status = (req, res) => {
            let username = req.body.username;
            let status = req.body.status;
            user_1.default.findOneAndUpdate({ 'username': username }, { $set: { 'status': status } }, (err, data) => {
                if (data) {
                    res.status(200)
                        .json({
                        status: 200,
                        message: "sve ok"
                    });
                }
                else {
                    res.status(401)
                        .json({
                        status: 401,
                        error_message: err
                    });
                }
            });
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map