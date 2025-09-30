const { Schema, model } = require('mongoose');

/**
 * Modèle pour stocker les effectifs annuels et calculer les taux d'accroissement
 */

const effectifAnnuelSchema = new Schema({
  identificationProved: {
    type: Schema.Types.ObjectId,
    ref: 'IdentificationProved',
    required: true
  },
  annee: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{4}$/.test(v);
      },
      message: props => `${props.value} n'est pas un format d'année scolaire valide (ex: 2024-2025)`
    }
  },
  effectifs: {
    niveauPrescolaire: {
      espaceCommunautaireEveil: {
        effectifGarconsFilles: { type: Number, default: 0 },
        effectifFilles: { type: Number, default: 0 }
      },
      maternel: {
        effectifGarconsFilles: { type: Number, default: 0 },
        effectifFilles: { type: Number, default: 0 }
      },
      prePrimaire: {
        effectifGarconsFilles: { type: Number, default: 0 },
        effectifFilles: { type: Number, default: 0 }
      },
      special: {
        effectifGarconsFilles: { type: Number, default: 0 },
        effectifFilles: { type: Number, default: 0 }
      }
    },
    niveauPrimaire: {
      enseignementSpecial: {
        effectifGarconsFilles: { type: Number, default: 0 },
        effectifFilles: { type: Number, default: 0 }
      },
      enseignementPrimaire: {
        effectifGarconsFilles: { type: Number, default: 0 },
        effectifFilles: { type: Number, default: 0 }
      }
    },
    niveauSecondaire: {
      enseignementSpecial: {
        effectifGarcons: { type: Number, default: 0 },
        effectifFilles: { type: Number, default: 0 }
      },
      enseignementSecondaire: {
        septiemeCTEB: {
          effectifGarcons: { type: Number, default: 0 },
          effectifFilles: { type: Number, default: 0 }
        },
        huitiemeCTEB: {
          effectifGarcons: { type: Number, default: 0 },
          effectifFilles: { type: Number, default: 0 }
        },
        premiereHumanite: {
          effectifGarcons: { type: Number, default: 0 },
          effectifFilles: { type: Number, default: 0 }
        },
        quatriemeHumanite: {
          effectifGarcons: { type: Number, default: 0 },
          effectifFilles: { type: Number, default: 0 }
        }
      }
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Index unique pour éviter les doublons
effectifAnnuelSchema.index({ identificationProved: 1, annee: 1 }, { unique: true });

// Méthode statique pour récupérer l'effectif d'une année
effectifAnnuelSchema.statics.getEffectifByYear = function(identificationProved, annee) {
  return this.findOne({ identificationProved, annee });
};

// Méthode statique pour calculer le taux d'accroissement
effectifAnnuelSchema.statics.calculateTauxAccroissement = function(effectifActuel, effectifPrecedent) {
  if (!effectifPrecedent || effectifPrecedent === 0) {
    return 0;
  }
  const taux = ((effectifActuel - effectifPrecedent) / effectifPrecedent) * 100;
  return Math.round(taux * 100) / 100; // Arrondir à 2 décimales
};

// Méthode pour sauvegarder ou mettre à jour les effectifs
effectifAnnuelSchema.statics.saveEffectifs = async function(identificationProved, annee, effectifs) {
  return this.findOneAndUpdate(
    { identificationProved, annee },
    { effectifs },
    { upsert: true, new: true }
  );
};

module.exports = {
  EffectifAnnuel: model('EffectifAnnuel', effectifAnnuelSchema)
};