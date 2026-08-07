const express = require("express");
const router = express.Router();
const OportunidadMentoria = require("../models/oportunidadMentoria.model");

// POST /oportunidades-mentoria
router.post("/", async (req, res) => {
  try {
    const { creadoPor, titulo, descripcion, area, fechaVencimiento } = req.body;

    if (!creadoPor || !titulo || !descripcion || !area || !fechaVencimiento) {
      return res.status(400).json({ mensajeError: "Todos los campos son obligatorios: creadoPor, titulo, descripcion, area, fechaVencimiento." });
    }

    // Validar que fechaVencimiento sea una fecha futura (opcional)
    const fechaVenc = new Date(fechaVencimiento);
    if (fechaVenc <= new Date()) {
      return res.status(400).json({ mensajeError: "La fecha de vencimiento debe ser futura." });
    }

    // El estado se asigna por defecto: 'Abierta'
    const nuevaOportunidad = new OportunidadMentoria(req.body);
    await nuevaOportunidad.save();
    res.status(201).json(nuevaOportunidad);
  } catch (error) {
    res.status(400).json({ msj: "Error al crear la oportunidad de mentoría", error });
  }
});

// GET /oportunidades-mentoria
router.get("/", async (req, res) => {
  try {
    const oportunidades = await OportunidadMentoria.find().populate('creadoPor');
    res.json(oportunidades);
  } catch (error) {
    res.status(500).json({ msj: "Error al obtener las oportunidades de mentoría", error });
  }
});

module.exports = router;