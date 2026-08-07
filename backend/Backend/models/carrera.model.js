const mongoose = require('mongoose');

const carreraSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    descripcion: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Carrera', carreraSchema);