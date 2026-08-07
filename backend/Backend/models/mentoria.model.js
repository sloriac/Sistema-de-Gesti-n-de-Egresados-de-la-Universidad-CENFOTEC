const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mentoriaSchema = new Schema({
  mentor: {
    type: Schema.Types.ObjectId,
    ref: 'Egresado',
    required: true
  },
  solicitante: {
    type: Schema.Types.ObjectId,
    ref: 'Egresado',
    required: true
  },
  oportunidad: {
    type: Schema.Types.ObjectId,
    ref: 'OportunidadMentoria'
  },
  solicitud: {
    type: Schema.Types.ObjectId,
    ref: 'SolicitudMentoria'
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: { type: Date },
  estado: {
    type: String,
    required: true,
    enum: ['Pendiente', 'Activa', 'Finalizada', 'Cancelada'],
    default: 'Pendiente'
  },
  observaciones: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Mentoria', mentoriaSchema);