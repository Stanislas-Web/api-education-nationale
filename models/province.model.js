const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Province:
 *       type: object
 *       required:
 *         - nom
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom de la province

 */
const provinceSchema = new Schema({
  nom: { type: String, required: true },
}, { timestamps: true, versionKey: false });

module.exports.Province = model('Province', provinceSchema);
