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
 *                 ecoleEspaceCommunautaire:
 *                   type: object
 *                   properties:
 *                     nombreEcoles: { type: number }
 *                     nombreClasses: { type: number }
 *                     effectifGarcons: { type: number }
 *                     effectifFilles: { type: number }
 *                     tauxAccroissement: { type: number }
 *                 maternel:
 *                   type: object
 *                   properties:
 *                     nombreEcoles: { type: number }
 *                     nombreClasses: { type: number }
 *                     effectifGarcons: { type: number }
 *                     effectifFilles: { type: number }
 *                     tauxAccroissement: { type: number }
 *                 prePrimaire:
 *                   type: object
 *                   properties:
 *                     nombreEcoles: { type: number }
 *                     nombreClasses: { type: number }
 *                     effectifGarcons: { type: number }
 *                     effectifFilles: { type: number }
 *                     tauxAccroissement: { type: number }
 *                 special:
 *                   type: object
 *                   properties:
 *                     nombreEcoles: { type: number }
 *                     nombreClasses: { type: number }
 *                     effectifGarcons: { type: number }
 *                     effectifFilles: { type: number }
 *                     tauxAccroissement: { type: number }
 *             niveauPrimaire:
 *               type: object
 *               properties:
 *                 enseignementSpecial:
 *                   type: object
 *                   properties:
 *                     nombreClasses: { type: number }
 *                     effectifGarcons: { type: number }
 *                     effectifFilles: { type: number }
 *                     tauxAccroissement: { type: number }
 *                 enseignementPrimaire:
 *                   type: object
 *                   properties:
 *                     nombreEcoles: { type: number }
 *                     nombreClasses: { type: number }
 *                     classesPlethoriques: { type: number }
 *                     effectifGarcons: { type: number }
 *                     effectifFilles: { type: number }
 *                     tauxAccroissement: { type: number }
 *             niveauSecondaire:
 *               type: object
 *               properties:
 *                 enseignementSpecial:
 *                   type: object
 *                   properties:
 *                     nombreClasses: { type: number }
 *                     effectifGarcons: { type: number }
 *                     effectifFilles: { type: number }
 *                     tauxAccroissement: { type: number }
 *                 enseignementSecondaire:
 *                   type: object
 *                   properties:
 *                     premierCycle:
 *                       type: object
 *                       properties:
 *                         classes7emeCTEB: { type: number }
 *                         classes8emeCTEB: { type: number }
 *                         effectifGarcons: { type: number }
 *                         effectifFilles: { type: number }
 *                         tauxAccroissement: { type: number }
 *                     deuxiemeCycle:
 *                       type: object
 *                       properties:
 *                         classesHumanites: { type: number }
 *                         effectifGarcons: { type: number }
 *                         effectifFilles: { type: number }
 *                         tauxAccroissement: { type: number }
 *         personnel:
 *           type: object
 *           properties:
 *             personnelEnseignant:
 *               type: object
 *               properties:
 *                 prescolaire:
 *                   type: object
 *                   properties:
 *                     hommes: { type: number }
 *                     femmes: { type: number }
 *                 primaire:
 *                   type: object
 *                   properties:
 *                     hommes: { type: number }
 *                     femmes: { type: number }
 *                 secondaire:
 *                   type: object
 *                   properties:
 *                     hommes: { type: number }
 *                     femmes: { type: number }
 *             personnelAdministratif:
 *               type: object
 *               properties:
 *                 directionProvinciale: { type: number }
 *                 inspectionPrincipale: { type: number }
 *                 dinacope: { type: number }
 *                 sernie: { type: number }
 *                 coordinationProvinciale: { type: number }
 *                 sousDivision: { type: number }
 *                 poolsInspectionPrimaire: { type: number }
 *                 poolsInspectionSecondaire: { type: number }
 *                 antenneDinacope: { type: number }
 *                 antenneSernie: { type: number }
 *                 coordinationDiocesaine: { type: number }
 *                 sousCoordinationConventionnees: { type: number }
 *                 conseillerieResidente: { type: number }
 *         realisations:
 *           type: object
 *           properties:
 *             accesAccessibiliteEquite:
 *               type: object
 *               properties:
 *                 nouvellesSallesClasses:
 *                   type: object
 *                   properties:
 *                     prescolaire: { type: number }
 *                     primaire: { type: number }
 *                     secondaire: { type: number }
 *                     sourceFinancement: { type: string }
 *                 nouveauxBancsTables:
 *                   type: object
 *                   properties:
 *                     prescolaire: { type: number }
 *                     primaire: { type: number }
 *                     secondaire: { type: number }
 *                     sourceFinancement: { type: string }
 *                 nouvellesLatrines:
 *                   type: object
 *                   properties:
 *                     prescolaire: { type: number }
 *                     primaire: { type: number }
 *                     secondaire: { type: number }
 *                     sourceFinancement: { type: string }
 *                 gratuitéEnseignementPrimaire:
 *                   type: string
 *                   description: Commentaire sur la gratuité de l'enseignement primaire
 *                 sensibilisation:
 *                   type: object
 *                   properties:
 *                     filles: { type: boolean }
 *                     enfantsHorsEcole: { type: boolean }
 *                     peuplesAutochtones: { type: boolean }
 *                 cantinesScolaires:
 *                   type: object
 *                   properties:
 *                     prescolaire: { type: number }
 *                     primaire: { type: number }
 *                     secondaire: { type: number }
 *                     commentaire: { type: string }
 *                 indicateursAcces:
 *                   type: object
 *                   properties:
 *                     proportionNouveauxInscrits: { type: number }
 *                     tauxTransitionPrimaireCTEB: { type: number }
 *                     tauxTransitionCTEBHumanites: { type: number }
 *             ameliorationQualite:
 *               type: object
 *               properties:
 *                 moyensEnseignement:
 *                   type: object
 *                   properties:
 *                     programmesScolaires: { type: object }
 *                     manuelsScolaires: { type: object }
 *                     materielsDidactiques: { type: object }
 *                     laboratoires: { type: object }
 *                     equipementsAteliers: { type: object }
 *                 visitesClasses:
 *                   type: object
 *                   properties:
 *                     prescolaire: { type: string, enum: ['TRES BON', 'BON', 'ASSEZ BON'] }
 *                     primaire: { type: string, enum: ['TRES BON', 'BON', 'ASSEZ BON'] }
 *                     secondaire: { type: string, enum: ['TRES BON', 'BON', 'ASSEZ BON'] }
 *                 reunionsPedagogiques:
 *                   type: object
 *                   properties:
 *                     prescolaire: { type: string, enum: ['TRES BON', 'BON', 'ASSEZ BON'] }
 *                     primaire: { type: string, enum: ['TRES BON', 'BON', 'ASSEZ BON'] }
 *                     secondaire: { type: string, enum: ['TRES BON', 'BON', 'ASSEZ BON'] }
 *                 inspectionsPedagogiques:
 *                   type: object
 *                   properties:
 *                     nombrePrevu: { type: number }
 *                     nombreRealise: { type: number }
 *                     pourcentageRealisation: { type: number }
 *                 formationContinue:
 *                   type: object
 *                   properties:
 *                     prescolaire: { type: string, enum: ['TRES BON', 'BON', 'CARENCE'] }
 *                     primaire: { type: string, enum: ['TRES BON', 'BON', 'CARENCE'] }
 *                     secondaire: { type: string, enum: ['TRES BON', 'BON', 'CARENCE'] }
 *                     themesExploites: { type: string }
 *                 indicateursRendement:
 *                   type: object
 *                   properties:
 *                     prescolaire: { type: object }
 *                     primaire: { type: object }
 *                     secondaire: { type: object }
 *                     examensCertificatifs: { type: object }
 *         gouvernance:
 *           type: object
 *           properties:
 *             miseEnOeuvreSSEF:
 *               type: object
 *               properties:
 *                 provinceEducationnelle: { type: object }
 *                 provinceAdministrative: { type: object }
 *             inspectionsAdministratives:
 *               type: object
 *               properties:
 *                 maternel: { type: object }
 *                 primaire: { type: object }
 *                 secondaire: { type: object }
 *                 special: { type: object }
 *             comitesProvinciaux:
 *               type: object
 *               properties:
 *                 comiteProvincialEDUNC: { type: object }
 *                 comiteProvincialENAFP: { type: object }
 *                 comiteProvincialTENASOSP: { type: object }
 *                 comiteProvincialExamenEtat: { type: object }
 *             remunerationPersonnel:
 *               type: object
 *               properties:
 *                 directionProvinciale: { type: object }
 *                 inspectionPrincipale: { type: object }
 *                 dinacope: { type: object }
 *                 sernie: { type: object }
 *                 coordinationProvinciale: { type: object }
 *                 sousDivision: { type: object }
 *                 poolsInspectionPrimaire: { type: object }
 *                 poolsInspectionSecondaire: { type: object }
 *                 antenneDinacope: { type: object }
 *                 antenneSernie: { type: object }
 *                 coordinationDiocesaine: { type: object }
 *                 sousCoordinationConventionnees: { type: object }
 *                 conseillerieResidente: { type: object }
 *             vulgarisationInstructions:
 *               type: string
 *               description: Vulgarisation des instructions officielles
 *             groupesAidesPsychopedagogiques:
 *               type: object
 *               properties:
 *                 nombreGAPMisEnPlace: { type: number }
 *                 nombreGAPOperationnel: { type: number }
 *                 nombreCasPrisEnCharge: { type: number }
 *                 problemesIdentifies: { type: string }
 *                 solutionsPreconisees: { type: string }
 *             acquisitionsMateriels:
 *               type: object
 *               properties:
 *                 ecoles: { type: object }
 *                 bureauxGestionnaires: { type: object }
 *             infrastructureBureaux:
 *               type: object
 *               properties:
 *                 directionProvinciale: { type: object }
 *                 inspectionPrincipale: { type: object }
 *                 dinacope: { type: object }
 *                 sernie: { type: object }
 *                 coordinationProvinciale: { type: object }
 *                 sousDivision: { type: object }
 *                 poolsInspectionPrimaire: { type: object }
 *                 poolsInspectionSecondaire: { type: object }
 *                 antenneDinacope: { type: object }
 *                 antenneSernie: { type: object }
 *                 coordinationDiocesaine: { type: object }
 *                 sousCoordinationConventionnees: { type: object }
 *                 conseillerieResidente: { type: object }
 *             formationGestionnaires:
 *               type: object
 *               properties:
 *                 calculAnalyseIndicateurs: { type: object }
 *                 leadershipScolaire: { type: object }
 *                 managementScolaire: { type: object }
 *                 gestionEntiteEducationnelle: { type: object }
 *                 planification: { type: object }
 *         educationUrgence:
 *           type: object
 *           properties:
 *             planStockContingence:
 *               type: object
 *               properties:
 *                 plan: { type: string }
 *                 stock: { type: string }
 *                 catastrophesNaturelles: { type: string }
 *                 destructionSDC: { type: string }
 *                 solutionsLocales: { type: string }
 *                 reunionsClusterEducation: { type: string }
 *                 recommandations: { type: string }
 *             espacesTemporaires:
 *               type: object
 *               properties:
 *                 nombreEspacesConstruits: { type: number }
 *                 couts: { type: number }
 *                 nombreApprenantsScolarises: { type: number }
 *                 formationEnseignantsESU: { type: number }
 *         autresProblemes:
 *           type: string
 *           description: Autres problèmes spécifiques
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
  // Référence vers l'identification de la PROVED
  identificationProved: { 
    type: Schema.Types.ObjectId, 
    ref: 'IdentificationProved',
    required: true 
  },

  // Introduction
  introduction: { type: String },

  // Les quatre paramètres clés du système éducif
  parametresCles: {
    niveauPrescolaire: {
      ecoleEspaceCommunautaire: {
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

  // Personnel
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

  // Réalisations par axe stratégique
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
    },
    ameliorationQualite: {
      moyensEnseignement: {
        programmesScolaires: { type: Object },
        manuelsScolaires: { type: Object },
        materielsDidactiques: { type: Object },
        laboratoires: { type: Object },
        equipementsAteliers: { type: Object }
      },
      visitesClasses: {
        prescolaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'] },
        primaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'] },
        secondaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'] }
      },
      reunionsPedagogiques: {
        prescolaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'] },
        primaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'] },
        secondaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'] }
      },
      inspectionsPedagogiques: {
        nombrePrevu: { type: Number, default: 0 },
        nombreRealise: { type: Number, default: 0 },
        pourcentageRealisation: { type: Number, default: 0 }
      },
      formationContinue: {
        prescolaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'] },
        primaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'] },
        secondaire: { type: String, enum: ['TRES BON', 'BON', 'CARENCE'] },
        themesExploites: { type: String }
      },
      indicateursRendement: {
        prescolaire: { type: Object },
        primaire: { type: Object },
        secondaire: { type: Object },
        examensCertificatifs: { type: Object }
      }
    }
  },

  // Gouvernance
  gouvernance: {
    miseEnOeuvreSSEF: {
      provinceEducationnelle: { type: Object },
      provinceAdministrative: { type: Object }
    },
    inspectionsAdministratives: {
      maternel: { type: Object },
      primaire: { type: Object },
      secondaire: { type: Object },
      special: { type: Object }
    },
    comitesProvinciaux: {
      comiteProvincialEDUNC: { type: Object },
      comiteProvincialENAFP: { type: Object },
      comiteProvincialTENASOSP: { type: Object },
      comiteProvincialExamenEtat: { type: Object }
    },
    remunerationPersonnel: {
      directionProvinciale: { type: Object },
      inspectionPrincipale: { type: Object },
      dinacope: { type: Object },
      sernie: { type: Object },
      coordinationProvinciale: { type: Object },
      sousDivision: { type: Object },
      poolsInspectionPrimaire: { type: Object },
      poolsInspectionSecondaire: { type: Object },
      antenneDinacope: { type: Object },
      antenneSernie: { type: Object },
      coordinationDiocesaine: { type: Object },
      sousCoordinationConventionnees: { type: Object },
      conseillerieResidente: { type: Object }
    },
    vulgarisationInstructions: { type: String },
    groupesAidesPsychopedagogiques: {
      nombreGAPMisEnPlace: { type: Number, default: 0 },
      nombreGAPOperationnel: { type: Number, default: 0 },
      nombreCasPrisEnCharge: { type: Number, default: 0 },
      problemesIdentifies: { type: String },
      solutionsPreconisees: { type: String }
    },
    acquisitionsMateriels: {
      ecoles: { type: Object },
      bureauxGestionnaires: { type: Object }
    },
    infrastructureBureaux: {
      directionProvinciale: { type: Object },
      inspectionPrincipale: { type: Object },
      dinacope: { type: Object },
      sernie: { type: Object },
      coordinationProvinciale: { type: Object },
      sousDivision: { type: Object },
      poolsInspectionPrimaire: { type: Object },
      poolsInspectionSecondaire: { type: Object },
      antenneDinacope: { type: Object },
      antenneSernie: { type: Object },
      coordinationDiocesaine: { type: Object },
      sousCoordinationConventionnees: { type: Object },
      conseillerieResidente: { type: Object }
    },
    formationGestionnaires: {
      calculAnalyseIndicateurs: { type: Object },
      leadershipScolaire: { type: Object },
      managementScolaire: { type: Object },
      gestionEntiteEducationnelle: { type: Object },
      planification: { type: Object }
    }
  },

  // Education en situation d'urgence
  educationUrgence: {
    planStockContingence: {
      plan: { type: String },
      stock: { type: String },
      catastrophesNaturelles: { type: String },
      destructionSDC: { type: String },
      solutionsLocales: { type: String },
      reunionsClusterEducation: { type: String },
      recommandations: { type: String }
    },
    espacesTemporaires: {
      nombreEspacesConstruits: { type: Number, default: 0 },
      couts: { type: Number, default: 0 },
      nombreApprenantsScolarises: { type: Number, default: 0 },
      formationEnseignantsESU: { type: Number, default: 0 }
    }
  },

  // Autres problèmes
  autresProblemes: { type: String },

  // Conclusion
  conclusion: { type: String },

  // Métadonnées
  statut: { 
    type: String, 
    enum: ['brouillon', 'soumis', 'approuve', 'rejete'], 
    default: 'brouillon' 
  },
  annee: { type: Number, required: true },
  fichierJoint: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { 
  timestamps: true, 
  versionKey: false 
});

// Ajouter le plugin de pagination
rapportActiviteSchema.plugin(mongoosePaginate);

module.exports.RapportActivite = model('RapportActivite', rapportActiviteSchema); 