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

managerRouter.route('/request/service/remove').post(
	(req, res) => new ManagerController().remove_service_request(req, res)
)

managerRouter.route('/request/service/aprove').post(
	(req, res) => new ManagerController().aprove_service_request(req, res)
)
managerRouter.route('/specializzazione/services/get/all').get(
	(req, res) => new ManagerController().get_data_spec_ser(req, res)
)

managerRouter.route('/specializzazione/services/update').post(
	(req, res) => new ManagerController().update_service_data(req, res)
)
managerRouter.route('/specializzazione/services/delete').post(
	(req, res) => new ManagerController().delete_servic(req, res)
)

managerRouter.route('/specializzazione/add').post(
	(req, res) => new ManagerController().add_new_spec(req, res)
)


managerRouter.route('/specializzazione/get/all').get(
	(req, res) => new ManagerController().get_all_spec(req, res)
)

managerRouter.route('/specializzazione/service/add').post(
	(req, res) => new ManagerController().add_ser_speserv(req, res)
)
managerRouter.route('/services/get/all').get(
	(req, res) => new ManagerController().get_all_services(req, res)
)

managerRouter.route('/get_manager').post(
	(req, res) => new ManagerController().get_manager(req, res)
)


export default managerRouter