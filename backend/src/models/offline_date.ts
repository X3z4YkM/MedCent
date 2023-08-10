import { Decimal128, Double, Int32, ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema = mongoose.Schema



let Offline = new Schema({

    doctor_id: {
        type: String
    },
    offline_dates: {
        type: Array
    }

})

export default mongoose.model('Offline', Offline, 'offline');
