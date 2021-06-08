// 1. IMPORTACIONES
const express       = require('express')
// PERMITE GESTIONAR ACCESOS ENTRE APLICACIONES (NODE.JS)
const cors          = require("cors") 
const conectarDB    = require('./config/db')
const app           = express()
require('dotenv').config({
    path: '.env'
})
const userRoutes        = require('./routes/usuarios')
const authRoutes        = require('./routes/auth')
const trabajosRoutes    = require('./routes/trabajos')
// 2. MIDDLEWARES
    // a. Conectarnos a la BD
    conectarDB()
    // b. Habilitar el cruce de datos entre dos ambientes NODEJS (CORS)
    app.use(cors())
    // c. Habilitar JSON en Express
    app.use(express.json({extended:true}))
// 3. RUTEO - Importar rutas
    // A. Usuarios
    app.use('/api/usuarios', userRoutes)    
    // B. Autenticación
    app.use('/api/auth', authRoutes)
    // C. Trabajos
    app.use('/api/trabajos', trabajosRoutes)
    // RUTA DE PRUEBA
    app.get("/", (req, res) => {
        res.send("Hola mundo")
    })
// 4. SERVIDOR
app.listen(4000, () => {
    console.log("El servidor está corriendo en el puerto 4000")
})