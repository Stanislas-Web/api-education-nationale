const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const UserRouter = require('./routers/user.router');

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
        url: 'http://134.122.23.150/api/v1',
        // url: 'http://localhost/api/v1',
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./routers/*.js', './models/*.js'], // Assurez-vous que ces chemins sont corrects
};



const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use(cors());
app.use(express.json());

// Middleware Swagger
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/api/v1/', UserRouter);

module.exports = app;
