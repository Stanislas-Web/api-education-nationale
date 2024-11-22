const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     ProcesVerbalOuverture:
 *       type: object
 *       required:
 *         - codeFormulaire
 *         - identiteAgent
 *         - identiteResponsable
 *         - fauteDisciplinaire
 *       properties:
 *         codeFormulaire:
 *           type: string
 *           default: "A12"
 *           description: Code du formulaire (A12)
 *         identiteAgent:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *               description: Nom de l'agent
 *             postnom:
 *               type: string
 *               description: Post-nom de l'agent
 *             prenom:
 *               type: string
 *               description: Prénom de l'agent
 *             grade:
 *               type: string
 *               description: Grade de l'agent
 *             fonction:
 *               type: string
 *               description: Fonction de l'agent
 *         identiteResponsable:
 *           type: object
 *           properties:
 *             titre:
 *               type: string
 *               enum: [Mr, Mme, Mlle]
 *               description: Titre du responsable
 *             grade:
 *               type: string
 *               description: Grade du responsable
 *             matricule:
 *               type: string
 *               description: Numéro matricule
 *             fonction:
 *               type: string
 *               description: Fonction du responsable
 *         fauteDisciplinaire:
 *           type: string
 *           description: Description détaillée de la faute disciplinaire
 *         delaiJustification:
 *           type: string
 *           description: Délai pour présenter les justifications écrites
 *         signature:
 *           type: object
 *           properties:
 *             lieu:
 *               type: string
 *               description: Lieu de signature
 *             date:
 *               type: date
 *               description: Date de signature
 *             inspecteurSignature:
 *               type: string
 *               description: Signature de l'inspecteur
 *         receptionSignature:
 *           type: object
 *           properties:
 *             lieu:
 *               type: string
 *               description: Lieu de réception
 *             date:
 *               type: date
 *               description: Date de réception
 *             signature:
 *               type: string
 *               description: Signature de réception
 */

const procesVerbalOuvertureSchema = new Schema({
  codeFormulaire: {
    type: String,
    default: "A12",
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
  fauteDisciplinaire: { 
    type: String, 
    required: true 
  },
  delaiJustification: { 
    type: String,
    required: true 
  },
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

module.exports.ProcesVerbalOuverture = model('ProcesVerbalOuverture', procesVerbalOuvertureSchema);