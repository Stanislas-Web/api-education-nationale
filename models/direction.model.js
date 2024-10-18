const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Direction:
 *       type: object
 *       required:
 *         - nom
 *         - idProvince
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom de la Direction
 *         idProvince:
 *           type: string
 *           description: ID de la province à laquelle la Direction est rattachée
 *           example: 609e12674e1c2b3a4c4fbb42
 */
const directionSchema = new Schema({
  nom: { type: String, required: true },
  idProvince: { type: Schema.Types.ObjectId, ref: 'Province', required: true },
}, { timestamps: true, versionKey: false });

module.exports.Direction = model('Direction', directionSchema);
