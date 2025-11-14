
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

const confirmMail = async (req, res) => {
    try {
        //Paso 1
        const { token } = req.params
        //Paso 2
        const docenteBDD = await Docente.findOne({ token })
        if (!docenteBDD) return res.status(400).json({ msg: "Token no válido" })
        //Paso 3
        docenteBDD.token = null
        docenteBDD.confirmEmail = true
        await docenteBDD.save()
        //Paso 4
        res.status(200).json({ msg: "Cuenta confirmada correctamente" })
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const recuperarPassword = async (req, res) => {
    try {
        //Paso 1
        const { email } = req.body
        //Paso 2
        const docenteBDD = await Docente.findOne({ email })
        if (!docenteBDD) return res.status(400).json({ msg: "El email no está registrado" })        
        //Paso 3
        const token = await docenteBDD.createToken()
        await sendMailToRecoveryPassword(email, token)
        //Paso 4
        res.status(200).json({ msg: "Revisa tu correo electrónico para restablecer tu contraseña" })
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

export {
    registro,
    confirmMail,
    recuperarPassword
}