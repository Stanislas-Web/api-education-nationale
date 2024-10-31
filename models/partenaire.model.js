// models/Partenaire.model.js

const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Partenaire:
 *       type: object
 *       required:
 *         - nom
 *         - contact
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom du partenaire
 *           example: Entreprise X
 *         description:
 *           type: string
 *           description: Brève description du partenaire
 *           example: Une entreprise spécialisée en éducation
 *         contact:
 *           type: string
 *           description: Informations de contact du partenaire
 *           example: contact@entreprisex.com
 *         adresse:
 *           type: string
 *           description: Adresse du partenaire
 *           example: 123 Rue Principale, Kinshasa
 *         datePartenariat:
 *           type: string
 *           format: date
 *           description: Date de début du partenariat
 *           example: 2024-10-31
 */

const PartenaireSchema = new Schema(
  {
    nom: { type: String, required: true },
    description: { type: String },
    contact: { type: String, required: true },
    adresse: { type: String },
    datePartenariat: { type: Date },
  },
  { timestamps: true }
);

module.exports = model('Partenaire', PartenaireSchema);
