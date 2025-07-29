const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');
const app = express();

app.use(express.json());

// Cargar Swagger
const file = fs.readFileSync('./swagger.json', 'utf8');
const swaggerDocument = YAML.parse(file);

// Rutas CRUD mock (sin base de datos)
app.get('/mascotas', (req, res) => {
  res.json([{ id: 1, nombre: 'Firulais' }]);
});

app.get('/mascotas/:id', (req, res) => {
  res.json({ id: req.params.id, nombre: 'Firulais' });
});

app.post('/mascotas', (req, res) => {
  res.status(201).json({ message: 'Mascota creada' });
});

app.get('/veterinarios', (req, res) => {
  res.json([{ id: 1, nombre: 'Dra. Pérez' }]);
});

app.get('/tratamientos', (req, res) => {
  res.json([{ id: 1, descripcion: 'Desparasitación' }]);
});

app.get('/citas', (req, res) => {
  res.json([{ id: 1, fecha: '2024-08-01', mascotaId: 1 }]);
});

app.get('/historial', (req, res) => {
  res.json([{ id: 1, mascotaId: 1, descripcion: 'Consulta por fiebre' }]);
});

// Ruta de ejemplo distribuido con FDW
app.get('/mascotas/:id/tratamientos', (req, res) => {
  res.json({
    mascota: { id: req.params.id, nombre: 'Firulais' },
    tratamientos: [
      { id: 1, descripcion: 'Vacuna rabia' },
      { id: 2, descripcion: 'Desparasitación' }
    ]
  });
});

// Swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});