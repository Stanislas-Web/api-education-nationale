const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     ProcesVerbalSuspension:
 *       type: object
 *       required:
 *         - codeFormulaire
 *         - identiteAgent
 *         - fauteDisciplinaire
 *       properties:
 *         codeFormulaire:
 *           type: string
 *           default: "A4"
 *         identiteAgent:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *             postnom:
 *               type: string
 *             prenom:
 *               type: string
 *             grade:
 *               type: string
 *             fonction:
 *               type: string
 *         identiteResponsable:
 *           type: object
 *           properties:
 *             titre:
 *               type: string
 *               enum: [Mr, Mme, Mlle]
 *             grade:
 *               type: string
 *             matricule:
 *               type: string
 *             fonction:
 *               type: string
 *         fauteDisciplinaire:
 *           type: string
 *         mesuresConservatoires:
 *           type: string
 *         signature:
 *           type: object
 *           properties:
 *             lieu:
 *               type: string
 *             date:
 *               type: date
 *             inspecteurSignature:
 *               type: string
 *         receptionSignature:
 *           type: object
 *           properties:
 *             lieu:
 *               type: string
 *             date:
 *               type: date
 *             signature:
 *               type: string
 */

const procesVerbalSuspensionSchema = new Schema({
  codeFormulaire: {
    type: String,
    default: "A11",
    immutable: true
  },
  identiteAgent: {
    nom: { type: String, required: true },
    postnom: { type: String, required: true },
    prenom: { type: String },
    grade: { type: String, required: true },
    fonction: { type: String, required: true }
  },
  identiteResponsable: {
    titre: { 
      type: String, 
      enum: ['Mr', 'Mme', 'Mlle'],
      required: true 
    },
    grade: { type: String, required: true },
    matricule: { type: String, required: true },
    fonction: { type: String, required: true }
  },
  fauteDisciplinaire: { type: String, required: true },
  mesuresConservatoires: { type: String, required: true },
  signature: {
    lieu: { type: String, required: true },
    date: { type: Date, required: true },
    inspecteurSignature: { type: String, required: true }
  },
  receptionSignature: {
    lieu: { type: String, required: true },
    date: { type: Date, required: true },
    signature: { type: String, required: true }
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports.ProcesVerbalSuspension = model('ProcesVerbalSuspension', procesVerbalSuspensionSchema);