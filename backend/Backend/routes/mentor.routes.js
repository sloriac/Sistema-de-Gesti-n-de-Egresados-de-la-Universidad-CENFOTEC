const express = require("express");
const router = express.Router();
const Mentor = require("../models/mentor.model");

// POST /mentores
router.post("/", async (req, res) => {
  try {
    const { egresado, areaExperiencia, especialidades, annosExperiencia, disponibilidad } = req.body;

    if (!egresado || !areaExperiencia || !especialidades || annosExperiencia === undefined || !disponibilidad) {
      return res.status(400).json({ mensajeError: "Todos los campos son obligatorios: egresado, areaExperiencia, especialidades, añosExperiencia, disponibilidad." });
    }

    // Validar que especialidades sea un array no vacío
    if (!Array.isArray(especialidades) || especialidades.length === 0) {
      return res.status(400).json({ mensajeError: "El campo 'especialidades' debe ser un arreglo con al menos un elemento." });
    }

    // Validar añosExperiencia >= 0
    if (annosExperiencia < 0) {
      return res.status(400).json({ mensajeError: "Los años de experiencia no pueden ser negativos." });
    }

    // Verificar que el egresado no tenga ya un perfil de mentor
    const existente = await Mentor.findOne({ egresado });
    if (existente) {
      return res.status(400).json({ mensajeError: "Este egresado ya tiene un perfil de mentor." });
    }

    const nuevoMentor = new Mentor(req.body);
    await nuevoMentor.save();
    res.status(201).json(nuevoMentor);
  } catch (error) {
    res.status(400).json({ msj: "Error al crear el mentor", error });
  }
});

// GET /mentores
router.get("/", async (req, res) => {
  try {
    const mentores = await Mentor.find().populate('egresado');
    res.json(mentores);
  } catch (error) {
    res.status(500).json({ msj: "Error al obtener los mentores", error });
  }
});

module.exports = router;