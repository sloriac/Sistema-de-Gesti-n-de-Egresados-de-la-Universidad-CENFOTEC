const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario.model");

// POST /usuarios
router.post("/", async (req, res) => {
  try {
    const { email, password, rol, egresado } = req.body;

    // Validar campos obligatorios
    if (!email || !password || !rol) {
      return res.status(400).json({ mensajeError: "Email, contraseña y rol son obligatorios." });
    }

    // Validar que el rol sea uno de los permitidos
    const rolesPermitidos = ['Registro', 'Bienestar Estudiantil', 'Egresado'];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ mensajeError: "Rol no válido. Debe ser: Registro, Bienestar Estudiantil o Egresado." });
    }

    // Si el rol es 'Egresado', se debe proporcionar el id del egresado
    if (rol === 'Egresado' && !egresado) {
      return res.status(400).json({ mensajeError: "Para el rol Egresado, debe enviar el campo 'egresado' con el ID del egresado." });
    }

    // Verificar que el email no esté duplicado (opcional, pero se puede hacer)
    const existente = await Usuario.findOne({ email: email.toLowerCase() });
    if (existente) {
      return res.status(400).json({ mensajeError: "El email ya está registrado." });
    }

    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ msj: "Error al crear el usuario", error });
  }
});

// GET /usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find().populate('egresado');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ msj: "Error al obtener los usuarios", error });
  }
});

module.exports = router;