const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     PlanTrimestriel:
 *       type: object
 *       required:
 *         - codeFormulaire
 *         - anneesScolaire
 *         - inspecteur
 *         - etablissement
 *       properties:
 *         codeFormulaire:
 *           type: string
 *           description: Code du formulaire (A2)
 *           default: "A2"
 *         inspecteur:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *               description: Nom de l'inspecteur
 *             niveau:
 *               type: string
 *               description: Niveau/Discipline
 *             posteAttache:
 *               type: string
 *               description: Poste d'attache
 *             bp:
 *               type: string
 *               description: Boîte postale
 *             telephone:
 *               type: string
 *               description: Numéro de téléphone
 *             email:
 *               type: string
 *               description: Adresse email
 *         anneesScolaire:
 *           type: object
 *           properties:
 *             debut:
 *               type: number
 *               description: Année de début
 *             fin:
 *               type: number
 *               description: Année de fin
 *         periode:
 *           type: object
 *           properties:
 *             trimestre:
 *               type: number
 *               enum: [1, 2, 3, 4]
 *               description: Numéro du trimestre
 *             mois:
 *               type: array
 *               items:
 *                 type: string
 *               description: Liste des mois concernés
 *         activites:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               dates:
 *                 type: object
 *                 properties:
 *                   debut:
 *                     type: date
 *                     description: Date de début
 *                   fin:
 *                     type: date
 *                     description: Date de fin
 *               lieuEtablissement:
 *                 type: string
 *                 description: Lieu ou établissement
 *               nombreClasses:
 *                 type: number
 *                 description: Nombre de classes
 *               typeActivites:
 *                 type: string
 *                 description: Type d'activités ciblées
 *               nombreJoursPrevus:
 *                 type: number
 *                 description: Nombre de jours prévus
 *         sousTotal:
 *           type: number
 *           description: Sous-total des activités
 *         totalGeneral:
 *           type: number
 *           description: Total général
 *         signature:
 *           type: object
 *           properties:
 *             lieu:
 *               type: string
 *               description: Lieu de signature
 *             date:
 *               type: date
 *               description: Date de signature
 *             inspecteurSignature:
 *               type: string
 *               description: Signature de l'inspecteur
 */

const planTrimestrielSchema = new Schema({
  codeFormulaire: {
    type: String,
    default: "A2",
    immutable: true
  },
  inspecteur: {
    nom: { type: String, required: true },
    niveau: { type: String, required: true },
    posteAttache: { type: String },
    bp: { type: String },
    telephone: { type: String },
    email: { type: String }
  },
  anneesScolaire: {
    debut: { type: Number, required: true },
    fin: { type: Number, required: true }
  },
  periode: {
    trimestre: { 
      type: Number,
      enum: [1, 2, 3, 4],
      required: true 
    },
    mois: [{ type: String }]
  },
  activites: [{
    dates: {
      debut: { type: Date },
      fin: { type: Date }
    },
    lieuEtablissement: { type: String },
    nombreClasses: { type: Number },
    typeActivites: { type: String },
    nombreJoursPrevus: { type: Number }
  }],
  sousTotal: { 
    type: Number,
    default: 0
  },
  totalGeneral: {
    type: Number,
    default: 0
  },
  signature: {
    lieu: { type: String },
    date: { type: Date },
    inspecteurSignature: { type: String }
  }
}, { 
  timestamps: true,
  versionKey: false 
});

module.exports = model('PlanTrimestriel', planTrimestrielSchema);