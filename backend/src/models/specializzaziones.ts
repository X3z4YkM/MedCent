import { ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema = mongoose.Schema



let Specializzazione = new Schema({
    
    name:{
        type: String
    }

})


export default mongoose.model('Specializzazione', Specializzazione, 'specializzazione');
