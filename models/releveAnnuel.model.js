const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     ReleveAnnuel:
 *       type: object
 *       required:
 *         - codeFormulaire
 *         - anneesScolaire
 *         - inspecteur
 *       properties:
 *         codeFormulaire:
 *           type: string
 *           description: Code du formulaire (A4)
 *           default: "A4"
 *         inspecteur:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *             niveau:
 *               type: string
 *             posteAttache:
 *               type: string
 *             bp:
 *               type: string
 *             telephone:
 *               type: string
 *             email:
 *               type: string
 *         anneesScolaire:
 *           type: object
 *           properties:
 *             debut:
 *               type: number
 *             fin:
 *               type: number
 *         tableauStatistiqueProduction:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               module:
 *                 type: string
 *               codes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     valeur:
 *                       type: number
 *         releveModulaire:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               trimestre:
 *                 type: number
 *               modules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     module:
 *                       type: string
 *                     prevus:
 *                       type: number
 *                     realises:
 *                       type: number
 *                     pourcentage:
 *                       type: number
 *         tableauEffectifs:
 *           type: object
 *           properties:
 *             primaire:
 *               type: object
 *               properties:
 *                 qualifies:
 *                   type: number
 *                 sousQualifies:
 *                   type: number
 *                 pourcentageQualifies:
 *                   type: number
 *             secondaire:
 *               type: object
 *               properties:
 *                 qualifies:
 *                   type: number
 *                 sousQualifies:
 *                   type: number
 *                 pourcentageQualifies:
 *                   type: number
 *         tableauJuridiction:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               fonction:
 *                 type: string
 *               nombre:
 *                 type: number
 *               unitesReelles:
 *                 type: number
 *               unitesInspectees:
 *                 type: number
 *               pourcentageInspectes:
 *                 type: number
 *         tableauNotation:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               fonction:
 *                 type: string
 *               code:
 *                 type: string
 *               notes:
 *                 type: object
 *                 properties:
 *                   note4:
 *                     type: number
 *                   note3:
 *                     type: number
 *                   note2:
 *                     type: number
 *                   note1:
 *                     type: number
 *                   note0:
 *                     type: number
 *                   total:
 *                     type: number
 *         tableauMissions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               trimestre:
 *                 type: number
 *               joursAccomplis:
 *                 type: number
 *               montantRecu:
 *                 type: number
 *               references:
 *                 type: string
 *         difficultes:
 *           type: object
 *           properties:
 *             pedagogique:
 *               type: string
 *             materielle:
 *               type: string
 *             technique:
 *               type: string
 *             structurelle:
 *               type: string
 *             financiere:
 *               type: string
 *             autres:
 *               type: string
 *         recommandations:
 *           type: object
 *           properties:
 *             controle:
 *               type: string
 *             formation:
 *               type: string
 *             evaluation:
 *               type: string
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

const releveAnnuelSchema = new Schema({
  codeFormulaire: {
    type: String,
    default: "A4",
    immutable: true
  },
  inspecteur: {
    nom: { type: String, required: true },
    niveau: { type: String, required: true },
    posteAttache: { type: String },
    bp: { type: String },
    telephone: { type: String },
    email: { type: String }
  },
  anneesScolaire: {
    debut: { type: Number, required: true },
    fin: { type: Number, required: true }
  },
  tableauStatistiqueProduction: [{
    module: { type: String },
    codes: [{
      code: { type: String },
      valeur: { type: Number, default: 0 }
    }]
  }],
  releveModulaire: [{
    trimestre: { type: Number, enum: [1, 2, 3, 4] },
    modules: [{
      module: { type: String },
      prevus: { type: Number, default: 0 },
      realises: { type: Number, default: 0 },
      pourcentage: { type: Number, default: 0 }
    }]
  }],
  tableauEffectifs: {
    primaire: {
      qualifies: { type: Number, default: 0 },
      sousQualifies: { type: Number, default: 0 },
      pourcentageQualifies: { type: Number, default: 0 }
    },
    secondaire: {
      qualifies: { type: Number, default: 0 },
      sousQualifies: { type: Number, default: 0 },
      pourcentageQualifies: { type: Number, default: 0 }
    }
  },
  tableauJuridiction: [{
    fonction: { type: String },
    nombre: { type: Number, default: 0 },
    unitesReelles: { type: Number, default: 0 },
    unitesInspectees: { type: Number, default: 0 },
    pourcentageInspectes: { type: Number, default: 0 }
  }],
  tableauNotation: [{
    fonction: { type: String },
    code: { type: String },
    notes: {
      note4: { type: Number, default: 0 },
      note3: { type: Number, default: 0 },
      note2: { type: Number, default: 0 },
      note1: { type: Number, default: 0 },
      note0: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    }
  }],
  tableauMissions: [{
    trimestre: { type: Number, enum: [1, 2, 3, 4] },
    joursAccomplis: { type: Number, default: 0 },
    montantRecu: { type: Number, default: 0 },
    references: { type: String }
  }],
  difficultes: {
    pedagogique: { type: String },
    materielle: { type: String },
    technique: { type: String },
    structurelle: { type: String },
    financiere: { type: String },
    autres: { type: String }
  },
  recommandations: {
    controle: { type: String },
    formation: { type: String },
    evaluation: { type: String }
  },
  signature: {
    lieu: { type: String },
    date: { type: Date },
    inspecteurSignature: { type: String }
  }
}, { 
  timestamps: true,
  versionKey: false 
});

module.exports = model('ReleveAnnuel', releveAnnuelSchema);