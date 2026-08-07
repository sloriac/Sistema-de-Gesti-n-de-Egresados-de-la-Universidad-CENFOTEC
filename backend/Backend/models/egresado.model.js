const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lugarTrabajoSchema = new Schema({
    empresa: { type: String, required: true },
    puesto: { type: String, required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date },
    descripcion: { type: String }
}, { _id: false });

const egresadoSchema = new Schema({
    identificacion: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    nombreCompleto: {
        type: String,
        required: true
    },
    correoElectronico: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    },
    lugaresTrabajo: [lugarTrabajoSchema],
    empresaActual: { type: String },
    puestoActual: { type: String },
    areaProfesional: { type: String },
    linkedin: { type: String },
    portafolio: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Egresado', egresadoSchema);