import express from 'express'
import {PatientController} from '../controllers/patient.controller';
const patientRouter = express.Router();




patientRouter.route('/get_patient').post(
	(req, res) => new PatientController().getPatient(req,res)
)
patientRouter.route('/update_user').post(
	(req, res) => new PatientController().updateProfile(req,res)
)
patientRouter.route('/user/get/id').post(
	(req, res) => new PatientController().getById(req,res)
)

export default patientRouter