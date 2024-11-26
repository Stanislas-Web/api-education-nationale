const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     InspectionPedagogiqueMat:
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
 *           default: "C3M"
 *           description: Code du formulaire (C3M)
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
 *               activite:
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
 *                 autorite:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 sensResponsabilites:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 assiduite:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 tenueClasse:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 observation:
 *                   type: string
 *                 activitesParascolaires:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             maitriseProgramme:
 *               type: object
 *               properties:
 *                 connaissance:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conformite:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 coordination:
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
 *             structureActivite:
 *               type: object
 *               properties:
 *                 motivation:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 analyse:
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
 *                 didactiqueDiscipline:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 integrationPedagogique:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 faciliteTransmission:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             moyensEnseignement:
 *               type: object
 *               properties:
 *                 brochures:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 materielDidactique:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 utilisationTableau:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 autres:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 materielRecuperatif:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             participationApprenants:
 *               type: object
 *               properties:
 *                 reactivite:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 travailIndividuel:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 travailGroupe:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 activite:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 conseils:
 *                   type: string
 *             documentsApprenants:
 *               type: object
 *               properties:
 *                 cahierExercices:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 travailPratique:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 afficheMurale:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 fichierBricolage:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 cheminementImages:
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
 *                 fichierActivites:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 cahierProgrammation:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 cahierReunions:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 fichierEvaluation:
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
 *                 evaluationReponses:
 *                   type: number
 *                   enum: [0, 1, 2, 3, 4]
 *                 evaluationTests:
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

const inspectionPedagogiqueMatSchema = new Schema({
  numeroRapport: {
    type: String,
    required: true,
    unique: true
  },
  codeFormulaire: {
    type: String,
    default: "C3M"
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
    activite: String,
    classe: String,
    heure: String,
    effectifPH: String,
    sujet: String
  }],
  grilleEvaluation: {
    personnalite: {
      presentation: { type: Number, min: 0, max: 4 },
      elocution: { type: Number, min: 0, max: 4 },
      autorite: { type: Number, min: 0, max: 4 },
      sensResponsabilites: { type: Number, min: 0, max: 4 },
      assiduite: { type: Number, min: 0, max: 4 },
      tenueClasse: { type: Number, min: 0, max: 4 },
      observation: String,
      activitesParascolaires: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    maitriseProgramme: {
      connaissance: { type: Number, min: 0, max: 4 },
      conformite: { type: Number, min: 0, max: 4 },
      coordination: { type: Number, min: 0, max: 4 },
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
    structureActivite: {
      motivation: { type: Number, min: 0, max: 4 },
      analyse: { type: Number, min: 0, max: 4 },
      synthese: { type: Number, min: 0, max: 4 },
      application: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    strategie: {
      didactiqueGenerale: { type: Number, min: 0, max: 4 },
      didactiqueDiscipline: { type: Number, min: 0, max: 4 },
      integrationPedagogique: { type: Number, min: 0, max: 4 },
      faciliteTransmission: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    moyensEnseignement: {
      brochures: { type: Number, min: 0, max: 4 },
      materielDidactique: { type: Number, min: 0, max: 4 },
      utilisationTableau: { type: Number, min: 0, max: 4 },
      autres: { type: Number, min: 0, max: 4 },
      materielRecuperatif: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    participationApprenants: {
      reactivite: { type: Number, min: 0, max: 4 },
      travailIndividuel: { type: Number, min: 0, max: 4 },
      travailGroupe: { type: Number, min: 0, max: 4 },
      activite: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    documentsApprenants: {
      cahierExercices: { type: Number, min: 0, max: 4 },
      travailPratique: { type: Number, min: 0, max: 4 },
      afficheMurale: { type: Number, min: 0, max: 4 },
      fichierBricolage: { type: Number, min: 0, max: 4 },
      cheminementImages: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    documentsEnseignant: {
      previsionsMaterielles: { type: Number, min: 0, max: 4 },
      journalClasse: { type: Number, min: 0, max: 4 },
      fichierActivites: { type: Number, min: 0, max: 4 },
      cahierProgrammation: { type: Number, min: 0, max: 4 },
      cahierReunions: { type: Number, min: 0, max: 4 },
      fichierEvaluation: { type: Number, min: 0, max: 4 },
      documentationEcrite: { type: Number, min: 0, max: 4 },
      registreAppel: { type: Number, min: 0, max: 4 },
      conseils: String
    },
    evaluationAcquis: {
      evaluationProgressive: { type: Number, min: 0, max: 4 },
      evaluationFinale: { type: Number, min: 0, max: 4 },
      atteinteObjectif: { type: Number, min: 0, max: 4 },
      evaluationReponses: { type: Number, min: 0, max: 4 },
      evaluationTests: { type: Number, min: 0, max: 4 },
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

module.exports = model('InspectionPedagogiqueMat', inspectionPedagogiqueMatSchema);