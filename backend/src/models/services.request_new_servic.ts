import { Decimal128, Double, Int32, ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema = mongoose.Schema



let ReqNS = new Schema({

    specializzazione: {
        type: String
    },
    requests: {
        type: Array
    }

})

export default mongoose.model('ReqNS', ReqNS, 'request_new_servic');
