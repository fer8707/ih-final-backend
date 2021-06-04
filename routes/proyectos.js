// 1. IMPORTACIONES
const express               = require('express')
const router                = express.Router()
const auth                  = require('./../middleware/auth')
const { check }             = require('express-validator')
const proyectoController    = require("./../controllers/proyectoController")

// 2. RUTEO
// CRUD - PROYECTOS

/**
 * 
 * URL BASE: /api/proyectos
 */



// RUTA 1
// a. CREAR PROYECTO
/*
ESCRIBE TU PROYECTO:    
__________________
                =>          Creamos un proyecto con ese nombre en base de datos. 
                            Recordar añadir el id del usuario para que se ancle con el proyecto
*/

router.post("/", 
    auth, // VERIFICA QUE UN USUARIO ESTÉ REGISTRADO Y TENGA SU TOKEN
    [
        check("nombre", "El nombre del proyecto es obligatorio de llenar.").not().isEmpty()
    ], 
    proyectoController.crearProyecto
)


// RUTA 2
// b. LEER/OBTENER TODOS LOS PROYECTOS

router.get("/", 
    auth,
    proyectoController.obtenerProyectos
)


// RUTA 3
// c. ACTUALIZAR UN PROYECTO
router.put("/:id", 
    auth,
    [
        check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()
    ],
    proyectoController.actualizarProyecto
)

// RUTA 4
// d. BORRAR UN PROYECTO
router.delete('/:id', 
    auth, 
    proyectoController.eliminarProyecto
)




module.exports = router