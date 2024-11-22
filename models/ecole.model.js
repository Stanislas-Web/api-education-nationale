/**
 * @swagger
 * components:
 *   schemas:
 *     Ecole:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom de l'école
 *         adresse:
 *           type: string
 *           description: Adresse de l'école
 *         localisation:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *               description: Latitude de l'école
 *             longitude:
 *               type: number
 *               description: Longitude de l'école
 *           required:
 *             - latitude
 *             - longitude
 *         sousDirection:
 *           type: string
 *           description: Référence vers la sous-direction de l'école
 *         effectifs:
 *           type: number
 *           description: Nombre total d'élèves dans l'école
 *         secope:
 *           type: string
 *           description: Code SECOPE de l'école
 *         denomination:
 *           type: string
 *           description: Référence vers la dénomination de l'école
 *         rueOuAvenue:
 *           type: string
 *           description: Rue ou avenue de l'école
 *         quartier:
 *           type: string
 *           description: Quartier de l'école
 *         communeOuTerritoire:
 *           type: string
 *           description: Commune ou territoire de l'école
 *         district:
 *           type: string
 *           description: District de l'école
 *         ville:
 *           type: string
 *           description: Ville de l'école
 *         village:
 *           type: string
 *           description: Village de l'école (optionnel)
 *         province:
 *           type: string
 *           description: Province où se trouve l'école
 *         secteur:
 *           type: string
 *           description: Secteur de l'école (optionnel)
 *         bp:
 *           type: string
 *           description: Boîte postale de l'école
 *         matricule:
 *           type: string
 *           description: Matricule de l'école
 *         tel:
 *           type: string
 *           description: Numéro de télephone de l'école
 *         n:
 *           type: string
 *           description: numero d'adresse de l'école
 *       required:
 *         - nom
 *         - adresse
 *         - localisation
 *         - sousDirection
 *         - secope
 *         - denomination
 *         - rueOuAvenue
 *         - quartier
 *         - communeOuTerritoire
 *         - district
 *         - ville
 *         - province
 *         - n
 *         - tel
 *       example:
 *         nom: "Ecole Primaire Le Savoir"
 *         adresse: "123 Avenue des Nations"
 *         localisation:
 *           latitude: -1.28333
 *           longitude: 36.81667
 *         sousDirection: "64bca7a2e5d12c0012345671"
 *         effectifs: 350
 *         secope: "SEC12345"
 *         denomination: "64bca7a2e5d12c0012345672"
 *         rueOuAvenue: "Avenue de l'Unité"
 *         quartier: "Quartier Industriel"
 *         communeOuTerritoire: "Commune de Matete"
 *         district: "District de Tshangu"
 *         ville: "Kinshasa"
 *         village: "Village Example"
 *         province: "Kinshasa"
 *         secteur: "Secteur 7"
 *         bp: "BP 12345"
 *         matricule: "MAT56789"
 *         tel: "+243826016607"
 *         n: "12 A/Bis"
 */

const { Schema, model } = require('mongoose');

const EcoleSchema = new Schema({
  nom: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adresse: { type: String, required: true },
  localisation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  sousDirection: { type: Schema.Types.ObjectId, ref: 'SousDirection', required: true },
  effectifs: { type: Number, default: 0 },
  secope: { type: String, required: true },
  denomination: { type: Schema.Types.ObjectId, ref: 'Denomination', required: true },
  rueOuAvenue: { type: String, required: true },
  quartier: { type: String, required: true },
  communeOuTerritoire: { type: String, required: true },
  district: { type: String, required: true },
  ville: { type: String, required: true },
  village: { type: String },
  province: { type: String, required: true },
  secteur: { type: String },
  bp: { type: String },
  matricule: { type: String },
  tel: { type: String, required: true },
  n: { type: String, required: true }
}, { timestamps: true, versionKey: false });

module.exports.Ecole = model('Ecole', EcoleSchema);
