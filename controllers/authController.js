// 1. IMPORTACIONES
// NECESITAMOS EL MODELO PORQUE TENEMOS QUE VER LA BASE DE DATOS
const Usuario = require("./../models/Usuario")
const bcryptjs = require("bcryptjs")
const { validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
// 2. CONTROLLERS
// iniciarSesionUsuario
// El objetivo es obtener el token, confirmando que el usuario y contraseña es correcto.
exports.iniciarSesionUsuario = async(req, res) => {
    // REVISAR SI HAY ERRORES EN LA VALIDACIÓN DE CHECKS
    const errores = validationResult(req)
    if(!errores.isEmpty()){
        return res.json({
            errores: errores.array()
        })
    }
    // EXTRAER EL EMAIL Y EL PASSWORD PARA VERIFICAR CONTRA BASE DE DATOS QUE SON LOS REALES
    const { email, password  } = req.body
    // REVISIÓN QUE EL USUARIO ESTÉ REGISTRADO EN BASE DE DATOS
    try{
        // ENCONTRAR AL USUARIO EN BD
        let usuarioBD = await Usuario.findOne({ email })
        console.log("Obteniendo usuario:", usuarioBD)
            // EN CASO DE QUE NO ENCONTREMOS AL USUARIO
            if(!usuarioBD){
                return res.status(400).json({
                    msg: "El usuario no existe. Crea uno."
                })
            }
        // REVISAR EL PASSWORD Y CONFIRMAR QUE ES EL PASSWORD CORRECTO
        let passwordCorrecto = await bcryptjs.compare(password, usuarioBD.password)
        if(!passwordCorrecto){
            return res.status(400).json({
                msg: "Password incorrecto. Intenta nuevamente."
            })
        }
        // SI TRIUNFAMOS. TODO ESTÁ OK. ES EL USUARIO. SU PASS ESTÁ OK. CHÉVERE.
        // CREAR EL PAYLOAD
        const payload = {
            usuario: {
                id: usuarioBD.id
            }
        }
        console.log(payload)
        // CREAR EL JWT
        jwt.sign(
            payload,
            process.env.SECRETA,
            {
                expiresIn: 360000 // EXPIRACIÓN 100 HORAS
            },
            (error, token) => {
                if(error) throw error
                // TRIUNFAMOS. DEVOLVAMOS EL TOKEN HACIA EL CLIENTE (POSTMAN O CHROME)
                console.log(token)
                res.json({token})
            }
        )
    } catch(e){
        res.status(400).json({
            msg: "Hubo un error en el servidor"
        })
    }
}
exports.verificarUsuario = async (req, res) =>{
    const userId = req.usuario.id
    try {
        let usuario = await Usuario.findById(userId).select('-password')
        res.json({
            usuario
        })

    }
    catch(e){
        res.status(400).json({
            msg:"error en el servidor"
        })
    }
}