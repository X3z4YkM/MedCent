import express from 'express'
import {ManagerController} from '../controllers/manager.controller';
const managerRouter = express.Router();



managerRouter.route('/get_all_users').get(
	(req, res) => new ManagerController().get_all_users(req, res)
)
managerRouter.route('/get_all_requests').get(
	(req, res) => new ManagerController().get_all_requests(req, res)
)

managerRouter.route('/update_user').post(
	(req, res) => new ManagerController().update_user(req, res)
)

export default managerRouter