const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const oportunidadMentoriaSchema = new Schema({
  creadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  area: {
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
  estado: {
    type: String,
    enum: ['Abierta', 'Cerrada'],
    default: 'Abierta'
  }
}, { timestamps: true });

module.exports = mongoose.model('OportunidadMentoria', oportunidadMentoriaSchema);