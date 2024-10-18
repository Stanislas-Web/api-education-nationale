const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     SousDirection:
 *       type: object
 *       required:
 *         - nom
 *         - idDirection
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom de la Sous-Direction
 *         idDirection:
 *           type: string
 *           description: ID de la Direction à laquelle appartient la Sous-Direction
 */
const sousDirectionSchema = new Schema({
  nom: { type: String, required: true },
  idDirection: { type: Schema.Types.ObjectId, ref: 'Direction', required: true },
}, { timestamps: true, versionKey: false });

module.exports.SousDirection = model('SousDirection', sousDirectionSchema);
