const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Education Nationale',
      version: '1.0.0',
      description: 'API pour le projet Education Nationale',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./routes/*.js'], // Chemin vers vos fichiers de routes
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };