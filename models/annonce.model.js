const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Annonce:
 *       type: object
 *       required:
 *         - titre
 *         - contenu
 *         - type
 *         - cible
 *         - datePublication
 *       properties:
 *         titre:
 *           type: string
 *           description: Titre de l'annonce
 *         contenu:
 *           type: string
 *           description: Contenu de l'annonce
 *         type:
 *           type: string
 *           enum: ['privé', 'public']
 *           description: Type de visibilité de l'annonce
 *         cible:
 *           type: array
 *           items:
 *             type: string
 *             enum: ['Superviseur', 'Inspecteur']
 *           description: Rôles ciblés par l'annonce
 *         datePublication:
 *           type: string
 *           format: date-time
 *           description: Date de publication de l'annonce
 */

const annonceSchema = new Schema({
  titre: { type: String, required: true },
  contenu: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['privé', 'public'], 
    required: true 
  },
  cible: { 
    type: [String], 
    enum: ['Superviseur', 'Inspecteur'], 
    required: true 
  },
  datePublication: { type: Date, default: Date.now }
}, { timestamps: true, versionKey: false });

module.exports.Annonce = model('Annonce', annonceSchema);
