import {Router} from 'express'
import { actualizarEvento, actualizarPasswordDocente, actualizarPerfilDocente, comprobarTokenPasswordDocente, confirmarMailDocente, crearEvento, crearNuevoPasswordDocente, eliminarEvento, listarAulas, listarEventos, listarOficinas, loginDocente, perfilDocente, recuperarPasswordDocente, registroDocente, verAula, verOficina } from '../controllers/docente_controllers.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const routerDocentes = Router()

//REGISTRO Y AUTENTICACIÓN
routerDocentes.post('/docente/registro',registroDocente)
routerDocentes.get('/docenteconfirmar/:token',confirmarMailDocente)
routerDocentes.post('/docente/recuperarpassword',recuperarPasswordDocente)      
routerDocentes.get('/docente/recuperarpassword/:token',comprobarTokenPasswordDocente) 
routerDocentes.post('/docente/nuevopassword/:token',crearNuevoPasswordDocente)
//AUTENTICACIÓN
routerDocentes.post('/docente/login',loginDocente) 
routerDocentes.get('/docente/perfil',verificarTokenJWT,perfilDocente)
routerDocentes.put('/docente/actualizarperfil/:id',verificarTokenJWT,actualizarPerfilDocente)
routerDocentes.put('/docente/actualizarpassword/:id',verificarTokenJWT,actualizarPasswordDocente)


//EVENTOS
routerDocentes.post('/evento',crearEvento)
routerDocentes.put('/actualizarevento/:id',actualizarEvento)
routerDocentes.delete('/eliminarevento/:id',eliminarEvento)
routerDocentes.get('/eventos',listarEventos)

//OFICINAS
routerDocentes.get('/oficinas',listarOficinas)
routerDocentes.get('/veroficina/:id',verOficina)
//AULAS
routerDocentes.get('/aulas',listarAulas)
routerDocentes.get('/veraula/:id',verAula)


export default routerDocentes