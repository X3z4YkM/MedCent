import express from 'express'
import {UserController} from '../controllers/user.controller';
const userRouter = express.Router();

userRouter.route('/login').post(
	(req, res) => new UserController().login(req, res)
)

userRouter.route('/register/patient').post(
	(req, res) => new UserController().register_patient(req, res)
)

userRouter.route('/img/save').post(
	(req, res) => new UserController().set_profile_img(req, res)
)


export default userRouter
