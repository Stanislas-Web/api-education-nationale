const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     BesoinRessource:
 *       type: object
 *       required:
 *         - ecoleId
 *       properties:
 *         materielManquant:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des matériaux pédagogiques manquants
 *         infrastructuresARenover:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des infrastructures nécessitant des rénovations
 *         ecoleId:
 *           type: string
 *           description: Référence vers l'école associée aux besoins
 */

const BesoinRessourceSchema = new mongoose.Schema({
  materielManquant: {
    type: [String],
    default: [],
    description: "Liste des matériaux pédagogiques manquants"
  },
  infrastructuresARenover: {
    type: [String],
    default: [],
    description: "Liste des infrastructures nécessitant des rénovations"
  },
  ecoleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ecole',
    required: true,
    description: "Référence vers l'école"
  }
}, { timestamps: true, versionKey: false });

const BesoinRessource = mongoose.model('BesoinRessource', BesoinRessourceSchema);
module.exports = BesoinRessource;
