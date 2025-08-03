const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

/**
 * @swagger
 * components:
 *   schemas:
 *     RapportActivite:
 *       type: object
 *       required:
 *         - identificationProved
 *         - annee
 *       properties:
 *         identificationProved:
 *           type: string
 *           description: Référence vers l'identification de la PROVED
 *         introduction:
 *           type: string
 *           description: Brève description de la genèse et présentation de la situation sociogéographique
 *         parametresCles:
 *           type: object
 *           properties:
 *             niveauPrescolaire:
 *               type: object
 *               properties:
 *                 espaceCommunautaireEveil:
 *                   type: object
 *                   properties:
 *                     nombreEcoles: { type: number, default: 0 }
 *                     nombreClasses: { type: number, default: 0 }
 *                     effectifGarcons: { type: number, default: 0 }
 *                     effectifFilles: { type: number, default: 0 }
 *                     tauxAccroissement: { type: number, default: 0 }
 *                 maternel:
 *                   type: object
 *                   properties:
 *                     nombreEcoles: { type: number, default: 0 }
 *                     nombreClasses: { type: number, default: 0 }
 *                     effectifGarcons: { type: number, default: 0 }
 *                     effectifFilles: { type: number, default: 0 }
 *                     tauxAccroissement: { type: number, default: 0 }
 *                 prePrimaire:
 *                   type: object
 *                   properties:
 *                     nombreEcoles: { type: number, default: 0 }
 *                     nombreClasses: { type: number, default: 0 }
 *                     effectifGarcons: { type: number, default: 0 }
 *                     effectifFilles: { type: number, default: 0 }
 *                     tauxAccroissement: { type: number, default: 0 }
 *                 special:
 *                   type: object
 *                   properties:
 *                     nombreEcoles: { type: number, default: 0 }
 *                     nombreClasses: { type: number, default: 0 }
 *                     effectifGarcons: { type: number, default: 0 }
 *                     effectifFilles: { type: number, default: 0 }
 *                     tauxAccroissement: { type: number, default: 0 }
 *             niveauPrimaire:
 *               type: object
 *               properties:
 *                 enseignementSpecial:
 *                   type: object
 *                   properties:
 *                     nombreClasses: { type: number, default: 0 }
 *                     effectifGarcons: { type: number, default: 0 }
 *                     effectifFilles: { type: number, default: 0 }
 *                     tauxAccroissement: { type: number, default: 0 }
 *                 enseignementPrimaire:
 *                   type: object
 *                   properties:
 *                     nombreEcoles: { type: number, default: 0 }
 *                     nombreClasses: { type: number, default: 0 }
 *                     classesPlethoriques: { type: number, default: 0 }
 *                     effectifGarcons: { type: number, default: 0 }
 *                     effectifFilles: { type: number, default: 0 }
 *                     tauxAccroissement: { type: number, default: 0 }
 *             niveauSecondaire:
 *               type: object
 *               properties:
 *                 enseignementSpecial:
 *                   type: object
 *                   properties:
 *                     nombreClasses: { type: number, default: 0 }
 *                     effectifGarcons: { type: number, default: 0 }
 *                     effectifFilles: { type: number, default: 0 }
 *                     tauxAccroissement: { type: number, default: 0 }
 *                 enseignementSecondaire:
 *                   type: object
 *                   properties:
 *                     premierCycle:
 *                       type: object
 *                       properties:
 *                         classes7emeCTEB: { type: number, default: 0 }
 *                         classes8emeCTEB: { type: number, default: 0 }
 *                         effectifGarcons: { type: number, default: 0 }
 *                         effectifFilles: { type: number, default: 0 }
 *                         tauxAccroissement: { type: number, default: 0 }
 *                     deuxiemeCycle:
 *                       type: object
 *                       properties:
 *                         classesHumanites: { type: number, default: 0 }
 *                         effectifGarcons: { type: number, default: 0 }
 *                         effectifFilles: { type: number, default: 0 }
 *                         tauxAccroissement: { type: number, default: 0 }
 *         personnel:
 *           type: object
 *           properties:
 *             personnelEnseignant:
 *               type: object
 *               properties:
 *                 prescolaire:
 *                   type: object
 *                   properties:
 *                     hommes: { type: number, default: 0 }
 *                     femmes: { type: number, default: 0 }
 *                 primaire:
 *                   type: object
 *                   properties:
 *                     hommes: { type: number, default: 0 }
 *                     femmes: { type: number, default: 0 }
 *                 secondaire:
 *                   type: object
 *                   properties:
 *                     hommes: { type: number, default: 0 }
 *                     femmes: { type: number, default: 0 }
 *             personnelAdministratif:
 *               type: object
 *               properties:
 *                 directionProvinciale: { type: number, default: 0 }
 *                 inspectionPrincipale: { type: number, default: 0 }
 *                 dinacope: { type: number, default: 0 }
 *                 sernie: { type: number, default: 0 }
 *                 coordinationProvinciale: { type: number, default: 0 }
 *                 sousDivision: { type: number, default: 0 }
 *                 poolsInspectionPrimaire: { type: number, default: 0 }
 *                 poolsInspectionSecondaire: { type: number, default: 0 }
 *                 antenneDinacope: { type: number, default: 0 }
 *                 antenneSernie: { type: number, default: 0 }
 *                 coordinationDiocesaine: { type: number, default: 0 }
 *                 sousCoordinationConventionnees: { type: number, default: 0 }
 *                 conseillerieResidente: { type: number, default: 0 }
 *         realisations:
 *           type: object
 *           properties:
 *             accesAccessibiliteEquite:
 *               type: object
 *               properties:
 *                 nouvellesSallesClasses:
 *                   type: object
 *                   properties:
 *                     prescolaire: { type: number, default: 0 }
 *                     primaire: { type: number, default: 0 }
 *                     secondaire: { type: number, default: 0 }
 *                     sourceFinancement: { type: string }
 *                 nouveauxBancsTables:
 *                   type: object
 *                   properties:
 *                     prescolaire: { type: number, default: 0 }
 *                     primaire: { type: number, default: 0 }
 *                     secondaire: { type: number, default: 0 }
 *                     sourceFinancement: { type: string }
 *                 nouvellesLatrines:
 *                   type: object
 *                   properties:
 *                     prescolaire: { type: number, default: 0 }
 *                     primaire: { type: number, default: 0 }
 *                     secondaire: { type: number, default: 0 }
 *                     sourceFinancement: { type: string }
 *                 gratuitéEnseignementPrimaire: { type: string }
 *                 sensibilisation:
 *                   type: object
 *                   properties:
 *                     filles: { type: boolean, default: false }
 *                     enfantsHorsEcole: { type: boolean, default: false }
 *                     peuplesAutochtones: { type: boolean, default: false }
 *                 cantinesScolaires:
 *                   type: object
 *                   properties:
 *                     prescolaire: { type: number, default: 0 }
 *                     primaire: { type: number, default: 0 }
 *                     secondaire: { type: number, default: 0 }
 *                     commentaire: { type: string }
 *                 indicateursAcces:
 *                   type: object
 *                   properties:
 *                     proportionNouveauxInscrits: { type: number, default: 0 }
 *                     tauxTransitionPrimaireCTEB: { type: number, default: 0 }
 *                     tauxTransitionCTEBHumanites: { type: number, default: 0 }
 *         conclusion:
 *           type: string
 *           description: Conclusion du rapport
 *         statut:
 *           type: string
 *           enum: ['brouillon', 'soumis', 'approuve', 'rejete']
 *           default: 'brouillon'
 *           description: Statut du rapport
 *         annee:
 *           type: number
 *           required: true
 *           description: Année du rapport
 *         fichierJoint:
 *           type: string
 *           description: Chemin vers le fichier joint (optionnel)
 *         createdBy:
 *           type: string
 *           description: ID de l'utilisateur qui a créé le rapport
 *         updatedBy:
 *           type: string
 *           description: ID de l'utilisateur qui a modifié le rapport
 */

const rapportActiviteSchema = new Schema({
  identificationProved: {
    type: Schema.Types.ObjectId,
    ref: 'IdentificationProved',
    required: true
  },
  introduction: {
    type: String
  },
  parametresCles: {
    niveauPrescolaire: {
      espaceCommunautaireEveil: {
        nombreEcoles: { type: Number, default: 0 },
        nombreClasses: { type: Number, default: 0 },
        effectifGarcons: { type: Number, default: 0 },
        effectifFilles: { type: Number, default: 0 },
        tauxAccroissement: { type: Number, default: 0 }
      },
      maternel: {
        nombreEcoles: { type: Number, default: 0 },
        nombreClasses: { type: Number, default: 0 },
        effectifGarcons: { type: Number, default: 0 },
        effectifFilles: { type: Number, default: 0 },
        tauxAccroissement: { type: Number, default: 0 }
      },
      prePrimaire: {
        nombreEcoles: { type: Number, default: 0 },
        nombreClasses: { type: Number, default: 0 },
        effectifGarcons: { type: Number, default: 0 },
        effectifFilles: { type: Number, default: 0 },
        tauxAccroissement: { type: Number, default: 0 }
      },
      special: {
        nombreEcoles: { type: Number, default: 0 },
        nombreClasses: { type: Number, default: 0 },
        effectifGarcons: { type: Number, default: 0 },
        effectifFilles: { type: Number, default: 0 },
        tauxAccroissement: { type: Number, default: 0 }
      }
    },
    niveauPrimaire: {
      enseignementSpecial: {
        nombreClasses: { type: Number, default: 0 },
        effectifGarcons: { type: Number, default: 0 },
        effectifFilles: { type: Number, default: 0 },
        tauxAccroissement: { type: Number, default: 0 }
      },
      enseignementPrimaire: {
        nombreEcoles: { type: Number, default: 0 },
        nombreClasses: { type: Number, default: 0 },
        classesPlethoriques: { type: Number, default: 0 },
        effectifGarcons: { type: Number, default: 0 },
        effectifFilles: { type: Number, default: 0 },
        tauxAccroissement: { type: Number, default: 0 }
      }
    },
    niveauSecondaire: {
      enseignementSpecial: {
        nombreClasses: { type: Number, default: 0 },
        effectifGarcons: { type: Number, default: 0 },
        effectifFilles: { type: Number, default: 0 },
        tauxAccroissement: { type: Number, default: 0 }
      },
      enseignementSecondaire: {
        premierCycle: {
          classes7emeCTEB: { type: Number, default: 0 },
          classes8emeCTEB: { type: Number, default: 0 },
          effectifGarcons: { type: Number, default: 0 },
          effectifFilles: { type: Number, default: 0 },
          tauxAccroissement: { type: Number, default: 0 }
        },
        deuxiemeCycle: {
          classesHumanites: { type: Number, default: 0 },
          effectifGarcons: { type: Number, default: 0 },
          effectifFilles: { type: Number, default: 0 },
          tauxAccroissement: { type: Number, default: 0 }
        }
      }
    }
  },
  personnel: {
    personnelEnseignant: {
      prescolaire: {
        hommes: { type: Number, default: 0 },
        femmes: { type: Number, default: 0 }
      },
      primaire: {
        hommes: { type: Number, default: 0 },
        femmes: { type: Number, default: 0 }
      },
      secondaire: {
        hommes: { type: Number, default: 0 },
        femmes: { type: Number, default: 0 }
      }
    },
    personnelAdministratif: {
      directionProvinciale: { type: Number, default: 0 },
      inspectionPrincipale: { type: Number, default: 0 },
      dinacope: { type: Number, default: 0 },
      sernie: { type: Number, default: 0 },
      coordinationProvinciale: { type: Number, default: 0 },
      sousDivision: { type: Number, default: 0 },
      poolsInspectionPrimaire: { type: Number, default: 0 },
      poolsInspectionSecondaire: { type: Number, default: 0 },
      antenneDinacope: { type: Number, default: 0 },
      antenneSernie: { type: Number, default: 0 },
      coordinationDiocesaine: { type: Number, default: 0 },
      sousCoordinationConventionnees: { type: Number, default: 0 },
      conseillerieResidente: { type: Number, default: 0 }
    }
  },
  realisations: {
    accesAccessibiliteEquite: {
      nouvellesSallesClasses: {
        prescolaire: { type: Number, default: 0 },
        primaire: { type: Number, default: 0 },
        secondaire: { type: Number, default: 0 },
        sourceFinancement: { type: String }
      },
      nouveauxBancsTables: {
        prescolaire: { type: Number, default: 0 },
        primaire: { type: Number, default: 0 },
        secondaire: { type: Number, default: 0 },
        sourceFinancement: { type: String }
      },
      nouvellesLatrines: {
        prescolaire: { type: Number, default: 0 },
        primaire: { type: Number, default: 0 },
        secondaire: { type: Number, default: 0 },
        sourceFinancement: { type: String }
      },
      gratuitéEnseignementPrimaire: { type: String },
      sensibilisation: {
        filles: { type: Boolean, default: false },
        enfantsHorsEcole: { type: Boolean, default: false },
        peuplesAutochtones: { type: Boolean, default: false }
      },
      cantinesScolaires: {
        prescolaire: { type: Number, default: 0 },
        primaire: { type: Number, default: 0 },
        secondaire: { type: Number, default: 0 },
        commentaire: { type: String }
      },
      indicateursAcces: {
        proportionNouveauxInscrits: { type: Number, default: 0 },
        tauxTransitionPrimaireCTEB: { type: Number, default: 0 },
        tauxTransitionCTEBHumanites: { type: Number, default: 0 }
      }
    }
  },
  conclusion: {
    type: String
  },
  statut: {
    type: String,
    enum: ['brouillon', 'soumis', 'approuve', 'rejete'],
    default: 'brouillon'
  },
  annee: {
    type: Number,
    required: true
  },
  fichierJoint: {
    type: String
  }
}, {
  timestamps: true,
  versionKey: false
});

// Ajouter le plugin de pagination
rapportActiviteSchema.plugin(mongoosePaginate);

// Index pour améliorer les performances
rapportActiviteSchema.index({ identificationProved: 1, annee: 1 });
rapportActiviteSchema.index({ statut: 1 });
rapportActiviteSchema.index({ createdBy: 1 });
rapportActiviteSchema.index({ createdAt: -1 });

// Méthodes statiques
rapportActiviteSchema.statics.findByProvedAndYear = function(identificationProved, annee) {
  return this.findOne({ identificationProved, annee });
};

rapportActiviteSchema.statics.findByStatus = function(statut) {
  return this.find({ statut });
};

// Méthodes d'instance
rapportActiviteSchema.methods.submit = function() {
  this.statut = 'soumis';
  return this.save();
};

rapportActiviteSchema.methods.approve = function() {
  this.statut = 'approuve';
  return this.save();
};

rapportActiviteSchema.methods.reject = function() {
  this.statut = 'rejete';
  return this.save();
};

// Middleware pre-save pour valider les données
rapportActiviteSchema.pre('save', function(next) {
  // Validation personnalisée si nécessaire
  if (this.annee && this.annee < 2000) {
    return next(new Error('L\'année doit être supérieure à 2000'));
  }
  next();
});

// Virtual pour calculer le total des effectifs
rapportActiviteSchema.virtual('totalEffectifs').get(function() {
  const prescolaire = this.parametresCles.niveauPrescolaire;
  let total = 0;
  
  // Calculer le total des effectifs préscolaires
  Object.values(prescolaire).forEach(niveau => {
    if (niveau.effectifGarcons) total += niveau.effectifGarcons;
    if (niveau.effectifFilles) total += niveau.effectifFilles;
  });
  
  // Ajouter les effectifs primaires
  const primaire = this.parametresCles.niveauPrimaire.enseignementPrimaire;
  if (primaire.effectifGarcons) total += primaire.effectifGarcons;
  if (primaire.effectifFilles) total += primaire.effectifFilles;
  
  // Ajouter les effectifs secondaires
  const secondaire = this.parametresCles.niveauSecondaire.enseignementSecondaire;
  if (secondaire.premierCycle.effectifGarcons) total += secondaire.premierCycle.effectifGarcons;
  if (secondaire.premierCycle.effectifFilles) total += secondaire.premierCycle.effectifFilles;
  if (secondaire.deuxiemeCycle.effectifGarcons) total += secondaire.deuxiemeCycle.effectifGarcons;
  if (secondaire.deuxiemeCycle.effectifFilles) total += secondaire.deuxiemeCycle.effectifFilles;
  
  return total;
});

// Configuration pour inclure les virtuals dans les réponses JSON
rapportActiviteSchema.set('toJSON', { virtuals: true });
rapportActiviteSchema.set('toObject', { virtuals: true });

module.exports = {
  RapportActivite: model('RapportActivite', rapportActiviteSchema)
}; 