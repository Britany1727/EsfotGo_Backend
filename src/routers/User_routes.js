import {Router} from 'express'
import { actualizarEvento, actualizarPassword, actualizarPerfil, comprobarTokenPassword, confirmarMail, crearEvento, crearNuevoPassword, eliminarEvento, listarAulas, listarDocentes, listarEventos, listarOficinas, login, perfil, recuperarPassword, registro, verAula, verDocente, verOficina } from '../controllers/user_controllers.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'


const router = Router()



//REGISTRO Y AUTENTICACIÓN
router.post('/registro',registro)
router.get('/confirmar/:token',confirmarMail)
router.post('/recuperarpassword',recuperarPassword)
router.get('/recuperarpassword/:token',comprobarTokenPassword)  
router.post('/nuevopassword/:token',crearNuevoPassword)


//AUTENTICACIÓN
router.post('/login',login) 
router.get('/perfil',verificarTokenJWT,perfil)
router.put('/actualizarperfil/:id',verificarTokenJWT,actualizarPerfil)
router.put('/actualizarpassword/:id',verificarTokenJWT,actualizarPassword)

//EVENTOS
router.post('/evento',verificarTokenJWT,crearEvento)
router.put('/actualizarevento/:id',verificarTokenJWT,actualizarEvento)
router.delete('/eliminarevento/:id',verificarTokenJWT,eliminarEvento)
router.get('/eventos',verificarTokenJWT,listarEventos)


//OFICINAS

router.get('/oficinas',verificarTokenJWT,listarOficinas)
router.get('/veroficina/:id',verificarTokenJWT,verOficina)



//AULAS
router.get('/aulas',verificarTokenJWT,listarAulas)
router.get('/veraula/:id',verificarTokenJWT,verAula)


//DOCENTES
router.get('/docentes',verificarTokenJWT,listarDocentes)
router.get('/verdocente/:id',verificarTokenJWT,verDocente)


export default router