const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     TypeFormulaire:
 *       type: object
 *       required:
 *         - nom
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom du type de formulaire
 *         destinateurs:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des destinateurs du formulaire
 *         champs:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Le nom du champ dans le formulaire
 *               type:
 *                 type: string
 *                 enum: [text, number, date, select]
 *                 description: Le type de champ (texte, nombre, etc.)
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Les options de sélection (si applicable)
 */
const typeFormulaireSchema = new Schema({
  code: { type: String, required: true },
  nom: { type: String, required: true },
  destinateurs: {
    type: [String],
    default: [],
    description: "Liste des destinateurs (utilisateurs ou groupes auxquels le formulaire est destiné)"
  },
  champs: [
    {
      nom: { type: String, required: true },
      type: { type: String, required: true, enum: ['text', 'number', 'date', 'select'] },
      options: { type: [String], default: [] }, // Options si le champ est de type 'select'
    }
  ],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, versionKey: false });

module.exports.TypeFormulaire = model('TypeFormulaire', typeFormulaireSchema);
