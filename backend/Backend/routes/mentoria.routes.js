const express = require("express");
const router = express.Router();
const Mentoria = require("../models/mentoria.model");

// POST /mentorias
router.post("/", async (req, res) => {
  try {
    const { mentor, solicitante, fechaInicio, estado } = req.body;

    if (!mentor || !solicitante || !fechaInicio || !estado) {
      return res.status(400).json({ mensajeError: "Los campos mentor, solicitante, fechaInicio y estado son obligatorios." });
    }

    // Validar que estado sea uno de los permitidos
    const estadosPermitidos = ['Pendiente', 'Activa', 'Finalizada', 'Cancelada'];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ mensajeError: "Estado no válido. Debe ser: Pendiente, Activa, Finalizada o Cancelada." });
    }

    // Si se envía fechaFin, debe ser posterior a fechaInicio
    if (req.body.fechaFin) {
      const fechaIni = new Date(fechaInicio);
      const fechaFin = new Date(req.body.fechaFin);
      if (fechaFin <= fechaIni) {
        return res.status(400).json({ mensajeError: "La fecha de finalización debe ser posterior a la fecha de inicio." });
      }
    }

    const nuevaMentoria = new Mentoria(req.body);
    await nuevaMentoria.save();
    res.status(201).json(nuevaMentoria);
  } catch (error) {
    res.status(400).json({ msj: "Error al crear la mentoría", error });
  }
});

// GET /mentorias
router.get("/", async (req, res) => {
  try {
    const mentorias = await Mentoria.find()
      .populate('mentor')
      .populate('solicitante')
      .populate('oportunidad')
      .populate('solicitud');
    res.json(mentorias);
  } catch (error) {
    res.status(500).json({ msj: "Error al obtener las mentorías", error });
  }
});

module.exports = router;