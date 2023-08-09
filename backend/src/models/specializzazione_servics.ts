import { Double, ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema = mongoose.Schema



let Spec_servics = new Schema({

    _id: {
		type: ObjectId
	},
    specializzazione: {
        type: String
    },
    services: {
        type: Array
    }



})

export default mongoose.model('Spec_servics', Spec_servics, 'specializzazione_servics');
