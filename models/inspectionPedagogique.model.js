const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     InspectionPedagogique:
 *       type: object
 *       required:
 *         - numeroRapport
 *         - inspecteur
 *         - etablissement
 *         - enseignant
 *       properties:
 *         numeroRapport:
 *           type: string
 *           description: Numéro unique du rapport d'inspection
 *         codeFormulaire:
 *           type: string
 *           default: "C3"
 *           description: Code du formulaire (C3)
 *         inspecteur:
 *           type: string
 *           format: uuid
 *           description: Référence à l'inspecteur
 *         etablissement:
 *           type: string
 *           format: uuid
 *           description: Référence à l'établissement
 *         enseignant:
 *           type: string
 *           format: uuid
 *           description: Référence à l'enseignant inspecté
 *         activitesInspectees:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               discipline:
 *                 type: string
 *               classe:
 *                 type: string
 *               lecon:
 *                 type: string
 *               duree:
 *                 type: string
 *         grilleEvaluation:
 *           type: object
 *           properties:
 *             personnalite:
 *               type: object
 *               properties:
 *                 presentation:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 autorite:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 elocution:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 attitude:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 tenueSalle:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 tenueTableau:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 presenceEsprit:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             maitriseProgramme:
 *               type: object
 *               properties:
 *                 competence:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conformite:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 progression:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 adaptationMilieu:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 decomposition:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             maitriseDiscipline:
 *               type: object
 *               properties:
 *                 connaissanceMatiere:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 exactitude:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 dosage:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 formulation:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 adaptation:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             structureLecon:
 *               type: object
 *               properties:
 *                 preparation:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 motivation:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 verificationJournal:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 developpement:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 evaluation:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 synthese:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 application:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             strategie:
 *               type: object
 *               properties:
 *                 didactiqueGenerale:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 distribution:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 integrationPedagogique:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 facilitePedagogique:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             moyensEnseignement:
 *               type: object
 *               properties:
 *                 materielDidactique:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 materielSpecifique:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 utilisationTableau:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             documentsApprenants:
 *               type: object
 *               properties:
 *                 cahierLecons:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 cahierExercices:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 fiches:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             documentsEnseignant:
 *               type: object
 *               properties:
 *                 previsions:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 journalClasse:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 fichesPrep:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 cahierTextes:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 cahierPoints:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 documentationEcrite:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             evaluationAcquis:
 *               type: object
 *               properties:
 *                 assiduite:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 evaluationDiagnostique:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 evaluationFormative:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 rattrapage:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 evaluationSommative:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *         evaluationSynthetique:
 *           type: object
 *           properties:
 *             grille:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   niveau:
 *                     type: string
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *             total:
 *               type: number
 *         signatureEnseignant:
 *           type: string
 *           description: Signature de l'enseignant
 *         signatureChefEtablissement:
 *           type: string
 *           description: Signature du chef d'établissement
 *         signatureInspecteur:
 *           type: string
 *           description: Signature de l'inspecteur
 *         dateInspection:
 *           type: Date
 *           default: Date.now
 *           description: Date de l'inspection
 */

const inspectionPedagogiqueSchema = new Schema({
  numeroRapport: {
    type: String,
    required: true,
    unique: true
  },
  codeFormulaire: {
    type: String,
    default: "C3"
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
  enseignant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activitesInspectees: [{
    discipline: String,
    classe: String,
    lecon: String,
    duree: String
  }],
  grilleEvaluation: {
    personnalite: {
      presentation: { type: Number, min: 0, max: 4 },
      autorite: { type: Number, min: 0, max: 4 },
      elocution: { type: Number, min: 0, max: 4 },
      attitude: { type: Number, min: 0, max: 4 },
      tenueSalle: { type: Number, min: 0, max: 4 },
      tenueTableau: { type: Number, min: 0, max: 4 },
      presenceEsprit: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    maitriseProgramme: {
      competence: { type: Number, min: 0, max: 4 },
      conformite: { type: Number, min: 0, max: 4 },
      progression: { type: Number, min: 0, max: 4 },
      adaptationMilieu: { type: Number, min: 0, max: 4 },
      decomposition: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    maitriseDiscipline: {
      connaissanceMatiere: { type: Number, min: 0, max: 4 },
      exactitude: { type: Number, min: 0, max: 4 },
      dosage: { type: Number, min: 0, max: 4 },
      formulation: { type: Number, min: 0, max: 4 },
      adaptation: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    structureLecon: {
      preparation: { type: Number, min: 0, max: 4 },
      motivation: { type: Number, min: 0, max: 4 },
      verificationJournal: { type: Number, min: 0, max: 4 },
      developpement: { type: Number, min: 0, max: 4 },
      evaluation: { type: Number, min: 0, max: 4 },
      synthese: { type: Number, min: 0, max: 4 },
      application: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    strategie: {
      didactiqueGenerale: { type: Number, min: 0, max: 4 },
      distribution: { type: Number, min: 0, max: 4 },
      integrationPedagogique: { type: Number, min: 0, max: 4 },
      facilitePedagogique: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    moyensEnseignement: {
      materielDidactique: { type: Number, min: 0, max: 4 },
      materielSpecifique: { type: Number, min: 0, max: 4 },
      utilisationTableau: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    documentsApprenants: {
      cahierLecons: { type: Number, min: 0, max: 4 },
      cahierExercices: { type: Number, min: 0, max: 4 },
      fiches: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    documentsEnseignant: {
      previsions: { type: Number, min: 0, max: 4 },
      journalClasse: { type: Number, min: 0, max: 4 },
      fichesPrep: { type: Number, min: 0, max: 4 },
      cahierTextes: { type: Number, min: 0, max: 4 },
      cahierPoints: { type: Number, min: 0, max: 4 },
      documentationEcrite: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    evaluationAcquis: {
      assiduite: { type: Number, min: 0, max: 4 },
      evaluationDiagnostique: { type: Number, min: 0, max: 4 },
      evaluationFormative: { type: Number, min: 0, max: 4 },
      rattrapage: { type: Number, min: 0, max: 4 },
      evaluationSommative: { type: Number, min: 0, max: 4 },
      conseils: String
    }
  },
  evaluationSynthetique: {
    grille: [{
      niveau: String,
      min: Number,
      max: Number
    }],
    total: Number
  },
  signatureEnseignant: String,
  signatureChefEtablissement: String,
  signatureInspecteur: String,
  dateInspection: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = model('InspectionPedagogique', inspectionPedagogiqueSchema);