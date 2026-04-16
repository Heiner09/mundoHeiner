const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: 8
  },
  tipo: {
    type: String,
    enum: ['persona', 'empresa'],
    required: true
  },
  telefono: { type: String, trim: true, default: '' },
  ciudad:   { type: String, trim: true, default: '' },
  perfil:   { type: String, trim: true, default: '' },
  cv:       { type: mongoose.Schema.Types.Mixed, default: {} },
  creadoEn: { type: Date, default: Date.now },
});

// Encriptar contraseña antes de guardar
//cambio
usuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    //cambio
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
usuarioSchema.methods.verificarPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);