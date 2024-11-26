const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     EnqueteViabilite:
 *       type: object
 *       required:
 *         - numeroRapport
 *         - inspecteur
 *         - etablissement
 *       properties:
 *         numeroRapport:
 *           type: string
 *           description: Numéro unique du rapport d'enquête
 *         codeFormulaire:
 *           type: string
 *           default: "C6B"
 *           description: Code du formulaire (C6B)
 *         inspecteur:
 *           type: string
 *           format: uuid
 *           description: Référence à l'inspecteur
 *         etablissement:
 *           type: string
 *           format: uuid
 *           description: Référence à l'établissement
 *         donneur:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *             fonction:
 *               type: string
 *             date:
 *               type: date
 *             reference:
 *               type: string
 *         promoteur:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *             telephone:
 *               type: string
 *             adresse:
 *               type: string
 *         informationsEtablissement:
 *           type: object
 *           properties:
 *             adresse:
 *               type: string
 *             proprieteLieux:
 *               type: string
 *             autorisationOuverture:
 *               type: string
 *             arreteAgrement:
 *               type: string
 *             natureLocaux:
 *               type: string
 *             dateOuverture:
 *               type: string
 *             nomChefEtablissement:
 *               type: string
 *             titreInstitution:
 *               type: string
 *             identiteResponsablePedagogique:
 *               type: string
 *             depotBancaire:
 *               type: object
 *               properties:
 *                 date:
 *                   type: date
 *                 montant:
 *                   type: number
 *         evaluationAnalytique:
 *           type: object
 *           properties:
 *             implantation:
 *               type: object
 *               properties:
 *                 environnementPhysique:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 environnementSocial:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 environnementPedagogique:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 echangeInterscolaire:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 developpementComm:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 relationParents:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 relationAutorites:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *             patrimoine:
 *               type: object
 *               properties:
 *                 etatParcelle:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 etatBatiments:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 etatMobiliers:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 etatEquipements:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 etatSanitaires:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 entretienGeneral:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 emballageGeneral:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 documentsCadastres:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 bibliotheque:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *             structure:
 *               type: object
 *               properties:
 *                 planType:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 dispositionClasses:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 sallesClasses:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 pyramideScolaire:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 repartitionClasses:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 nombreBancs:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 ventilationApp:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *             personnel:
 *               type: object
 *               properties:
 *                 qualification:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 assiduite:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 disponibilite:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conduite:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 collaboration:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 autoFormation:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 encadrementPedagogique:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *             administration:
 *               type: object
 *               properties:
 *                 planBureau:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 classementDossiers:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 decisionsBudget:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 documentsPedagogiques:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 archivesAdministratives:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 transparence:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *             pedagogie:
 *               type: object
 *               properties:
 *                 programmeCours:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 planificationLecons:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 encadrementPedagogique:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 travailEnseignants:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 reunionsAnalyse:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 evaluationEleves:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 comitesParents:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *         conclusion:
 *           type: string
 *           enum: ['VIABLE', 'A PARFAIRE', 'NON VIABLE']
 *           description: Conclusion de l'enquête
 *         annexes:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des documents annexés
 *         signatureInspecteur:
 *           type: string
 *           description: Signature de l'inspecteur
 *         dateEnquete:
 *           type: Date
 *           default: Date.now
 *           description: Date de l'enquête
 */

const enqueteViabiliteSchema = new Schema({
  numeroRapport: {
    type: String,
    required: true,
    unique: true
  },
  codeFormulaire: {
    type: String,
    default: "C6B"
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
  donneur: {
    nom: String,
    fonction: String,
    date: Date,
    reference: String
  },
  promoteur: {
    nom: String,
    telephone: String,
    adresse: String
  },
  informationsEtablissement: {
    adresse: String,
    proprieteLieux: String,
    autorisationOuverture: String,
    arreteAgrement: String,
    natureLocaux: String,
    dateOuverture: String,
    nomChefEtablissement: String,
    titreInstitution: String,
    identiteResponsablePedagogique: String,
    depotBancaire: {
      date: Date,
      montant: Number
    }
  },
  evaluationAnalytique: {
    implantation: {
      environnementPhysique: { type: Number, min: 0, max: 4 },
      environnementSocial: { type: Number, min: 0, max: 4 },
      environnementPedagogique: { type: Number, min: 0, max: 4 },
      echangeInterscolaire: { type: Number, min: 0, max: 4 },
      developpementComm: { type: Number, min: 0, max: 4 },
      relationParents: { type: Number, min: 0, max: 4 },
      relationAutorites: { type: Number, min: 0, max: 4 }
    },
    patrimoine: {
      etatParcelle: { type: Number, min: 0, max: 4 },
      etatBatiments: { type: Number, min: 0, max: 4 },
      etatMobiliers: { type: Number, min: 0, max: 4 },
      etatEquipements: { type: Number, min: 0, max: 4 },
      etatSanitaires: { type: Number, min: 0, max: 4 },
      entretienGeneral: { type: Number, min: 0, max: 4 },
      emballageGeneral: { type: Number, min: 0, max: 4 },
      documentsCadastres: { type: Number, min: 0, max: 4 },
      bibliotheque: { type: Number, min: 0, max: 4 }
    },
    structure: {
      planType: { type: Number, min: 0, max: 4 },
      dispositionClasses: { type: Number, min: 0, max: 4 },
      sallesClasses: { type: Number, min: 0, max: 4 },
      pyramideScolaire: { type: Number, min: 0, max: 4 },
      repartitionClasses: { type: Number, min: 0, max: 4 },
      nombreBancs: { type: Number, min: 0, max: 4 },
      ventilationApp: { type: Number, min: 0, max: 4 }
    },
    personnel: {
      qualification: { type: Number, min: 0, max: 4 },
      assiduite: { type: Number, min: 0, max: 4 },
      disponibilite: { type: Number, min: 0, max: 4 },
      conduite: { type: Number, min: 0, max: 4 },
      collaboration: { type: Number, min: 0, max: 4 },
      autoFormation: { type: Number, min: 0, max: 4 },
      encadrementPedagogique: { type: Number, min: 0, max: 4 }
    },
    administration: {
      planBureau: { type: Number, min: 0, max: 4 },
      classementDossiers: { type: Number, min: 0, max: 4 },
      decisionsBudget: { type: Number, min: 0, max: 4 },
      documentsPedagogiques: { type: Number, min: 0, max: 4 },
      archivesAdministratives: { type: Number, min: 0, max: 4 },
      transparence: { type: Number, min: 0, max: 4 }
    },
    pedagogie: {
      programmeCours: { type: Number, min: 0, max: 4 },
      planificationLecons: { type: Number, min: 0, max: 4 },
      encadrementPedagogique: { type: Number, min: 0, max: 4 },
      travailEnseignants: { type: Number, min: 0, max: 4 },
      reunionsAnalyse: { type: Number, min: 0, max: 4 },
      evaluationEleves: { type: Number, min: 0, max: 4 },
      comitesParents: { type: Number, min: 0, max: 4 }
    }
  },
  conclusion: {
    type: String,
    enum: ['VIABLE', 'A PARFAIRE', 'NON VIABLE'],
    required: true
  },
  annexes: [String],
  signatureInspecteur: String,
  dateEnquete: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = model('EnqueteViabilite', enqueteViabiliteSchema);