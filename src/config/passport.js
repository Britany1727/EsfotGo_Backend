import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/oauth2/redirect/google',
    scope: ['profile', 'email'] 
}, 
async function(accessToken, refreshToken, profile, cb) {
    console.log("¡Google me contactó!"); // Si no ves esto, el problema es la URL de callback o Google Cloud
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (!user) {
            console.log("Creando usuario nuevo...");
            user = new User({
                nombre: profile.name.givenName || profile.displayName,
                apellido: profile.name.familyName || "Google-User",
                email: profile.emails[0].value,
                googleId: profile.id,
                confirmEmail: true,
                password: Math.random().toString(36).slice(-8) + 'Aa1!',
                telefono: "0999999999",
                direccion: "Pendiente de completar"
            });
            await user.save();
        }
        console.log("Usuario listo:", user.email);
        return cb(null, user);
    } catch (error) {
        console.error("ERROR CRÍTICO EN PASSPORT:", error.message);
        return cb(error, null);
    }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;