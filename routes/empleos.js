const express  = require('express');
const Empleo   = require('../models/Empleo');
const auth     = require('../middleware/auth');

const router = express.Router();

// GET /api/empleos — lista todos los empleos activos (público)
router.get('/', async (req, res) => {
  try {
    const empleos = await Empleo.find({ activo: true })
      .populate('empresa', 'nombre')
      .sort({ creadoEn: -1 });

    res.json({ ok: true, empleos });
  } catch (error) {
    console.error('Error al listar empleos:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

// GET /api/empleos/mis-empleos — empleos de la empresa autenticada
router.get('/mis-empleos', auth, async (req, res) => {
  try {
    if (req.usuario.tipo !== 'empresa') {
      return res.status(403).json({ ok: false, mensaje: 'Solo las empresas pueden ver sus vacantes' });
    }

    const empleos = await Empleo.find({ empresa: req.usuario.id })
      .sort({ creadoEn: -1 });

    res.json({ ok: true, empleos });
  } catch (error) {
    console.error('Error al listar mis empleos:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

// POST /api/empleos — crear empleo (solo empresa)
router.post('/', auth, async (req, res) => {
  try {
    if (req.usuario.tipo !== 'empresa') {
      return res.status(403).json({ ok: false, mensaje: 'Solo las empresas pueden publicar empleos' });
    }

    const { titulo, descripcion, ubicacion, salario, modalidad } = req.body;

    if (!titulo || !descripcion || !ubicacion) {
      return res.status(400).json({ ok: false, mensaje: 'Título, descripción y ubicación son requeridos' });
    }

    const empleo = new Empleo({
      titulo,
      descripcion,
      ubicacion,
      salario,
      modalidad,
      empresa: req.usuario.id,
    });

    await empleo.save();
    await empleo.populate('empresa', 'nombre');

    res.status(201).json({ ok: true, empleo });
  } catch (error) {
    console.error('Error al crear empleo:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

module.exports = router;
