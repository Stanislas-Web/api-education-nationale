const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Eleve:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom de l'élève
 *         prenom:
 *           type: string
 *           description: Prénom de l'élève
 *         age:
 *           type: number
 *           description: Âge de l'élève
 *         sexe:
 *           type: string
 *           enum: ['M', 'F']
 *           description: Sexe de l'élève
 *         classe:
 *           type: string
 *           description: Classe de l'élève 
 *         ecole:
 *           type: string
 *           description: Référence vers l'école de l'élève
 */
const EleveSchema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  age: { type: Number, required: true },
  sexe: { type: String, enum: ['M', 'F'], required: true },
  classe: { type: String, required: true }, // Classe de l'élève
  ecole: { type: Schema.Types.ObjectId, ref: 'Ecole', required: true } // Référence vers l'école
}, { timestamps: true });

module.exports.Eleve = model('Eleve', EleveSchema);
