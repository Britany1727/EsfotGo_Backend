import {Router} from 'express'
import { actualizarPassword, actualizarPerfil, comprobarTokenPassword, confirmarMail, crearEvento, crearNuevoPassword, login, perfil, recuperarPassword, registro } from '../controllers/docente_controllers.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()


router.post('/registro',registro)

router.get('/confirmar/:token',confirmarMail)

router.post('/recuperarpassword',recuperarPassword)

router.get('/recuperarpassword/:token',comprobarTokenPassword)  

router.post('/nuevopassword/:token',crearNuevoPassword)

router.post('/docente/login',login) 

router.get('/docente/perfil',verificarTokenJWT,perfil)

router.put('/docente/perfil/:id',verificarTokenJWT,actualizarPerfil)

router.put('/docente/password/:id',verificarTokenJWT,actualizarPassword)

router.post('/docente/evento',verificarTokenJWT,crearEvento)

export default router