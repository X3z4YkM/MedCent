import express from 'express'
import {DoctorController} from '../controllers/doctor.controller';
const doctorRouter = express.Router();



doctorRouter.route('/get_all').get(
	(req, res) => new DoctorController().get_all(req, res)
)
doctorRouter.route('/get_doctor').post(
	(req, res) => new DoctorController().getDoctor(req,res)
)
doctorRouter.route('/update_user').post(
	(req, res) => new DoctorController().updateProfile(req,res)
)

doctorRouter.route('/calender/get').post(
	(req, res) => new DoctorController().get_doctor_calender(req,res)
)

export default doctorRouter