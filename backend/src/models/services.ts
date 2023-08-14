import { Decimal128, Double, Int32, ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema = mongoose.Schema



let Servic = new Schema({

    _id: {
		type: ObjectId
	},
    servic_name: {
        type: String
    },
    cost: {
        type: Decimal128
    },
    time: {
        type: Number
    },
    description:{
        type: String
    }

})

export default mongoose.model('Servic', Servic, 'srvices');
