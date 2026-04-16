const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB conectado'))
    .catch((err) => console.error('❌ Error MongoDB:', err));

// Rutas
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/empleos',       require('./routes/empleos'));
app.use('/api/usuarios',      require('./routes/usuarios'));
app.use('/api/postulaciones', require('./routes/postulaciones'));

// Ruta de prueba
app.get('/api/ping', (req, res) => {
    res.json({ mensaje: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});