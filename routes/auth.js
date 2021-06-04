// 1. IMPORTACIONES
const express   = require('express')
const router    = express.Router()
const { check } = require("express-validator")
const authController = require('./../controllers/authController')
const auth = require('./../middleware/auth')
// INICIAR SESIÓN
// api/auth - POST
// ÉL NO HA INICIADO SESIÓN Y VIENE POR SU TOKEN
/*
* EMAIL: _________
* PASSWORD: ___________
*/
router.post("/", [
    check("email", "Agrega un email válido").isEmail(),
    check("password", "El password debe ser mínimo de 6 carácteres").isLength({min: 6})
], authController.iniciarSesionUsuario)
// VERIFICAR USUARIO
// api/auth - GET
// (ÉL YA INICIO SESIÓN Y ME VA A MOSTRAR TOKEN)
router.get("/", auth, authController.verificarUsuario)
module.exports = router