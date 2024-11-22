/**
 * @swagger
 * components:
 *   schemas:
 *     Denomination:
 *       type: object
 *       properties:
 *         appellation:
 *           type: string
 *           description: Appellation de la dénomination
 *         sigle:
 *           type: string
 *           description: Sigle ou abréviation de la dénomination
 *         code:
 *           type: number
 *           description: Code unique de la dénomination
 *       required:
 *         - appellation
 *         - sigle
 *         - code
 *       example:
 *         appellation: "Ecole Primaire Le Savoir"
 *         sigle: "EPS"
 *         code: 12345
 */

const { Schema, model } = require('mongoose');

const DenominationSchema = new Schema({
  appellation: { type: String, required: true },
  sigle: { type: String, required: true }, // Nouveau champ pour le sigle de la dénomination
  code: { type: Number, required: true } // Nouveau champ pour le code unique
}, { timestamps: true, versionKey: false });

module.exports.Denomination = model('Denomination', DenominationSchema);
