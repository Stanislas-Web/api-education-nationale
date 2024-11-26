const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     InspectionAdjoint:
 *       type: object
 *       required:
 *         - numeroRapport
 *         - inspecteur
 *         - etablissement
 *         - adjoint
 *       properties:
 *         numeroRapport:
 *           type: string
 *           description: Numéro unique du rapport d'inspection
 *         codeFormulaire:
 *           type: string
 *           default: "C6A"
 *           description: Code du formulaire (C6A)
 *         inspecteur:
 *           type: string
 *           format: uuid
 *           description: Référence à l'inspecteur
 *         etablissement:
 *           type: string
 *           format: uuid
 *           description: Référence à l'établissement
 *         adjoint:
 *           type: string
 *           format: uuid
 *           description: Référence à l'adjoint inspecté
 *         conseillerPedagogiquePrimaire:
 *           type: object
 *           properties:
 *             competencesAdministratives:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             competencesGenerales:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             assiduite:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             ponctualite:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             tenueDossiers:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             rapportsActivites:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             fichesVisites:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             notesReunions:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             fichesCotation:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             conseils:
 *               type: string
 *         conseillerPedagogiqueSecondaire:
 *           type: object
 *           properties:
 *             competencesAdministratives:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             competencesGenerales:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             assiduite:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             ponctualite:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             tenueDossiers:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             rapportsActivites:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             fichesVisites:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             notesReunions:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             fichesCotation:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             conseils:
 *               type: string
 *         tachesAdministrativesPrimaire:
 *           type: object
 *           properties:
 *             gestionDossiers:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             organisationClasses:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             gestionPersonnel:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             tenueDossiers:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             gestionPatrimoine:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             controlePedagogique:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             controleDocuments:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             controlePresences:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             activitesParascolaires:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             conseils:
 *               type: string
 *         tachesAdministrativesSecondaire:
 *           type: object
 *           properties:
 *             gestionDossiers:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             organisationClasses:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             gestionPersonnel:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             tenueDossiers:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             gestionPatrimoine:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             controlePedagogique:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             controleDocuments:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             controlePresences:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             activitesParascolaires:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             conseilsClasse:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             reunionsPedagogiques:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             circulairesMF:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             circulairesUP:
 *               type: number
 *               enum: [0, 1, 2, 3, 4]
 *             conseils:
 *               type: string
 *         tableauConversion:
 *           type: object
 *           properties:
 *             elite:
 *               type: string
 *               default: "100 à 80"
 *             tresBon:
 *               type: string
 *               default: "79 à 70"
 *             bon:
 *               type: string
 *               default: "69 à 50"
 *             assezBon:
 *               type: string
 *               default: "49 à 40"
 *             mediocre:
 *               type: string
 *               default: "39 à 0"
 *         appreciationFinale:
 *           type: string
 *           description: Appréciation finale de l'inspection
 *         signatureAdjoint:
 *           type: string
 *           description: Signature de l'adjoint
 *         signatureChefEtablissement:
 *           type: string
 *           description: Signature du chef d'établissement
 *         signatureInspecteur:
 *           type: string
 *           description: Signature de l'inspecteur
 *         dateInspection:
 *           type: string
 *           format: date-time
 *           description: Date de l'inspection
 */

const inspectionAdjointSchema = new Schema({
  numeroRapport: {
    type: String,
    required: true,
    unique: true
  },
  codeFormulaire: {
    type: String,
    default: "C6A"
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
  adjoint: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conseillerPedagogiquePrimaire: {
    competencesAdministratives: { type: Number, min: 0, max: 4 },
    competencesGenerales: { type: Number, min: 0, max: 4 },
    assiduite: { type: Number, min: 0, max: 4 },
    ponctualite: { type: Number, min: 0, max: 4 },
    tenueDossiers: { type: Number, min: 0, max: 4 },
    rapportsActivites: { type: Number, min: 0, max: 4 },
    fichesVisites: { type: Number, min: 0, max: 4 },
    notesReunions: { type: Number, min: 0, max: 4 },
    fichesCotation: { type: Number, min: 0, max: 4 },
    conseils: String
  },
  conseillerPedagogiqueSecondaire: {
    competencesAdministratives: { type: Number, min: 0, max: 4 },
    competencesGenerales: { type: Number, min: 0, max: 4 },
    assiduite: { type: Number, min: 0, max: 4 },
    ponctualite: { type: Number, min: 0, max: 4 },
    tenueDossiers: { type: Number, min: 0, max: 4 },
    rapportsActivites: { type: Number, min: 0, max: 4 },
    fichesVisites: { type: Number, min: 0, max: 4 },
    notesReunions: { type: Number, min: 0, max: 4 },
    fichesCotation: { type: Number, min: 0, max: 4 },
    conseils: String
  },
  tachesAdministrativesPrimaire: {
    gestionDossiers: { type: Number, min: 0, max: 4 },
    organisationClasses: { type: Number, min: 0, max: 4 },
    gestionPersonnel: { type: Number, min: 0, max: 4 },
    tenueDossiers: { type: Number, min: 0, max: 4 },
    gestionPatrimoine: { type: Number, min: 0, max: 4 },
    controlePedagogique: { type: Number, min: 0, max: 4 },
    controleDocuments: { type: Number, min: 0, max: 4 },
    controlePresences: { type: Number, min: 0, max: 4 },
    activitesParascolaires: { type: Number, min: 0, max: 4 },
    conseils: String
  },
  tachesAdministrativesSecondaire: {
    gestionDossiers: { type: Number, min: 0, max: 4 },
    organisationClasses: { type: Number, min: 0, max: 4 },
    gestionPersonnel: { type: Number, min: 0, max: 4 },
    tenueDossiers: { type: Number, min: 0, max: 4 },
    gestionPatrimoine: { type: Number, min: 0, max: 4 },
    controlePedagogique: { type: Number, min: 0, max: 4 },
    controleDocuments: { type: Number, min: 0, max: 4 },
    controlePresences: { type: Number, min: 0, max: 4 },
    activitesParascolaires: { type: Number, min: 0, max: 4 },
    conseilsClasse: { type: Number, min: 0, max: 4 },
    reunionsPedagogiques: { type: Number, min: 0, max: 4 },
    circulairesMF: { type: Number, min: 0, max: 4 },
    circulairesUP: { type: Number, min: 0, max: 4 },
    conseils: String
  },
  tableauConversion: {
    elite: { type: String, default: "100 à 80" },
    tresBon: { type: String, default: "79 à 70" },
    bon: { type: String, default: "69 à 50" },
    assezBon: { type: String, default: "49 à 40" },
    mediocre: { type: String, default: "39 à 0" }
  },
  appreciationFinale: String,
  signatureAdjoint: String,
  signatureChefEtablissement: String,
  signatureInspecteur: String,
  dateInspection: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = model('InspectionAdjoint', inspectionAdjointSchema);