const { validationResult } = require("express-validator")
const bcryptjs             = require('bcryptjs')
const jwt                  = require('jsonwebtoken')
const Usuario = require('../models/Usuario')
exports.crearUsuario = async (req, res) => {
        // REVISIÓN DE EXPRESS-VALIDATOR
            const errores = validationResult(req)
            if(!errores.isEmpty()){
                return res.json({
                    errores: errores.array()
                })
            }
        // EXTRAER NOMBRE, EMAIL Y PASSWORD DEL REQ
            const { email, password, nombre } = req.body
        // BUSCAR EN BASE DE DATOS SI EXISTE EL USUARIO
            try{
                // CONFIRMAR QUE EL USUARIO ES ÚNICO
                    let usuario = await Usuario.findOne({email})
                // SI ENCONTRAMOS EL USUARIO EN BASE DE DATOS
                    if(usuario){
                        return res.status(400).json({
                            msg: "El usuario ya existe. Usa otro."
                        })
                    }
                // SI NO ENCONTRAMOS EL USUARIO EN BASE DE DATOS, ENTONCES SÍ CREA UN USUARIO NUEVO
                    usuario = new Usuario(req.body)
                // ENCRIPTAMOS EL PASSWORD
                    const salt = await bcryptjs.genSalt(10)
                    usuario.password = await bcryptjs.hash(password, salt)
                // GUARDARMOS EL USUARIO
                    await usuario.save()
                // CREACIÓN DE PAYLOAD PARA EL JWT
                    const payload = {
                        usuario: {
                            id: usuario.id
                        }
                    }
                // GENERAR EL JWT Y APLICARLE UNA FIRMA
                    jwt.sign(
                        payload, // LOS DATOS QUE SE ENVÍAN AL FRONT (USUARIO.ID) 
                        process.env.SECRETA, // PALABRA SECRETA DEL BACKEND
                        {
                            expiresIn: 360000 // EXPIRACIÓN 100 HORAS
                        },
                        (error, token) => { // CALLBACK UNA VEZ QUE EJECUTÓ TODO LO DE ARRIBA (sign con el payload, la palabra secreta y la expiración)
                            if(error) throw error
                            // DEVOLVER RESULTADO AL FRONTEND
                            res.json({
                                token: token
                            })        
                        }
                    )
            } 
            catch(e){
                console.log(e)
                res.status(400).json({
                    msg: "Hubo un error en el servidor"
                })
            }
}

