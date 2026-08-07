const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mentorSchema = new Schema({
  egresado: {
    type: Schema.Types.ObjectId,
    ref: 'Egresado',
    required: true,
    unique: true
  },
  areaExperiencia: {
    type: String,
    required: true
  },
  especialidades: {
    type: [String],
    required: true
  },
  annosExperiencia: {
    type: Number,
    required: true,
    min: 0
  },
  disponibilidad: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Mentor', mentorSchema);