// Requerir módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routerAdmins from './routers/Admin_routes.js';
import routerDocentes from './routers/Docente_routes.js';
import cloudinary from 'cloudinary'
import fileUpload from "express-fileupload"
import connection from './database.js' 
import passport from 'passport'
import session from 'express-session' 
import routerAuth from './routers/auth.js' 
import router from './routers/User_routes.js';
import './config/passport.js';

// Inicializaciones
const app = express()
dotenv.config()
connection() // Conectar a la BD

// Configuraciones Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// --- MIDDLEWARES (ORDEN CRÍTICO) ---
app.use(express.json()) // Permite leer JSON en el body
app.use(express.urlencoded({ extended: true }))
// 1. CORS debe permitir credenciales para las cookies de sesión
app.use(cors({
    origin: "http://localhost:5173", // URL de tu Vite/React
    credentials: true
}));

app.use(express.json())

// 2. Configuración de Sesión (Indispensable para Google)
app.use(session({
    secret: 'esfotgo_secret', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // true solo si usas HTTPS
        httpOnly: true 
    }
}));

// 3. Passport debe ir DESPUÉS de la sesión
app.use(passport.initialize());
app.use(passport.session());

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}))

// Variables globales
app.set('port', process.env.PORT || 3000)

// --- RUTAS ---

app.get('/', (req, res) => res.send("Server on"))

// IMPORTANTE: Esta ruta debe coincidir con el href del frontend
app.use('/auth', routerAuth) 

app.use('/api', router)
app.use('/api', routerAdmins)
app.use('/api', routerDocentes)

// Manejo de 404
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"))

export default app;