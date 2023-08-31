"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
userRouter.route('/login').post((req, res) => new user_controller_1.UserController().login(req, res));
userRouter.route('/register/patient').post((req, res) => new user_controller_1.UserController().register_patient(req, res));
userRouter.route('/register/doctor').post((req, res) => new user_controller_1.UserController().register_doctor(req, res));
userRouter.route('/img/save').post((req, res) => new user_controller_1.UserController().set_profile_img(req, res));
userRouter.route('/img/get').post((req, res) => new user_controller_1.UserController().get_profile_img(req, res));
userRouter.route('/chechk/session/expiration').post((req, res) => new user_controller_1.UserController().get_expr_status(req, res));
userRouter.route('/token_data').post((req, res) => new user_controller_1.UserController().get_token_data(req, res));
userRouter.route('/update_status').post((req, res) => new user_controller_1.UserController().update_status(req, res));
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map