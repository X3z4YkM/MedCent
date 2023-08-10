import express from 'express'
import {ServicsController} from '../controllers/servics.controller';
const servicsRouter = express.Router();

servicsRouter.route('/specializzazione/get').post(
	(req, res) => new ServicsController().specializzazione_based_services(req, res)
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
export default servicsRouter