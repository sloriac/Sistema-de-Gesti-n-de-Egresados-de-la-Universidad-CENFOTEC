const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tituloSchema = new Schema({
  tipoPrograma: {
    type: String,
    required: true,
    enum: ['Técnico', 'Bachillerato', 'Maestría']
  },
  carrera: {
    type: Schema.Types.ObjectId,
    ref: 'Carrera',
    required: true
  },
  escuela: {
    type: Schema.Types.ObjectId,
    ref: 'Escuela',
    required: true
  },
  annoGraduacion: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 5
  },
  estado: {
    type: String,
    required: true,
    default: 'Emitido'
  },
  egresado: {
    type: Schema.Types.ObjectId,
    ref: 'Egresado',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Titulo', tituloSchema);