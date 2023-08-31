import { Decimal128, Double, Int32, ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema = mongoose.Schema



let Servic = new Schema({


    servic_name: {
        type: String
    },
    cost: {
        type: Number
    },
    time: {
        type: String
    },
    description:{
        type: String
    }

})

export default mongoose.model('Servic', Servic, 'srvices');
