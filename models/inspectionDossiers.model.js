const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     InspectionDossiers:
 *       type: object
 *       required:
 *         - numeroRapport
 *         - inspecteur
 *         - etablissement
 *       properties:
 *         numeroRapport:
 *           type: string
 *           description: Numéro unique du rapport d'inspection
 *         codeFormulaire:
 *           type: string
 *           default: "C7"
 *           description: Code du formulaire (C7)
 *         inspecteur:
 *           type: object
 *           properties:
 *             niveauDiscipline:
 *               type: string
 *             posteAttache:
 *               type: string
 *               enum: ['IPP', 'PROVED', 'SOUS/PROVED', 'COORDINATEUR', 'SECTEUR', 'CLASSEMENT']
 *             telephone:
 *               type: string
 *         etablissement:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *             regime:
 *               type: string
 *               enum: ['EXT', 'INT']
 *             scope:
 *               type: string
 *             matricule:
 *               type: string
 *             telephone:
 *               type: string
 *             adresse:
 *               type: string
 *         chefEtablissement:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *             sexe:
 *               type: string
 *               enum: ['M', 'F']
 *             age:
 *               type: number
 *         codes:
 *           type: object
 *           properties:
 *             matricule:
 *               type: string
 *             idSecope:
 *               type: string
 *         donneesClasses:
 *           type: object
 *           properties:
 *             nombreClassesAgrees:
 *               type: number
 *             nombreClassesParalleles:
 *               type: number
 *             nombreClassesNonAutorisees:
 *               type: number
 *             nombreClassesParallelesNonAutorisees:
 *               type: number
 *         enseignants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               numero:
 *                 type: string
 *               nom:
 *                 type: string
 *               postnom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               sexe:
 *                 type: string
 *                 enum: ['M', 'F']
 *               age:
 *                 type: number
 *               cotations:
 *                 type: array
 *                 items:
 *                   type: number
 *                   enum: [1, 2, 3, 4, 5, 6]
 *               moyenne:
 *                 type: number
 *               observations:
 *                 type: string
 *         remarquesConseils:
 *           type: string
 *         signatureChefEtablissement:
 *           type: string
 *         signatureInspecteur:
 *           type: string
 *         dateInspection:
 *           type: Date
 *           default: Date.now
 *         legendes:
 *           type: object
 *           properties:
 *             accepte:
 *               type: string
 *               default: "A"
 *             refus:
 *               type: string
 *               default: "R"
 *             enOrdre:
 *               type: string
 *               default: "E"
 *             parc:
 *               type: string
 *               default: "P"
 *             fonctionnementRetard:
 *               type: string
 *               default: "F"
 *             fonctionnementCours:
 *               type: string
 *               default: "T"
 *             absenceDocument:
 *               type: string
 *               default: "H"
 *             horaire:
 *               type: string
 *               default: "H1, H2, H3"
 *             sousSigneInspecteur:
 *               type: string
 *               default: "S"
 *             ecritEtranger:
 *               type: string
 *               default: "X"
 *             ecritAllemand:
 *               type: string
 *               default: "Y"
 *             annotation:
 *               type: string
 *               default: "V"
 *             changementInterieur:
 *               type: string
 *               default: "Q"
 */

const inspectionDossiersSchema = new Schema({
  numeroRapport: {
    type: String,
    required: true,
    unique: true
  },
  codeFormulaire: {
    type: String,
    default: "C7"
  },
  inspecteur: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  etablissement: {
    type: Schema.Types.ObjectId,
    ref: 'Ecole',
    required: true
  },
  chefEtablissement: {
    nom: String,
    sexe: {
      type: String,
      enum: ['M', 'F']
    },
    age: Number
  },
  codes: {
    matricule: String,
    idSecope: String
  },
  donneesClasses: {
    nombreClassesAgrees: Number,
    nombreClassesParalleles: Number,
    nombreClassesNonAutorisees: Number,
    nombreClassesParallelesNonAutorisees: Number
  },
  enseignants: [{
    numero: String,
    nom: String,
    postnom: String,
    prenom: String,
    sexe: {
      type: String,
      enum: ['M', 'F']
    },
    age: Number,
    cotations: [{
      type: Number,
      min: 1,
      max: 6
    }],
    moyenne: Number,
    observations: String
  }],
  remarquesConseils: String,
  signatureChefEtablissement: String,
  signatureInspecteur: String,
  dateInspection: {
    type: Date,
    default: Date.now
  },
  legendes: {
    accepte: {
      type: String,
      default: "A"
    },
    refus: {
      type: String,
      default: "R"
    },
    enOrdre: {
      type: String,
      default: "E"
    },
    parc: {
      type: String,
      default: "P"
    },
    fonctionnementRetard: {
      type: String,
      default: "F"
    },
    fonctionnementCours: {
      type: String,
      default: "T"
    },
    absenceDocument: {
      type: String,
      default: "H"
    },
    horaire: {
      type: String,
      default: "H1, H2, H3"
    },
    sousSigneInspecteur: {
      type: String,
      default: "S"
    },
    ecritEtranger: {
      type: String,
      default: "X"
    },
    ecritAllemand: {
      type: String,
      default: "Y"
    },
    annotation: {
      type: String,
      default: "V"
    },
    changementInterieur: {
      type: String,
      default: "Q"
    }
  }
}, {
  timestamps: true
});

module.exports = model('InspectionDossiers', inspectionDossiersSchema);