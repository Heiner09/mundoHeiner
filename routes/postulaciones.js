const express      = require('express');
const Postulacion  = require('../models/Postulacion');
const auth         = require('../middleware/auth');

const router = express.Router();

// POST /api/postulaciones — persona se postula a un empleo
router.post('/', auth, async (req, res) => {
  try {
    if (req.usuario.tipo !== 'persona') {
      return res.status(403).json({ ok: false, mensaje: 'Solo las personas pueden postularse' });
    }

    const { empleoId } = req.body;
    if (!empleoId) {
      return res.status(400).json({ ok: false, mensaje: 'empleoId es requerido' });
    }

    const postulacion = new Postulacion({ persona: req.usuario.id, empleo: empleoId });
    await postulacion.save();

    res.status(201).json({ ok: true, mensaje: '¡Postulación enviada exitosamente!' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ ok: false, mensaje: 'Ya te postulaste a este empleo' });
    }
    console.error('Error al postular:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

// GET /api/postulaciones/empleo/:id — empresa ve postulantes de una vacante
router.get('/empleo/:id', auth, async (req, res) => {
  try {
    if (req.usuario.tipo !== 'empresa') {
      return res.status(403).json({ ok: false, mensaje: 'Solo las empresas pueden ver postulantes' });
    }

    const postulaciones = await Postulacion.find({ empleo: req.params.id })
      .populate('persona', 'nombre email telefono ciudad perfil')
      .sort({ creadoEn: -1 });

    res.json({ ok: true, postulaciones });
  } catch (error) {
    console.error('Error al obtener postulantes:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

// GET /api/postulaciones/mis-postulaciones — persona ve sus postulaciones
router.get('/mis-postulaciones', auth, async (req, res) => {
  try {
    if (req.usuario.tipo !== 'persona') {
      return res.status(403).json({ ok: false, mensaje: 'Solo disponible para personas' });
    }

    const postulaciones = await Postulacion.find({ persona: req.usuario.id })
      .populate('empleo', 'titulo ubicacion modalidad empresa')
      .sort({ creadoEn: -1 });

    res.json({ ok: true, postulaciones });
  } catch (error) {
    console.error('Error al obtener mis postulaciones:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

module.exports = router;
