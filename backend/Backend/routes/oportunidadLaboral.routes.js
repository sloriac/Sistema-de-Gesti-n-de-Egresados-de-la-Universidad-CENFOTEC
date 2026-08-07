const express = require("express");
const router = express.Router();
const OportunidadLaboral = require("../models/oportunidadLaboral.model");

// POST /oportunidades-laborales
router.post("/", async (req, res) => {
  try {
    const { publicadoPor, empresa, puesto, descripcion, areaProfesional, modalidad, ubicacion, fechaVencimiento, contacto } = req.body;

    if (!publicadoPor || !empresa || !puesto || !descripcion || !areaProfesional || !modalidad || !ubicacion || !fechaVencimiento || !contacto) {
      return res.status(400).json({ mensajeError: "Todos los campos son obligatorios: publicadoPor, empresa, puesto, descripcion, areaProfesional, modalidad, ubicacion, fechaVencimiento, contacto." });
    }

    // Validar modalidad
    const modalidadesPermitidas = ['Presencial', 'Remoto', 'Híbrido'];
    if (!modalidadesPermitidas.includes(modalidad)) {
      return res.status(400).json({ mensajeError: "Modalidad no válida. Debe ser: Presencial, Remoto o Híbrido." });
    }

    // Validar fechaVencimiento futura
    const fechaVenc = new Date(fechaVencimiento);
    if (fechaVenc <= new Date()) {
      return res.status(400).json({ mensajeError: "La fecha de vencimiento debe ser futura." });
    }

    const nuevaOportunidad = new OportunidadLaboral(req.body);
    await nuevaOportunidad.save();
    res.status(201).json(nuevaOportunidad);
  } catch (error) {
    res.status(400).json({ msj: "Error al crear la oportunidad laboral", error });
  }
});

// GET /oportunidades-laborales
router.get("/", async (req, res) => {
  try {
    const oportunidades = await OportunidadLaboral.find().populate('publicadoPor');
    res.json(oportunidades);
  } catch (error) {
    res.status(500).json({ msj: "Error al obtener las oportunidades laborales", error });
  }
});

module.exports = router;