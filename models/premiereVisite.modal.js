const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     PremiereVisite:
 *       type: object
 *       required:
 *         - codeFormulaire
 *         - inspecteur
 *         - etablissement
 *         - signature
 *       properties:
 *         codeFormulaire:
 *           type: string
 *           default: "C1"
 *           description: Code du formulaire (C1)
 *         inspecteur:
 *           type: string
 *           format: uuid
 *           description: ID de l'inspecteur (référence à User)
 *         etablissement:
 *           type: string
 *           format: uuid
 *           description: ID de l'établissement (référence à Ecole)
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
 *               $ref: '#/components/schemas/Poste'
 *             batiments:
 *               $ref: '#/components/schemas/Poste'
 *             equipements:
 *               $ref: '#/components/schemas/Poste'
 *             moyensEnseignement:
 *               $ref: '#/components/schemas/Poste'
 *             personnel:
 *               $ref: '#/components/schemas/Poste'
 *             apprenants:
 *               $ref: '#/components/schemas/Poste'
 *             administration:
 *               $ref: '#/components/schemas/Poste'
 *             organisationPedagogique:
 *               $ref: '#/components/schemas/Poste'
 *             finances:
 *               $ref: '#/components/schemas/Poste'
 *             internet:
 *               $ref: '#/components/schemas/Poste'
 *         rapportCirconstancie:
 *           type: string
 *           description: Rapport circonstancié pour complément d'information
 *         signature:
 *           type: object
 *           required:
 *             - lieu
 *             - date
 *             - chefEtablissementSignature
 *             - inspecteurSignature
 *           properties:
 *             lieu:
 *               type: string
 *               description: Lieu de signature
 *             date:
 *               type: string
 *               format: date
 *               description: Date de signature
 *             chefEtablissementSignature:
 *               type: string
 *               description: Signature du chef d'établissement
 *             inspecteurSignature:
 *               type: string
 *               description: Signature de l'inspecteur
 *             sceauEtablissement:
 *               type: boolean
 *               default: false
 *               description: Présence du sceau de l'établissement
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière modification
 *     Poste:
 *       type: object
 *       properties:
 *         constatsProblemes:
 *           type: string
 *           description: Constatations et problèmes identifiés
 *         solutionsProposees:
 *           type: string
 *           description: Solutions proposées
 */

const posteSchema = new Schema({
  constatsProblemes: { type: String },
  solutionsProposees: { type: String }
});

const premiereVisiteSchema = new Schema({
  codeFormulaire: {
    type: String,
    default: "C1",
    immutable: true
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
  nomChefEtablissement: { type: String },
  telephone: { type: String },
  postes: {
    parcelle: posteSchema,
    batiments: posteSchema,
    equipements: posteSchema,
    moyensEnseignement: posteSchema,
    personnel: posteSchema,
    apprenants: posteSchema,
    administration: posteSchema,
    organisationPedagogique: posteSchema,
    finances: posteSchema,
    internet: posteSchema
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

module.exports = model('PremiereVisite', premiereVisiteSchema);