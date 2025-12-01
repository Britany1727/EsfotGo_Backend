import {Schema, model} from 'mongoose'
import bcrypt from "bcryptjs"

const eventoSchema = new Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },  
    informacion:{
        type:String,
        required:true,
        trim:true
    },
    ubicacion:{
        type:String,
        required:false,
        trim:true
    },          
    fecha:{
        type:Date,
        required:true
    },
    hora:{
        type:String,
        required:true
    },
    organizador:{
        type:String,
        required:true,
        trim:true   
    }
},{
    timestamps:true
})  

export default model('Evento',eventoSchema)