const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     IdentificationProved:
 *       type: object
 *       required:
 *         - provinceAdministrative
 *         - provinceEducationnelle
 *         - chefLieuProved
 *         - directeurProvincial
 *       properties:
 *         provinceAdministrative:
 *           type: string
 *           description: Province administrative
 *         provinceEducationnelle:
 *           type: string
 *           description: Province éducationnelle
 *         chefLieuProved:
 *           type: string
 *           description: Chef lieu de la PROVED
 *         emailProfessionnel:
 *           type: string
 *           description: Adresse email professionnelle
 *         telephone:
 *           type: string
 *           description: Numéro de téléphone
 *         statutOccupation:
 *           type: string
 *           enum: ['Propriétaire', 'Locataire']
 *           description: Statut d'occupation
 *         nombreTerritoires:
 *           type: number
 *           description: Nombre de territoires de la PROVED
 *         nombreSousDivisions:
 *           type: number
 *           description: Nombre de sous-divisions
 *         directeurProvincial:
 *           type: string
 *           description: Nom complet du directeur provincial
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Indique si cette identification est active

 */

const identificationProvedSchema = new Schema({
  provinceAdministrative: { 
    type: String, 
    required: true,
    unique: true 
  },
  provinceEducationnelle: { 
    type: String, 
    required: true 
  },
  chefLieuProved: { 
    type: String, 
    required: true 
  },
  emailProfessionnel: { 
    type: String 
  },
  telephone: { 
    type: String 
  },
  statutOccupation: { 
    type: String, 
    enum: ['Propriétaire', 'Locataire'] 
  },
  nombreTerritoires: { 
    type: Number, 
    default: 0 
  },
  nombreSousDivisions: { 
    type: Number, 
    default: 0 
  },
  directeurProvincial: { 
    type: String, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  updatedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { 
  timestamps: true, 
  versionKey: false 
});

module.exports.IdentificationProved = model('IdentificationProved', identificationProvedSchema); 