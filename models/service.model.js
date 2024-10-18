const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - nom
 *         - type
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom du service
 *         type:
 *           type: string
 *           enum: [direction, sousDirection]
 *           description: Type de service (direction ou sous-direction)
 *         idDirection:
 *           type: string
 *           description: Référence à la direction (si applicable)
 *         idSousDirection:
 *           type: string
 *           description: Référence à la sous-direction (si applicable)
 */
const serviceSchema = new Schema({
  nom: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['direction', 'sousDirection'], 
    required: true, 
  },
  idDirection: { type: Schema.Types.ObjectId, ref: 'Direction' },
  idSousDirection: { type: Schema.Types.ObjectId, ref: 'SousDirection' },
}, { timestamps: true, versionKey: false });

module.exports.Service = model('Service', serviceSchema);
