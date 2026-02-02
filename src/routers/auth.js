import { Router } from 'express';
import passport from '../config/passport.js';
import { crearTokenJWT } from '../middlewares/JWT.js';

const router = Router();

// Inicia el flujo
router.get('/login/federated/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback de Google
// routerAuth.js
router.get('/oauth2/redirect/google', 
    passport.authenticate('google', { 
        failureRedirect: 'http://localhost:5173/login', 
        session: false 
    }), 
    (req, res) => {
        // Si llegamos aquí, req.user existe porque el login fue exitoso
        const token = crearTokenJWT(req.user._id, req.user.rol || 'user');
        
        // Enviamos el token al frontend
        res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    }
);

export default router;