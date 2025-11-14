import {Router} from 'express'
import { confirmMail, recuperarPassword, registro } from '../controllers/docente_controllers.js'
const router = Router()


router.post('/registro',registro)

router.get('/confirmar/:token',confirmMail)

router.post('/recuperarpassword',recuperarPassword)


export default router