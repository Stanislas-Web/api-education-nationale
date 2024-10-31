const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Ecole:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom de l'école
 *         adresse:
 *           type: string
 *           description: Adresse de l'école
 *         localisation:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *               description: Latitude de l'école
 *             longitude:
 *               type: number
 *               description: Longitude de l'école
 *         effectifs:
 *           type: number
 *           description: Nombre total d'élèves dans l'école
 *         sousDirection:
 *           type: string
 *           description: Référence vers la sous-direction de l'école
 */
const EcoleSchema = new Schema({
  nom: { type: String, required: true },
  adresse: { type: String, required: true }, // Nouveau champ pour l'adresse de l'école
  localisation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  eleves: [{ type: Schema.Types.ObjectId, ref: 'Eleve' }], // Référence vers les élèves
  sousDirection: { type: Schema.Types.ObjectId, ref: 'SousDirection', required: true } // Référence vers SousDirection
}, { 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Champ virtuel pour calculer automatiquement le total des effectifs
EcoleSchema.virtual('effectifs').get(function() {
  return this.eleves ? this.eleves.length : 0;
});

module.exports.Ecole = model('Ecole', EcoleSchema);
