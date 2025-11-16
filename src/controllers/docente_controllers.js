
import Docente from "../models/Docente.js"
import { sendMailToRecoveryPassword, sendMailToRegister } from "../helpers/sendMail.js"

const registro = async (req,res)=>{

    try {

        const {email,password} = req.body
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const verificarEmailBDD = await Docente.findOne({email})
        if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
        const nuevoDocente = new Docente(req.body)
        nuevoDocente.password = await nuevoDocente.encryptPassword(password)
        const token = nuevoDocente.createToken()
        await sendMailToRegister(email,token)
        await nuevoDocente.save()
        res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }

}

const confirmarMail = async (req, res) => {
    try {
        const { token } = req.params
        const docenteBDD = await Docente.findOne({ token })
        if (!docenteBDD) return res.status(404).json({ msg: "Token inválido o cuenta ya confirmada" })
        docenteBDD.token = null
        docenteBDD.confirmEmail = true
        await docenteBDD.save()
        res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesión" })

    } catch (error) {
    console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}
const recuperarPassword = async (req, res) => {

    try {
        const { email } = req.body
        if (!email) return res.status(400).json({ msg: "Debes ingresar un correo electrónico" })
        const docenteBDD = await Docente.findOne({ email })
        if (!docenteBDD) return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        const token = docenteBDD.createToken()
        docenteBDD.token = token
        await sendMailToRecoveryPassword(email, token)
        await docenteBDD.save()
        res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}


const comprobarTokenPassword = async (req,res)=>{
    try {
        const {token} = req.params
        const docenteBDD = await Docente.findOne({token})
        if (!docenteBDD) {
            return res.status(404).json({ msg: "Token inválido o expirado" })
        }
        res.status(200).json({ msg: "Token confirmado, puedes crear tu nueva contraseña" })
    
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}




const crearNuevoPassword = async (req,res)=>{

    try {
        const{password,confirmpassword} = req.body
        const { token } = req.params
        if (!password || !confirmpassword) {return res.status(400).json({ msg: "Todos los campos son obligatorios" })}
        if(password !== confirmpassword) return res.status(404).json({msg:"Los passwords no coinciden"})
        const docenteBDD = await Docente.findOne({token})
        if(!docenteBDD) return res.status(404).json({msg:"No se puede validar la cuenta"})
        docenteBDD.token = null
        docenteBDD.password = await docenteBDD.encryptPassword(password)
        await docenteBDD.save()
        res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const login = async (req,res)=>{
    try {
        const {email,password} = req.body
        if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Debes llenar todos los campos"})
        const docenteBDD = await Docente.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
        if(!docenteBDD) return res.status(404).json({msg:"El usuario no se encuentra registrado"})
        if(!docenteBDD.confirmEmail) return res.status(403).json({msg:"Debes verificar tu cuenta antes de iniciar sesión"})
        const verificarPassword = await docenteBDD.matchPassword(password)
        if(!verificarPassword) return res.status(401).json({msg:"El password no es correcto"})
        const {nombre,apellido,direccion,telefono,_id,rol} = docenteBDD
        res.status(200).json({
            rol,
            nombre,
            apellido,
            direccion,
            telefono,
            _id,
            email:docenteBDD.email
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }

}

export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    login
}