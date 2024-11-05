const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Personnel:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom du membre du personnel
 *         prenom:
 *           type: string
 *           description: Prénom du membre du personnel
 *         role:
 *           type: string
 *           description: Rôle ou fonction du membre du personnel (ex. enseignant, administrateur)
 *         qualification:
 *           type: string
 *           description: Qualification du membre du personnel
 *         ecole:
 *           type: string
 *           description: Référence vers l'école à laquelle le personnel est associé
 *         presences:
 *           type: number
 *           description: Nombre de jours de présence
 */
const PersonnelSchema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  role: { type: String, required: true }, // Rôle du personnel
  qualification: { type: String, required: true }, // Qualification du personnel
  ecole: { type: Schema.Types.ObjectId, ref: 'Ecole', required: true }, // Référence vers l'école
  presences: { type: Number, default: 0 } // Nombre de jours de présence, par défaut à 0
}, { timestamps: true });

module.exports.Personnel = model('Personnel', PersonnelSchema);
