const mongoose = require('mongoose');

const empleoSchema = new mongoose.Schema({
  titulo:      { type: String, required: true, trim: true },
  descripcion: { type: String, required: true, trim: true },
  empresa:     { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  ubicacion:   { type: String, required: true, trim: true },
  salario:     { type: String, trim: true, default: 'A convenir' },
  modalidad:   { type: String, enum: ['presencial', 'remoto', 'hibrido'], default: 'presencial' },
  activo:      { type: Boolean, default: true },
  creadoEn:    { type: Date, default: Date.now },
});

module.exports = mongoose.model('Empleo', empleoSchema);
