import {Router} from 'express'
import { actualizarPassword, actualizarPerfil, comprobarTokenPassword, confirmarMail, crearEvento, crearNuevoPassword, login, perfil, recuperarPassword, registro } from '../controllers/docente_controllers.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()


router.post('/registro',registro)

router.get('/confirmar/:token',confirmarMail)

router.post('/recuperarpassword',recuperarPassword)

router.get('/recuperarpassword/:token',comprobarTokenPassword)  

router.post('/nuevopassword/:token',crearNuevoPassword)

router.post('/login',login) 

router.get('/perfil',verificarTokenJWT,perfil)

router.put('/actualizarperfil/:id',verificarTokenJWT,actualizarPerfil)

router.put('/actualizarpassword/:id',verificarTokenJWT,actualizarPassword)

router.post('/evento',verificarTokenJWT,crearEvento)

export default router