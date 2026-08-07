const express = require("express");
const router = express.Router();
const Escuela = require("../models/escuela.model");

// POST /escuelas
router.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ mensajeError: "El nombre de la escuela es obligatorio." });
    }

    const existente = await Escuela.findOne({ nombre });
    if (existente) {
      return res.status(400).json({ mensajeError: "La escuela ya existe." });
    }

    const nuevaEscuela = new Escuela(req.body);
    await nuevaEscuela.save();
    res.status(201).json(nuevaEscuela);
  } catch (error) {
    res.status(400).json({ msj: "Error al crear la escuela", error });
  }
});

// GET /escuelas
router.get("/", async (req, res) => {
  try {
    const escuelas = await Escuela.find();
    res.json(escuelas);
  } catch (error) {
    res.status(500).json({ msj: "Error al obtener las escuelas", error });
  }
});

module.exports = router;