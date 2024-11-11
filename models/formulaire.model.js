const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Formulaire:
 *       type: object
 *       required:
 *         - typeFormulaire
 *         - reponses
 *         - idSousDirection
 *       properties:
 *         typeFormulaire:
 *           type: string
 *           description: ID du type de formulaire auquel ce formulaire appartient
 *         reponses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               champId:
 *                 type: string
 *                 description: ID du champ du type de formulaire
 *               valeur:
 *                 type: string
 *                 description: La réponse donnée pour ce champ
 *         destinateurs:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des destinataires du formulaire
 *         idSousDirection:
 *           type: string
 *           description: ID de la sous-direction liée au formulaire
 */
const formulaireSchema = new Schema({
  typeFormulaire: { type: Schema.Types.ObjectId, ref: 'TypeFormulaire', required: true },
  reponses: [
    {
      champId: { type: Schema.Types.ObjectId, ref: 'TypeFormulaire.champs', required: true },
      valeur: { type: Schema.Types.Mixed, required: true }, // La valeur peut être de n'importe quel type
    }
  ],
  destinateurs: {
    type: [String],
    default: [],
    description: "Liste des destinataires du formulaire"
  },
  idSousDirection: { type: Schema.Types.ObjectId, ref: 'SousDirection', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, versionKey: false });

module.exports.Formulaire = model('Formulaire', formulaireSchema);
