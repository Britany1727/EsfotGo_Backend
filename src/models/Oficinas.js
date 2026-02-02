import { Schema, model } from "mongoose";

const oficinaSchema = new Schema({
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
    edificio: {
        type: String,
        required: true,
        trim: true
    }
}
,{
    timestamps: true,
    collection: 'oficinas'
})
export default model('Oficina', oficinaSchema)