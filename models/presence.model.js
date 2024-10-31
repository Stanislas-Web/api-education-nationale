const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Presence:
 *       type: object
 *       required:
 *         - date
 *         - eleveId
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: Date de la présence
 *         eleveId:
 *           type: string
 *           description: Référence vers l'élève
 *         personnelId:
 *           type: string
 *           description: Référence vers le personnel (optionnel)
 *         present:
 *           type: boolean
 *           description: Indique si l'élève ou le personnel est présent
 */
const PresenceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  eleveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eleve',
    required: true,
  },
  personnelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personnel',
    default: null, // Optional field for personnel
  },
  present: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true });

const Presence = mongoose.model('Presence', PresenceSchema);
module.exports = Presence;
