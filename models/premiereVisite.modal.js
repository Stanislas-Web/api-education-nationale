const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     PremiereVisite:
 *       type: object
 *       required:
 *         - codeFormulaire
 *         - postes
 *       properties:
 *         codeFormulaire:
 *           type: string
 *           default: "C1"
 *           description: Code du formulaire (C1)
 *         inspecteur:
 *           type: string
 *           description: Nom de l'inspecteur
 *         etablissement:
 *           type: string
 *           description: Nom de l'établissement
 *         nomChefEtablissement:
 *           type: string
 *           description: Nom du chef d'établissement
 *         telephone:
 *           type: string
 *           description: Numéro de téléphone
 *         postes:
 *           type: object
 *           properties:
 *             parcelle:
 *               type: object
 *               properties:
 *                 constatsProblemes:
 *                   type: string
 *                 solutionsProposees:
 *                   type: string
 *             batiments:
 *               type: object
 *               properties:
 *                 constatsProblemes:
 *                   type: string
 *                 solutionsProposees:
 *                   type: string
 *             equipements:
 *               type: object
 *               properties:
 *                 constatsProblemes:
 *                   type: string
 *                 solutionsProposees:
 *                   type: string
 *             moyensEnseignement:
 *               type: object
 *               properties:
 *                 constatsProblemes:
 *                   type: string
 *                 solutionsProposees:
 *                   type: string
 *             personnel:
 *               type: object
 *               properties:
 *                 constatsProblemes:
 *                   type: string
 *                 solutionsProposees:
 *                   type: string
 *             apprenants:
 *               type: object
 *               properties:
 *                 constatsProblemes:
 *                   type: string
 *                 solutionsProposees:
 *                   type: string
 *             administration:
 *               type: object
 *               properties:
 *                 constatsProblemes:
 *                   type: string
 *                 solutionsProposees:
 *                   type: string
 *             organisationPedagogique:
 *               type: object
 *               properties:
 *                 constatsProblemes:
 *                   type: string
 *                 solutionsProposees:
 *                   type: string
 *             finances:
 *               type: object
 *               properties:
 *                 constatsProblemes:
 *                   type: string
 *                 solutionsProposees:
 *                   type: string
 *             internet:
 *               type: object
 *               properties:
 *                 constatsProblemes:
 *                   type: string
 *                 solutionsProposees:
 *                   type: string
 *         rapportCirconstancie:
 *           type: string
 *           description: Rapport circonstancié pour complément d'information
 *         signature:
 *           type: object
 *           properties:
 *             lieu:
 *               type: string
 *               description: Lieu de signature
 *             date:
 *               type: date
 *               description: Date de signature
 *             chefEtablissementSignature:
 *               type: string
 *               description: Signature du chef d'établissement
 *             inspecteurSignature:
 *               type: string
 *               description: Signature de l'inspecteur
 *             sceauEtablissement:
 *               type: boolean
 *               description: Présence du sceau de l'établissement
 */

const premiereVisiteSchema = new Schema({
  codeFormulaire: {
    type: String,
    default: "C1",
    immutable: true
  },
  inspecteur: { type: String },
  etablissement: { type: String },
  nomChefEtablissement: { type: String },
  telephone: { type: String },
  postes: {
    parcelle: {
      constatsProblemes: { type: String },
      solutionsProposees: { type: String }
    },
    batiments: {
      constatsProblemes: { type: String },
      solutionsProposees: { type: String }
    },
    equipements: {
      constatsProblemes: { type: String },
      solutionsProposees: { type: String }
    },
    moyensEnseignement: {
      constatsProblemes: { type: String },
      solutionsProposees: { type: String }
    },
    personnel: {
      constatsProblemes: { type: String },
      solutionsProposees: { type: String }
    },
    apprenants: {
      constatsProblemes: { type: String },
      solutionsProposees: { type: String }
    },
    administration: {
      constatsProblemes: { type: String },
      solutionsProposees: { type: String }
    },
    organisationPedagogique: {
      constatsProblemes: { type: String },
      solutionsProposees: { type: String }
    },
    finances: {
      constatsProblemes: { type: String },
      solutionsProposees: { type: String }
    },
    internet: {
      constatsProblemes: { type: String },
      solutionsProposees: { type: String }
    }
  },
  rapportCirconstancie: { type: String },
  signature: {
    lieu: { type: String, required: true },
    date: { type: Date, required: true },
    chefEtablissementSignature: { type: String, required: true },
    inspecteurSignature: { type: String, required: true },
    sceauEtablissement: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports.PremiereVisite = model('PremiereVisite', premiereVisiteSchema);