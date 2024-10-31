// models/equipement.model.js

const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Equipement:
 *       type: object
 *       required:
 *         - nom
 *         - quantite
 *         - categorie
 *         - ecoleId
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom de l'équipement
 *         quantite:
 *           type: number
 *           description: Quantité d'équipement disponible
 *         categorie:
 *           type: string
 *           description: Catégorie de l'équipement
 *         ecoleId:
 *           type: string
 *           description: ID de l'école associée à cet équipement
 */
const EquipementSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  quantite: { type: Number, required: true },
  categorie: { type: String, required: true },
  ecoleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ecole', required: true }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Equipement', EquipementSchema);
