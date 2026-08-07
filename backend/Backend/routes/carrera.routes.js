const express = require("express");
const router = express.Router();
const Carrera = require("../models/carrera.model");

// POST /carreras
router.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ mensajeError: "El nombre de la carrera es obligatorio." });
    }

    const existente = await Carrera.findOne({ nombre });
    if (existente) {
      return res.status(400).json({ mensajeError: "La carrera ya existe." });
    }

    const nuevaCarrera = new Carrera(req.body);
    await nuevaCarrera.save();
    res.status(201).json(nuevaCarrera);
  } catch (error) {
    res.status(400).json({ msj: "Error al crear la carrera", error });
  }
});

// GET /carreras
router.get("/", async (req, res) => {
  try {
    const carreras = await Carrera.find();
    res.json(carreras);
  } catch (error) {
    res.status(500).json({ msj: "Error al obtener las carreras", error });
  }
});

module.exports = router;