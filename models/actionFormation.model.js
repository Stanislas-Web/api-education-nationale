const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     ActionFormation:
 *       type: object
 *       required:
 *         - numeroRapport
 *         - inspecteur
 *         - etablissement
 *       properties:
 *         numeroRapport:
 *           type: string
 *           description: Numéro unique du rapport d'action de formation
 *         codeFormulaire:
 *           type: string
 *           default: "F1"
 *           description: Code du formulaire (F1)
 *         inspecteur:
 *           type: string
 *           format: uuid
 *           description: Référence à l'inspecteur
 *         etablissement:
 *           type: string
 *           format: uuid
 *           description: Référence à l'établissement
 *         nature:
 *           type: object
 *           properties:
 *             expose:
 *               type: string
 *             conferencesPedagogiques:
 *               type: string
 *             seanceAnimationPedagogique:
 *               type: string
 *             animateurs:
 *               type: array
 *               items:
 *                 type: string
 *             animateursFormation:
 *               type: object
 *               properties:
 *                 interne:
 *                   type: array
 *                   items:
 *                     type: string
 *                 externe:
 *                   type: array
 *                   items:
 *                     type: string
 *         modalites:
 *           type: object
 *           properties:
 *             date:
 *               type: string
 *             duree:
 *               type: object
 *               properties:
 *                 debut:
 *                   type: string
 *                 fin:
 *                   type: string
 *             participation:
 *               type: object
 *               properties:
 *                 operateursPedagogiques:
 *                   type: array
 *                   items:
 *                     type: string
 *                 etablissements:
 *                   type: array
 *                   items:
 *                     type: string
 *                 services:
 *                   type: array
 *                   items:
 *                     type: string
 *         initiative:
 *           type: string
 *           description: Initiative de l'action de formation
 *         collaboration:
 *           type: string
 *           description: Collaboration dans l'action de formation
 *         sujetTheme:
 *           type: string
 *           description: Sujet ou thème de la formation
 *         objectifs:
 *           type: array
 *           items:
 *             type: string
 *           description: Objectifs de la formation
 *         methodesStrategies:
 *           type: array
 *           items:
 *             type: string
 *           description: Méthodes et techniques (stratégies) utilisées
 *         moyensFormation:
 *           type: array
 *           items:
 *             type: string
 *           description: Moyens de formation mis en œuvre
 *         bilan:
 *           type: string
 *           description: Bilan de la formation
 *         controleSuivi:
 *           type: string
 *           description: Contrôle du suivi
 *         suggestions:
 *           type: string
 *           description: Suggestions et recommandations
 *         dateFormation:
 *           type: Date
 *           default: Date.now
 *           description: Date de l'action de formation
 */

const actionFormationSchema = new Schema({
  numeroRapport: {
    type: String,
    required: true,
    unique: true
  },
  codeFormulaire: {
    type: String,
    default: "F1"
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
  nature: {
    expose: String,
    conferencesPedagogiques: String,
    seanceAnimationPedagogique: String,
    animateurs: [String],
    animateursFormation: {
      interne: [String],
      externe: [String]
    }
  },
  modalites: {
    date: String,
    duree: {
      debut: String,
      fin: String
    },
    participation: {
      operateursPedagogiques: [String],
      etablissements: [String],
      services: [String]
    }
  },
  initiative: String,
  collaboration: String,
  sujetTheme: String,
  objectifs: [String],
  methodesStrategies: [String],
  moyensFormation: [String],
  bilan: String,
  controleSuivi: String,
  suggestions: String,
  dateFormation: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = model('ActionFormation', actionFormationSchema);