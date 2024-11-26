const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     InspectionFormation:
 *       type: object
 *       required:
 *         - numeroRapport
 *         - inspecteur
 *         - etablissement
 *         - chefCelluleBase
 *         - unitesPedagogiques
 *         - tenueDossiers
 *       properties:
 *         numeroRapport:
 *           type: string
 *           description: Numéro unique du rapport d'inspection
 *         codeFormulaire:
 *           type: string
 *           default: "C2B"
 *           description: Code du formulaire (C2B)
 *         inspecteur:
 *           type: string
 *           format: uuid
 *           description: Référence à l'inspecteur
 *         etablissement:
 *           type: string
 *           format: uuid
 *           description: Référence à l'établissement
 *         chefCelluleBase:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *             sexe:
 *               type: string
 *               enum: ['M', 'F']
 *             qualification:
 *               type: string
 *             anciennete:
 *               type: string
 *         unitesPedagogiques:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 enum: ['UP1', 'UP2', 'UP3', 'UP4', 'UP5']
 *               nomEducateur:
 *                 type: string
 *               titreEnLigne:
 *                 type: string
 *               qualite:
 *                 type: string
 *                 enum: ['Q', 'SQ']
 *               discipline:
 *                 type: string
 *               nomInspecteur:
 *                 type: string
 *         tenueDossiers:
 *           type: object
 *           properties:
 *             instructionsOfficielles:
 *               type: string
 *             inventairesMF:
 *               type: string
 *             exploitationMF:
 *               type: string
 *             participationSeminaires:
 *               type: string
 *             notesService:
 *               type: string
 *             fcRentree:
 *               type: string
 *             visitesEncadrement:
 *               type: string
 *             leconsDemonstration:
 *               type: string
 *             rapportsReunions:
 *               type: string
 *             rapportsAdministratifs:
 *               type: string
 *             registrePrets:
 *               type: string
 *             collaborationInterscolaire:
 *               type: string
 *             correspondance:
 *               type: string
 *             classementRapports:
 *               type: string
 *             planOperations:
 *               type: string
 *         dateInspection:
 *           type: Date
 *           default: Date.now
 *           description: Date de l'inspection
 */

const inspectionFormationSchema = new Schema({
  numeroRapport: {
    type: String,
    required: true,
    unique: true
  },
  codeFormulaire: {
    type: String,
    default: "C2B"
  },
  inspecteur: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  etablissement: {
    type: Schema.Types.ObjectId,
    ref: 'Ecole',
    required: true
  },
  chefCelluleBase: {
    nom: String,
    sexe: {
      type: String,
      enum: ['M', 'F']
    },
    qualification: String,
    anciennete: String
  },
  unitesPedagogiques: [{
    code: {
      type: String,
      enum: ['UP1', 'UP2', 'UP3', 'UP4', 'UP5']
    },
    nomEducateur: String,
    titreEnLigne: String,
    qualite: {
      type: String,
      enum: ['Q', 'SQ']
    },
    discipline: String,
    nomInspecteur: String
  }],
  tenueDossiers: {
    instructionsOfficielles: String,
    inventairesMF: String,
    exploitationMF: String,
    participationSeminaires: String,
    notesService: String,
    fcRentree: String,
    visitesEncadrement: String,
    leconsDemonstration: String,
    rapportsReunions: String,
    rapportsAdministratifs: String,
    registrePrets: String,
    collaborationInterscolaire: String,
    correspondance: String,
    classementRapports: String,
    planOperations: String
  },
  etatFormationContinue: {
    participationEnseignants: {
      type: Number,
      min: 0,
      max: 4
    },
    moyensFormation: {
      type: Number,
      min: 0,
      max: 4
    },
    materielFormation: {
      type: Number,
      min: 0,
      max: 4
    },
    observations: String
  },
  conseilsFormationContinue: {
    fcQualifies: String,
    fcSousQualifies: String,
    conseilsFonctionnementCelluleBase: String
  },
  appreciationSynthetique: String,
  signatureCCB: String,
  dateInspection: {
    type: Date,
    default: Date.now
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// Middleware pre-save pour mettre à jour dateModification
inspectionFormationSchema.pre('save', function(next) {
  this.dateModification = new Date();
  next();
});

const InspectionFormation = model('InspectionFormation', inspectionFormationSchema);

module.exports = InspectionFormation;