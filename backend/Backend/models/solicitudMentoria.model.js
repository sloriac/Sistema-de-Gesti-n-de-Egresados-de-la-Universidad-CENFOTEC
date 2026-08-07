const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const solicitudMentoriaSchema = new Schema({
  egresado: {
    type: Schema.Types.ObjectId,
    ref: 'Egresado',
    required: true
  },
  oportunidad: {
    type: Schema.Types.ObjectId,
    ref: 'OportunidadMentoria',
    required: true
  },
  objetivo: {
    type: String,
    required: true
  },
  comentarios: { type: String },
  fechaSolicitud: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'Aceptada', 'Rechazada'],
    default: 'Pendiente'
  }
}, { timestamps: true });

module.exports = mongoose.model('SolicitudMentoria', solicitudMentoriaSchema);