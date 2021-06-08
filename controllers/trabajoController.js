const Trabajo              = require('../models/Trabajo')
const {validationResult}    = require('express-validator')


exports.crearTrabajo = async (req,res) => {
    // REVISAR SI HAY ERRORES EN LA VALIDACIÓN DE CHECKS
        const errores = validationResult(req)
        
        if(!errores.isEmpty()){
            return res.json({
                errores: errores.array()
            })
        }

    // CREAR TRABAJO EN BASE DE DATOS
        try {
            // CREAR UN TRABAJO A PARTIR DEL MODELO
            const trabajo = new Trabajo(req.body)
            console.log(trabajo)
            // OBTENER EL ID DEL USUARIO QUE CREÓ ESTE TRABAJO
            trabajo.creador = req.usuario.id
            console.log(trabajo.creador)

            // GUARDO ESTE TRABAJO  EN BASE DE DATOS
            trabajo.save()
            console.log(trabajo)
            
            // DEVOLVER RESPUESTA
            res.json({
                mensaje: "Todo ok",
                trabajoCreado: trabajo
            })


        } catch (e){
            res.status(400).json({
                msg: "Hubo un error en servidor."
            })
        }

}


exports.obtenerTrabajos = async (req, res)  => {
    // OBTENER TODOS LOS TRABAJOS DEL USUARIO EN CUESTIÓN
        let usuario = req.usuario.id

        try{
            // BUSCAMOS EN LA BASE DE DATOS EL LISTADO DE TRABAJOS DE UN USUARIO ESPECÍFICO
            const listaTrabajos = await Trabajo.find({creador: usuario}).sort({creado: -1})

            // DEVOLVEMOS LA RESPUESTA AL CLIENTE
            res.json({
                listaTrabajos
            })
        }catch(e){
            // EN CASO DE ERROR, DEVUELVE EL ERROR
                res.status(400).json({
                    msg: e
                })
        }
}


exports.actualizarTrabajo = async (req, res) => {

    // REVISAR SI HAY ERRORES CON LA VALIDACIÓN DE CHECK
    const errores = validationResult(req)
    
    if(!errores.isEmpty()){
        return res.json({
            errores: errores.array()
        })
    }

    // EXTRAER LA INFORMACIÓN DEL TRABAJO
    const { nombre } = req.body

    // CREAR UN NUEVO TRABAJO VACÍO DONDE LE INSERTAREMOS LA NUEVA INFORMACIÓN
    const nuevoTrabajo = {}

    // AGREGAR EL NOMBRE AL NUEVOTRABAJO (OBJETO)
    nuevoTrabajo.nombre = nombre


    // AGREGAR FECHA DE ACTUALIZACIÓN
    nuevoTrabajo.actualizadoEn = Date.now()


    // OBTENER EL ID DEL TRABAJO
    const trabajoId = req.params.id

    try{
        // REVISIÓN DEL ID DEL TRABAJO. NECESITO IDENTIFICAR EL TRABAJO QUE VOY A CAMBIARLE EL NOMBRE
        let trabajo = await Trabajo.findById(trabajoId)

        // EN CASO DE QUE NO EXISTA ESE TRABAJO DENTRO DE LA BASE DE DATOS
        if(!trabajo){
            return res.status(400).json({
                msg: "Trabajo no encontrado"
            })
        }

        // VERIFICACIÓN DE QUE EL USUARIO ES EL AUTOR DE ESE TRABAJO
        // 1. OBJECT ID DEL CREADOR EN MONGODB
        //                                 2. EL USUARIO DEL TOKEN
        if(trabajo.creador.toString() !== req.usuario.id){
            return res.status(400).json({
                msg: "Otro usuario está intentando cambiar un trabajo que no es suyo. No autorizado."
            })
        }

        // SI SÍ EXISTE, AVANZAMOS
        // ACTUALIZAMOS LE NOMBRE DEL TRABAJO

        console.log(trabajo)

        trabajo = await Trabajo.findByIdAndUpdate({_id: trabajoId.toString()}, { $set: nuevoTrabajo }, { new: true })
        res.json({
            trabajoActualizado: trabajo
        })

    } catch(e){
        return res.status(400).json({
            msg: e
        })
    }
}


exports.eliminarTrabajo = async (req, res) => {

    // TENER EL ID DEL TRABAJO
        const trabajoId = req.params.id

        // SI EL TRABAJO NO SE ENCONTRÓ
        // if(!trabajoId){
        //     return res.status(400).json({
        //         msg: "No se insertó el ID del trabajo."
        //     })
        // }


        try {
            // ENCONTRANDO EL TRABAJO EN BD
            let trabajo = await Trabajo.findById(trabajoId)

            // VERIFICACIÓN DE QUE EL USUARIO ES EL MISMO DEL TRABAJO
            // 1. OBJECT ID DEL CREADOR EN MONGODB
            //                                 2. EL USUARIO DEL TOKEN
            if(trabajo.creador.toString() !== req.usuario.id){
                return res.status(400).json({
                    msg: "Otro usuario está intentando cambiar un trabajo que no es suyo. No autorizado."
                })
            }


            // ELIMINACIÓN DE TRABAJO
            await Trabajo.findOneAndRemove({_id: trabajoId})
            
            res.json({
                msg: "El trabajo fue eliminado" 
            })
            
        } catch(e){
            console.log(e)
            res.status(400).json({
                msg: "Hubo un error en el servidor. Puede que el documento esté borrado."
            })
        }
}

exports.todosLosTrabajos = async (req, res)  => {
    // OBTENER TODOS LOS TRABAJOS DEL USUARIO EN CUESTIÓN
        // let usuario = req.usuario.id

        try{
            // BUSCAMOS EN LA BASE DE DATOS EL LISTADO DE TRABAJOS DE UN USUARIO ESPECÍFICO
            // const listaTrabajos = await Trabajo.find({creador: usuario}).sort({creado: -1})
            const listaTodosTrabajos = await Trabajo.sort({creado: -1})

            // DEVOLVEMOS LA RESPUESTA AL CLIENTE
            res.json({
                listaTodosTrabajos
            })
        }catch(e){
            // EN CASO DE ERROR, DEVUELVE EL ERROR
                res.status(400).json({
                    msg: e
                })
        }
}