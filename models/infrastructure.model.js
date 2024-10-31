const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Infrastructure:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - location
 *         - schoolId
 *       properties:
 *         name:
 *           type: string
 *           description: Nom de l'infrastructure
 *         type:
 *           type: string
 *           enum: ['Salle de classe', 'Bibliothèque', 'Laboratoire', 'Toilettes', 'Autre']
 *           description: Type d'infrastructure
 *         location:
 *           type: string
 *           description: Emplacement de l'infrastructure
 *         schoolId:
 *           type: string
 *           description: Référence vers l'école associée à cette infrastructure
 */

const infrastructureSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['Salle de classe', 'Bibliothèque', 'Laboratoire', 'Toilettes', 'Autre'],
    required: true,
  },
  location: { type: String, required: true },
  schoolId: { type: Schema.Types.ObjectId, ref: 'Ecole', required: true },
}, { timestamps: true, versionKey: false });

const Infrastructure = model('Infrastructure', infrastructureSchema);
module.exports = Infrastructure;
