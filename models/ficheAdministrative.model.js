const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     FicheAdministrative:
 *       type: object
 *       required:
 *         - etablissement
 *         - structureEtPeuplement
 *         - idDirection
 *         - idSousDirection
 *       properties:
 *         idSousDirection:
 *           type: string
 *           description: id de la sous direction 
 *         idDirection:
 *           type: string
 *           description: id de la direction
 *         etablissement:
 *           type: string
 *           description: Référence à l'ID de l'école.
 *         destinateurs:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des IDs des utilisateurs destinataires du formulaire.
 *         createdBy:
 *           type: string
 *           description: ID de l'utilisateur ayant créé le formulaire.
 *         code:
 *           type: string
 *           description: Code du formulaire, toujours "A1".
 *           default: "A1"
 *         structureEtPeuplement:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               niveau:
 *                 type: string
 *                 description: Niveau d'enseignement.
 *               classes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     classe:
 *                       type: string
 *                       description: Nom ou numéro de la classe.
 *                     nombreElevesGarcons:
 *                       type: integer
 *                       description: Nombre de garçons.
 *                     nombreElevesFilles:
 *                       type: integer
 *                       description: Nombre de filles.
 *         personnel:
 *           type: object
 *           properties:
 *             enseignant:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   autorise:
 *                     type: integer
 *                     description: Nombre d'enseignants autorisés.
 *                   employe:
 *                     type: integer
 *                     description: Nombre d'enseignants employés.
 *                   manque:
 *                     type: integer
 *                     description: Nombre d'enseignants manquants.
 *             administratif:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   autorise:
 *                     type: integer
 *                     description: Nombre de personnels administratifs autorisés.
 *                   employe:
 *                     type: integer
 *                     description: Nombre de personnels administratifs employés.
 *                   manque:
 *                     type: integer
 *                     description: Nombre de personnels administratifs manquants.
 *         miseEnPlace:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               nomPostNom:
 *                 type: string
 *                 description: Nom et post-nom de la personne.
 *               sexe:
 *                 type: string
 *                 enum: [M, F]
 *                 description: Sexe de la personne.
 *               age:
 *                 type: integer
 *                 description: Âge de la personne.
 *               secope:
 *                 type: string
 *                 description: SECOPE de la personne.
 *               qualif:
 *                 type: string
 *                 description: Qualification de la personne.
 *               cin:
 *                 type: string
 *                 description: CIN de la personne.
 *               fonction:
 *                 type: string
 *                 description: Fonction générale à l'école.
 *               dateEntree:
 *                 type: string
 *                 description: Date d'entrée en fonction.
 *               dateSortie:
 *                 type: string
 *                 description: Date de sortie.
 *               autresInfos:
 *                 type: object
 *                 properties:
 *                   dernierAncien:
 *                     type: string
 *                     description: Dernière fonction précédente.
 *                   motifMutation:
 *                     type: string
 *                     description: Motif de la mutation.
 *                   autres:
 *                     type: string
 *                     description: Autres informations.
 */
const ficheAdministrativeSchema = new Schema({
  idSousDirection: {
    type: Schema.Types.ObjectId,
    ref: 'SousDirection',
    required: true,
  },
  idDirection: {
    type: Schema.Types.ObjectId,
    ref: 'Direction',
    required: true,
  },
  etablissement: {
    type: Schema.Types.ObjectId,
    ref: 'Ecole',
    required: true,
  },
  destinateurs: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  code: {
    type: String,
    default: "A1",
    immutable: true, // Pour rendre le champ code immuable
  },
  structureEtPeuplement: [
    {
      niveau: { type: String, required: true },
      classes: [
        {
          classe: { type: String, required: true },
          nombreElevesGarcons: { type: Number, default: 0 },
          nombreElevesFilles: { type: Number, default: 0 }
        }
      ]
    }
  ],
  personnel: {
    enseignant: [
      {
        autorise: { type: Number, default: 0 },
        employe: { type: Number, default: 0 },
        manque: { type: Number, default: 0 }
      }
    ],
    administratif: [
      {
        autorise: { type: Number, default: 0 },
        employe: { type: Number, default: 0 },
        manque: { type: Number, default: 0 }
      }
    ]
  },
  miseEnPlace: [
    {
      nomPostNom: { type: String, required: true },
      sexe: { type: String, enum: ['M', 'F'], required: true },
      age: { type: Number },
      secope: { type: String },
      qualif: { type: String },
      cin: { type: String },
      fonction: { type: String },
      dateEntree: { type: String, required: true},
      dateSortie: { type: String, required: true},
      autresInfos: {
        dernierAncien: { type: String, required: true},
        motifMutation: { type: String, required: true},
        autres: { type: String }
      }
    }
  ]
}, { timestamps: true, versionKey: false });

module.exports.FicheAdministrative = model('FicheAdministrative', ficheAdministrativeSchema);
