import {Router} from 'express'
import { actualizarAula, actualizarEvento, actualizarOficina, actualizarPasswordAdmin, actualizarPerfilAdmin, comprobarTokenPasswordAdmin, confirmarMailAdmin, crearAulas, crearEvento, crearNuevoPasswordAdmin, crearOficinas, eliminarAula, eliminarDocente, eliminarEvento, eliminarOficina, listarAulas, listarDocentes, listarEventos, listarOficinas, loginAdmin, perfilAdmin, recuperarPasswordAdmin, registroAdmin, verAula, verDocente, verOficina } from '../controllers/admin_controllers.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'


const routerAdmins= Router()

//REGISTRO Y AUTENTICACIÓN
routerAdmins.post('/registro',registroAdmin)
routerAdmins.get('/confirmar/:token',confirmarMailAdmin)
routerAdmins.post('/recuperarpassword',recuperarPasswordAdmin)
routerAdmins.get('/recuperarpassword/:token',comprobarTokenPasswordAdmin)  
routerAdmins.post('/nuevopassword/:token',crearNuevoPasswordAdmin)

//AUTENTICACIÓN
routerAdmins.post('/login',loginAdmin) 
routerAdmins.get('/perfil',verificarTokenJWT,perfilAdmin)
routerAdmins.put('/actualizarperfil/:id',verificarTokenJWT,actualizarPerfilAdmin)
routerAdmins.put('/actualizarpassword/:id',verificarTokenJWT,actualizarPasswordAdmin)

//EVENTOS
routerAdmins.post('/evento',verificarTokenJWT,crearEvento)
routerAdmins.put('/actualizarevento/:id',verificarTokenJWT,actualizarEvento)
routerAdmins.delete('/eliminarevento/:id',verificarTokenJWT,eliminarEvento)
routerAdmins.get('/eventos',verificarTokenJWT,listarEventos)


//OFICINAS
routerAdmins.post('/oficina',verificarTokenJWT,crearOficinas)
routerAdmins.get('/oficinas',verificarTokenJWT,listarOficinas)
routerAdmins.get('/veroficina/:id',verificarTokenJWT,verOficina)
routerAdmins.put('/actualizaroficina/:id',verificarTokenJWT,actualizarOficina)
routerAdmins.delete('/eliminaroficina/:id',verificarTokenJWT,eliminarOficina)


//AULAS
routerAdmins.post('/aula',verificarTokenJWT,crearAulas)
routerAdmins.get('/aulas',verificarTokenJWT,listarAulas)
routerAdmins.get('/veraula/:id',verificarTokenJWT,verAula)
routerAdmins.put('/actualizaraula/:id',verificarTokenJWT,actualizarAula)
routerAdmins.delete('/eliminaraula/:id',verificarTokenJWT,eliminarAula)


//DOCENTES
routerAdmins.get('/docentes',verificarTokenJWT,listarDocentes)
routerAdmins.get('/verdocente/:id',verificarTokenJWT,verDocente)
routerAdmins.delete('/eliminardocente/:id',verificarTokenJWT,eliminarDocente)


export default routerAdmins