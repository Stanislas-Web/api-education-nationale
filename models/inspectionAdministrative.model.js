const { Schema, model } = require('mongoose');


/**
 * @swagger
 * components:
 *   schemas:
 *     InspectionAdministrative:
 *       type: object
 *       required:
 *         - numeroRapport
 *         - etablissement
 *         - nomChefEtablissement
 *         - descriptionEntite
 *         - gestionPatrimoine
 *         - gestionPedagogique
 *         - gestionAdministrative
 *         - evaluationSynthetique
 *         - appreciationFinale
 *         - signatureInspecteur
 *         - signatureChefEtablissement
 *       properties:
 *         numeroRapport:
 *           type: string
 *           description: Numéro unique du rapport d'inspection
 *         etablissement:
 *           type: string
 *           description: Nom de l'établissement inspecté
 *         nomChefEtablissement:
 *           type: string
 *           description: Nom du chef d'établissement
 *         dateInspection:
 *           type: string
 *           format: date
 *           description: Date de l'inspection
 */


const inspectionAdministrativeSchema = new Schema({
  numeroRapport: {
    type: String,
    required: true,
    unique: true,
    description: "Numéro unique du rapport d'inspection"
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
  nomChefEtablissement: {
    type: String,
    required: true,
    description: "Nom du chef d'établissement"
  },
  dateInspection: {
    type: Date,
    default: Date.now,
    description: "Date de l'inspection"
  },
  descriptionEntite: {
    type: String,
    required: true
  },
  gestionPatrimoine: {
    type: String,
    required: true
  },
  gestionPedagogique: {
    type: String,
    required: true
  },
  gestionAdministrative: {
    type: String,
    required: true
  },
  evaluationSynthetique: {
    type: String,
    required: true
  },
  appreciationFinale: {
    type: String,
    required: true
  },
  signatureInspecteur: {
    type: String,
    required: true
  },
  signatureChefEtablissement: {
    type: String,
    required: true
  },
  codeFormulaire: {
    type: String,
    default: "C2",
    description: "Code du formulaire (C2)"
  }
}, {
  timestamps: true
});

module.exports = model('InspectionAdministrative', inspectionAdministrativeSchema);
