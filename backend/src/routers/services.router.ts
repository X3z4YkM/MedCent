import express from 'express'
import {ServicsController} from '../controllers/servics.controller';
const servicsRouter = express.Router();

servicsRouter.route('/specializzazione/get').post(
	(req, res) => new ServicsController().specializzazione_based_services(req, res)
)

servicsRouter.route('/patient/doctor/specializzazione/get').post(
	(req, res) => new ServicsController().pet_doc_specializzazione_based_services(req, res)
)
servicsRouter.route('/docotr/update').post(
	(req, res) => new ServicsController().upate_doctor(req, res)
)

servicsRouter.route('/docotr/workoff/add').post(
	(req, res) => new ServicsController().add_workoff(req, res)
)
servicsRouter.route('/specializzazione/request/add').post(
	(req, res) => new ServicsController().add_req_spec(req, res)
)
servicsRouter.route('/specializzazione/request/get').get(
	(req, res) => new ServicsController().get_req_spec(req, res)
)

servicsRouter.route('/report/generate').post(
	(req, res) => new ServicsController().generate_report(req, res)
)

servicsRouter.route('/appointment/cancle/doctor').post(
	(req, res) => new ServicsController().cancle_appoinment_docotr(req, res)
)
servicsRouter.route('/reports/user/get').post(
	(req, res) => new ServicsController().get_all_reports_for_user(req, res)
)

servicsRouter.route('/appointment/update/date').post(
	(req, res) => new ServicsController().update_dates(req, res)
)

servicsRouter.route('/user/set/reservation').post(
	(req, res) => new ServicsController().set_user_reservation(req, res)
)

servicsRouter.route('/appointment/cancle/patient').post(
	(req, res) => new ServicsController().cancle_appoinment_patient(req, res)
)

servicsRouter.route('/user/get/reports').post(
	(req, res) => new ServicsController().get_my_reports(req, res)
)


servicsRouter.route('/user/get/apoinments').post(
	(req, res) => new ServicsController().get_my_apointments(req, res)
)



servicsRouter.route('/patient/download/pdf/make').post(
	(req, res) => new ServicsController().create_one_pdf(req, res)
)
servicsRouter.route('/patient/download/pdf/all/make').post(
	(req, res) => new ServicsController().create_all_pdf(req, res)
)


servicsRouter.route('/request/get').get(
	(req, res) => new ServicsController().get_all_new_service(req, res)
)

servicsRouter.route('/request/get').get(
	(req, res) => new ServicsController().get_all_new_service(req, res)
)

servicsRouter.route('/discount/add').post(
	(req, res) => new ServicsController().add_sale_to_service(req, res)
)

servicsRouter.route('/patient/get/notifi').post(
	(req, res) => new ServicsController().get_users_noti(req, res)
)

export default servicsRouter