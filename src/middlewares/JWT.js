import jwt from "jsonwebtoken"
import Docente from "../models/Docente.js"
import Admin from "../models/Admin.js"


/**
 * Crear token JWT
 * @param {string} id - ID del usuario
 * @param {string} rol - Rol del usuario
 * @returns {string} token - JWT
 */
const crearTokenJWT = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" })
}




const verificarTokenJWT = async (req, res, next) => {

	const { authorization } = req.headers
    if (!authorization) return res.status(401).json({ msg: "Acceso denegado: token no proporcionado" })
    try {
        const token = authorization.split(" ")[1]
        const { id, rol } = jwt.verify(token,process.env.JWT_SECRET)
        if (rol === "admin") {
            const adminBDD = await Admin.findById(id).lean().select("-password")
            if (!adminBDD) return res.status(401).json({ msg: "Usuario no encontrado" })
            req.adminHeader = adminBDD
            next()
        }else if (rol === "docente") {
            const docenteBDD = await Docente.findById(id).lean().select("-password")
            if (!docenteBDD) return res.status(401).json({ msg: "Usuario no encontrado" })
            req.docenteHeader = docenteBDD
            next()    
        } else {
            next(new Error("Rol no válido"))
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ msg: `Token inválido o expirado - ${error}` })
    }
}


export { 
    crearTokenJWT,
    verificarTokenJWT 
}

