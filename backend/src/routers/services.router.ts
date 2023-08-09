import express from 'express'
import {ServicsController} from '../controllers/servics.controller';
const servicsRouter = express.Router();

servicsRouter.route('/specializzazione/get').post(
	(req, res) => new ServicsController().specializzazione_based_services(req, res)
)

servicsRouter.route('/docotr/update').post(
	(req, res) => new ServicsController().upate_doctor(req, res)
)


export default servicsRouter