// 1. IMPORTACIONES
const mongoose = require('mongoose')
// 2. SCHEMA
const ProyectoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    creado: {
        type: Date,
        default: Date.now()
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    actualizadoEn: {
        type: Date,
        default: Date.now()
    }
})
// 3. MODELO
const Proyecto = mongoose.model('Proyecto', ProyectoSchema)
// 4. EXPORTACIÓN
module.exports = Proyecto