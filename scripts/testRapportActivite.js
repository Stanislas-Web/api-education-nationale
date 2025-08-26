const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://stanislasmakengo1:CmO8NytrFHAsW4yI@cluster0.rl7g5.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true });

const { RapportActivite } = require('../models/rapportActivite.model');
const { IdentificationProved } = require('../models/identificationProved.model');

async function testRapportActivite() {
  try {
    console.log('🧪 Test du modèle RapportActivite avec les nouvelles sections...\n');

    // 1. Trouver une PROVED existante
    const proved = await IdentificationProved.findOne({ telephone: '+243829166417' });
    if (!proved) {
      console.log('❌ Aucune PROVED trouvée pour le test');
      return;
    }

    console.log('✅ PROVED trouvée:', proved.provinceAdministrative);

    // 2. Créer un rapport d'activité complet avec toutes les nouvelles sections
    const rapportData = {
      identificationProved: proved._id,
      annee: 2024,
      introduction: "Rapport d'activité de test pour la PROVED de Tshopo1",
      
      // Sections existantes
      parametresCles: {
        // 1.1. Nbre d'Ecole / Nbre de Classe
        nombreEcolesClasses: {
          niveauPrescolaire: {
            espaceCommunautaireEveil: {
              nombreEcoles: 3,
              nombreClasses: 267
            },
            maternel: {
              nombreEcoles: 103,
              nombreClasses: 267
            },
            prePrimaire: {
              nombreEcoles: 6,
              nombreClasses: 6
            },
            special: {
              nombreEcoles: 0,
              nombreClasses: 0
            }
          },
          niveauPrimaire: {
            enseignementSpecial: {
              nombreEcoles: 0,
              totalClassesSpecialesPrim: 0
            },
            enseignementPrimaire: {
              nombreEcoles: 890,
              totalClassesPrimaire: 7684,
              classesPlethoriques: '-'
            }
          },
          niveauSecondaire: {
            enseignementSpecial: {
              nombreEcoles: 0,
              totalClassesSpecialesSec: 0
            },
            enseignementSecondaire: {
              nombreEcoles: 563,
              premierCycle: {
                classes7emeCTEB: 819,
                classes8emeCTEB: 755
              },
              deuxiemeCycle: {
                totalClassesHumanites: 5720
              },
              totalClasses1er2emeCycle: 7294
            }
          }
        },
        // 1.2. Effectif Scolaire et Taux d'accroissement
        effectifScolaire: {
          niveauPrescolaire: {
            espaceCommunautaireEveil: {
              effectifGarconsFilles: 47,
              effectifFilles: 29,
              tauxAccroissementGarconsFilles: 0,
              tauxAccroissementFilles: 0
            },
            maternel: {
              effectifGarconsFilles: 6517,
              effectifFilles: 3327,
              tauxAccroissementGarconsFilles: 18,
              tauxAccroissementFilles: 15
            },
            prePrimaire: {
              effectifGarconsFilles: 64,
              effectifFilles: 38,
              tauxAccroissementGarconsFilles: 56,
              tauxAccroissementFilles: 312
            },
            special: {
              effectifGarconsFilles: 0,
              effectifFilles: 0,
              tauxAccroissementGarconsFilles: 0,
              tauxAccroissementFilles: 0
            }
          },
          niveauPrimaire: {
            enseignementSpecial: {
              effectifGarconsFilles: 0,
              effectifFilles: 0,
              tauxAccroissementGarconsFilles: 0,
              tauxAccroissementFilles: 0
            },
            enseignementPrimaire: {
              effectifGarconsFilles: 150000,
              effectifFilles: 75000,
              tauxAccroissementGarconsFilles: 3.5,
              tauxAccroissementFilles: 4.2
            }
          },
          niveauSecondaire: {
            enseignementSpecial: {
              effectifGarcons: 0,
              effectifFilles: 0,
              tauxGarcons: 0,
              tauxFilles: 0
            },
            enseignementSecondaire: {
              septiemeCTEB: {
                effectifGarcons: 32344,
                effectifFilles: 15674,
                tauxGarcons: 3.32,
                tauxFilles: 2.6
              },
              huitiemeCTEB: {
                effectifGarcons: 26686,
                effectifFilles: 12779,
                tauxGarcons: 1.6,
                tauxFilles: 0.75
              },
              premiereHumanite: {
                effectifGarcons: 23071,
                effectifFilles: 11208,
                tauxGarcons: 4.8,
                tauxFilles: 1.1
              },
              quatriemeHumanite: {
                effectifGarcons: 16389,
                effectifFilles: 6887,
                tauxGarcons: 5.4,
                tauxFilles: 5.7
              }
            }
          }
        }
      },
      
      personnel: {
        personnelEnseignant: {
          niveauPrescolaire: {
            enseignementPrescolaireSpecial: {
              hommes: 0,
              femmes: 0
            },
            enseignementPrescolaire: {
              hommes: 260,
              femmes: 257
            }
          },
          niveauPrimaire: {
            enseignementPrescolaireSpecial: {
              hommes: 0,
              femmes: 0
            },
            enseignementPrimaire: {
              hommes: 7875,
              femmes: 3541
            }
          },
          niveauSecondaire: {
            enseignementPrescolaireSpecial: {
              hommes: 0,
              femmes: 0
            },
            enseignementSecondaire: {
              hommes: 10203,
              femmes: 2167
            }
          }
        },
        personnelAdministratif: {
          directionProvinciale: {
            hommes: 74,
            femmes: 19
          },
          inspectionPrincipale: {
            hommes: 68,
            femmes: 17
          },
          dinacope: {
            hommes: 57,
            femmes: 15
          },
          sernie: {
            hommes: 15,
            femmes: 6
          },
          coordinationProvinciale: {
            hommes: 0,
            femmes: 0
          },
          sousDivision: {
            hommes: 106,
            femmes: 33
          },
          poolsInspectionPrimaire: {
            hommes: 194,
            femmes: 57
          },
          poolsInspectionSecondaire: {
            hommes: 163,
            femmes: 29
          },
          antenneDinacope: {
            hommes: 169,
            femmes: 50
          },
          antenneSernie: {
            hommes: 60,
            femmes: 24
          },
          coordinationDiocesaine: {
            hommes: 148,
            femmes: 38
          }
        }
      },
      
      realisations: {
        accesAccessibiliteEquite: {
          nouvellesSallesClasses: {
            primaire: 25,
            secondaire: 15,
            sourceFinancement: "GVT et PTFS"
          },
          cantinesScolaires: {
            primaire: 80,
            commentaire: "Cantines fonctionnelles dans 80 écoles primaires"
          }
        }
      },

      // NOUVELLES SECTIONS AJOUTÉES
      ameliorationQualite: {
        disponibiliteMoyensEnseignement: {
          programmesScolaires: {
            prescolaire: 'BON',
            primaire: 'TRES BON',
            secondaire: 'BON'
          },
          manuelsScolaires: {
            prescolaire: 'CARENCE',
            primaire: 'BON',
            secondaire: 'BON'
          },
          laboratoires: {
            chimie: 'TRES BON',
            biologie: 'BON',
            physique: 'CARENCE'
          }
        },
        visitesEtReunions: {
          visitesClasses: {
            prescolaire: 'BON',
            primaire: 'TRES BON',
            secondaire: 'BON',
            special: 'ASSEZ BON'
          }
        },
        activitesInspectorales: {
          inspectionsPedagogiquesC3: {
            primaire: {
              nombrePrevu: 100,
              nombreRealise: 85,
              pourcentageRealisation: 85
            },
            secondaire: {
              nombrePrevu: 50,
              nombreRealise: 45,
              pourcentageRealisation: 90
            }
          }
        },
        indicateursRendement: {
          rendementInterne: {
            primaire: {
              tauxAbandon: 8.5,
              tauxReussite: 75.2,
              tauxEchec: 16.3
            },
            secondaire: {
              tauxAbandon: 12.1,
              tauxReussite: 68.7,
              tauxEchec: 19.2
            }
          }
        }
      },

      gouvernance: {
        miseEnOeuvreSSEF: {
          niveauProvinceEducationnelle: {
            elaborationPAO: "PAO élaboré avec approche participative",
            miseEnOeuvre: "Mise en œuvre en cours avec suivi régulier",
            evaluationMiParcours: "Évaluation prévue pour juin 2024"
          }
        },
        inspectionsAdministrativesC2B: {
          primaire: {
            nombrePrevu: 80,
            nombreRealise: 72,
            pourcentageRealisation: 90
          }
        },
        comitesProvinciaux: {
          comiteEDUNC: {
            frequenceReunions: "Mensuelle",
            pointsTraites: "Suivi des activités éducatives, planification"
          },
          comiteENAFP: {
            frequenceReunions: "Trimestrielle",
            pointsTraites: "Formation professionnelle, partenariats"
          }
        },
        remunerationPersonnel: {
          directionProvinciale: {
            totalAgents: 15,
            nonPayes: 2
          },
          coordinationProvinciale: {
            totalAgents: 12,
            nonPayes: 1
          }
        },
        vulgarisationInstructions: {
          instructionsOfficielles: "Instructions diffusées via réunions et documents",
          nouvelleCitoyennete: "Formation dispensée aux enseignants"
        },
        groupesAidesPsychopedagogiques: {
          nombreGAPMisEnPlace: 8,
          nombreGAPOperationnel: 6,
          nombreCasPrisEnCharge: 45,
          problemesIdentifies: "Décrochage scolaire, difficultés d'apprentissage",
          solutionsPreconisees: "Accompagnement personnalisé, soutien psychologique"
        },
        acquisitionsMateriels: {
          ecoles: {
            nature: "Matériel informatique et mobilier",
            sourceFinancement: {
              gvt: 5000000,
              projet: 3000000,
              ptfs: 2000000,
              ong: 1000000
            }
          }
        },
        infrastructureBureaux: {
          directionProvinciale: {
            proprietaire: 1,
            locataire: 0
          },
          inspectionPrincipale: {
            proprietaire: 1,
            locataire: 0
          },
          coordinationProvinciale: {
            proprietaire: 0,
            locataire: 1
          },
          sousDivision: {
            proprietaire: 4,
            locataire: 2
          },
          poolsInspectionPrimaire: {
            proprietaire: 2,
            locataire: 4
          },
          poolsInspectionSecondaire: {
            proprietaire: 2,
            locataire: 4
          },
          antenneDinacope: {
            proprietaire: 0,
            locataire: 12
          },
          coordinationDiocesaine: {
            proprietaire: 6,
            locataire: 0
          },
          conseillerieResidente: {
            proprietaire: 3,
            locataire: 0
          }
        }
      },

      educationUrgence: {
        planStockContingence: {
          plan: "Plan de contingence élaboré et testé",
          stock: "Stock de matériel d'urgence disponible"
        },
        catastrophesNaturelles: {
          nature: "Inondations saisonnières",
          effetsNegatifs: "Destruction d'infrastructures, interruption des cours"
        },
        solutionsLocales: "Construction de digues, relocalisation temporaire",
        reunionsClusterEducation: {
          frequence: "Bimensuelle",
          pointsTraites: "Coordination des interventions, partage d'informations"
        },
        recommandations: {
          espacesTemporairesApprentissage: {
            nombre: 12,
            couts: "15 millions de francs congolais"
          },
          apprenantsScolarises: {
            cible: 500
          },
          formationEnseignantsESU: "Formation dispensée à 25 enseignants"
        }
      },

      autresProblemes: {
        problemesSpecifiques: "Manque de matériel didactique, insuffisance d'infrastructures sanitaires, besoins en formation continue des enseignants"
      },

      conclusion: "Le rapport montre des progrès significatifs malgré les défis rencontrés. Des améliorations sont nécessaires dans certains domaines.",
      statut: 'brouillon'
    };

    // 3. Créer le rapport
    const rapport = new RapportActivite(rapportData);
    await rapport.save();

    console.log('✅ Rapport d\'activité créé avec succès!');
    console.log('📋 ID du rapport:', rapport._id);
    console.log('📊 Statut:', rapport.statut);
    console.log('📅 Année:', rapport.annee);

    // 4. Vérifier que toutes les sections sont bien sauvegardées
    console.log('\n🔍 Vérification des sections sauvegardées:');
    console.log('✅ Paramètres clés:', !!rapport.parametresCles);
    console.log('✅ Personnel:', !!rapport.personnel);
    console.log('✅ Réalisations:', !!rapport.realisations);
    console.log('✅ Amélioration qualité:', !!rapport.ameliorationQualite);
    console.log('✅ Gouvernance:', !!rapport.gouvernance);
    console.log('✅ Éducation urgence:', !!rapport.educationUrgence);
    console.log('✅ Autres problèmes:', !!rapport.autresProblemes);

    // 5. Tester quelques valeurs spécifiques
    console.log('\n📈 Données de test vérifiées:');
    console.log('🏫 Écoles primaires:', rapport.parametresCles.nombreEcolesClasses.niveauPrimaire.enseignementPrimaire.nombreEcoles);
    console.log('📚 Classes humanités:', rapport.parametresCles.nombreEcolesClasses.niveauSecondaire.enseignementSecondaire.deuxiemeCycle.totalClassesHumanites);
    console.log('👨‍🎓 Effectif 7ème CTEB - Garçons:', rapport.parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.septiemeCTEB.effectifGarcons);
    console.log('👩‍🎓 Effectif 1ère Humanité - Filles:', rapport.parametresCles.effectifScolaire.niveauSecondaire.enseignementSecondaire.premiereHumanite.effectifFilles);
    console.log('👨‍🏫 Enseignants primaire (H):', rapport.personnel.personnelEnseignant.niveauPrimaire.enseignementPrimaire.hommes);
    console.log('👩‍🏫 Enseignants secondaire (F):', rapport.personnel.personnelEnseignant.niveauSecondaire.enseignementSecondaire.femmes);
    console.log('🏢 Personnel Direction Provinciale - H:', rapport.personnel.personnelAdministratif.directionProvinciale.hommes, 'F:', rapport.personnel.personnelAdministratif.directionProvinciale.femmes);
    console.log('⚠️ Coordination Provinciale - H:', rapport.personnel.personnelAdministratif.coordinationProvinciale.hommes, 'F:', rapport.personnel.personnelAdministratif.coordinationProvinciale.femmes);
    console.log('📚 Programmes scolaires primaire:', rapport.ameliorationQualite.disponibiliteMoyensEnseignement.programmesScolaires.primaire);
    console.log('📊 Taux de réussite primaire:', rapport.ameliorationQualite.indicateursRendement.rendementInterne.primaire.tauxReussite + '%');
    console.log('🏢 Infrastructure direction provinciale - Propriétaire:', rapport.gouvernance.infrastructureBureaux.directionProvinciale.proprietaire, 'Locataire:', rapport.gouvernance.infrastructureBureaux.directionProvinciale.locataire);
    console.log('🚨 GAP opérationnels:', rapport.gouvernance.groupesAidesPsychopedagogiques.nombreGAPOperationnel);
    
    // Afficher les totaux calculés
    console.log('📊 Totaux infrastructure bureaux - Propriétaires:', rapport.gouvernance.totalInfrastructureBureaux.totalProprietaire, 'Locataires:', rapport.gouvernance.totalInfrastructureBureaux.totalLocataire);

    // 6. Tester les méthodes du modèle
    console.log('\n🧪 Test des méthodes du modèle:');
    
    // Soumettre le rapport
    await rapport.submit();
    console.log('✅ Rapport soumis, nouveau statut:', rapport.statut);

    // Approuver le rapport
    await rapport.approve();
    console.log('✅ Rapport approuvé, nouveau statut:', rapport.statut);

    // 7. Calculer le total des effectifs (virtual)
    console.log('\n📊 Total des effectifs (calculé):', rapport.totalEffectifs);
    
    // 8. Calculer le total des infrastructures (virtual)
    const totalInfra = rapport.totalInfrastructureBureaux;
    console.log('🏢 Total des infrastructures bureaux (virtual):', totalInfra);

    console.log('\n🎉 Test terminé avec succès! Toutes les nouvelles sections fonctionnent correctement.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    process.exit(1);
  }
}

testRapportActivite();
