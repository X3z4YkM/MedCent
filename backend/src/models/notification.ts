import { Decimal128, Double, Int32, ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema = mongoose.Schema



let Notification = new Schema({

    patient_id: {
        type: String
    },
    notifications: {
        type: Array
    }

})

export default mongoose.model('Notification', Notification, 'notifications');
