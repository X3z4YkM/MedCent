"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
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
            const targetDir = 'assets/profile_pictures/';
            const targetFileName = 'profile_image.' + extension;
            res.json({ 'something': 200 });
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map