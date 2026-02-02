import {Schema, model} from 'mongoose'
import bcrypt from "bcryptjs"

const userSchema = new Schema({ 
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    apellido:{  
        type:String,
        trim:true
    },
    direccion:{
        type:String,
        trim:true
    },
    telefono:{  
        type:String,
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
        default:"user"
    },
    googleId: {
        type: String,
        default: null
    },

},{
    timestamps:true,
    collection: 'users'
})
// Método para cifrar el password
userSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}


// Método para verificar si el password es el mismo de la BDD
userSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}


// Método para crear un token 
userSchema.methods.createToken= function(){
    const tokenGenerado = Math.random().toString(36).slice(2)
    this.token = tokenGenerado
    return tokenGenerado
}


export default model('User',userSchema)