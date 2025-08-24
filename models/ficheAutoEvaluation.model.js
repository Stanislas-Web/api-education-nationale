const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

/**
 * @swagger
 * components:
 *   schemas:
 *     FicheAutoEvaluation:
 *       type: object
 *       required:
 *         - identificationProved
 *         - intituleFormation
 *         - noms
 *         - provenance
 *       properties:
 *         identificationProved:
 *           type: string
 *           description: Référence vers l'identification de la PROVED
 *         intituleFormation:
 *           type: string
 *           description: Intitulé de la formation
 *         noms:
 *           type: string
 *           description: Noms du participant
 *         provenance:
 *           type: string
 *           enum: ['Proved', 'IPP']
 *           description: Provenance du participant (Proved ou IPP)
 *         contenuComprehension:
 *           type: object
 *           properties:
 *             contenuClair:
 *               type: string
 *               enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait']
 *               description: Évaluation de la clarté du contenu
 *             nouvellesConnaissances:
 *               type: string
 *               enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait']
 *               description: Évaluation de l'acquisition de nouvelles connaissances
 *         participationImplication:
 *           type: object
 *           properties:
 *             participationActive:
 *               type: string
 *               enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait']
 *               description: Évaluation de la participation active
 *             rythmeAdapte:
 *               type: string
 *               enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait']
 *               description: Évaluation de l'adaptation du rythme
 *         pertinenceUtilite:
 *           type: object
 *           properties:
 *             themesUtiles:
 *               type: string
 *               enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait']
 *               description: Évaluation de l'utilité des thèmes pour la pratique professionnelle
 *             capaciteApplication:
 *               type: string
 *               enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait']
 *               description: Évaluation de la capacité d'application
 *         suggestionsCommentaires:
 *           type: object
 *           properties:
 *             ceQuiApprecie:
 *               type: string
 *               description: Ce qui a été le plus apprécié aujourd'hui
 *             ameliorations:
 *               type: string
 *               description: Ce qui pourrait être amélioré
 *             autresCommentaires:
 *               type: string
 *               description: Autres commentaires
 *         statut:
 *           type: string
 *           enum: ['brouillon', 'soumis', 'approuve', 'rejete']
 *           default: 'brouillon'
 *           description: Statut de la fiche
 *         createdBy:
 *           type: string
 *           description: ID de l'utilisateur qui a créé la fiche
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création (automatique via timestamps)
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière modification (automatique via timestamps)
 */

const ficheAutoEvaluationSchema = new Schema({
  identificationProved: {
    type: Schema.Types.ObjectId,
    ref: 'IdentificationProved',
    required: true
  },
  intituleFormation: {
    type: String,
    required: true
  },

  noms: {
    type: String,
    required: true
  },
  provenance: {
    type: String,
    enum: ['Proved', 'IPP'],
    required: true
  },
  contenuComprehension: {
    contenuClair: {
      type: String,
      enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait'],
      default: 'Assez'
    },
    nouvellesConnaissances: {
      type: String,
      enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait'],
      default: 'Assez'
    }
  },
  participationImplication: {
    participationActive: {
      type: String,
      enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait'],
      default: 'Assez'
    },
    rythmeAdapte: {
      type: String,
      enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait'],
      default: 'Assez'
    }
  },
  pertinenceUtilite: {
    themesUtiles: {
      type: String,
      enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait'],
      default: 'Assez'
    },
    capaciteApplication: {
      type: String,
      enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait'],
      default: 'Assez'
    }
  },
  suggestionsCommentaires: {
    ceQuiApprecie: {
      type: String,
      default: ''
    },
    ameliorations: {
      type: String,
      default: ''
    },
    autresCommentaires: {
      type: String,
      default: ''
    }
  },
  statut: {
    type: String,
    enum: ['brouillon', 'soumis', 'approuve', 'rejete'],
    default: 'brouillon'
  }
}, {
  timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  versionKey: false
});

// Ajouter le plugin de pagination
ficheAutoEvaluationSchema.plugin(mongoosePaginate);

// Index pour améliorer les performances
ficheAutoEvaluationSchema.index({ identificationProved: 1 });
ficheAutoEvaluationSchema.index({ statut: 1 });
ficheAutoEvaluationSchema.index({ provenance: 1 });
ficheAutoEvaluationSchema.index({ createdAt: -1 });


// Méthodes statiques
ficheAutoEvaluationSchema.statics.findByProvedAndDate = function(identificationProved, date) {
  return this.findOne({ 
    identificationProved, 
    createdAt: {
      $gte: new Date(date),
      $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
    }
  });
};

ficheAutoEvaluationSchema.statics.findByStatus = function(statut) {
  return this.find({ statut });
};

ficheAutoEvaluationSchema.statics.findByProvenance = function(provenance) {
  return this.find({ provenance });
};



// Méthodes d'instance
ficheAutoEvaluationSchema.methods.submit = function() {
  this.statut = 'soumis';
  return this.save();
};

ficheAutoEvaluationSchema.methods.approve = function() {
  this.statut = 'approuve';
  return this.save();
};

ficheAutoEvaluationSchema.methods.reject = function() {
  this.statut = 'rejete';
  return this.save();
};

// Middleware pre-save pour valider les données
ficheAutoEvaluationSchema.pre('save', function(next) {
  // Validation personnalisée si nécessaire
  next();
});

// Virtual pour calculer le score global
ficheAutoEvaluationSchema.virtual('scoreGlobal').get(function() {
  const scores = {
    'Pas du tout': 1,
    'Peu': 2,
    'Assez': 3,
    'Beaucoup': 4,
    'Tout à fait': 5
  };
  
  let total = 0;
  let count = 0;
  
  // Calculer le score pour contenuComprehension
  if (this.contenuComprehension) {
    if (this.contenuComprehension.contenuClair) {
      total += scores[this.contenuComprehension.contenuClair] || 0;
      count++;
    }
    if (this.contenuComprehension.nouvellesConnaissances) {
      total += scores[this.contenuComprehension.nouvellesConnaissances] || 0;
      count++;
    }
  }
  
  // Calculer le score pour participationImplication
  if (this.participationImplication) {
    if (this.participationImplication.participationActive) {
      total += scores[this.participationImplication.participationActive] || 0;
      count++;
    }
    if (this.participationImplication.rythmeAdapte) {
      total += scores[this.participationImplication.rythmeAdapte] || 0;
      count++;
    }
  }
  
  // Calculer le score pour pertinenceUtilite
  if (this.pertinenceUtilite) {
    if (this.pertinenceUtilite.themesUtiles) {
      total += scores[this.pertinenceUtilite.themesUtiles] || 0;
      count++;
    }
    if (this.pertinenceUtilite.capaciteApplication) {
      total += scores[this.pertinenceUtilite.capaciteApplication] || 0;
      count++;
    }
  }
  
  return count > 0 ? (total / count).toFixed(2) : 0;
});

// Configuration pour inclure les virtuals dans les réponses JSON
ficheAutoEvaluationSchema.set('toJSON', { virtuals: true });
ficheAutoEvaluationSchema.set('toObject', { virtuals: true });

module.exports = {
  FicheAutoEvaluation: model('FicheAutoEvaluation', ficheAutoEvaluationSchema)
};
