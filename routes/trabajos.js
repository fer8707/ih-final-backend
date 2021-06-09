// 1. IMPORTACIONES
const express               = require('express')
const router                = express.Router()
const auth                  = require('../middleware/auth')
const { check }             = require('express-validator')
const trabajoController    = require("../controllers/trabajoController")

// 2. RUTEO
// CRUD - TRABAJOS

/**
 * 
 * URL BASE: /api/trabajos
 */



// RUTA 1
// a. CREAR TRABAJO
/*
ESCRIBE TU TRABAJO:    
__________________
                =>          Creamos un trabajo con ese nombre en base de datos. 
                            Recordar añadir el id del usuario para que se ancle con el trabajo
*/

router.post("/", 
    auth, // VERIFICA QUE UN USUARIO ESTÉ REGISTRADO Y TENGA SU TOKEN
    [
        check("titulo", "El título del trabajo es obligatorio de llenar.").not().isEmpty(),
        check("descripcion", "Debes añadir una descripción corta").not().isEmpty(),
        check("duracion", "Especifica la duración de trabajo en horas o dias").not().isEmpty(),
        check("titulo", "El nombre del trabajo es obligatorio de llenar.").not().isEmpty(),
        check("ubicacion", "añade el link de google maps.").not().isEmpty()
    ], 
    trabajoController.crearTrabajo
)


// RUTA 2
// b. LEER/OBTENER TODOS LOS TRABAJOS DEL USUARIO

router.get("/", 
    auth,
    trabajoController.obtenerTrabajos
)

//-----------------------
// MOSTRAR TODOS LOS TRABAJOS DE LA PLATAFORMA
// router.get("/trabaja",
//     auth,
//     trabajoController.todosLostrabajos
// )
//------------------------


// RUTA 3
// c. ACTUALIZAR UN TRABAJO
router.put("/:id", 
    auth,
    [
        check("nombre", "El nombre del trabajo es obligatorio").not().isEmpty()
    ],
    trabajoController.actualizarTrabajo
)

// RUTA 4
// d. BORRAR UN TRABAJO
router.delete('/:id', 
    auth, 
    trabajoController.eliminarTrabajo
)



module.exports = router