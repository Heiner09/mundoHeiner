const express  = require('express');
const jwt      = require('jsonwebtoken');
const Usuario  = require('../models/Usuario');
const auth     = require('../middleware/auth');

const router = express.Router();

// ─── REGISTRO ────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, tipo } = req.body;

    // Verificar si el email ya existe
    const emailExistente = await Usuario.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Ya existe una cuenta con ese correo electrónico'
      });
    }

    // Crear y guardar el usuario
    const nuevoUsuario = new Usuario({ nombre, email, password, tipo });
    await nuevoUsuario.save();

    // Generar token JWT
    const token = jwt.sign(
      { id: nuevoUsuario._id, tipo: nuevoUsuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      ok: true,
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        tipo: nuevoUsuario.tipo
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

// ─── LOGIN ────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Correo o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    const passwordValida = await usuario.verificarPassword(password);
    if (!passwordValida) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Correo o contraseña incorrectos'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      ok: true,
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

// ─── ME ──────────────────────────────────────────────────
router.get('/me', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
    }
    res.json({
      ok: true,
      usuario: {
        id:       usuario._id,
        nombre:   usuario.nombre,
        email:    usuario.email,
        tipo:     usuario.tipo,
        telefono: usuario.telefono,
        ciudad:   usuario.ciudad,
        perfil:   usuario.perfil,
        cv:       usuario.cv,
      },
    });
  } catch (error) {
    console.error('Error en /me:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

module.exports = router;