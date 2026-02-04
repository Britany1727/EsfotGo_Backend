
import {Router} from 'express'
import { actualizarAula, actualizarEvento, actualizarOficina, actualizarPasswordAdmin, actualizarPerfilAdmin, comprobarTokenPasswordAdmin, confirmarMailAdmin, crearAulas, crearEvento, crearNuevoPasswordAdmin, crearOficinas, eliminarAula, eliminarDocente, eliminarEvento, eliminarOficina, listarAulas, listarDocentes, listarEventos, listarOficinas, loginAdmin, perfilAdmin, recuperarPasswordAdmin, registroAdmin, verAula, verDocente, verOficina } from '../controllers/admin_controllers.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'


const routerAdmins= Router()

//REGISTRO Y AUTENTICACIÓN
routerAdmins.post('/admin/registro',registroAdmin)
routerAdmins.get('/admin/confirmar/:token',confirmarMailAdmin)
routerAdmins.post('/admin/recuperarpassword',recuperarPasswordAdmin)
routerAdmins.get('/admin/recuperarpassword/:token',comprobarTokenPasswordAdmin)  
routerAdmins.post('/admin/nuevopassword/:token',crearNuevoPasswordAdmin)
//AUTENTICACIÓN
routerAdmins.post('/admin/login',loginAdmin) 
routerAdmins.get('/admin/perfil',verificarTokenJWT,perfilAdmin)
routerAdmins.put('/admin/actualizarperfil/:id',verificarTokenJWT,actualizarPerfilAdmin)
routerAdmins.put('/admin/actualizarpassword/:id',verificarTokenJWT,actualizarPasswordAdmin)

//EVENTOS
routerAdmins.post('/evento',crearEvento)
routerAdmins.put('/actualizarevento/:id',actualizarEvento)
routerAdmins.delete('/eliminarevento/:id',eliminarEvento)
routerAdmins.get('/eventos',listarEventos)


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