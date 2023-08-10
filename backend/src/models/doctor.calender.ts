import { Decimal128, Double, Int32, ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema = mongoose.Schema



let Calender = new Schema({

    doctor_id: {
        type: String
    },
    reservations: {
        type: Array
    }

})

export default mongoose.model('Calender', Calender, 'calendar');
