const express = require("express");
const router = express.Router();
const SolicitudMentoria = require("../models/solicitudMentoria.model");

// POST /solicitudes-mentoria
router.post("/", async (req, res) => {
  try {
    const { egresado, oportunidad, objetivo } = req.body;

    if (!egresado || !oportunidad || !objetivo) {
      return res.status(400).json({ mensajeError: "Los campos egresado, oportunidad y objetivo son obligatorios." });
    }

    // Verificar que no exista una solicitud pendiente para la misma oportunidad y egresado
    const existente = await SolicitudMentoria.findOne({ egresado, oportunidad, estado: 'Pendiente' });
    if (existente) {
      return res.status(400).json({ mensajeError: "Ya tienes una solicitud pendiente para esta oportunidad." });
    }

    const nuevaSolicitud = new SolicitudMentoria(req.body);
    await nuevaSolicitud.save();
    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    res.status(400).json({ msj: "Error al crear la solicitud de mentoría", error });
  }
});

// GET /solicitudes-mentoria
router.get("/", async (req, res) => {
  try {
    const solicitudes = await SolicitudMentoria.find()
      .populate('egresado')
      .populate('oportunidad');
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ msj: "Error al obtener las solicitudes de mentoría", error });
  }
});

module.exports = router;