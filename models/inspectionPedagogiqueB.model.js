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
 *           default: "C3B"
 *           description: Code du formulaire (C3B)
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
 *               branche:
 *                 type: string
 *               classe:
 *                 type: string
 *               heure:
 *                 type: string
 *               effectifPH:
 *                 type: string
 *               sujet:
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
 *                 elocution:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 presenceAutorite:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 attitudeResponsabilites:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 assiduite:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 tenueSalle:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 observation:
 *                   type: string
 *                 conseils:
 *                   type: string
 *             maitriseCurricula:
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
 *                 exactitude:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 dosage:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 formulation:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 adaptationNiveaux:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 reponseQuestions:
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
 *                 organisation:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 demonstration:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 execution:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 menage:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 inscriptionJournal:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             strategies:
 *               type: object
 *               properties:
 *                 surveillance:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 controleIndividuel:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 controleGroupe:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 directives:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             moyensEnseignement:
 *               type: object
 *               properties:
 *                 tableau:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 manuels:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 materielDidactique:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 materielExercice:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             documentsEnseignant:
 *               type: object
 *               properties:
 *                 previsionsMaterielles:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 journalClasse:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 fichesLecons:
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
 *                 registreAppel:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             evaluationAcquis:
 *               type: object
 *               properties:
 *                 evaluationProgressive:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 evaluationFinale:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 atteinteObjectif:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 evaluationIndependante:
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
 *                   critere:
 *                     type: string
 *                   note:
 *                     type: number
 *                   max:
 *                     type: number
 *             noteFinale:
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
    default: "C3B"
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
    branche: String,
    classe: String,
    heure: String,
    effectifPH: String,
    sujet: String
  }],
  grilleEvaluation: {
    personnalite: {
      presentation: { type: Number, min: 0, max: 4 },
      elocution: { type: Number, min: 0, max: 4 },
      presenceAutorite: { type: Number, min: 0, max: 4 },
      attitudeResponsabilites: { type: Number, min: 0, max: 4 },
      assiduite: { type: Number, min: 0, max: 4 },
      tenueSalle: { type: Number, min: 0, max: 4 },
      observation: String,
      conseils: String
    },
    maitriseCurricula: {
      competence: { type: Number, min: 0, max: 4 },
      conformite: { type: Number, min: 0, max: 4 },
      progression: { type: Number, min: 0, max: 4 },
      adaptationMilieu: { type: Number, min: 0, max: 4 },
      decomposition: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    maitriseDiscipline: {
      exactitude: { type: Number, min: 0, max: 4 },
      dosage: { type: Number, min: 0, max: 4 },
      formulation: { type: Number, min: 0, max: 4 },
      adaptationNiveaux: { type: Number, min: 0, max: 4 },
      reponseQuestions: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    structureLecon: {
      preparation: { type: Number, min: 0, max: 4 },
      organisation: { type: Number, min: 0, max: 4 },
      demonstration: { type: Number, min: 0, max: 4 },
      execution: { type: Number, min: 0, max: 4 },
      menage: { type: Number, min: 0, max: 4 },
      inscriptionJournal: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    strategies: {
      surveillance: { type: Number, min: 0, max: 4 },
      controleIndividuel: { type: Number, min: 0, max: 4 },
      controleGroupe: { type: Number, min: 0, max: 4 },
      directives: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    moyensEnseignement: {
      tableau: { type: Number, min: 0, max: 4 },
      manuels: { type: Number, min: 0, max: 4 },
      materielDidactique: { type: Number, min: 0, max: 4 },
      materielExercice: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    documentsEnseignant: {
      previsionsMaterielles: { type: Number, min: 0, max: 4 },
      journalClasse: { type: Number, min: 0, max: 4 },
      fichesLecons: { type: Number, min: 0, max: 4 },
      cahierTextes: { type: Number, min: 0, max: 4 },
      cahierPoints: { type: Number, min: 0, max: 4 },
      documentationEcrite: { type: Number, min: 0, max: 4 },
      registreAppel: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    evaluationAcquis: {
      evaluationProgressive: { type: Number, min: 0, max: 4 },
      evaluationFinale: { type: Number, min: 0, max: 4 },
      atteinteObjectif: { type: Number, min: 0, max: 4 },
      evaluationIndependante: { type: Number, min: 0, max: 4 },
      conseils: String
    }
  },
  evaluationSynthetique: {
    grille: [{
      critere: String,
      note: Number,
      max: Number
    }],
    noteFinale: Number
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