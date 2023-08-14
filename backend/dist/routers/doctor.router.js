"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctor_controller_1 = require("../controllers/doctor.controller");
const doctorRouter = express_1.default.Router();
doctorRouter.route('/get_all').get((req, res) => new doctor_controller_1.DoctorController().get_all(req, res));
doctorRouter.route('/get_doctor').post((req, res) => new doctor_controller_1.DoctorController().getDoctor(req, res));
doctorRouter.route('/update_user').post((req, res) => new doctor_controller_1.DoctorController().updateProfile(req, res));
doctorRouter.route('/calender/get').post((req, res) => new doctor_controller_1.DoctorController().get_doctor_calender(req, res));
doctorRouter.route('/calender/get/id').post((req, res) => new doctor_controller_1.DoctorController().get_doctor_calender_id(req, res));
exports.default = doctorRouter;
//# sourceMappingURL=doctor.router.js.map