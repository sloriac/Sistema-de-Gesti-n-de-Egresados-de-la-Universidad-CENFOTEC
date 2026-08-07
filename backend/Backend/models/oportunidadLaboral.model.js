const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const oportunidadLaboralSchema = new Schema({
  publicadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  empresa: {
    type: String,
    required: true
  },
  puesto: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  areaProfesional: {
    type: String,
    required: true
  },
  modalidad: {
    type: String,
    required: true,
    enum: ['Presencial', 'Remoto', 'Híbrido']
  },
  ubicacion: {
    type: String,
    required: true
  },
  fechaPublicacion: {
    type: Date,
    default: Date.now
  },
  fechaVencimiento: {
    type: Date,
    required: true
  },
  contacto: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    required: true,
    enum: ['Activa', 'Inactiva', 'Vencida'],
    default: 'Activa'
  }
}, { timestamps: true });

module.exports = mongoose.model('OportunidadLaboral', oportunidadLaboralSchema);