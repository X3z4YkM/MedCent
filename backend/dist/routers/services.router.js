"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const servics_controller_1 = require("../controllers/servics.controller");
const servicsRouter = express_1.default.Router();
servicsRouter.route('/specializzazione/get').post((req, res) => new servics_controller_1.ServicsController().specializzazione_based_services(req, res));
servicsRouter.route('/patient/doctor/specializzazione/get').post((req, res) => new servics_controller_1.ServicsController().pet_doc_specializzazione_based_services(req, res));
servicsRouter.route('/docotr/update').post((req, res) => new servics_controller_1.ServicsController().upate_doctor(req, res));
servicsRouter.route('/docotr/workoff/add').post((req, res) => new servics_controller_1.ServicsController().add_workoff(req, res));
servicsRouter.route('/specializzazione/request/add').post((req, res) => new servics_controller_1.ServicsController().add_req_spec(req, res));
servicsRouter.route('/specializzazione/request/get').get((req, res) => new servics_controller_1.ServicsController().get_req_spec(req, res));
servicsRouter.route('/report/generate').post((req, res) => new servics_controller_1.ServicsController().generate_report(req, res));
servicsRouter.route('/appointment/cancle/doctor').post((req, res) => new servics_controller_1.ServicsController().cancle_appoinment_docotr(req, res));
servicsRouter.route('/reports/user/get').post((req, res) => new servics_controller_1.ServicsController().get_all_reports_for_user(req, res));
servicsRouter.route('/appointment/update/date').post((req, res) => new servics_controller_1.ServicsController().update_dates(req, res));
servicsRouter.route('/user/set/reservation').post((req, res) => new servics_controller_1.ServicsController().set_user_reservation(req, res));
servicsRouter.route('/appointment/cancle/patient').post((req, res) => new servics_controller_1.ServicsController().cancle_appoinment_patient(req, res));
servicsRouter.route('/user/get/reports').post((req, res) => new servics_controller_1.ServicsController().get_my_reports(req, res));
servicsRouter.route('/user/get/apoinments').post((req, res) => new servics_controller_1.ServicsController().get_my_apointments(req, res));
servicsRouter.route('/patient/download/pdf/make').post((req, res) => new servics_controller_1.ServicsController().create_one_pdf(req, res));
servicsRouter.route('/patient/download/pdf/all/make').post((req, res) => new servics_controller_1.ServicsController().create_all_pdf(req, res));
servicsRouter.route('/request/get').get((req, res) => new servics_controller_1.ServicsController().get_all_new_service(req, res));
servicsRouter.route('/request/get').get((req, res) => new servics_controller_1.ServicsController().get_all_new_service(req, res));
servicsRouter.route('/discount/add').post((req, res) => new servics_controller_1.ServicsController().add_sale_to_service(req, res));
servicsRouter.route('/patient/get/notifi').post((req, res) => new servics_controller_1.ServicsController().get_users_noti(req, res));
exports.default = servicsRouter;
//# sourceMappingURL=services.router.js.map