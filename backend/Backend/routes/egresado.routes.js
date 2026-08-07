const express = require("express");
const router = express.Router();
const Egresado = require("../models/egresado.model");

// POST /egresados
router.post("/", async (req, res) => {
  try {
    const { identificacion, nombreCompleto, correoElectronico, telefono } = req.body;

    if (!identificacion || !nombreCompleto || !correoElectronico || !telefono) {
      return res.status(400).json({ mensajeError: "Identificación, nombre, correo y teléfono son obligatorios." });
    }

    // Verificar duplicado de identificación
    const existente = await Egresado.findOne({ identificacion });
    if (existente) {
      return res.status(400).json({ mensajeError: "Ya existe un egresado con esa identificación." });
    }

    // Validar que lugaresTrabajo (si se envía) sea un array
    if (req.body.lugaresTrabajo && !Array.isArray(req.body.lugaresTrabajo)) {
      return res.status(400).json({ mensajeError: "El campo 'lugaresTrabajo' debe ser un arreglo." });
    }

    const nuevoEgresado = new Egresado(req.body);
    await nuevoEgresado.save();
    res.status(201).json(nuevoEgresado);
  } catch (error) {
    res.status(400).json({ msj: "Error al crear el egresado", error });
  }
});

/* 
{
  "identificacion": "13456789",
  "nombreCompleto": "María M",
  "correoElectronico": "maria_m@example.com",
  "telefono": "8888-8888",
  "fechaRegistro": "2026-07-30"
}

{
  "identificacion": "123456789",
  "nombreCompleto": "María López",
  "correoElectronico": "maria@example.com",
  "telefono": "8888-8888",
  "fechaRegistro": "2026-07-30",
  "lugaresTrabajo": [
    {
      "empresa": "Empresa ABC",
      "puesto": "Desarrolladora",
      "fechaInicio": "2024-01-01",
      "fechaFin": "2025-12-31",
      "descripcion": "Desarrollo de aplicaciones"
    }
  ],
  "empresaActual": "Empresa XYZ",
  "puestoActual": "Líder técnico",
  "areaProfesional": "Tecnología",
  "linkedin": "linkedin.com/in/marialopez",
  "portafolio": "maria.dev"
}


*/

// GET /egresados
router.get("/", async (req, res) => {
  try {
    const egresados = await Egresado.find();
    res.json(egresados);
  } catch (error) {
    res.status(500).json({ msj: "Error al obtener los egresados", error });
  }
});

module.exports = router;