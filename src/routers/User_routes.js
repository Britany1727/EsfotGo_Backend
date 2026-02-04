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
router.post('/evento',crearEvento)
router.put('/actualizarevento/:id',actualizarEvento)
router.delete('/eliminarevento/:id',eliminarEvento)
router.get('/eventos',listarEventos)

//OFICINAS

router.get('/oficinas',listarOficinas)
router.get('/veroficina/:id',verOficina)



//AULAS
router.get('/aulas',listarAulas)
router.get('/veraula/:id',verAula)


//DOCENTES
router.get('/docentes',listarDocentes)
router.get('/verdocente/:id',verDocente)


export default router