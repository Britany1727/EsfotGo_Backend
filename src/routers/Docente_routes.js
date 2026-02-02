import {Router} from 'express'
import { actualizarEvento, actualizarPasswordDocente, actualizarPerfilDocente, comprobarTokenPasswordDocente, confirmarMailDocente, crearEvento, crearNuevoPasswordDocente, eliminarEvento, listarAulas, listarEventos, listarOficinas, loginDocente, perfilDocente, recuperarPasswordDocente, registroDocente, verAula, verOficina } from '../controllers/docente_controllers.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const routerDocentes = Router()

//REGISTRO Y AUTENTICACIÓN
routerDocentes.post('/registro',registroDocente)
routerDocentes.get('/confirmar/:token',confirmarMailDocente)
routerDocentes.post('/recuperarpassword',recuperarPasswordDocente)      
routerDocentes.get('/recuperarpassword/:token',comprobarTokenPasswordDocente) 
routerDocentes.post('/nuevopassword/:token',crearNuevoPasswordDocente)

//AUTENTICACIÓN
routerDocentes.post('/login',loginDocente) 
routerDocentes.get('/perfil',verificarTokenJWT,perfilDocente)
routerDocentes.put('/actualizarperfil/:id',verificarTokenJWT,actualizarPerfilDocente)
routerDocentes.put('/actualizarpassword/:id',verificarTokenJWT,actualizarPasswordDocente)


//EVENTOS
routerDocentes.post('/evento',verificarTokenJWT,crearEvento)
routerDocentes.put('/actualizarevento/:id',verificarTokenJWT,actualizarEvento)
routerDocentes.delete('/eliminarevento/:id',verificarTokenJWT,eliminarEvento)
routerDocentes.get('/eventos',verificarTokenJWT,listarEventos)

//OFICINAS
routerDocentes.get('/oficinas',verificarTokenJWT,listarOficinas)
routerDocentes.get('/veroficina/:id',verificarTokenJWT,verOficina)
//AULAS
routerDocentes.get('/aulas',verificarTokenJWT,listarAulas)
routerDocentes.get('/veraula/:id',verificarTokenJWT,verAula)


export default routerDocentes