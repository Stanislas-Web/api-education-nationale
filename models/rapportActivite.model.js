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
    // 1.1. Nbre d'Ecole / Nbre de Classe
    nombreEcolesClasses: {
      niveauPrescolaire: {
        espaceCommunautaireEveil: {
          nombreEcoles: { type: Number, default: 0 },
          nombreClasses: { type: Number, default: 0 }
        },
        maternel: {
          nombreEcoles: { type: Number, default: 0 },
          nombreClasses: { type: Number, default: 0 }
        },
        prePrimaire: {
          nombreEcoles: { type: Number, default: 0 },
          nombreClasses: { type: Number, default: 0 }
        },
        special: {
          nombreEcoles: { type: Number, default: 0 },
          nombreClasses: { type: Number, default: 0 }
        }
      },
      niveauPrimaire: {
        enseignementSpecial: {
          nombreEcoles: { type: Number, default: 0 },
          totalClassesSpecialesPrim: { type: Number, default: 0 }
        },
        enseignementPrimaire: {
          nombreEcoles: { type: Number, default: 0 },
          totalClassesPrimaire: { type: Number, default: 0 },
          classesPlethoriques: { type: String, default: '-' }
        }
      },
      niveauSecondaire: {
        enseignementSpecial: {
          nombreEcoles: { type: Number, default: 0 },
          totalClassesSpecialesSec: { type: Number, default: 0 }
        },
        enseignementSecondaire: {
          nombreEcoles: { type: Number, default: 0 },
          premierCycle: {
            classes7emeCTEB: { type: Number, default: 0 },
            classes8emeCTEB: { type: Number, default: 0 }
          },
          deuxiemeCycle: {
            totalClassesHumanites: { type: Number, default: 0 }
          },
          totalClasses1er2emeCycle: { type: Number, default: 0 }
        }
      }
    },
    // 1.2. Effectif Scolaire et Taux d'accroissement
    effectifScolaire: {
      niveauPrescolaire: {
        espaceCommunautaireEveil: {
          effectifGarconsFilles: { type: Number, default: 0 },
          effectifFilles: { type: Number, default: 0 },
          tauxAccroissementGarconsFilles: { type: Number, default: 0 },
          tauxAccroissementFilles: { type: Number, default: 0 }
        },
        maternel: {
          effectifGarconsFilles: { type: Number, default: 0 },
          effectifFilles: { type: Number, default: 0 },
          tauxAccroissementGarconsFilles: { type: Number, default: 0 },
          tauxAccroissementFilles: { type: Number, default: 0 }
        },
        prePrimaire: {
          effectifGarconsFilles: { type: Number, default: 0 },
          effectifFilles: { type: Number, default: 0 },
          tauxAccroissementGarconsFilles: { type: Number, default: 0 },
          tauxAccroissementFilles: { type: Number, default: 0 }
        },
        special: {
          effectifGarconsFilles: { type: Number, default: 0 },
          effectifFilles: { type: Number, default: 0 },
          tauxAccroissementGarconsFilles: { type: Number, default: 0 },
          tauxAccroissementFilles: { type: Number, default: 0 }
        }
      },
      niveauPrimaire: {
        enseignementSpecial: {
          effectifGarconsFilles: { type: Number, default: 0 },
          effectifFilles: { type: Number, default: 0 },
          tauxAccroissementGarconsFilles: { type: Number, default: 0 },
          tauxAccroissementFilles: { type: Number, default: 0 }
        },
        enseignementPrimaire: {
          effectifGarconsFilles: { type: Number, default: 0 },
          effectifFilles: { type: Number, default: 0 },
          tauxAccroissementGarconsFilles: { type: Number, default: 0 },
          tauxAccroissementFilles: { type: Number, default: 0 }
        }
      },
      niveauSecondaire: {
        enseignementSpecial: {
          effectifGarcons: { type: Number, default: 0 },
          effectifFilles: { type: Number, default: 0 },
          tauxGarcons: { type: Number, default: 0 },
          tauxFilles: { type: Number, default: 0 }
        },
        enseignementSecondaire: {
          septiemeCTEB: {
            effectifGarcons: { type: Number, default: 0 },
            effectifFilles: { type: Number, default: 0 },
            tauxGarcons: { type: Number, default: 0 },
            tauxFilles: { type: Number, default: 0 }
          },
          huitiemeCTEB: {
            effectifGarcons: { type: Number, default: 0 },
            effectifFilles: { type: Number, default: 0 },
            tauxGarcons: { type: Number, default: 0 },
            tauxFilles: { type: Number, default: 0 }
          },
          premiereHumanite: {
            effectifGarcons: { type: Number, default: 0 },
            effectifFilles: { type: Number, default: 0 },
            tauxGarcons: { type: Number, default: 0 },
            tauxFilles: { type: Number, default: 0 }
          },
          quatriemeHumanite: {
            effectifGarcons: { type: Number, default: 0 },
            effectifFilles: { type: Number, default: 0 },
            tauxGarcons: { type: Number, default: 0 },
            tauxFilles: { type: Number, default: 0 }
          }
        }
      }
    }
  },


  
  personnel: {
    personnelEnseignant: {
      niveauPrescolaire: {
        enseignementPrescolaireSpecial: {
          hommes: { type: Number, default: 0 },
          femmes: { type: Number, default: 0 }
        },
        enseignementPrescolaire: {
          hommes: { type: Number, default: 0 },
          femmes: { type: Number, default: 0 }
        }
      },
      niveauPrimaire: {
        enseignementPrescolaireSpecial: {
          hommes: { type: Number, default: 0 },
          femmes: { type: Number, default: 0 }
        },
        enseignementPrimaire: {
          hommes: { type: Number, default: 0 },
          femmes: { type: Number, default: 0 }
        }
      },
      niveauSecondaire: {
        enseignementPrescolaireSpecial: {
          hommes: { type: Number, default: 0 },
          femmes: { type: Number, default: 0 }
        },
        enseignementSecondaire: {
          hommes: { type: Number, default: 0 },
          femmes: { type: Number, default: 0 }
        }
      }
    },
    personnelAdministratif: {
      directionProvinciale: {
        hommes: { type: Number, default: 0 },
        femmes: { type: Number, default: 0 }
      },
      inspectionPrincipale: {
        hommes: { type: Number, default: 0 },
        femmes: { type: Number, default: 0 }
      },
      dinacope: {
        hommes: { type: Number, default: 0 },
        femmes: { type: Number, default: 0 }
      },
      sernie: {
        hommes: { type: Number, default: 0 },
        femmes: { type: Number, default: 0 }
      },
      coordinationProvinciale: {
        hommes: { type: Number, default: 0 },
        femmes: { type: Number, default: 0 }
      },
      sousDivision: {
        hommes: { type: Number, default: 0 },
        femmes: { type: Number, default: 0 }
      },
      poolsInspectionPrimaire: {
        hommes: { type: Number, default: 0 },
        femmes: { type: Number, default: 0 }
      },
      poolsInspectionSecondaire: {
        hommes: { type: Number, default: 0 },
        femmes: { type: Number, default: 0 }
      },
      antenneDinacope: {
        hommes: { type: Number, default: 0 },
        femmes: { type: Number, default: 0 }
      },
      antenneSernie: {
        hommes: { type: Number, default: 0 },
        femmes: { type: Number, default: 0 }
      },
      coordinationDiocesaine: {
        hommes: { type: Number, default: 0 },
        femmes: { type: Number, default: 0 }
      }
    }
  },
  realisations: {
    accesAccessibiliteEquite: {
      nouvellesSallesClasses: {
        prescolaire: { type: Number, default: 0 },
        primaire: { type: Number, default: 0 },
        secondaire: { type: Number, default: 0 },
        sourceFinancementPrescolaire: { type: String },
        sourceFinancementPrimaire: { type: String },
        sourceFinancementSecondaire: { type: String }
      },
      nouveauxBancsTables: {
        prescolaire: { type: Number, default: 0 },
        primaire: { type: Number, default: 0 },
        secondaire: { type: Number, default: 0 },
        sourceFinancementPrescolaire: { type: String },
        sourceFinancementPrimaire: { type: String },
        sourceFinancementSecondaire: { type: String }
      },
      nouvellesLatrines: {
        prescolaire: { type: Number, default: 0 },
        primaire: { type: Number, default: 0 },
        secondaire: { type: Number, default: 0 },
        sourceFinancementPrescolaire: { type: String },
        sourceFinancementPrimaire: { type: String },
        sourceFinancementSecondaire: { type: String }
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
        totalGeneralEcoles: { type: Number, default: 0 },
        commentaire: { type: String },
        cantinesScolairesDetail: {
          prescolaire: {
            gvt: { type: Number, default: 0 },
            projet: { type: Number, default: 0 },
            ptfs: { type: Number, default: 0 },
            ong: { type: Number, default: 0 }
          },
          primaire: {
            gvt: { type: Number, default: 0 },
            projet: { type: Number, default: 0 },
            ptfs: { type: Number, default: 0 },
            ong: { type: Number, default: 0 }
          },
          secondaire: {
            gvt: { type: Number, default: 0 },
            projet: { type: Number, default: 0 },
            ptfs: { type: Number, default: 0 },
            ong: { type: Number, default: 0 }
          }
        }
      },
      indicateursAcces: {
        proportionNouveauxInscrits: { type: Number, default: 0 },
        tauxTransitionPrimaireCTEB: { type: Number, default: 0 },
        tauxTransitionCTEBHumanites: { type: Number, default: 0 }
      }
    }
  },
  ameliorationQualite: {
    disponibiliteMoyensEnseignement: {
      programmesScolaires: {
        ece: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        preprimaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        maternel: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        primaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        secondaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        prescolaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' }
      },
      manuelsScolaires: {
        ece: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        preprimaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        maternel: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        primaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        secondaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        prescolaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' }
      },
      materielsDidactiques: {
        ece: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        preprimaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        maternel: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        primaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        secondaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        prescolaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' }
      },
      laboratoires: {
        chimie: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        biologie: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        physique: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' }
      },
      equipementsAteliers: {
        humanitesTechniques: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' }
      }
    },
    visitesEtReunions: {
      visitesClasses: {
        prescolaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: 'BON' },
        primaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: 'BON' },
        secondaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: 'BON' },
        special: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: 'BON' }
      },
      reunionsPedagogiques: {
        prescolaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: 'BON' },
        primaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: 'BON' },
        secondaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: 'BON' }
      },
      fonctionnementCelluleBase: {
        prescolaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: 'BON' },
        primaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: 'BON' },
        secondaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: 'BON' },
        special: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: 'BON' }
      }
    },
    activitesInspectorales: {
      inspectionsPedagogiquesC3: {
        prescolaire: {
          nombrePrevu: { type: Number, default: 0 },
          nombreRealise: { type: Number, default: 0 },
          pourcentageRealisation: { type: Number, default: 0 }
        },
        primaire: {
          nombrePrevu: { type: Number, default: 0 },
          nombreRealise: { type: Number, default: 0 },
          pourcentageRealisation: { type: Number, default: 0 }
        },
        secondaire: {
          nombrePrevu: { type: Number, default: 0 },
          nombreRealise: { type: Number, default: 0 },
          pourcentageRealisation: { type: Number, default: 0 }
        },
        special: {
          nombrePrevu: { type: Number, default: 0 },
          nombreRealise: { type: Number, default: 0 },
          pourcentageRealisation: { type: Number, default: 0 }
        }
      },
      inspectionsFormation: {
        prescolaire: {
          nombrePrevu: { type: Number, default: 0 },
          nombreRealise: { type: Number, default: 0 },
          pourcentageRealisation: { type: Number, default: 0 }
        },
        primaire: {
          nombrePrevu: { type: Number, default: 0 },
          nombreRealise: { type: Number, default: 0 },
          pourcentageRealisation: { type: Number, default: 0 }
        },
        secondaire: {
          nombrePrevu: { type: Number, default: 0 },
          nombreRealise: { type: Number, default: 0 },
          pourcentageRealisation: { type: Number, default: 0 }
        },
        special: {
          nombrePrevu: { type: Number, default: 0 },
          nombreRealise: { type: Number, default: 0 },
          pourcentageRealisation: { type: Number, default: 0 }
        }
      },
      formationContinue: {
        prescolaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        primaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        secondaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' },
        special: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'], default: 'BON' }
      },
      themesExploites: {
        ece: { type: String },
        maternel: { type: String }
      }
    },
    indicateursRendement: {
      rendementInterne: {
        prescolaire: {
          tauxAbandon: { type: Number, default: 0 },
          tauxReussite: { type: Number, default: 0 },
          tauxEchec: { type: Number, default: 0 }
        },
        primaire: {
          tauxAbandon: { type: Number, default: 0 },
          tauxReussite: { type: Number, default: 0 },
          tauxEchec: { type: Number, default: 0 }
        },
        secondaire: {
          tauxAbandon: { type: Number, default: 0 },
          tauxReussite: { type: Number, default: 0 },
          tauxEchec: { type: Number, default: 0 }
        }
      },
      rendementExterne: {
        examensCertificatifs: {
          tauxDiplomes: { type: Number, default: 0 },
          tauxHumanitesScientifiques: { type: Number, default: 0 },
          tauxHumanitesTechniques: { type: Number, default: 0 }
        }
      }
    }
  },
  gouvernance: {
    miseEnOeuvreSSEF: {
      niveauProvinceEducationnelle: {
        elaborationPAO: { type: String },
        miseEnOeuvre: { type: String },
        evaluationMiParcours: { type: String },
        evaluationFinale: { type: String }
      },
      niveauProvinceAdministrative: {
        elaborationPAO: { type: String },
        miseEnOeuvre: { type: String },
        evaluationMiParcours: { type: String },
        evaluationFinale: { type: String }
      }
    },
    inspectionsAdministrativesC2B: {
      prescolaire: {
        nombrePrevu: { type: Number, default: 0 },
        nombreRealise: { type: Number, default: 0 },
        pourcentageRealisation: { type: Number, default: 0 }
      },
      primaire: {
        nombrePrevu: { type: Number, default: 0 },
        nombreRealise: { type: Number, default: 0 },
        pourcentageRealisation: { type: Number, default: 0 }
      },
      secondaire: {
        nombrePrevu: { type: Number, default: 0 },
        nombreRealise: { type: Number, default: 0 },
        pourcentageRealisation: { type: Number, default: 0 }
      },
      special: {
        nombrePrevu: { type: Number, default: 0 },
        nombreRealise: { type: Number, default: 0 },
        pourcentageRealisation: { type: Number, default: 0 }
      }
    },
    comitesProvinciaux: {
      comiteEDUNC: {
        frequenceReunions: { type: String },
        pointsTraites: { type: String }
      },
      comiteENAFP: {
        frequenceReunions: { type: String },
        pointsTraites: { type: String }
      },
      comiteTENASOSP: {
        frequenceReunions: { type: String },
        pointsTraites: { type: String }
      },
      comiteExamenEtat: {
        frequenceReunions: { type: String },
        pointsTraites: { type: String }
      }
    },
    remunerationPersonnel: {
      directionProvinciale: {
        totalAgents: { type: Number, default: 0 },
        nonPayes: { type: Number, default: 0 }
      },
      inspectionPrincipale: {
        totalAgents: { type: Number, default: 0 },
        nonPayes: { type: Number, default: 0 }
      },
      dinacope: {
        totalAgents: { type: Number, default: 0 },
        nonPayes: { type: Number, default: 0 }
      },
      sernie: {
        totalAgents: { type: Number, default: 0 },
        nonPayes: { type: Number, default: 0 }
      },
      coordinationProvinciale: {
        totalAgents: { type: Number, default: 0 },
        nonPayes: { type: Number, default: 0 }
      },
      sousDivision: {
        totalAgents: { type: Number, default: 0 },
        nonPayes: { type: Number, default: 0 }
      },
      poolsInspectionPrimaire: {
        totalAgents: { type: Number, default: 0 },
        nonPayes: { type: Number, default: 0 }
      },
      poolsInspectionSecondaire: {
        totalAgents: { type: Number, default: 0 },
        nonPayes: { type: Number, default: 0 }
      },
      antenneDinacope: {
        totalAgents: { type: Number, default: 0 },
        nonPayes: { type: Number, default: 0 }
      },
      antenneSernie: {
        totalAgents: { type: Number, default: 0 },
        nonPayes: { type: Number, default: 0 }
      },
      coordinationDiocesaine: {
        totalAgents: { type: Number, default: 0 },
        nonPayes: { type: Number, default: 0 }
      },
      sousCoordinationConventionnees: {
        totalAgents: { type: Number, default: 0 },
        nonPayes: { type: Number, default: 0 }
      },
      conseillerieResidente: {
        totalAgents: { type: Number, default: 0 },
        nonPayes: { type: Number, default: 0 }
      }
    },
    vulgarisationInstructions: {
      instructionsOfficielles: { type: String },
      nouvelleCitoyennete: { type: String }
    },
    groupesAidesPsychopedagogiques: {
      nombreGAPMisEnPlace: { type: Number, default: 0 },
      nombreGAPOperationnel: { type: Number, default: 0 },
      nombreCasPrisEnCharge: { type: Number, default: 0 },
      problemesIdentifies: { type: String },
      solutionsPreconisees: { type: String }
    },
    acquisitionsMateriels: {
      ecoles: {
        nature: { type: String },
        sourceFinancement: {
          gvt: { type: Number, default: 0 },
          projet: { type: Number, default: 0 },
          ptfs: { type: Number, default: 0 },
          ong: { type: Number, default: 0 }
        }
      },
      bureauxGestionnaires: {
        nature: { type: String },
        sourceFinancement: {
          gvt: { type: Number, default: 0 },
          projet: { type: Number, default: 0 },
          ptfs: { type: Number, default: 0 },
          ong: { type: Number, default: 0 }
        }
      }
    },
    infrastructureBureaux: {
      directionProvinciale: {
        proprietaire: { type: Number, default: 0 },
        locataire: { type: Number, default: 0 }
      },
      inspectionPrincipale: {
        proprietaire: { type: Number, default: 0 },
        locataire: { type: Number, default: 0 }
      },
      dinacope: {
        proprietaire: { type: Number, default: 0 },
        locataire: { type: Number, default: 0 }
      },
      sernie: {
        proprietaire: { type: Number, default: 0 },
        locataire: { type: Number, default: 0 }
      },
      coordinationProvinciale: {
        proprietaire: { type: Number, default: 0 },
        locataire: { type: Number, default: 0 }
      },
      sousDivision: {
        proprietaire: { type: Number, default: 0 },
        locataire: { type: Number, default: 0 }
      },
      poolsInspectionPrimaire: {
        proprietaire: { type: Number, default: 0 },
        locataire: { type: Number, default: 0 }
      },
      poolsInspectionSecondaire: {
        proprietaire: { type: Number, default: 0 },
        locataire: { type: Number, default: 0 }
      },
      antenneDinacope: {
        proprietaire: { type: Number, default: 0 },
        locataire: { type: Number, default: 0 }
      },
      antenneSernie: {
        proprietaire: { type: Number, default: 0 },
        locataire: { type: Number, default: 0 }
      },
      coordinationDiocesaine: {
        proprietaire: { type: Number, default: 0 },
        locataire: { type: Number, default: 0 }
      },
      sousCoordinationConventionnees: {
        proprietaire: { type: Number, default: 0 },
        locataire: { type: Number, default: 0 }
      },
      conseillerieResidente: {
        proprietaire: { type: Number, default: 0 },
        locataire: { type: Number, default: 0 }
      }
    },
    totalInfrastructureBureaux: {
      totalProprietaire: { type: Number, default: 0 },
      totalLocataire: { type: Number, default: 0 }
    }
  },
  educationUrgence: {
    planStockContingence: {
      plan: { type: String },
      stock: { type: String }
    },
    catastrophesNaturelles: {
      nature: { type: String },
      effetsNegatifs: { type: String }
    },
    destructionSDC: {
      forcesNegatives: { type: String }
    },
    solutionsLocales: { type: String },
    reunionsClusterEducation: {
      frequence: { type: String },
      pointsTraites: { type: String }
    },
    recommandations: {
      espacesTemporairesApprentissage: {
        nombre: { type: Number, default: 0 },
        couts: { type: String }
      },
      apprenantsScolarises: {
        cible: { type: Number, default: 0 }
      },
      formationEnseignantsESU: { type: String }
    }
  },
  autresProblemes: {
    // VI. AUTRES PRINCIPAUX PROBLEMES SPECIFIQUES
    // VI.1. Autres principaux problèmes spécifiques (10 lignes maximum)
    problemesSpecifiques: { 
      type: String,
      maxlength: 1000,
      description: "VI.1. Autres principaux problèmes spécifiques (10 lignes maximum)"
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
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{4}$/.test(v);
      },
      message: props => `${props.value} n'est pas un format d'année scolaire valide (ex: 2024-2025)`
    }
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

// Middleware pre-save pour valider les données et calculer les totaux
rapportActiviteSchema.pre('save', function(next) {
  // Validation personnalisée si nécessaire
  if (this.annee && typeof this.annee === 'string') {
    const [debut] = this.annee.split('-');
    if (parseInt(debut) < 2000) {
      return next(new Error('L\'année de début doit être supérieure à 2000'));
    }
  }
  
  // Calculer les totaux des infrastructures bureaux
  if (this.gouvernance && this.gouvernance.infrastructureBureaux) {
    let totalProprietaire = 0;
    let totalLocataire = 0;
    
    Object.values(this.gouvernance.infrastructureBureaux).forEach(bureau => {
      if (bureau.proprietaire) totalProprietaire += bureau.proprietaire;
      if (bureau.locataire) totalLocataire += bureau.locataire;
    });
    
    // Initialiser totalInfrastructureBureaux s'il n'existe pas
    if (!this.gouvernance.totalInfrastructureBureaux) {
      this.gouvernance.totalInfrastructureBureaux = {};
    }
    
    this.gouvernance.totalInfrastructureBureaux.totalProprietaire = totalProprietaire;
    this.gouvernance.totalInfrastructureBureaux.totalLocataire = totalLocataire;
  }
  
  next();
});

// Virtual pour calculer le total des effectifs
rapportActiviteSchema.virtual('totalEffectifs').get(function() {
  let total = 0;
  
  // Calculer le total des effectifs préscolaires
  if (this.parametresCles && this.parametresCles.effectifScolaire && this.parametresCles.effectifScolaire.niveauPrescolaire) {
    const prescolaire = this.parametresCles.effectifScolaire.niveauPrescolaire;
    Object.values(prescolaire).forEach(niveau => {
      if (niveau.effectifGarconsFilles) total += niveau.effectifGarconsFilles;
    });
  }
  
  // Ajouter les effectifs primaires
  if (this.parametresCles && this.parametresCles.effectifScolaire && this.parametresCles.effectifScolaire.niveauPrimaire) {
    const primaire = this.parametresCles.effectifScolaire.niveauPrimaire.enseignementPrimaire;
    if (primaire.effectifGarconsFilles) total += primaire.effectifGarconsFilles;
  }
  
  // Ajouter les effectifs secondaires
  if (this.parametresCles && this.parametresCles.effectifScolaire && this.parametresCles.effectifScolaire.niveauSecondaire) {
    const secondaire = this.parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire;
    if (secondaire.septiemeCTEB.effectifGarcons) total += secondaire.septiemeCTEB.effectifGarcons;
    if (secondaire.septiemeCTEB.effectifFilles) total += secondaire.septiemeCTEB.effectifFilles;
    if (secondaire.huitiemeCTEB.effectifGarcons) total += secondaire.huitiemeCTEB.effectifGarcons;
    if (secondaire.huitiemeCTEB.effectifFilles) total += secondaire.huitiemeCTEB.effectifFilles;
    if (secondaire.premiereHumanite.effectifGarcons) total += secondaire.premiereHumanite.effectifGarcons;
    if (secondaire.premiereHumanite.effectifFilles) total += secondaire.premiereHumanite.effectifFilles;
    if (secondaire.quatriemeHumanite.effectifGarcons) total += secondaire.quatriemeHumanite.effectifGarcons;
    if (secondaire.quatriemeHumanite.effectifFilles) total += secondaire.quatriemeHumanite.effectifFilles;
  }
  
  return total;
});

// Virtual pour calculer le total des infrastructures bureaux
rapportActiviteSchema.virtual('totalInfrastructureBureaux').get(function() {
  if (!this.gouvernance || !this.gouvernance.infrastructureBureaux) {
    return { totalProprietaire: 0, totalLocataire: 0 };
  }
  
  let totalProprietaire = 0;
  let totalLocataire = 0;
  
  Object.values(this.gouvernance.infrastructureBureaux).forEach(bureau => {
    if (bureau.proprietaire) totalProprietaire += bureau.proprietaire;
    if (bureau.locataire) totalLocataire += bureau.locataire;
  });
  
  return { totalProprietaire, totalLocataire };
});

// Configuration pour inclure les virtuals dans les réponses JSON
rapportActiviteSchema.set('toJSON', { virtuals: true });
rapportActiviteSchema.set('toObject', { virtuals: true });

module.exports = {
  RapportActivite: model('RapportActivite', rapportActiviteSchema)
}; 