const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Effectif:
 *       type: object
 *       required:
 *         - ecoleId
 *       properties:
 *         ecoleId:
 *           type: string
 *           description: Référence vers l'école
 *         totalEleves:
 *           type: number
 *           description: Nombre total d'élèves
 *         totalPersonnel:
 *           type: number
 *           description: Nombre total de personnel
 *         repartitionSexe:
 *           type: object
 *           properties:
 *             garcons:
 *               type: number
 *               description: Nombre de garçons
 *             filles:
 *               type: number
 *               description: Nombre de filles
 *         repartitionAge:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               age:
 *                 type: number
 *                 description: Âge des élèves
 *               count:
 *                 type: number
 *                 description: Nombre d'élèves pour cet âge
 */
const EffectifSchema = new mongoose.Schema({
  ecoleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ecole',
    required: true,
  },
  totalEleves: {
    type: Number,
    default: 0,
  },
  totalPersonnel: {
    type: Number,
    default: 0,
  },
  repartitionSexe: {
    garcons: {
      type: Number,
      default: 0,
    },
    filles: {
      type: Number,
      default: 0,
    },
  },
  repartitionAge: [
    {
      age: { type: Number },
      count: { type: Number },
    },
  ],
}, { timestamps: true, versionKey: false });

const Effectif = mongoose.model('Effectif', EffectifSchema);
module.exports = Effectif;
