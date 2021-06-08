// IMPORTACIONES
const express   = require('express')
const router    = express.Router()
const { check, validationResult } = require("express-validator")
const usuarioController = require("./../controllers/usuarioController")
// RUTAS
// CREAR UN USUARIO
// localhost:4000/api/usuarios/
router.post("/",
    [
        // checks si son true, avanzan, si son false, ejecutan el mensaje de error
        check("nombre", "El nombre es obligatorio").not().isEmpty(),   // req, res
        check("email", "Agrega un email válido").isEmail(),
        check("password", "El password debe tener mínimo de 6 caracteres").isLength({min:6})
    ]
    ,usuarioController.crearUsuario)
// // localhost:4000/api/usuarios/mike
// router.get('/mike', (req,res) => {
//     res.json({
//         ejemplo: "123"
//     })
// })
module.exports = router