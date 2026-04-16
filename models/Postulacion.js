const mongoose = require('mongoose');

const postulacionSchema = new mongoose.Schema({
  persona: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  empleo:  { type: mongoose.Schema.Types.ObjectId, ref: 'Empleo',  required: true },
  creadoEn: { type: Date, default: Date.now },
});

// Evita postulaciones duplicadas (una persona, un empleo)
postulacionSchema.index({ persona: 1, empleo: 1 }, { unique: true });

module.exports = mongoose.model('Postulacion', postulacionSchema);
