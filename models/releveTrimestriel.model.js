const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     ReleveTrimestriel:
 *       type: object
 *       required:
 *         - codeFormulaire
 *         - anneesScolaire
 *         - inspecteur
 *       properties:
 *         codeFormulaire:
 *           type: string
 *           description: Code du formulaire (A3)
 *           default: "A3"
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
 *         periode:
 *           type: object
 *           properties:
 *             trimestre:
 *               type: number
 *               enum: [1, 2, 3, 4]
 *             mois:
 *               type: array
 *               items:
 *                 type: string
 *         tableauProduction:
 *           type: object
 *           properties:
 *             administration:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   prevus:
 *                     type: number
 *                   realises:
 *                     type: number
 *                   nonRealises:
 *                     type: number
 *             controle:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   prevus:
 *                     type: number
 *                   realises:
 *                     type: number
 *                   nonRealises:
 *                     type: number
 *             formation:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   prevus:
 *                     type: number
 *                   realises:
 *                     type: number
 *                   nonRealises:
 *                     type: number
 *             evaluation:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   prevus:
 *                     type: number
 *                   realises:
 *                     type: number
 *                   nonRealises:
 *                     type: number
 *         tableauAnalytique:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               mois:
 *                 type: string
 *               dates:
 *                 type: string
 *               lieu:
 *                 type: string
 *               nombreClasses:
 *                 type: number
 *               numeroRapports:
 *                 type: string
 *               nombreJours:
 *                 type: number
 *         tableauNotation:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               fonction:
 *                 type: string
 *               codeActivite:
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
 *               joursAccomplis:
 *                 type: string
 *               montantRecu:
 *                 type: number
 *               references:
 *                 type: string
 *         difficultes:
 *           type: object
 *           properties:
 *             pedagogique:
 *               type: string
 *             materiel:
 *               type: string
 *             technique:
 *               type: string
 *             structurel:
 *               type: string
 *             financier:
 *               type: string
 *             autres:
 *               type: string
 *         suggestions:
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

const releveTrimestrielSchema = new Schema({
  codeFormulaire: {
    type: String,
    default: "A3",
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
  periode: {
    trimestre: { 
      type: Number,
      enum: [1, 2, 3, 4],
      required: true 
    },
    mois: [{ type: String }]
  },
  tableauProduction: {
    administration: [{
      code: { type: String },
      prevus: { type: Number, default: 0 },
      realises: { type: Number, default: 0 },
      nonRealises: { type: Number, default: 0 }
    }],
    controle: [{
      code: { type: String },
      prevus: { type: Number, default: 0 },
      realises: { type: Number, default: 0 },
      nonRealises: { type: Number, default: 0 }
    }],
    formation: [{
      code: { type: String },
      prevus: { type: Number, default: 0 },
      realises: { type: Number, default: 0 },
      nonRealises: { type: Number, default: 0 }
    }],
    evaluation: [{
      code: { type: String },
      prevus: { type: Number, default: 0 },
      realises: { type: Number, default: 0 },
      nonRealises: { type: Number, default: 0 }
    }]
  },
  tableauAnalytique: [{
    mois: { type: String },
    dates: { type: String },
    lieu: { type: String },
    nombreClasses: { type: Number },
    numeroRapports: { type: String },
    nombreJours: { type: Number }
  }],
  tableauNotation: [{
    fonction: { type: String },
    codeActivite: { type: String },
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
    joursAccomplis: { type: String },
    montantRecu: { type: Number },
    references: { type: String }
  }],
  difficultes: {
    pedagogique: { type: String },
    materiel: { type: String },
    technique: { type: String },
    structurel: { type: String },
    financier: { type: String },
    autres: { type: String }
  },
  suggestions: {
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

module.exports = model('ReleveTrimestriel', releveTrimestrielSchema);