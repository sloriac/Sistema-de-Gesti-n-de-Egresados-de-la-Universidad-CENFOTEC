const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    required: true,
    enum: ['Registro', 'Bienestar Estudiantil', 'Egresado']
  },
  egresado: {
    type: Schema.Types.ObjectId,
    ref: 'Egresado'
  }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);