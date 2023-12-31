import { ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema = mongoose.Schema



let User = new Schema({
	_id: {
		type: ObjectId
	},
	firstname: {
		type: String
	},
	lastname: {
		type: String
	},
	username: {
		type: String
	},
	password: {
		type: String
	},
	address: {
		type: String
	},
	mobile_phone: {
		type: String
	},
	email: {
		type: String
	},
	type:{
		type: String
	},
	d_data: {
		type: Object
	},
	img_src: {
		type: String
	},
	status: {
		type: String
	}

})


export default mongoose.model('User', User, 'users');
