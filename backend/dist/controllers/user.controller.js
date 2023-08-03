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
class UserController {
    constructor() {
        this.login = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            let type = req.body.role;
            user_1.default.findOne({ 'username': username, 'password': password, 'type': type }, (err, user) => {
                if (err) {
                    res.status(401)
                        .json({
                        "status": 401,
                        "cause": "User with provided credentials was not found",
                        "error_message": err
                    });
                }
                else {
                    res.status(200)
                        .json({
                        "status": 200,
                        "casue": "User was successfully founded",
                        "return_user": user
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
            user_1.default.findOne({ 'username': username }, (err, user) => {
                if (user) {
                    res.status(400).json({
                        'status': 400,
                        'casue': "Trying to add user that exists",
                        'error_message': "User alllready exists in database"
                    });
                }
                else {
                    let user = new user_1.default({
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
                            office_branch: null
                        }
                    });
                    user.save().then(user => {
                        res.status(200).json({
                            'status': 200,
                            'response_message': 'User was successfully added'
                        });
                    }).catch(err => {
                        res.status(400).json({
                            'status': 400,
                            'casue': "Trying to add user to the database",
                            'error_message': err
                        });
                    });
                }
            });
        };
        this.set_profile_img = (req, res) => {
            const imageSrc = req.body.img_src;
            const extension = req.body.extension;
            let username = 'misko123';
            const targetDir = '../srassets/profile_pictures/image.png';
            const targetFileName = 'profile_image.' + extension;
            const path_to_images = path.join(__dirname, `../../src/assets/profile_pictures/${username}.${extension}`);
            //console.log(path_to_images)
            let s = fs.readFileSync(imageSrc);
            console.log(s);
            fs.writeFileSync(path_to_images, imageSrc);
            res.json({ 'something': imageSrc });
        };
        this.get_profile_img = (req, res) => {
            let usrename = req.body.username;
            const path_to_images = path.join(__dirname, `../../src/assets/profile_pictures/misko123.png`);
            let image = fs.readFileSync(path_to_images, 'base64');
            res.json({
                'image': JSON.stringify(image)
            });
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map