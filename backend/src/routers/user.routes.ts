import express from 'express'
import {UserController} from '../controllers/user.controller';
const userRouter = express.Router();

userRouter.route('/login').post(
	(req, res) => new UserController().login(req, res)
)

userRouter.route('/register/patient').post(
	(req, res) => new UserController().register_patient(req, res)
)
userRouter.route('/register/doctor').post(
	(req, res) => new UserController().register_doctor(req, res)
)


userRouter.route('/img/save').post(
	(req, res) => new UserController().set_profile_img(req, res)
)

userRouter.route('/img/get').post(
	(req, res) => new UserController().get_profile_img(req, res)
)

userRouter.route('/chechk/session/expiration').post(
	(req, res) => new UserController().get_expr_status(req, res)
)

userRouter.route('/token_data').post(
	(req, res) => new UserController().get_token_data(req, res)
)

userRouter.route('/update_status').post(
	(req, res) => new UserController().update_status(req, res)
)


export default userRouter
