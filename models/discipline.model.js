/**
 * @swagger
 * components:
 *   schemas:
 *     Discipline:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom de la discipline (ex. Mathématiques, Sciences)
 *       required:
 *         - nom
 *       example:
 *         nom: "Mathématiques"
 */

const { Schema, model } = require('mongoose');

const DisciplineSchema = new Schema({
  nom: { type: String, required: true }
}, { timestamps: true, versionKey: false });

module.exports.Discipline = model('Discipline', DisciplineSchema);
