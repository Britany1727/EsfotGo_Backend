
import Docente from "../models/Docente.js"
import { sendMailToRegister } from "../helpers/sendMail.js"

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


export {
    registro
}