const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     ConstatAbsence:
 *       type: object
 *       required:
 *         - codeFormulaire
 *         - identiteEtablissement
 *         - identiteAbsent
 *       properties:
 *         codeFormulaire:
 *           type: string
 *           default: "A5"
 *         identiteEtablissement:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *             bp:
 *               type: string
 *             adresseComplete:
 *               type: string
 *             ecoleDirection:
 *               type: string
 *             poolInspection:
 *               type: string
 *             gestion:
 *               type: string
 *             coordinationSousProvinciale:
 *               type: string
 *         identiteAbsent:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *             matricule:
 *               type: string
 *             fonction:
 *               type: string
 *         dateConstat:
 *           type: object
 *           properties:
 *             date:
 *               type: date
 *             heure:
 *               type: string
 *         nomChefEtablissement:
 *           type: string
 *         observations:
 *           type: string
 *         lettre:
 *           type: object
 *           properties:
 *             auCoordonnateur:
 *               type: boolean
 *             auChefEtablissement:
 *               type: boolean
 *             auProfesseur:
 *               type: boolean
 *         signature:
 *           type: object
 *           properties:
 *             lieu:
 *               type: string
 *             date:
 *               type: date
 *             inspecteurSignature:
 *               type: string
 */

const constatAbsenceSchema = new Schema({
  codeFormulaire: {
    type: String,
    default: "A5",
    immutable: true
  },
  identiteEtablissement: {
    nom: { type: String, required: true },
    bp: { type: String },
    adresseComplete: { type: String },
    ecoleDirection: { type: String },
    poolInspection: { type: String },
    gestion: { type: String },
    coordinationSousProvinciale: { type: String }
  },
  identiteAbsent: {
    nom: { type: String, required: true },
    matricule: { type: String, required: true },
    fonction: { type: String, required: true }
  },
  dateConstat: {
    date: { type: Date, required: true },
    heure: { type: String, required: true }
  },
  nomChefEtablissement: { type: String },
  observations: { type: String },
  lettre: {
    auCoordonnateur: { type: Boolean, default: false },
    auChefEtablissement: { type: Boolean, default: false },
    auProfesseur: { type: Boolean, default: false }
  },
  signature: {
    lieu: { type: String, required: true },
    date: { type: Date, required: true },
    inspecteurSignature: { type: String, required: true }
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports.ConstatAbsence = model('ConstatAbsence', constatAbsenceSchema);