const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     TypeFormulaire:
 *       type: object
 *       required:
 *         - nom
 *         - code
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom du type de formulaire
 *         code:
 *           type: string
 *           description: Code unique du type de formulaire
 *         destinateurs:
 *           type: array
 *           items:
 *             type: string
 *             description: Liste des ID des utilisateurs (destinateurs) du formulaire
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
 *         createdBy:
 *           type: string
 *           description: L'ID de l'utilisateur ayant créé le formulaire
 *       example:
 *         nom: "Formulaire d'inscription"
 *         code: "INSCRIP_2024"
 *         destinateurs: ["60f8a1bc6b8d293ee45674f9", "60f8a1bc6b8d293ee45674f8"]
 *         champs: 
 *           - nom: "Nom complet"
 *             type: "text"
 *             options: []
 *           - nom: "Date de naissance"
 *             type: "date"
 *             options: []
 *         createdBy: "60f8a1bc6b8d293ee45674f9"
 */
const typeFormulaireSchema = new Schema({
  code: { type: String, required: true },
  nom: { type: String, required: true },
  destinateurs: [{
    type: Schema.Types.ObjectId,
    ref: 'User', // Référence au modèle 'User'
    required: true,
    description: "Liste des utilisateurs destinataires du formulaire"
  }],
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
