import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";


const adminSchema = new Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },  
    apellido:{
        type:String,
        required:true,
        trim:true
    },  
    celular:{
        type:String,
        required:true,
        trim:true
    },  
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,   
        default:true
    },
    token:{ 
        type:String,
        default:null
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    rol:{
        type:String,
        default:"admin"
    }   
},{
    timestamps:true,
    collection: 'administradores'

})
adminSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}

adminSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password)
}
    
// Método para crear un token 
adminSchema.methods.createToken= function(){
    const tokenGenerado = Math.random().toString(36).slice(2)
    this.token = tokenGenerado
    return tokenGenerado
}

export default model('Admin', adminSchema)
    