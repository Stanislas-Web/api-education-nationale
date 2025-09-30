// Exemple de requête POST pour créer un rapport d'activité
// Côté frontend (JavaScript/TypeScript)

// 1. EXEMPLE AVEC FETCH API (JavaScript vanilla)
async function creerRapportActivite() {
  const token = localStorage.getItem('token'); // Token JWT de l'utilisateur connecté
  
  const rapportData = {
    annee: 2024,
    introduction: "Rapport d'activité de la PROVED de Tshopo1 pour l'année 2024. Ce rapport présente un aperçu complet des activités éducatives, des réalisations et des défis rencontrés dans la province éducationnelle.",
    
    // 1. LES QUATRE PARAMETRES CLES DU SYSTEME EDUCATIF
    parametresCles: {
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

    // 2. PERSONNEL
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

    // 3. RÉALISATIONS
    realisations: {
      accesAccessibiliteEquite: {
        nouvellesSallesClasses: {
          prescolaire: 15,
          primaire: 25,
          secondaire: 15,
          sourceFinancement: "GVT et PTFS"
        },
        nouveauxBancsTables: {
          prescolaire: 120,
          primaire: 300,
          secondaire: 180,
          sourceFinancement: "Projet et ONG"
        },
        nouvellesLatrines: {
          prescolaire: 8,
          primaire: 45,
          secondaire: 12,
          sourceFinancement: "GVT"
        },
        gratuitéEnseignementPrimaire: "La gratuité de l'enseignement primaire est effective dans toute la province avec un taux de couverture de 95%",
        sensibilisation: {
          filles: true,
          enfantsHorsEcole: true,
          peuplesAutochtones: true
        },
        cantinesScolaires: {
          prescolaire: 20,
          primaire: 80,
          secondaire: 15,
          commentaire: "Cantines fonctionnelles dans 115 écoles avec un impact positif sur la fréquentation scolaire"
        },
        indicateursAcces: {
          proportionNouveauxInscrits: 85.5,
          tauxTransitionPrimaireCTEB: 78.2,
          tauxTransitionCTEBHumanites: 65.8
        }
      }
    },

    // 4. AMÉLIORATION DE LA QUALITÉ
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
        materielsDidactiques: {
          prescolaire: 'CARENCE',
          primaire: 'BON',
          secondaire: 'TRES BON'
        },
        laboratoires: {
          chimie: 'TRES BON',
          biologie: 'BON',
          physique: 'CARENCE'
        },
        equipementsAteliers: {
          humanitesTechniques: 'BON'
        }
      },
      visitesEtReunions: {
        visitesClasses: {
          prescolaire: 'BON',
          primaire: 'TRES BON',
          secondaire: 'BON',
          special: 'ASSEZ BON'
        },
        reunionsPedagogiques: {
          prescolaire: 'BON',
          primaire: 'TRES BON',
          secondaire: 'BON'
        },
        fonctionnementCelluleBase: {
          prescolaire: 'BON',
          primaire: 'TRES BON',
          secondaire: 'BON',
          special: 'ASSEZ BON'
        }
      },
      activitesInspectorales: {
        inspectionsPedagogiquesC3: {
          prescolaire: {
            nombrePrevu: 50,
            nombreRealise: 45,
            pourcentageRealisation: 90
          },
          primaire: {
            nombrePrevu: 100,
            nombreRealise: 85,
            pourcentageRealisation: 85
          },
          secondaire: {
            nombrePrevu: 50,
            nombreRealise: 45,
            pourcentageRealisation: 90
          },
          special: {
            nombrePrevu: 10,
            nombreRealise: 8,
            pourcentageRealisation: 80
          }
        },
        inspectionsFormation: {
          prescolaire: {
            nombrePrevu: 20,
            nombreRealise: 18,
            pourcentageRealisation: 90
          },
          primaire: {
            nombrePrevu: 40,
            nombreRealise: 35,
            pourcentageRealisation: 87.5
          },
          secondaire: {
            nombrePrevu: 25,
            nombreRealise: 22,
            pourcentageRealisation: 88
          },
          special: {
            nombrePrevu: 5,
            nombreRealise: 4,
            pourcentageRealisation: 80
          }
        },
        formationContinue: {
          prescolaire: 'BON',
          primaire: 'TRES BON',
          secondaire: 'BON',
          special: 'BON'
        }
      },
      indicateursRendement: {
        rendementInterne: {
          prescolaire: {
            tauxAbandon: 5.2,
            tauxReussite: 85.3,
            tauxEchec: 9.5
          },
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
        },
        rendementExterne: {
          examensCertificatifs: {
            tauxDiplomes: 72.5,
            tauxHumanitesScientifiques: 68.3,
            tauxHumanitesTechniques: 71.8
          }
        }
      }
    },

    // 5. GOUVERNANCE
    gouvernance: {
      miseEnOeuvreSSEF: {
        niveauProvinceEducationnelle: {
          elaborationPAO: "PAO élaboré avec approche participative impliquant tous les acteurs éducatifs",
          miseEnOeuvre: "Mise en œuvre en cours avec suivi régulier et évaluation trimestrielle",
          evaluationMiParcours: "Évaluation prévue pour juin 2024 avec indicateurs de performance",
          evaluationFinale: "Évaluation finale programmée pour décembre 2024"
        },
        niveauProvinceAdministrative: {
          elaborationPAO: "PAO provincial élaboré autour des Gouverneurs dans le cadre du Comité Technique Provincial",
          miseEnOeuvre: "Suivi mensuel des activités et coordination inter-sectorielle",
          evaluationMiParcours: "Évaluation mi-parcours avec participation des partenaires",
          evaluationFinale: "Évaluation finale avec rapport de synthèse"
        }
      },
      inspectionsAdministrativesC2B: {
        prescolaire: {
          nombrePrevu: 30,
          nombreRealise: 28,
          pourcentageRealisation: 93.3
        },
        primaire: {
          nombrePrevu: 80,
          nombreRealise: 72,
          pourcentageRealisation: 90
        },
        secondaire: {
          nombrePrevu: 40,
          nombreRealise: 36,
          pourcentageRealisation: 90
        },
        special: {
          nombrePrevu: 8,
          nombreRealise: 7,
          pourcentageRealisation: 87.5
        }
      },
      comitesProvinciaux: {
        comiteEDUNC: {
          frequenceReunions: "Mensuelle",
          pointsTraites: "Suivi des activités éducatives, planification stratégique, coordination des interventions"
        },
        comiteENAFP: {
          frequenceReunions: "Trimestrielle",
          pointsTraites: "Formation professionnelle, partenariats, développement des compétences"
        },
        comiteTENASOSP: {
          frequenceReunions: "Bimensuelle",
          pointsTraites: "Sécurité sociale, protection des travailleurs, conditions de travail"
        },
        comiteExamenEtat: {
          frequenceReunions: "Semestrielle",
          pointsTraites: "Organisation des examens, validation des résultats, certification"
        }
      },
      remunerationPersonnel: {
        directionProvinciale: {
          totalAgents: 93,
          nonPayes: 2
        },
        inspectionPrincipale: {
          totalAgents: 85,
          nonPayes: 1
        },
        dinacope: {
          totalAgents: 72,
          nonPayes: 3
        },
        sernie: {
          totalAgents: 21,
          nonPayes: 0
        },
        coordinationProvinciale: {
          totalAgents: 0,
          nonPayes: 0
        },
        sousDivision: {
          totalAgents: 139,
          nonPayes: 5
        },
        poolsInspectionPrimaire: {
          totalAgents: 251,
          nonPayes: 8
        },
        poolsInspectionSecondaire: {
          totalAgents: 192,
          nonPayes: 6
        },
        antenneDinacope: {
          totalAgents: 219,
          nonPayes: 7
        },
        antenneSernie: {
          totalAgents: 84,
          nonPayes: 2
        },
        coordinationDiocesaine: {
          totalAgents: 186,
          nonPayes: 4
        }
      },
      vulgarisationInstructions: {
        instructionsOfficielles: "Instructions diffusées via réunions, documents et plateformes numériques",
        nouvelleCitoyennete: "Formation dispensée aux enseignants sur les valeurs de la nouvelle citoyenneté"
      },
      groupesAidesPsychopedagogiques: {
        nombreGAPMisEnPlace: 8,
        nombreGAPOperationnel: 6,
        nombreCasPrisEnCharge: 45,
        problemesIdentifies: "Décrochage scolaire, difficultés d'apprentissage, problèmes comportementaux",
        solutionsPreconisees: "Accompagnement personnalisé, soutien psychologique, collaboration famille-école"
      },
      acquisitionsMateriels: {
        ecoles: {
          nature: "Matériel informatique et mobilier scolaire",
          sourceFinancement: {
            gvt: 5000000,
            projet: 3000000,
            ptfs: 2000000,
            ong: 1000000
          }
        },
        bureauxGestionnaires: {
          nature: "Équipements de bureau et véhicules",
          sourceFinancement: {
            gvt: 3000000,
            projet: 1500000,
            ptfs: 1000000,
            ong: 500000
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
        dinacope: {
          proprietaire: 1,
          locataire: 0
        },
        sernie: {
          proprietaire: 0,
          locataire: 1
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
        antenneSernie: {
          proprietaire: 0,
          locataire: 8
        },
        coordinationDiocesaine: {
          proprietaire: 6,
          locataire: 0
        }
      }
    },

    // 6. ÉDUCATION EN SITUATION D'URGENCE
    educationUrgence: {
      planStockContingence: {
        plan: "Plan de contingence élaboré et testé avec simulation d'urgence",
        stock: "Stock de matériel d'urgence disponible : kits scolaires, tentes, matériel de secours"
      },
      catastrophesNaturelles: {
        nature: "Inondations saisonnières et glissements de terrain",
        effetsNegatifs: "Destruction d'infrastructures, interruption des cours, déplacement des populations"
      },
      destructionSDC: {
        forcesNegatives: "Destruction partielle de 3 écoles par des groupes armés"
      },
      solutionsLocales: "Construction de digues, relocalisation temporaire, partenariat avec ONG humanitaires",
      reunionsClusterEducation: {
        frequence: "Bimensuelle",
        pointsTraites: "Coordination des interventions, partage d'informations, planification des secours"
      },
      recommandations: {
        espacesTemporairesApprentissage: {
          nombre: 12,
          couts: "15 millions de francs congolais"
        },
        apprenantsScolarises: {
          cible: 500
        },
        formationEnseignantsESU: "Formation dispensée à 25 enseignants sur l'éducation en situation d'urgence"
      }
    },

    // 7. AUTRES PROBLÈMES
    autresProblemes: {
      problemesSpecifiques: "Manque de matériel didactique, insuffisance d'infrastructures sanitaires, besoins en formation continue des enseignants, insécurité dans certaines zones, manque de moyens de transport pour les inspecteurs"
    },

    conclusion: "Le rapport montre des progrès significatifs dans l'amélioration de l'accès et de la qualité de l'éducation malgré les défis rencontrés. Des améliorations sont nécessaires dans certains domaines, notamment l'infrastructure et la formation continue. La collaboration avec les partenaires reste essentielle pour atteindre les objectifs éducatifs.",
    statut: 'brouillon'
  };

  try {
    const response = await fetch('http://localhost:3000/api/rapport-activite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(rapportData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Rapport créé avec succès:', result);
      return result;
    } else {
      console.error('❌ Erreur lors de la création:', result);
      throw new Error(result.message || 'Erreur lors de la création du rapport');
    }
  } catch (error) {
    console.error('❌ Erreur réseau:', error);
  }
}

// Test de l'endpoint de modification du profil utilisateur
async function testUpdateUserProfile() {
  try {
    console.log('\n🧪 Test de l\'endpoint PUT /users/:id');
    
    // D'abord, on se connecte pour obtenir un token
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.error('❌ Échec de la connexion pour le test');
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    const userId = loginData.user._id;

    console.log('✅ Connexion réussie, token obtenu');

    // Test de modification du profil
    const updateData = {
      nom: 'Nom Modifié',
      prenom: 'Prénom Modifié',
      phone: '123456789',
      email: 'nouveau@email.com'
    };

    console.log('📝 Données à envoyer:', updateData);

    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Profil modifié avec succès:', result);
      console.log('📊 Données mises à jour:', result.data);
    } else {
      console.error('❌ Erreur lors de la modification:', result);
    }

    // Test avec un mot de passe
    console.log('\n🔐 Test de modification du mot de passe');
    const passwordUpdateData = {
      password: 'nouveauMotDePasse123'
    };

    const passwordResponse = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordUpdateData)
    });

    const passwordResult = await passwordResponse.json();
    
    if (passwordResponse.ok) {
      console.log('✅ Mot de passe modifié avec succès');
    } else {
      console.error('❌ Erreur lors de la modification du mot de passe:', passwordResult);
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    throw error;
  }
}

// 2. EXEMPLE AVEC AXIOS (si tu utilises Axios)
async function creerRapportActiviteAvecAxios() {
  const axios = require('axios'); // Si côté Node.js
  // import axios from 'axios'; // Si côté frontend avec modules
  
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.post('http://localhost:3000/api/rapport-activite', rapportData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Rapport créé avec succès:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    throw error;
  }
}

// 3. EXEMPLE AVEC REACT HOOKS (si tu utilises React)
import { useState } from 'react';

function useRapportActivite() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rapport, setRapport] = useState(null);

  const creerRapport = async (rapportData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/rapport-activite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(rapportData)
      });

      const result = await response.json();
      
      if (response.ok) {
        setRapport(result);
        return result;
      } else {
        throw new Error(result.message || 'Erreur lors de la création');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { creerRapport, loading, error, rapport };
}

// 4. EXEMPLE D'UTILISATION DANS UN COMPOSANT REACT
function RapportActiviteForm() {
  const { creerRapport, loading, error } = useRapportActivite();
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await creerRapport(formData);
      console.log('Rapport créé:', result);
      // Redirection ou notification de succès
    } catch (err) {
      console.error('Erreur:', err);
      // Gestion de l'erreur (notification, etc.)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Tes champs de formulaire ici */}
      <button type="submit" disabled={loading}>
        {loading ? 'Création en cours...' : 'Créer le rapport'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

// 5. EXEMPLE AVEC ANGULAR (si tu utilises Angular)
/*
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RapportActiviteService {
  private apiUrl = 'http://localhost:3000/api/rapport-activite';

  constructor(private http: HttpClient) {}

  creerRapport(rapportData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, rapportData, { headers });
  }
}
*/

// 6. EXEMPLE AVEC VUE.JS (si tu utilises Vue.js)
/*
// Dans un composant Vue
export default {
  data() {
    return {
      rapportData: {},
      loading: false,
      error: null
    }
  },
  methods: {
    async creerRapport() {
      this.loading = true;
      this.error = null;
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/rapport-activite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.rapportData)
        });

        const result = await response.json();
        
        if (response.ok) {
          console.log('Rapport créé:', result);
          // Succès
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
}
*/

// Export pour utilisation
module.exports = {
  creerRapportActivite,
  creerRapportActiviteAvecAxios,
  useRapportActivite
};

console.log('📋 Exemples de requêtes POST pour rapport d\'activité créés !');
console.log('🚀 Utilise ces exemples selon ton framework frontend !');

// Test de l'endpoint de modification du profil
testUpdateUserProfile();
