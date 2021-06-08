// 1. IMPORTACIONES
const mongoose = require('mongoose')
// 2. SCHEMA
const TrabajoSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    duracion: {
        type: String,
        required: true
    },
    requisitos: {
        type: String,
        required: false
    },
    ubicacion: {
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
const Trabajo = mongoose.model('Trabajo', TrabajoSchema)
// 4. EXPORTACIÓN
module.exports = Trabajo