const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const UserRouter = require('./routers/user.route.js');
const ProvinceRouter = require('./routers/province.route.js');
const DirectionRouter = require('./routers/direction.route');
const SousDirectionRouter = require('./routers/sousDirection.route.js');
const ServiceRouter = require('./routers/service.route');
const EcoleRouter = require('./routers/ecole.route');
const EleveRouter = require('./routers/eleve.route');
const PersonnelRouter = require('./routers/personnel.route.js');
const BesoinRessourceRouter = require('./routers/besoinRessource.route.js');
const EffectifRouter = require('./routers/effectif.route.js');
const PresenceRouter = require('./routers/presence.route.js');
const ResultatScolaireRouter = require('./routers/resultatScolaire.route.js');
const PermissionRouter = require('./routers/permission.route.js');
const InfrastructureRouter = require('./routers/infras.route.js');
const EquipementRouter = require('./routers/equipement.route.js');
const CommissionRouter = require('./routers/commission.route.js');
const AnnonceRouter = require('./routers/annonce.route.js');
const TypeFormulaireRouter = require('./routers/typeFormulaire.route.js');
const FormulaireRouter = require('./routers/formulaire.route.js');
const ficheAdministrativeRouter = require('./routers/ficheAdministrative.route.js');
const denominationRouter = require('./routers/denomination.route.js');
const premiereVisiteRouter = require('./routers/premiereVisite.route.js');
const inspectionPedagogiqueRouter = require('./routers/inspectionPedagogique.route.js');
const disciplineRouter = require('./routers/discipline.route.js');
const rapportActiviteRouter = require('./routers/rapportActivite.route.js');
const identificationProvedRouter = require('./routers/identificationProved.route.js');
const provedAuthRouter = require('./routers/provedAuth.route.js');


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


// Middleware Swagger Docs (doit être avant les routes protégées)
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/api/v1/', UserRouter, ProvinceRouter, DirectionRouter, SousDirectionRouter, ServiceRouter, EcoleRouter, EleveRouter, PersonnelRouter, BesoinRessourceRouter, EffectifRouter, PresenceRouter, ResultatScolaireRouter, PermissionRouter, InfrastructureRouter, EquipementRouter, CommissionRouter, AnnonceRouter, TypeFormulaireRouter, FormulaireRouter, ficheAdministrativeRouter, denominationRouter, premiereVisiteRouter, inspectionPedagogiqueRouter, disciplineRouter, rapportActiviteRouter, identificationProvedRouter);
app.use('/api/v1/proved', provedAuthRouter);

module.exports = app;
