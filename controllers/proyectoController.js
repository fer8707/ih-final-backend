const Proyecto              = require('./../models/Proyecto')
const {validationResult}    = require('express-validator')


exports.crearProyecto = async (req,res) => {
    // REVISAR SI HAY ERRORES EN LA VALIDACIÓN DE CHECKS
    const errores = validationResult(req)
    
    if(!errores.isEmpty()){
        return res.json({
            errores: errores.array()
        })
    }

    // CREAR PROYECTO EN BASE DE DATOS
    try {
        // CREAR UN PROYECTO A PARTIR DEL MODELO
        const proyecto = new Proyecto(req.body)

        // OBTENER EL ID DEL USUARIO QUE CREÓ ESTE PROYECTO
        proyecto.creador = req.usuario.id

        // GUARDO ESTE PROYECTO  EN BASE DE DATOS
        proyecto.save()
        
        // DEVOLVER RESPUESTA
        res.json({
            mensaje: "Todo ok",
            proyectoCreado: proyecto
        })


    } catch (e){
        res.status(400).json({
            msg: "Hubo un error en servidor."
        })
    }

}


exports.obtenerProyectos = async (req, res)  => {
    // OBTENER TODOS LOS PROYECTOS DEL USUARIO EN CUESTIÓN
    let usuario = req.usuario.id

    try{
        // BUSCAMOS EN LA BASE DE DATOS EL LISTADO DE PROYECTOS DE UN USUARIO ESPECÍFICO
        const listaProyectos = await Proyecto.find({creador: usuario}).sort({creado: -1})

        // DEVOLVEMOS LA RESPUESTA AL CLIENTE
        res.json({
            listaProyectos
        })
    }catch(e){
        // EN CASO DE ERROR, DEVUELVE EL ERROR
            res.status(400).json({
                msg: e
            })
    }
}


exports.actualizarProyecto = async (req, res) => {

    // REVISAR SI HAY ERRORES CON LA VALIDACIÓN DE CHECK
    const errores = validationResult(req)
    
    if(!errores.isEmpty()){
        return res.json({
            errores: errores.array()
        })
    }

    // EXTRAER LA INFORMACIÓN DEL PROYECTO
    const { nombre } = req.body

    // CREAR UN NUEVO PROYECTO VACÍO DONDE LE INSERTAREMOS LA NUEVA INFORMACIÓN
    const nuevoProyecto = {}

    // AGREGAR EL NOMBRE AL NUEVOPROYECTO (OBJETO)
    nuevoProyecto.nombre = nombre


    // AGREGAR FECHA DE ACTUALIZACIÓN
    nuevoProyecto.actualizadoEn = Date.now()


    // OBTENER EL ID DEL PROYECTO
    const proyectoId = req.params.id

    try{
        // REVISIÓN DEL ID DEL PROYECTO. NECESITO IDENTIFICAR EL PROYECTO QUE VOY A CAMBIARLE EL NOMBRE
        let proyecto = await Proyecto.findById(proyectoId)

        // EN CASO DE QUE NO EXISTA ESE PROYECTO DENTRO DE LA BASE DE DATOS
        if(!proyecto){
            return res.status(400).json({
                msg: "Proyecto no encontrado"
            })
        }

        // VERIFICACIÓN DE QUE EL USUARIO ES EL AUTOR DE ESE PROYECTO
        // 1. OBJECT ID DEL CREADOR EN MONGODB
        //                                 2. EL USUARIO DEL TOKEN
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(400).json({
                msg: "Otro usuario está intentando cambiar un proyecto que no es suyo. No autorizado."
            })
        }

        // SI SÍ EXISTE, AVANZAMOS
        // ACTUALIZAMOS LE NOMBRE DEL PROYECTO

        console.log(proyecto)

        proyecto = await Proyecto.findByIdAndUpdate({_id: proyectoId.toString()}, { $set: nuevoProyecto }, { new: true })
        res.json({
            proyectoActualizado: proyecto
        })

    } catch(e){
        return res.status(400).json({
            msg: e
        })
    }
}


exports.eliminarProyecto = async (req, res) => {

    // TENER EL ID DEL PROYECTO
    const proyectoId = req.params.id

    // SI EL PROYECTO NO SE ENCONTRÓ
    // if(!proyectoId){
    //     return res.status(400).json({
    //         msg: "No se insertó el ID del proyecto."
    //     })
    // }


    try {
        // ENCONTRANDO EL PROYECTO EN BD
        let proyecto = await Proyecto.findById(proyectoId)

        // VERIFICACIÓN DE QUE EL USUARIO ES EL MISMO DEL PROYECTO
        // 1. OBJECT ID DEL CREADOR EN MONGODB
        //                                 2. EL USUARIO DEL TOKEN
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(400).json({
                msg: "Otro usuario está intentando cambiar un proyecto que no es suyo. No autorizado."
            })
        }


        // ELIMINACIÓN DE PROYECTO
        await Proyecto.findOneAndRemove({_id: proyectoId})
        
        res.json({
            msg: "El proyecto fue eliminado" 
        })
        
    } catch(e){
        console.log(e)
        res.status(400).json({
            msg: "Hubo un error en el servidor. Puede que el documento esté borrado."
        })
    }
}