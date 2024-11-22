const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     BordereauTransmission:
 *       type: object
 *       required:
 *         - codeFormulaire
 *         - documents
 *       properties:
 *         codeFormulaire:
 *           type: string
 *           default: "A6"
 *         documents:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               nombre:
 *                 type: string
 *               numeroThematique:
 *                 type: string
 *         recepisse:
 *           type: object
 *           properties:
 *             conforme:
 *               type: boolean
 *             destinataires:
 *               type: object
 *               properties:
 *                 inspecteur:
 *                   type: boolean
 *                 etablissement:
 *                   type: boolean
 *                 ipe:
 *                   type: boolean
 *                 sousProved:
 *                   type: boolean
 *                 proved:
 *                   type: boolean
 *                 coordProvincial:
 *                   type: boolean
 *                 sernie:
 *                   type: boolean
 *                 secope:
 *                   type: boolean
 *                 classement:
 *                   type: boolean
 *         informationsRecepisse:
 *           type: object
 *           properties:
 *             inspecteur:
 *               type: string
 *             niveauDiscipline:
 *               type: string
 *             posteAttache:
 *               type: string
 *             bp:
 *               type: string
 *             telephone:
 *               type: string
 *             email:
 *               type: string
 *             anneesScolaire:
 *               type: string
 *             rapport:
 *               type: string
 *         signature:
 *           type: object
 *           properties:
 *             lieu:
 *               type: string
 *             date:
 *               type: date
 *             nomSignature:
 *               type: string
 *             sceau:
 *               type: boolean
 */

const bordereauTransmissionSchema = new Schema({
  codeFormulaire: {
    type: String,
    default: "A6",
    immutable: true
  },
  documents: [{
    code: { type: String, required: true },
    nombre: { type: String },
    numeroThematique: { type: String }
  }],
  recepisse: {
    conforme: { type: Boolean, default: false },
    destinataires: {
      inspecteur: { type: Boolean, default: false },
      etablissement: { type: Boolean, default: false },
      ipe: { type: Boolean, default: false },
      sousProved: { type: Boolean, default: false },
      proved: { type: Boolean, default: false },
      coordProvincial: { type: Boolean, default: false },
      sernie: { type: Boolean, default: false },
      secope: { type: Boolean, default: false },
      classement: { type: Boolean, default: false }
    }
  },
  informationsRecepisse: {
    inspecteur: { type: String },
    niveauDiscipline: { type: String },
    posteAttache: { type: String },
    bp: { type: String },
    telephone: { type: String },
    email: { type: String },
    anneesScolaire: { type: String },
    rapport: { type: String }
  },
  signature: {
    lieu: { type: String, required: true },
    date: { type: Date, required: true },
    nomSignature: { type: String, required: true },
    sceau: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports.BordereauTransmission = model('BordereauTransmission', bordereauTransmissionSchema);