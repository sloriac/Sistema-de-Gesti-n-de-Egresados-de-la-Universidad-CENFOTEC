const express = require("express");
const router = express.Router();
const Titulo = require("../models/titulo.model");

// POST /titulos
router.post("/", async (req, res) => {
  try {
    const { tipoPrograma, carrera, escuela, annoGraduacion, egresado } = req.body;

    if (!tipoPrograma || !carrera || !escuela || !annoGraduacion || !egresado) {
      return res.status(400).json({ mensajeError: "Todos los campos son obligatorios: tipoPrograma, carrera, escuela, annoGraduacion, egresado." });
    }

    // Validar tipoPrograma
    const tiposPermitidos = ['Técnico', 'Bachillerato', 'Maestría'];
    if (!tiposPermitidos.includes(tipoPrograma)) {
      return res.status(400).json({ mensajeError: "Tipo de programa no válido. Debe ser: Técnico, Bachillerato o Maestría." });
    }

    // Validar que annoGraduacion sea un número razonable
    const annoActual = new Date().getFullYear();
    if (annoGraduacion < 1900 || annoGraduacion > annoActual + 5) {
      return res.status(400).json({ mensajeError: "El año de graduación debe estar entre 1900 y " + (annoActual + 5) + "." });
    }

    const nuevoTitulo = new Titulo(req.body);
    await nuevoTitulo.save();
    res.status(201).json(nuevoTitulo);
  } catch (error) {
    res.status(400).json({ msj: "Error al crear el título", error });
  }
});

// GET /titulos
router.get("/", async (req, res) => {
  try {
    const titulos = await Titulo.find()
      .populate('carrera')
      .populate('escuela')
      .populate('egresado');
    res.json(titulos);
  } catch (error) {
    res.status(500).json({ msj: "Error al obtener los títulos", error });
  }
});

module.exports = router;