const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     FicheAnalyseItem:
 *       type: object
 *       required:
 *         - numeroRapport
 *         - inspecteur
 *       properties:
 *         numeroRapport:
 *           type: string
 *           description: Numéro unique du rapport
 *         codeFormulaire:
 *           type: string
 *           default: "T1"
 *           description: Code du formulaire (T1)
 *         inspecteur:
 *           type: string
 *           format: uuid
 *           description: Référence à l'inspecteur
 *         definition:
 *           type: object
 *           properties:
 *             discipline:
 *               type: string
 *             niveau:
 *               type: string
 *             numeroItem:
 *               type: string
 *               description: Numéro de l'item en banque
 *         programme:
 *           type: object
 *           properties:
 *             references:
 *               type: string
 *             enonceDuRef:
 *               type: string
 *         objectifsTaxonomie:
 *           type: object
 *           properties:
 *             connaissance:
 *               type: string
 *             comprehension:
 *               type: string
 *             application:
 *               type: string
 *             analyse:
 *               type: string
 *             synthese:
 *               type: string
 *             jugement:
 *               type: string
 *         formulation:
 *           type: object
 *           properties:
 *             articleBase:
 *               type: string
 *               description: Article de base (se limiter à l'article, les propositions commencent par une majuscule)
 *             propositions:
 *               type: array
 *               items:
 *                 type: string
 *               description: Propositions numérotées de 1 à 5
 *         experimentation:
 *           type: object
 *           properties:
 *             titre:
 *               type: string
 *             date:
 *               type: string
 *             etablissement:
 *               type: string
 *         criteresSelection:
 *           type: string
 *           description: Critères de sélection des élèves
 *         observations:
 *           type: string
 *           description: Observations générales
 *         resultats:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               groupe:
 *                 type: string
 *               reponses:
 *                 type: array
 *                 items:
 *                   type: number
 *               total:
 *                 type: number
 *         critique:
 *           type: object
 *           properties:
 *             conformiteProgramme:
 *               type: string
 *             validiteBonneReponse:
 *               type: string
 *             valeurDistrateurs:
 *               type: string
 *             valeurIndices:
 *               type: string
 *         avisResponsables:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: ['discipline', 'langue']
 *               nom:
 *                 type: string
 *               date:
 *                 type: string
 *               avis:
 *                 type: string
 *         exploitation:
 *           type: object
 *           properties:
 *             annee:
 *               type: string
 *             nomEpreuve:
 *               type: string
 *             code:
 *               type: string
 */

const ficheAnalyseItemSchema = new Schema({
  numeroRapport: {
    type: String,
    required: true,
    unique: true
  },
  codeFormulaire: {
    type: String,
    default: "T1"
  },
  inspecteur: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  definition: {
    discipline: String,
    niveau: String,
    numeroItem: String
  },
  programme: {
    references: String,
    enonceDuRef: String
  },
  objectifsTaxonomie: {
    connaissance: String,
    comprehension: String,
    application: String,
    analyse: String,
    synthese: String,
    jugement: String
  },
  formulation: {
    articleBase: String,
    propositions: [String]
  },
  experimentation: {
    titre: String,
    date: String,
    etablissement: String
  },
  criteresSelection: String,
  observations: String,
  resultats: [{
    groupe: String,
    reponses: [Number],
    total: Number
  }],
  critique: {
    conformiteProgramme: String,
    validiteBonneReponse: String,
    valeurDistrateurs: String,
    valeurIndices: String
  },
  avisResponsables: [{
    type: {
      type: String,
      enum: ['discipline', 'langue']
    },
    nom: String,
    date: String,
    avis: String
  }],
  exploitation: {
    annee: String,
    nomEpreuve: String,
    code: String
  }
}, {
  timestamps: true
});

module.exports = model('FicheAnalyseItem', ficheAnalyseItemSchema);