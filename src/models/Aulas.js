import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs"

const aulaSchema = new Schema({
    numero: {
        type: String,   
        required: true,
        trim: true
    },  
    ubicacion: {
        type: String,
        required: true, 
        trim: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['aula', 'laboratorio'],
        trim: true
    },
    edificio: {
        type: Schema.Types.ObjectId,  // Referencia al modelo Edificio
        ref: 'Edificio',
        required: true
    }
}
,{
    timestamps: true,
    collection: 'aulas'
})

aulaSchema.index({ edificio: 1, numero: 1 });

export default model('Aula', aulaSchema)