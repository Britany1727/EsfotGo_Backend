import User from "../models/User.js"
import { sendMailToRecoveryPassword, sendMailToRegister } from "../helpers/sendMail.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"
import Evento from "../models/Evento.js"
import Oficina from "../models/Oficinas.js"
import Aula from "../models/Aulas.js"


const registro = async (req, res) => {
    try {
        const { email, password } = req.body; 
        if (Object.values(req.body).includes("")) {return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });}
        const verificarEmailBDD = await User.findOne({ email });
        if (verificarEmailBDD) {return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });}
        const nuevoUser = new User(req.body);
        nuevoUser.password = await nuevoUser.encryptPassword(password);
        const token = nuevoUser.createToken();
        await sendMailToRegister(email, token, password);
        await nuevoUser.save()
        res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });

    } catch (error) {
    res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
    }
}

const confirmarMail = async (req, res) => {
    try {
        const { token } = req.params
        const userBDD = await User.findOne({ token })
        if (!userBDD) return res.status(404).json({ msg: "Token inválido o cuenta ya confirmada" })
        userBDD.token = null
        userBDD.confirmEmail = true
        await userBDD.save()
        res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesión" })

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}
const recuperarPassword = async (req, res) => {

    try {
        const { email } = req.body
        if (!email) return res.status(400).json({ msg: "Debes ingresar un correo electrónico" })
        const userBDD = await User.findOne({ email })
        if (!userBDD) return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        const token = userBDD.createToken()
        userBDD.token = token
        await sendMailToRecoveryPassword(email, token)
        await userBDD.save()
        res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" })
        
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}


const comprobarTokenPassword = async (req,res)=>{
    try {
        const {token} = req.params
        const userBDD = await User.findOne({token})
        if (!userBDD) {
            return res.status(404).json({ msg: "Token inválido o expirado" })
        }
        res.status(200).json({ msg: "Token confirmado, puedes crear tu nueva contraseña" })
    
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}




const crearNuevoPassword = async (req,res)=>{

    try {
        const{password,confirmpassword} = req.body
        const { token } = req.params
        if (!password || !confirmpassword) {return res.status(400).json({ msg: "Todos los campos son obligatorios" })}
        if(password !== confirmpassword) return res.status(404).json({msg:"Los passwords no coinciden"})
        const userBDD = await User.findOne({token})
        if(!userBDD) return res.status(404).json({msg:"No se puede validar la cuenta"})
        userBDD.token = null
        userBDD.password = await userBDD.encryptPassword(password)
        await userBDD.save()
        res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const login = async (req,res)=>{
    try {
        const {email,password} = req.body
        if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Debes llenar todos los campos"})
        const userBDD = await User.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
        if(!userBDD) return res.status(404).json({msg:"El usuario no se encuentra registrado"})
        if(!userBDD.confirmEmail) return res.status(403).json({msg:"Debes verificar tu cuenta antes de iniciar sesión"})
        const verificarPassword = await userBDD.matchPassword(password)
        if(!verificarPassword) return res.status(401).json({msg:"El password no es correcto"})
        const {nombre,apellido,direccion,celular,_id,rol} = userBDD
        const token = crearTokenJWT(userBDD._id,userBDD.rol)
        res.status(200).json({
            rol,
            nombre,
            apellido,
            direccion,
            celular,
            _id,
            email:userBDD.email,
            token
        })
        

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }

}

const perfil = (req, res) => {
    
    const { token, confirmEmail, createdAt, updatedAt, __v, password, ...datosPerfil } = req.adminHeader 
    res.status(200).json(datosPerfil)
}

const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, direccion, telefono, email } = req.body; 
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: `ID inválido` });
        const userBDD = await User.findById(id);
        if (!userBDD) return res.status(404).json({ msg: "No existe el usuario" });
        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Debes llenar todos los campos" });
        if (userBDD.email !== email) {const emailExistente = await User.findOne({ email });
        if (emailExistente) return res.status(400).json({ msg: "El email ya está registrado" });}
        userBDD.nombre = nombre || userBDD.nombre;
        userBDD.apellido = apellido || userBDD.apellido;
        userBDD.direccion = direccion || userBDD.direccion;
        userBDD.celular = celular || userBDD.celular;
        userBDD.email = email || userBDD.email;
        await userBDD.save();
        res.status(200).json({ msg: "Perfil actualizado con éxito", userBDD });
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
    }
}
const actualizarPassword = async (req,res)=>{

    try {
        const {_id} = req.params
        const {passwordactual,passwordnuevo} = req.body
        const userBDD = await User.findById(req.userHeader._id)
        if(!userBDD) return res.status(404).json({msg:`Lo sentimos, no existe el usuario ${_id}`})
        const verificarPassword = await userBDD.matchPassword(passwordactual)
        if(!verificarPassword) return res.status(401).json({msg:"Lo sentimos, el password actual no es el correcto"})
        userBDD.password = await userBDD.encryptPassword(passwordnuevo)
        await userBDD.save()

    res.status(200).json({msg:"Password actualizado correctamente"})
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const crearEvento = async (req,res)=>{

    try {
        const {nombre,descripcion,fecha,hora,encargado,ubicacion,imagen} = req.body
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const nuevoEvento = new Evento(req.body)

        if (req.files?.subirImagenEvento) {
            const { secure_url, public_id } = await subirImagenEvento(req.files.subirImagenEvento.tempFilePath)
            nuevoEvento.imagen = secure_url
        }

        if (req.body.subirBase64Evento) {
            const secure_url = await subirBase64Evento(req.body.subirBase64Evento)
            nuevoEvento.imagen = secure_url
        }

        await nuevoEvento.save()
        res.status(200).json({msg:"Evento creado correctamente"})
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const actualizarEvento = async (req,res)=>{

    try {
        const {id} = req.params
        const {nombre,descripcion,fecha,hora,encargado,ubicacion,imagen} = req.body
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const eventoBDD = await Evento.findById(id)
        if(!eventoBDD) return res.status(404).json({msg:"El evento no existe"})
        eventoBDD.nombre = nombre || eventoBDD.nombre
        eventoBDD.descripcion = descripcion || eventoBDD.descripcion
        eventoBDD.fecha = fecha || eventoBDD.fecha
        eventoBDD.hora = hora || eventoBDD.hora
        eventoBDD.encargado = encargado || eventoBDD.encargado
        eventoBDD.ubicacion = ubicacion || eventoBDD.ubicacion

        if (req.files?.subirImagenEvento) {
            const { secure_url, public_id } = await subirImagenEvento(req.files.subirImagenEvento.tempFilePath)
            eventoBDD.imagen = secure_url
        }
        if (req.body.subirBase64Evento) {
            const secure_url = await subirBase64Evento(req.body.subirBase64Evento)
            eventoBDD.imagen = secure_url
        }
        await eventoBDD.save()
        res.status(200).json({msg:"Evento actualizado correctamente"})
    }   
    catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const eliminarEvento = async (req,res)=>{

    try {
        const {id} = req.params
        const eventoBDD = await Evento.findById(id) 
        if(!eventoBDD) return res.status(404).json({msg:"El evento no existe"})
        await eventoBDD.deleteOne()
        res.status(200).json({msg:"Evento eliminado correctamente"})
    }
    catch (error) {     
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const listarEventos = async (req,res)=>{

    try {
        const eventosBDD = await Evento.find().sort({createdAt:-1})
        res.status(200).json(eventosBDD)
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const verEvento = async (req,res)=>{

    try {
        const {id} = req.params
        const eventoBDD = await Evento.findById(id)
        if(!eventoBDD) return res.status(404).json({msg:"El evento no existe"})
        res.status(200).json(eventoBDD)
    }
    catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }  

}

const listarDocentes = async (req,res)=>{
    try {
        const docentesBDD = await Docente.find().select("-password -token -status -__v -createdAt -updatedAt").sort({createdAt:-1})
        res.status(200).json(docentesBDD)
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const verDocente = async (req,res)=>{
    try {
        const {id} = req.params
        const docenteBDD = await Docente.findById(id).select("-password -token -status -__v -createdAt -updatedAt")
        if(!docenteBDD) return res.status(404).json({msg:"El docente no existe"})
        res.status(200).json(docenteBDD)
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const listarOficinas = async (req,res)=>{
    try {
        const oficinasBDD = await Oficina.find().sort({createdAt:-1})
        res.status(200).json(oficinasBDD)
    }
    catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const verOficina = async (req,res)=>{
    try {
        const {id} = req.params
        const oficinaBDD = await Oficina.findById(id)
        if(!oficinaBDD) return res.status(404).json({msg:"La oficina no existe"})
        res.status(200).json(oficinaBDD)
    }
    catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const listarAulas = async (req,res)=>{
    try {
        const aulasBDD = await Aula.find().sort({createdAt:-1})
        res.status(200).json(aulasBDD)
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const verAula = async (req,res)=>{
    try {
        const {id} = req.params
        const aulaBDD = await Aula.findById(id)
        if(!aulaBDD) return res.status(404).json({msg:"El aula no existe"})
        res.status(200).json(aulaBDD)
    }
    catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    login,
    perfil,
    actualizarPerfil,
    actualizarPassword,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
    listarEventos,
    verEvento,
    listarDocentes,
    verDocente,
    listarOficinas,
    verOficina,
    listarAulas,
    verAula
}