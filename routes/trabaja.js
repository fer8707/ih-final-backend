// 1. IMPORTACIONES
const express               = require('express')
const router                = express.Router()
const auth                  = require('../middleware/auth')
const trabajoController    = require("../controllers/trabajoController")

//2.  RUTA

router.get("/",
    auth,
    trabajoController.todosLostrabajos
)

//3. EXPORTACIÓN
module.exports = router