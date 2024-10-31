const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     ResultatScolaire:
 *       type: object
 *       required:
 *         - tauxReussite
 *         - moyenneClasse
 *         - ecole
 *       properties:
 *         tauxReussite:
 *           type: number
 *           description: Taux de réussite des élèves en pourcentage
 *         moyenneClasse:
 *           type: number
 *           description: Moyenne générale de la classe
 *         ecole:
 *           type: string
 *           description: Référence vers l'école associée
 */

const ResultatScolaireSchema = new mongoose.Schema({
  tauxReussite: {
    type: Number,
    required: true,
    description: "Taux de réussite des élèves en pourcentage",
  },
  moyenneClasse: {
    type: Number,
    required: true,
    description: "Moyenne générale de la classe",
  },
  ecole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ecole',
    required: true,
    description: "Référence vers l'école associée",
  }
}, { timestamps: true, versionKey: false });

module.exports.ResultatScolaire = mongoose.model('ResultatScolaire', ResultatScolaireSchema);
