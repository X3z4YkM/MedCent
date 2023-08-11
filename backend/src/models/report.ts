import { Decimal128, Double, Int32, ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema = mongoose.Schema



let Report = new Schema({

    date_of_report: {
        type: Date
    },
    doctors_name: {
        type: String
    },
    specializzazione: {
        type: String
    },
    reason_for_comming: {
        type: String
    },
    diagnosis: {
        type: String
    },
    therapy: {
        type: String
    },
    next_session: {
        type: Date
    },
    patient_id: {
        type: String
    },
    date_of_schedule: {
        type: Date
    }

})

export default mongoose.model('Report', Report, 'report');
