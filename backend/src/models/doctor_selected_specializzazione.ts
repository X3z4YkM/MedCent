import { Double, ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema = mongoose.Schema



let DocSpec_servics = new Schema({

    _id: {
		type: ObjectId
	},
    docotrId: {
        type: String
    },
    services: {
        type: Array
    }



})

export default mongoose.model('DocSpec_servics', DocSpec_servics, 'doctor_selected_specializzazione');
