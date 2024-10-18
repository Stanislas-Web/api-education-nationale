const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const UserRouter = require('./routers/user.router');
const ProvinceRouter = require('./routers/province.router');
const DirectionRouter = require('./routers/direction.route');
const SousDirectionRouter = require('./routers/sousDirection.js');
const ServiceRouter = require('./routers/service.route');
const path = require('path');

const app = express();

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    info: {
      title: 'API Education Nationale',
      version: '1.0.0',
      description: 'Documentation de l\'API Education Nationale',
    },
    servers: [
      {
        // url: 'http://134.122.23.150/api/v1',
        url: 'http://localhost/api/v1',
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./routers/*.js', './models/*.js'], // Assurez-vous que ces chemins sont corrects
};

// Middleware Swagger
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// Middleware CORS & JSON
app.use(cors());
app.use(express.json());

// Middleware pour servir les fichiers statiques (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route pour récupérer une image
app.get('/image/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  // Vérifie si le fichier existe et l'envoie
  res.sendFile(filePath, (err) => {
    if (err) {
      return res.status(404).json({ message: 'Image non trouvée' });
    }
  });
});

// Configuration des routes
app.use('/api/v1/', UserRouter, ProvinceRouter, DirectionRouter, SousDirectionRouter, ServiceRouter);

// Middleware Swagger Docs
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

module.exports = app;
