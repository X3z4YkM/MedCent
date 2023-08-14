"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patient_controller_1 = require("../controllers/patient.controller");
const patientRouter = express_1.default.Router();
patientRouter.route('/get_patient').post((req, res) => new patient_controller_1.PatientController().getPatient(req, res));
patientRouter.route('/update_user').post((req, res) => new patient_controller_1.PatientController().updateProfile(req, res));
patientRouter.route('/user/get/id').post((req, res) => new patient_controller_1.PatientController().getById(req, res));
exports.default = patientRouter;
//# sourceMappingURL=patinet.router.js.map