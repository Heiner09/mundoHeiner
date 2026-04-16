const express  = require('express');
const path     = require('path');
const fs       = require('fs');
const multer   = require('multer');
const Usuario  = require('../models/Usuario');
const auth     = require('../middleware/auth');

const router = express.Router();

// ─── Configuración multer para certificados ───────────────
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `cert-${req.usuario.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF o imágenes (JPG, PNG)'));
    }
  },
});

// ─── PUT /api/usuarios/perfil — datos básicos ─────────────
router.put('/perfil', auth, async (req, res) => {
  try {
    const { nombre, telefono, ciudad, perfil } = req.body;

    const actualizado = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      { nombre, telefono, ciudad, perfil },
      { new: true, runValidators: true, select: '-password' }
    );

    if (!actualizado) {
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
    }

    res.json({
      ok: true,
      usuario: {
        id:       actualizado._id,
        nombre:   actualizado.nombre,
        email:    actualizado.email,
        tipo:     actualizado.tipo,
        telefono: actualizado.telefono,
        ciudad:   actualizado.ciudad,
        perfil:   actualizado.perfil,
      },
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

// ─── PUT /api/usuarios/cv — guardar hoja de vida completa ─
router.put('/cv', auth, async (req, res) => {
  try {
    const { cv } = req.body;

    const actualizado = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      { cv },
      { new: true, select: '-password' }
    );

    if (!actualizado) {
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
    }

    res.json({ ok: true, mensaje: 'Hoja de vida guardada correctamente', cv: actualizado.cv });
  } catch (error) {
    console.error('Error al guardar CV:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

// ─── POST /api/usuarios/certificado — subir archivo ───────
router.post('/certificado', auth, upload.single('certificado'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, mensaje: 'No se recibió ningún archivo' });
  }
  res.json({
    ok:     true,
    url:    `/uploads/${req.file.filename}`,
    nombre: req.file.originalname,
  });
});

module.exports = router;
