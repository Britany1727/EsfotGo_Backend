import Admin from "../models/Admin.js";
import { sendMailToRecoveryPassword, sendMailToAdmin } from "../helpers/sendMail.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"
import Evento from "../models/Evento.js"
import { subirImagenEvento, subirBase64Evento } from "../helpers/uploadCloudinary.js"
import Oficina from "../models/Oficinas.js"
import Aula from "../models/Aulas.js"

const registroAdmin = async (req, res) => {
    try {
        const { email, password } = req.body; 
        if (Object.values(req.body).includes("")) {return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });}
        const verificarEmailBDD = await Admin.findOne({ email });
        if (verificarEmailBDD) {return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });}
        const nuevoAdmin = new Admin(req.body);
        nuevoAdmin.password = await nuevoAdmin.encryptPassword(password);
        const token = nuevoAdmin.createToken();
        await sendMailToAdmin(email, token, password);
        await nuevoAdmin.save()
        res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });

    } catch (error) {
    res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
    }
}

const confirmarMailAdmin = async (req, res) => {
    try {
        const { token } = req.params
        const adminBDD = await Admin.findOne({ token })
        if (!adminBDD) return res.status(404).json({ msg: "Token inválido o cuenta ya confirmada" })
        adminBDD.token = null
        adminBDD.confirmEmail = true
        await adminBDD.save()
        res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesión" })

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}
const recuperarPasswordAdmin = async (req, res) => {

    try {
        const { email } = req.body
        if (!email) return res.status(400).json({ msg: "Debes ingresar un correo electrónico" })
        const adminBDD = await Admin.findOne({ email })
        if (!adminBDD) return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        const token = adminBDD.createToken()
        adminBDD.token = token
        await sendMailToRecoveryPassword(email, token)
        await adminBDD.save()
        res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" })
        
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}


const comprobarTokenPasswordAdmin = async (req,res)=>{
    try {
        const {token} = req.params
        const adminBDD = await Admin.findOne({token})
        if (!adminBDD) {
            return res.status(404).json({ msg: "Token inválido o expirado" })
        }
        res.status(200).json({ msg: "Token confirmado, puedes crear tu nueva contraseña" })
    
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}




const crearNuevoPasswordAdmin = async (req,res)=>{

    try {
        const{password,confirmpassword} = req.body
        const { token } = req.params
        if (!password || !confirmpassword) {return res.status(400).json({ msg: "Todos los campos son obligatorios" })}
        if(password !== confirmpassword) return res.status(404).json({msg:"Los passwords no coinciden"})
        const adminBDD = await Admin.findOne({token})
        if(!adminBDD) return res.status(404).json({msg:"No se puede validar la cuenta"})
        adminBDD.token = null
        adminBDD.password = await adminBDD.encryptPassword(password)
        await adminBDD.save()
        res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const loginAdmin = async (req,res)=>{
    try {
        const {email,password} = req.body
        if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Debes llenar todos los campos"})
        const adminBDD = await Admin.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
        if(!adminBDD) return res.status(404).json({msg:"El usuario no se encuentra registrado"})
        if(!adminBDD.confirmEmail) return res.status(403).json({msg:"Debes verificar tu cuenta antes de iniciar sesión"})
        const verificarPassword = await adminBDD.matchPassword(password)
        if(!verificarPassword) return res.status(401).json({msg:"El password no es correcto"})
        const {nombre,apellido,direccion,celular,_id,rol} = adminBDD
        const token = crearTokenJWT(adminBDD._id,adminBDD.rol)
        res.status(200).json({
            rol,
            nombre,
            apellido,
            direccion,
            celular,
            _id,
            email:adminBDD.email,
            token
        })
        

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }

}

const perfilAdmin = (req, res) => {
    
    const { token, confirmEmail, createdAt, updatedAt, __v, password, ...datosPerfil } = req.adminHeader 
    res.status(200).json(datosPerfil)
}

const actualizarPerfilAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, direccion, telefono, email } = req.body; 
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: `ID inválido` });
        const adminBDD = await Admin.findById(id);
        if (!adminBDD) return res.status(404).json({ msg: "No existe el administrador" });
        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Debes llenar todos los campos" });
        if (adminBDD.email !== email) {const emailExistente = await Admin.findOne({ email });
        if (emailExistente) return res.status(400).json({ msg: "El email ya está registrado" });}
        adminBDD.nombre = nombre || adminBDD.nombre;
        adminBDD.apellido = apellido || adminBDD.apellido;
        adminBDD.direccion = direccion || adminBDD.direccion;
        adminBDD.telefono = telefono || adminBDD.telefono;
        adminBDD.email = email || adminBDD.email;
        await adminBDD.save();
        res.status(200).json({ msg: "Perfil actualizado con éxito", adminBDD });
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
    }
}
const actualizarPasswordAdmin = async (req,res)=>{

    try {
        const {_id} = req.params
        const {passwordactual,passwordnuevo} = req.body
        const adminBDD = await Admin.findById(req.adminHeader._id)
        if(!adminBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${_id}`})
        const verificarPassword = await adminBDD.matchPassword(passwordactual)
        if(!verificarPassword) return res.status(401).json({msg:"Lo sentimos, el password actual no es el correcto"})
        adminBDD.password = await adminBDD.encryptPassword(passwordnuevo)
        await adminBDD.save()

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

const eliminarDocente = async (req,res)=>{
    try {
        const {id} = req.params
        const docenteBDD = await Docente.findById(id)
        if(!docenteBDD) return res.status(404).json({msg:"El docente no existe"})
        await docenteBDD.deleteOne()
        res.status(200).json({msg:"Docente eliminado correctamente"})
    }
    catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const crearOficinas = async (req,res)=>{
    try {
        const {nombre,ubicacion,encargado,telefono} = req.body
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        }   
    catch (error) {
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

const actualizarOficina = async (req,res)=>{
    try {
        const {id} = req.params 
        const {nombre,ubicacion,encargado,telefono} = req.body
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const oficinaBDD = await Oficina.findById(id)
        if(!oficinaBDD) return res.status(404).json({msg:"La oficina no existe"})
        oficinaBDD.nombre = nombre || oficinaBDD.nombre
        oficinaBDD.ubicacion = ubicacion || oficinaBDD.ubicacion
        oficinaBDD.encargado = encargado || oficinaBDD.encargado
        oficinaBDD.telefono = telefono || oficinaBDD.telefono
        await oficinaBDD.save()
        res.status(200).json({msg:"Oficina actualizada correctamente"})
    }   
    catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const eliminarOficina = async (req,res)=>{
    try {
        const {id} = req.params
        const oficinaBDD = await Oficina.findById(id)   
        if(!oficinaBDD) return res.status(404).json({msg:"La oficina no existe"})
        await oficinaBDD.deleteOne()
        res.status(200).json({msg:"Oficina eliminada correctamente"})
    }
    catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const crearAulas = async (req,res)=>{
    try {
        const {nombre,ubicacion,capacidad} = req.body
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        }
    catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const actualizarAula = async (req,res)=>{
    try {
        const {id} = req.params
        const {nombre,ubicacion,capacidad} = req.body
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const aulaBDD = await Aula.findById(id)
        if(!aulaBDD) return res.status(404).json({msg:"El aula no existe"})
        aulaBDD.nombre = nombre || aulaBDD.nombre
        aulaBDD.ubicacion = ubicacion || aulaBDD.ubicacion
        aulaBDD.capacidad = capacidad || aulaBDD.capacidad
        await aulaBDD.save()
        res.status(200).json({msg:"Aula actualizada correctamente"})
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

const eliminarAula = async (req,res)=>{
    try {
        const {id} = req.params
        const aulaBDD = await Aula.findById(id)
        if(!aulaBDD) return res.status(404).json({msg:"El aula no existe"})
        await aulaBDD.deleteOne()
        res.status(200).json({msg:"Aula eliminada correctamente"})
    }   
    catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}





export {registroAdmin,
    confirmarMailAdmin,
    recuperarPasswordAdmin,
    comprobarTokenPasswordAdmin,
    crearNuevoPasswordAdmin,
    loginAdmin,
    perfilAdmin,
    actualizarPerfilAdmin,
    actualizarPasswordAdmin,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
    listarEventos,
    verEvento,
    listarDocentes,
    verDocente,
    eliminarDocente,
    crearOficinas,
    listarOficinas,
    verOficina,
    actualizarOficina,
    eliminarOficina,
    crearAulas,
    actualizarAula,
    listarAulas,
    verAula,
    eliminarAula
}