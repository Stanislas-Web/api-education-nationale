# API Éducation Nationale — Référence complète des Body (POST/PUT/PATCH)

> **Base URL** : `http://localhost:3000/api/v1`
> **Auth** : `Authorization: Bearer <token>` sur toutes les requêtes (sauf login/signup)

---

## Table des matières

1. [Authentification (Users)](#1-authentification-users)
2. [Authentification PROVED](#2-authentification-proved)
3. [Identification PROVED](#3-identification-proved)
4. [Rapport d'Activité](#4-rapport-dactivité)
5. [Effectif Annuel](#5-effectif-annuel)
6. [Annonces](#6-annonces)
7. [Besoins en Ressources](#7-besoins-en-ressources)
8. [Commissions](#8-commissions)
9. [Dénominations](#9-dénominations)
10. [Directions](#10-directions)
11. [Sous-Directions](#11-sous-directions)
12. [Provinces](#12-provinces)
13. [Disciplines](#13-disciplines)
14. [Écoles](#14-écoles)
15. [Effectifs (par école)](#15-effectifs-par-école)
16. [Élèves](#16-élèves)
17. [Équipements](#17-équipements)
18. [Fiches Administratives (A1)](#18-fiches-administratives-a1)
19. [Fiches Auto-Évaluation](#19-fiches-auto-évaluation)
20. [Formulaires](#20-formulaires)
21. [Types de Formulaires](#21-types-de-formulaires)
22. [Infrastructures](#22-infrastructures)
23. [Inspections Pédagogiques (C3)](#23-inspections-pédagogiques-c3)
24. [Premières Visites (C1)](#24-premières-visites-c1)
25. [Partenaires](#25-partenaires)
26. [Permissions](#26-permissions)
27. [Personnel](#27-personnel)
28. [Présences](#28-présences)
29. [Résultats Scolaires](#29-résultats-scolaires)
30. [Services](#30-services)

---

## 1. Authentification (Users)

### `POST /signup`

```json
{
  "nom": "Makengo",
  "postnom": "Stanislas",
  "prenom": "Jean",
  "email": "stanislas@example.com",
  "password": "motdepasse123",
  "phone": "+243812345678",
  "photo": "url_ou_chemin_photo",
  "role": "Inspecteur",
  "provinces": "Kinshasa",
  "direction": "ObjectId_direction",
  "sousDirection": "ObjectId_sous_direction",
  "service": "ObjectId_service",
  "grade": "Inspecteur Principal",
  "fonction": "Inspecteur Itinérant",
  "niveauOuDiscipline": "Primaire"
}
```

| Champ | Type | Requis | Enum |
|---|---|---|---|
| `nom` | String | ✅ | — |
| `postnom` | String | ✅ | — |
| `prenom` | String | ✅ | — |
| `email` | String | ✅ | — |
| `password` | String | ✅ | — |
| `phone` | String | ✅ | — |
| `photo` | String | ✅ | — |
| `role` | String | ✅ | `Administrateur`, `Utilisateur`, `Superviseur`, `Inspecteur`, `Décideur` |
| `provinces` | String | ✅ | — |
| `direction` | ObjectId | ✅ | — |
| `sousDirection` | ObjectId | ❌ | — |
| `service` | ObjectId | ✅ | — |
| `grade` | String | ✅ | — |
| `fonction` | String | ✅ | — |
| `niveauOuDiscipline` | String | ✅ | — |
| `isActive` | Boolean | ❌ | default: `true` |

### `POST /login`

```json
{
  "email": "stanislas@example.com",
  "password": "motdepasse123"
}
```

### `PUT /users/:id`

Mêmes champs que signup, tous optionnels pour mise à jour partielle.

### `PATCH /users/:id/status`

```json
{
  "action": "enable"
}
```

| Champ | Type | Requis | Enum |
|---|---|---|---|
| `action` | String | ✅ | `enable`, `disable` |

### `POST /users/:id/upload-photo`

```
Content-Type: multipart/form-data
Champ: photo (fichier binaire)
```

---

## 2. Authentification PROVED

### `POST /proved/login`

```json
{
  "identifier": "+243899312592",
  "motDePasse": "1234"
}
```

| Champ | Type | Requis | Description |
|---|---|---|---|
| `identifier` | String | ✅ | Email professionnel OU téléphone |
| `motDePasse` | String | ✅ | Mot de passe |

### `POST /proved/change-password`

```json
{
  "ancienMotDePasse": "1234",
  "nouveauMotDePasse": "NouveauMotDePasse123"
}
```

---

## 3. Identification PROVED

### `POST /identification-proved`
### `PUT /identification-proved/:id`

```json
{
  "provinceAdministrative": "Kwango",
  "provinceEducationnelle": "Kwango",
  "chefLieuProved": "Kenge",
  "emailProfessionnel": "proved.kwango@education.cd",
  "telephone": "+243899312592",
  "statutOccupation": "Propriétaire",
  "nombreTerritoires": 5,
  "nombreSousDivisions": 12,
  "directeurProvincial": "Jean Mukendi",
  "motDePasse": "MonMotDePasse123",
  "role": "user",
  "isActive": true
}
```

| Champ | Type | Requis | Défaut | Enum |
|---|---|---|---|---|
| `provinceAdministrative` | String | ✅ | — | — |
| `provinceEducationnelle` | String | ✅ | — | — |
| `chefLieuProved` | String | ✅ | — | — |
| `emailProfessionnel` | String | ❌ | — | — |
| `telephone` | String | ❌ | — | — |
| `statutOccupation` | String | ❌ | — | `Propriétaire`, `Locataire` |
| `nombreTerritoires` | Number | ❌ | `0` | — |
| `nombreSousDivisions` | Number | ❌ | `0` | — |
| `directeurProvincial` | String | ✅ | — | — |
| `motDePasse` | String | ✅ | — | min 6 caractères |
| `role` | String | ❌ | `user` | `admin`, `user` |
| `isActive` | Boolean | ❌ | `true` | — |

---

## 4. Rapport d'Activité

### `POST /rapport-activite`
### `PUT /rapport-activite/:id`

Le body complet est très large. Seuls `identificationProved` et `annee` sont requis. Tous les autres champs sont optionnels avec des valeurs par défaut.

```json
{
  "identificationProved": "ObjectId_proved",
  "annee": "2024-2025",
  "introduction": "Présentation sociogéographique...",
  "conclusion": "Conclusion du rapport...",
  "statut": "brouillon",

  "parametresCles": {
    "nombreEcolesClasses": {
      "niveauPrescolaire": {
        "espaceCommunautaireEveil": { "nombreEcoles": 0, "nombreClasses": 0 },
        "maternel": { "nombreEcoles": 0, "nombreClasses": 0 },
        "prePrimaire": { "nombreEcoles": 0, "nombreClasses": 0 },
        "special": { "nombreEcoles": 0, "nombreClasses": 0 }
      },
      "niveauPrimaire": {
        "enseignementSpecial": { "nombreEcoles": 0, "totalClassesSpecialesPrim": 0 },
        "enseignementPrimaire": {
          "nombreEcoles": 0,
          "totalClassesPrimaire": 0,
          "classesPlethoriques": "-"
        }
      },
      "niveauSecondaire": {
        "enseignementSpecial": { "nombreEcoles": 0, "totalClassesSpecialesSec": 0 },
        "enseignementSecondaire": {
          "nombreEcoles": 0,
          "totalClassesSecondaire": 0,
          "premierCycle": {
            "classes7emeCTEB": 0,
            "classes8emeCTEB": 0,
            "nombreEcoles7eme": 0,
            "nombreEcoles8eme": 0
          },
          "deuxiemeCycle": {
            "totalClassesHumanites": 0,
            "nombreEcolesHumanites": 0
          },
          "nombreEcoles1er2emeCycle": 0
        }
      }
    },

    "effectifScolaire": {
      "niveauPrescolaire": {
        "espaceCommunautaireEveil": {
          "effectifGarconsFilles": 0,
          "effectifFilles": 0,
          "tauxAccroissementGarconsFilles": 0,
          "tauxAccroissementFilles": 0
        },
        "maternel": {
          "effectifGarconsFilles": 0,
          "effectifFilles": 0,
          "tauxAccroissementGarconsFilles": 0,
          "tauxAccroissementFilles": 0
        },
        "prePrimaire": {
          "effectifGarconsFilles": 0,
          "effectifFilles": 0,
          "tauxAccroissementGarconsFilles": 0,
          "tauxAccroissementFilles": 0
        },
        "special": {
          "effectifGarconsFilles": 0,
          "effectifFilles": 0,
          "tauxAccroissementGarconsFilles": 0,
          "tauxAccroissementFilles": 0
        }
      },
      "niveauPrimaire": {
        "enseignementSpecial": {
          "effectifGarconsFilles": 0,
          "effectifFilles": 0,
          "tauxAccroissementGarconsFilles": 0,
          "tauxAccroissementFilles": 0
        },
        "enseignementPrimaire": {
          "effectifGarconsFilles": 0,
          "effectifFilles": 0,
          "tauxAccroissementGarconsFilles": 0,
          "tauxAccroissementFilles": 0
        }
      },
      "niveauSecondaire": {
        "enseignementSpecial": {
          "effectifGarcons": 0,
          "effectifFilles": 0,
          "tauxGarcons": 0,
          "tauxFilles": 0
        },
        "enseignementSecondaire": {
          "septiemeCTEB": { "effectifGarcons": 0, "effectifFilles": 0, "tauxGarcons": 0, "tauxFilles": 0 },
          "huitiemeCTEB": { "effectifGarcons": 0, "effectifFilles": 0, "tauxGarcons": 0, "tauxFilles": 0 },
          "premiereHumanite": { "effectifGarcons": 0, "effectifFilles": 0, "tauxGarcons": 0, "tauxFilles": 0 },
          "quatriemeHumanite": { "effectifGarcons": 0, "effectifFilles": 0, "tauxGarcons": 0, "tauxFilles": 0 }
        }
      }
    }
  },

  "personnel": {
    "personnelEnseignant": {
      "niveauPrescolaire": {
        "enseignementPrescolaireSpecial": { "hommes": 0, "femmes": 0 },
        "enseignementPrescolaire": { "hommes": 0, "femmes": 0 }
      },
      "niveauPrimaire": {
        "enseignementPrescolaireSpecial": { "hommes": 0, "femmes": 0 },
        "enseignementPrimaire": { "hommes": 0, "femmes": 0 }
      },
      "niveauSecondaire": {
        "enseignementPrescolaireSpecial": { "hommes": 0, "femmes": 0 },
        "enseignementSecondaire": { "hommes": 0, "femmes": 0 }
      }
    },
    "personnelAdministratif": {
      "directionProvinciale": { "hommes": 0, "femmes": 0 },
      "inspectionPrincipale": { "hommes": 0, "femmes": 0 },
      "dinacope": { "hommes": 0, "femmes": 0 },
      "sernie": { "hommes": 0, "femmes": 0 },
      "coordinationProvinciale": { "hommes": 0, "femmes": 0 },
      "sousDivision": { "hommes": 0, "femmes": 0 },
      "poolsInspectionPrimaire": { "hommes": 0, "femmes": 0 },
      "poolsInspectionSecondaire": { "hommes": 0, "femmes": 0 },
      "antenneDinacope": { "hommes": 0, "femmes": 0 },
      "antenneSernie": { "hommes": 0, "femmes": 0 },
      "coordinationDiocesaine": { "hommes": 0, "femmes": 0 }
    }
  },

  "realisations": {
    "accesAccessibiliteEquite": {
      "nouvellesSallesClasses": {
        "prescolaire": 0,
        "sourceFinancementPrescolaire": "",
        "primaire": 0,
        "sourceFinancementPrimaire": "",
        "secondaire": 0,
        "sourceFinancementSecondaire": ""
      },
      "nouveauxBancsTables": {
        "prescolaire": 0,
        "sourceFinancementPrescolaire": "",
        "primaire": 0,
        "sourceFinancementPrimaire": "",
        "secondaire": 0,
        "sourceFinancementSecondaire": ""
      },
      "nouvellesLatrines": {
        "prescolaire": 0,
        "sourceFinancementPrescolaire": "",
        "primaire": 0,
        "sourceFinancementPrimaire": "",
        "secondaire": 0,
        "sourceFinancementSecondaire": ""
      },
      "gratuitéEnseignementPrimaire": "",
      "sensibilisation": {
        "filles": false,
        "enfantsHorsEcole": false,
        "peuplesAutochtones": false
      },
      "cantinesScolaires": {
        "prescolaire": 0,
        "primaire": 0,
        "secondaire": 0,
        "totalGeneralEcoles": 0,
        "commentaire": "",
        "cantinesScolairesDetail": {
          "prescolaire": { "gvt": 0, "projet": 0, "ptfs": 0, "ong": 0 },
          "primaire": { "gvt": 0, "projet": 0, "ptfs": 0, "ong": 0 },
          "secondaire": { "gvt": 0, "projet": 0, "ptfs": 0, "ong": 0 }
        }
      },
      "indicateursAcces": {
        "proportionNouveauxInscrits": null,
        "proportionNouveauxInscrits_Filles": null,
        "tauxTransitionPrimaireCTEB": null,
        "tauxTransitionPrimaireCTEB_Filles": null,
        "tauxTransitionCTEBHumanites": null,
        "tauxTransitionCTEBHumanites_Filles": null
      }
    }
  },

  "ameliorationQualite": {
    "disponibiliteMoyensEnseignement": {
      "programmesScolaires": {
        "ece": "BON",
        "preprimaire": "BON",
        "maternel": "BON",
        "primaire": "BON",
        "secondaire": "BON",
        "prescolaire": "BON"
      },
      "manuelsScolaires": {
        "ece": "BON",
        "preprimaire": "BON",
        "maternel": "BON",
        "primaire": "BON",
        "secondaire": "BON",
        "prescolaire": "BON"
      },
      "materielsDidactiques": {
        "ece": "BON",
        "preprimaire": "BON",
        "maternel": "BON",
        "primaire": "BON",
        "secondaire": "BON",
        "prescolaire": "BON"
      },
      "laboratoires": {
        "chimie": "BON",
        "biologie": "BON",
        "physique": "BON"
      },
      "equipementsAteliers": {
        "humanitesTechniques": "BON"
      }
    },
    "visitesEtReunions": {
      "visitesClasses": {
        "ece": "BON",
        "preprimaire": "BON",
        "maternel": "BON",
        "primaire": "BON",
        "secondaire": "BON",
        "special": "BON"
      },
      "reunionsPedagogiques": {
        "ece": "BON",
        "preprimaire": "BON",
        "maternel": "BON",
        "primaire": "BON",
        "secondaire": "BON"
      },
      "fonctionnementCelluleBase": {
        "ece": "BON",
        "preprimaire": "BON",
        "maternel": "BON",
        "primaire": "BON",
        "secondaire": "BON",
        "special": "BON"
      }
    },
    "activitesInspectorales": {
      "inspectionsPedagogiquesC3": {
        "prescolaire": { "nombrePrevu": 0, "nombreRealise": 0, "pourcentageRealisation": 0 },
        "primaire": { "nombrePrevu": 0, "nombreRealise": 0, "pourcentageRealisation": 0 },
        "secondaire": { "nombrePrevu": 0, "nombreRealise": 0, "pourcentageRealisation": 0 },
        "special": { "nombrePrevu": 0, "nombreRealise": 0, "pourcentageRealisation": 0 }
      },
      "inspectionsFormation": {
        "prescolaire": { "nombrePrevu": 0, "nombreRealise": 0, "pourcentageRealisation": 0 },
        "primaire": { "nombrePrevu": 0, "nombreRealise": 0, "pourcentageRealisation": 0 },
        "secondaire": { "nombrePrevu": 0, "nombreRealise": 0, "pourcentageRealisation": 0 },
        "special": { "nombrePrevu": 0, "nombreRealise": 0, "pourcentageRealisation": 0 }
      },
      "formationContinue": {
        "prescolaire": "BON",
        "primaire": "BON",
        "secondaire": "BON",
        "special": "BON"
      },
      "themesExploites": {
        "ece": "",
        "maternel": ""
      }
    },
    "indicateursRendement": {
      "rendementInterne": {
        "sixiemePrimaire": { "abandon": 0, "reussite": 0, "echec": 0 },
        "huitiemeCETB": { "abandon": 0, "reussite": 0, "echec": 0 },
        "quatriemeHumanite": { "abandon": 0, "reussite": 0, "echec": 0 },
        "diplomesMathematiques": { "abandon": 0, "reussite": 0, "echec": 0 },
        "diplomesFiliereTechniques": { "abandon": 0, "reussite": 0, "echec": 0 }
      },
      "rendementExterne": {
        "prescolaire": { "tauxGF": 0, "tauxFilles": 0 },
        "espaceCommunautaireEveil": { "tauxGF": 0, "tauxFilles": 0 },
        "classePreprimaire": { "tauxGF": 0, "tauxFilles": 0 },
        "maternel": { "tauxGF": 0, "tauxFilles": 0 },
        "primaire": { "tauxGF": 0, "tauxFilles": 0 },
        "enseignementSpecialPrimaire": { "tauxGF": 0, "tauxFilles": 0 },
        "enseignementPrimaire": { "tauxGF": 0, "tauxFilles": 0 },
        "secondaire": { "tauxGF": 0, "tauxFilles": 0 },
        "enseignementSpecialSecondaire": { "tauxGF": 0, "tauxFilles": 0 },
        "enseignementSecondaireNormal": { "tauxGF": 0, "tauxFilles": 0 }
      },
      "efficacitePrimaire": {
        "tauxAbandon": { "tauxGF": 0, "tauxFilles": 0 },
        "tauxReussite": { "tauxGF": 0, "tauxFilles": 0 },
        "tauxEchec": { "tauxGF": 0, "tauxFilles": 0 }
      },
      "efficaciteSecondaire": {
        "tauxAbandon": { "tauxGF": 0, "tauxFilles": 0 },
        "tauxReussite": { "tauxGF": 0, "tauxFilles": 0 },
        "tauxEchec": { "tauxGF": 0, "tauxFilles": 0 }
      },
      "tauxDiplomesOCDE": {
        "humanitesScientifiques": { "tauxGF": 0, "tauxFilles": 0 },
        "humanitesTechniques": { "tauxGF": 0, "tauxFilles": 0 }
      }
    }
  },

  "gouvernance": {
    "miseEnOeuvreSSEF": {
      "niveauProvinceEducationnelle": {
        "elaborationPAO": "",
        "miseEnOeuvre": "",
        "evaluationMiParcours": "",
        "evaluationFinale": ""
      },
      "niveauProvinceAdministrative": {
        "elaborationPAO": "",
        "miseEnOeuvre": "",
        "evaluationMiParcours": "",
        "evaluationFinale": ""
      }
    },
    "inspectionsAdministrativesC2B": {
      "prescolaire": { "nombrePrevu": 0, "nombreRealise": 0, "pourcentageRealisation": 0 },
      "primaire": { "nombrePrevu": 0, "nombreRealise": 0, "pourcentageRealisation": 0 },
      "secondaire": { "nombrePrevu": 0, "nombreRealise": 0, "pourcentageRealisation": 0 },
      "special": { "nombrePrevu": 0, "nombreRealise": 0, "pourcentageRealisation": 0 }
    },
    "comitesProvinciaux": {
      "comiteEDUNC": { "frequenceReunions": "", "pointsTraites": "" },
      "comiteENAFP": { "frequenceReunions": "", "pointsTraites": "" },
      "comiteTENASOSP": { "frequenceReunions": "", "pointsTraites": "" },
      "comiteExamenEtat": { "frequenceReunions": "", "pointsTraites": "" }
    },
    "remunerationPersonnel": {
      "directionProvinciale": { "totalAgents": 0, "nonPayes": 0 },
      "inspectionPrincipale": { "totalAgents": 0, "nonPayes": 0 },
      "dinacope": { "totalAgents": 0, "nonPayes": 0 },
      "sernie": { "totalAgents": 0, "nonPayes": 0 },
      "coordinationProvinciale": { "totalAgents": 0, "nonPayes": 0 },
      "sousDivision": { "totalAgents": 0, "nonPayes": 0 },
      "poolsInspectionPrimaire": { "totalAgents": 0, "nonPayes": 0 },
      "poolsInspectionSecondaire": { "totalAgents": 0, "nonPayes": 0 },
      "antenneDinacope": { "totalAgents": 0, "nonPayes": 0 },
      "antenneSernie": { "totalAgents": 0, "nonPayes": 0 },
      "coordinationDiocesaine": { "totalAgents": 0, "nonPayes": 0 }
    },
    "vulgarisationInstructions": {
      "instructionsOfficielles": "",
      "nouvelleCitoyennete": ""
    },
    "formationsGestionnaires": {
      "leadershipScolaire": { "tauxGF": 0, "tauxFilles": 0 },
      "managementScolaire": { "tauxGF": 0, "tauxFilles": 0 },
      "calculIndicateurs": { "tauxGF": 0, "tauxFilles": 0 },
      "gestionEntiteEducationnelle": { "tauxGF": 0, "tauxFilles": 0 },
      "planification": { "tauxGF": 0, "tauxFilles": 0 }
    },
    "commentaireFormations": "",
    "groupesAidesPsychopedagogiques": {
      "nombreGAPMisEnPlace": 0,
      "nombreGAPOperationnel": 0,
      "nombreCasPrisEnCharge": 0,
      "problemesIdentifies": "",
      "solutionsPreconisees": ""
    },
    "acquisitionsMateriels": {
      "ecoles": {
        "nature": "",
        "sourceFinancement": { "gvt": 0, "projet": 0, "ptfs": 0, "ong": 0 }
      },
      "bureauxGestionnaires": {
        "nature": "",
        "sourceFinancement": { "gvt": 0, "projet": 0, "ptfs": 0, "ong": 0 }
      }
    },
    "infrastructureBureaux": {
      "directionProvinciale": { "proprietaire": 0, "locataire": 0 },
      "inspectionPrincipale": { "proprietaire": 0, "locataire": 0 },
      "dinacope": { "proprietaire": 0, "locataire": 0 },
      "sernie": { "proprietaire": 0, "locataire": 0 },
      "coordinationProvinciale": { "proprietaire": 0, "locataire": 0 },
      "sousDivision": { "proprietaire": 0, "locataire": 0 },
      "poolsInspectionPrimaire": { "proprietaire": 0, "locataire": 0 },
      "poolsInspectionSecondaire": { "proprietaire": 0, "locataire": 0 },
      "antenneDinacope": { "proprietaire": 0, "locataire": 0 },
      "antenneSernie": { "proprietaire": 0, "locataire": 0 },
      "coordinationDiocesaine": { "proprietaire": 0, "locataire": 0 },
      "conseillerieResidente": { "proprietaire": 0, "locataire": 0 }
    }
  },

  "educationUrgence": {
    "planStockContingence": {
      "plan": "",
      "stock": ""
    },
    "catastrophesNaturelles": {
      "nature": "",
      "effetsNegatifs": ""
    },
    "destructionSDC": {
      "forcesNegatives": ""
    },
    "solutionsLocales": "",
    "reunionsClusterEducation": {
      "frequence": "",
      "pointsTraites": ""
    },
    "recommandations": {
      "espacesTemporairesApprentissage": {
        "nombre": 0,
        "couts": ""
      },
      "apprenantsScolarises": {
        "cible": 0
      },
      "formationEnseignantsESU": ""
    }
  },

  "autresProblemes": {
    "problemesSpecifiques": ""
  }
}
```

### `PATCH /rapport-activite/:id/statut`

```json
{
  "statut": "soumis"
}
```

| Valeurs possibles | Description |
|---|---|
| `brouillon` | En cours de rédaction |
| `soumis` | Soumis pour validation |
| `approuve` | Approuvé |
| `rejete` | Rejeté |

---

## 5. Effectif Annuel

### `POST /effectif-annuel`

```json
{
  "identificationProved": "ObjectId_proved",
  "annee": "2024-2025",
  "effectifs": {
    "niveauPrescolaire": {
      "espaceCommunautaireEveil": { "effectifGarconsFilles": 1500, "effectifFilles": 700 },
      "maternel": { "effectifGarconsFilles": 2000, "effectifFilles": 950 },
      "prePrimaire": { "effectifGarconsFilles": 1120, "effectifFilles": 548 },
      "special": { "effectifGarconsFilles": 228, "effectifFilles": 108 }
    },
    "niveauPrimaire": {
      "enseignementSpecial": { "effectifGarconsFilles": 298, "effectifFilles": 142 },
      "enseignementPrimaire": { "effectifGarconsFilles": 34500, "effectifFilles": 16675 }
    },
    "niveauSecondaire": {
      "enseignementSpecial": { "effectifGarcons": 118, "effectifFilles": 92 },
      "enseignementSecondaire": {
        "septiemeCTEB": { "effectifGarcons": 4000, "effectifFilles": 3500 },
        "huitiemeCTEB": { "effectifGarcons": 2950, "effectifFilles": 2600 },
        "premiereHumanite": { "effectifGarcons": 2700, "effectifFilles": 2400 },
        "quatriemeHumanite": { "effectifGarcons": 2200, "effectifFilles": 1900 }
      }
    }
  }
}
```

> **Comportement UPSERT** : Si un enregistrement existe déjà pour `identificationProved` + `annee`, il est mis à jour. Sinon il est créé.

> **Note** : Préscolaire/Primaire utilisent `effectifGarconsFilles` (total mixte) + `effectifFilles`. Secondaire utilise `effectifGarcons` + `effectifFilles` (séparés).

---

## 6. Annonces

### `POST /annonces`
### `PUT /annonces/:id`

```json
{
  "titre": "Rentrée scolaire 2025-2026",
  "contenu": "La rentrée scolaire est fixée au...",
  "type": "public",
  "cible": ["Superviseur", "Inspecteur"],
  "datePublication": "2025-09-01T00:00:00.000Z"
}
```

| Champ | Type | Requis | Défaut | Enum |
|---|---|---|---|---|
| `titre` | String | ✅ | — | — |
| `contenu` | String | ✅ | — | — |
| `type` | String | ✅ | — | `privé`, `public` |
| `cible` | [String] | ✅ | — | `Superviseur`, `Inspecteur` |
| `datePublication` | Date | ❌ | `Date.now` | — |

---

## 7. Besoins en Ressources

### `POST /besoin-ressources`
### `PUT /besoin-ressources/:id`

```json
{
  "materielManquant": ["Manuels scolaires", "Craies"],
  "infrastructuresARenover": ["Toiture bâtiment A", "Latrines"],
  "ecoleId": "ObjectId_ecole"
}
```

| Champ | Type | Requis | Défaut |
|---|---|---|---|
| `materielManquant` | [String] | ❌ | `[]` |
| `infrastructuresARenover` | [String] | ❌ | `[]` |
| `ecoleId` | ObjectId | ✅ | — |

---

## 8. Commissions

### `POST /commissions`
### `PUT /commissions/:id`

```json
{
  "name": "Commission de recrutement",
  "creationDate": "2025-01-15",
  "objective": "Recruter des enseignants qualifiés",
  "initiator": "ObjectId_user",
  "candidate": "Jean Mukendi",
  "position": "Enseignant",
  "direction": "Direction de Kinshasa",
  "service": "Service pédagogique",
  "status": "En cours"
}
```

Tous les champs sont **requis**.

---

## 9. Dénominations

### `POST /denominations`

```json
{
  "appellation": "École Primaire",
  "sigle": "EP",
  "code": 101
}
```

### `POST /denominations/many`

```json
{
  "denominations": [
    { "appellation": "École Primaire", "sigle": "EP", "code": 101 },
    { "appellation": "Institut", "sigle": "INST", "code": 102 }
  ]
}
```

| Champ | Type | Requis |
|---|---|---|
| `appellation` | String | ✅ |
| `sigle` | String | ✅ |
| `code` | Number | ✅ |

---

## 10. Directions

### `POST /directions`
### `PUT /directions/:id`

```json
{
  "nom": "Direction de Kinshasa",
  "idProvince": "ObjectId_province"
}
```

---

## 11. Sous-Directions

### `POST /sous-directions`
### `PUT /sous-directions/:id`

```json
{
  "nom": "Sous-Direction Gombe",
  "idDirection": "ObjectId_direction"
}
```

---

## 12. Provinces

### `POST /provinces`
### `PUT /provinces/:id`

```json
{
  "nom": "Kinshasa"
}
```

---

## 13. Disciplines

### `POST /disciplines`

```json
{
  "nom": "Mathématiques"
}
```

### `POST /disciplines/many`

```json
{
  "disciplines": [
    { "nom": "Mathématiques" },
    { "nom": "Français" }
  ]
}
```

---

## 14. Écoles

### `POST /ecoles`
### `PUT /ecoles/:id`

```json
{
  "nom": "EP Kenge 1",
  "createdBy": "ObjectId_user",
  "localisation": {
    "latitude": -4.7928,
    "longitude": 17.0399
  },
  "sousDirection": "ObjectId_sous_direction",
  "effectifs": 500,
  "secope": "SEC-001",
  "arreteMinisteriel": "AM-2024-001",
  "denomination": "ObjectId_denomination",
  "rueOuAvenue": "Avenue de l'Indépendance",
  "quartier": "Centre",
  "communeOuTerritoire": "Kenge",
  "district": "Kwango",
  "ville": "Kenge",
  "village": "",
  "secteur": "",
  "bp": "BP 123",
  "matricule": "MAT-001",
  "tel": "+243812345678",
  "n": "12"
}
```

### `POST /ecoles/many`

```json
{
  "ecoles": [ { ... }, { ... } ]
}
```

---

## 15. Effectifs (par école)

### `POST /effectifs`

```json
{
  "ecoleId": "ObjectId_ecole",
  "totalEleves": 500,
  "totalPersonnel": 30,
  "repartitionSexe": {
    "garcons": 260,
    "filles": 240
  },
  "repartitionAge": [
    { "age": 6, "count": 50 },
    { "age": 7, "count": 65 },
    { "age": 8, "count": 70 }
  ]
}
```

---

## 16. Élèves

### `POST /eleves`
### `PUT /eleves/:id`

```json
{
  "nom": "Mukendi",
  "prenom": "Paul",
  "age": 12,
  "sexe": "M",
  "classe": "6ème primaire",
  "ecole": "ObjectId_ecole",
  "createdBy": "ObjectId_user"
}
```

### `POST /eleves/many`

```json
{
  "eleves": [ { ... }, { ... } ]
}
```

| Champ | Type | Requis | Enum |
|---|---|---|---|
| `sexe` | String | ✅ | `M`, `F` |

---

## 17. Équipements

### `POST /equipements`
### `PUT /equipements/:id`

```json
{
  "nom": "Tableau noir",
  "quantite": 15,
  "categorie": "Mobilier scolaire",
  "ecoleId": "ObjectId_ecole",
  "createdBy": "ObjectId_user"
}
```

### `POST /equipements/many`

```json
{
  "equipements": [ { ... }, { ... } ]
}
```

---

## 18. Fiches Administratives (A1)

### `POST /fiches-administratives`
### `PUT /fiches-administratives/:id`

```json
{
  "idSousDirection": "ObjectId_sous_direction",
  "idDirection": "ObjectId_direction",
  "etablissement": "ObjectId_ecole",
  "destinateurs": ["ObjectId_user_1", "ObjectId_user_2"],
  "createdBy": "ObjectId_user",
  "code": "A1",
  "locaux": {
    "classes": 12,
    "bureaux": 3,
    "ateliers": 1,
    "labo": 1,
    "autres": 2
  },
  "structureEtPeuplement": [
    {
      "niveau": "Primaire",
      "classes": [
        {
          "classe": "1ère année",
          "nombreElevesGarcons": 30,
          "nombreElevesFilles": 28
        },
        {
          "classe": "2ème année",
          "nombreElevesGarcons": 25,
          "nombreElevesFilles": 27
        }
      ]
    }
  ],
  "personnel": {
    "enseignant": [
      { "autorise": 15, "employe": 12, "manque": 3 }
    ],
    "administratif": [
      { "autorise": 5, "employe": 4, "manque": 1 }
    ]
  },
  "miseEnPlace": [
    {
      "nomPostNom": "Mukendi Jean",
      "sexe": "M",
      "age": 42,
      "secope": "SEC-001",
      "qualif": "D6",
      "cin": "CIN-12345",
      "diplomePrincipal": true,
      "fonction": "Directeur",
      "dateEntree": "2020-09-01",
      "dateSortie": "2025-06-30",
      "autresInfos": {
        "dernierAncien": "2018",
        "motifMutation": "Promotion",
        "autres": ""
      }
    }
  ]
}
```

---

## 19. Fiches Auto-Évaluation

### `POST /fiche-auto-evaluation`
### `PUT /fiche-auto-evaluation/:id`

```json
{
  "identificationProved": "ObjectId_proved",
  "intituleFormation": "Formation sur les méthodes actives",
  "contenuComprehension": {
    "contenuClair": "Beaucoup",
    "nouvellesConnaissances": "Tout à fait"
  },
  "participationImplication": {
    "participationActive": "Assez",
    "rythmeAdapte": "Beaucoup"
  },
  "pertinenceUtilite": {
    "themesUtiles": "Tout à fait",
    "capaciteApplication": "Beaucoup"
  },
  "suggestionsCommentaires": {
    "ceQuiApprecie": "L'interactivité de la formation",
    "ameliorations": "Plus de temps pour la pratique",
    "autresCommentaires": ""
  },
  "statut": "soumis"
}
```

**Valeurs autorisées pour les échelles** : `Pas du tout`, `Peu`, `Assez`, `Beaucoup`, `Tout à fait`

### `PATCH /fiche-auto-evaluation/:id/statut`

```json
{
  "statut": "approuve"
}
```

---

## 20. Formulaires

### `POST /formulaires`
### `PUT /formulaires/:id`

```json
{
  "typeFormulaire": "ObjectId_type_formulaire",
  "reponses": [
    { "champId": "ObjectId_champ", "valeur": "Réponse libre" },
    { "champId": "ObjectId_champ", "valeur": 42 }
  ],
  "destinateurs": ["user1@example.com"],
  "idSousDirection": "ObjectId_sous_direction",
  "createdBy": "ObjectId_user"
}
```

---

## 21. Types de Formulaires

### `POST /type-formulaires`
### `PUT /type-formulaires/:id`

```json
{
  "code": "F01",
  "nom": "Formulaire d'inspection",
  "destinateurs": ["ObjectId_user_1"],
  "createdBy": "ObjectId_user",
  "champs": [
    { "nom": "Nom de l'école", "type": "text" },
    { "nom": "Nombre d'élèves", "type": "number" },
    { "nom": "Date de visite", "type": "date" },
    { "nom": "Niveau", "type": "select", "options": ["Primaire", "Secondaire"] }
  ]
}
```

| Type de champ | Description |
|---|---|
| `text` | Texte libre |
| `number` | Nombre |
| `date` | Date |
| `select` | Liste déroulante (utiliser `options`) |

---

## 22. Infrastructures

### `POST /infrastructures`
### `PUT /infrastructures/:id`

```json
{
  "description": "Salle de classe bâtiment B",
  "type": "Salle de classe",
  "schoolId": "ObjectId_ecole",
  "createdBy": "ObjectId_user"
}
```

| Champ | Type | Requis | Enum |
|---|---|---|---|
| `type` | String | ✅ | `Salle de classe`, `Bibliothèque`, `Laboratoire`, `Toilettes`, `Autre` |

### `POST /infrastructures/many`

```json
{
  "infrastructures": [ { ... }, { ... } ]
}
```

---

## 23. Inspections Pédagogiques (C3)

### `POST /inspections-pedagogique`
### `PUT /inspections-pedagogique/:id`

```json
{
  "numeroRapport": "C3-2025-001",
  "inspecteur": "ObjectId_user",
  "etablissement": "ObjectId_ecole",
  "enseignant": {
    "nom": "Mukendi",
    "postnom": "Jean",
    "prenom": "Pierre"
  },
  "activitesInspectees": [
    {
      "discipline": "Mathématiques",
      "classe": "6ème primaire",
      "lecon": "Les fractions",
      "duree": "45 min"
    }
  ],
  "grilleEvaluation": {
    "personnalite": {
      "presentation": 3,
      "autorite": 3,
      "elocution": 4,
      "attitude": 3,
      "tenueSalle": 2,
      "tenueTableau": 3,
      "presenceEsprit": 4,
      "conseils": "Améliorer la tenue du tableau"
    },
    "maitriseProgramme": {
      "competence": 3,
      "conformite": 4,
      "progression": 3,
      "adaptationMilieu": 3,
      "decomposition": 4,
      "conseils": ""
    },
    "maitriseDiscipline": {
      "connaissanceMatiere": 4,
      "exactitude": 4,
      "dosage": 3,
      "formulation": 3,
      "adaptation": 3,
      "conseils": ""
    },
    "structureLecon": {
      "preparation": 3,
      "motivation": 4,
      "verificationJournal": 3,
      "developpement": 3,
      "evaluation": 3,
      "synthese": 3,
      "application": 4,
      "conseils": ""
    },
    "strategie": {
      "didactiqueGenerale": 3,
      "distribution": 3,
      "integrationPedagogique": 3,
      "facilitePedagogique": 4,
      "conseils": ""
    },
    "moyensEnseignement": {
      "materielDidactique": 2,
      "materielSpecifique": 2,
      "utilisationTableau": 3,
      "conseils": "Utiliser plus de matériel didactique"
    },
    "documentsApprenants": {
      "cahierLecons": 3,
      "cahierExercices": 3,
      "fiches": 2,
      "conseils": ""
    },
    "documentsEnseignant": {
      "previsions": 3,
      "journalClasse": 4,
      "fichesPrep": 3,
      "cahierTextes": 3,
      "cahierPoints": 3,
      "documentationEcrite": 3,
      "conseils": ""
    },
    "evaluationAcquis": {
      "assiduite": 4,
      "evaluationDiagnostique": 3,
      "evaluationFormative": 3,
      "rattrapage": 2,
      "evaluationSommative": 3,
      "conseils": ""
    }
  },
  "evaluationSynthetique": {
    "grille": [
      { "niveau": "Excellent", "min": 80, "max": 100 },
      { "niveau": "Bon", "min": 60, "max": 79 }
    ],
    "total": 72
  },
  "signatureEnseignant": "Mukendi Jean",
  "signatureChefEtablissement": "Directeur Kalume",
  "signatureInspecteur": "Inspecteur Kabongo",
  "dateInspection": "2025-02-15T00:00:00.000Z"
}
```

> **Notes sur grille** : Chaque critère est noté de **0 à 4**.

---

## 24. Premières Visites (C1)

### `POST /premieres-visites`
### `PUT /premieres-visites/:id`

```json
{
  "inspecteur": "ObjectId_user",
  "etablissement": "ObjectId_ecole",
  "nomChefEtablissement": "Kalume Pierre",
  "telephone": "+243812345678",
  "postes": {
    "parcelle": {
      "constatsProblemes": "Clôture endommagée",
      "solutionsProposees": "Réparation urgente"
    },
    "batiments": {
      "constatsProblemes": "Toiture percée",
      "solutionsProposees": "Remplacement tôles"
    },
    "equipements": {
      "constatsProblemes": "Manque de bancs",
      "solutionsProposees": "Achat de 20 bancs"
    },
    "moyensEnseignement": {
      "constatsProblemes": "",
      "solutionsProposees": ""
    },
    "personnel": {
      "constatsProblemes": "Manque 3 enseignants",
      "solutionsProposees": "Recrutement"
    },
    "apprenants": {
      "constatsProblemes": "",
      "solutionsProposees": ""
    },
    "administration": {
      "constatsProblemes": "",
      "solutionsProposees": ""
    },
    "organisationPedagogique": {
      "constatsProblemes": "",
      "solutionsProposees": ""
    },
    "finances": {
      "constatsProblemes": "",
      "solutionsProposees": ""
    },
    "internet": {
      "constatsProblemes": "Pas de connexion",
      "solutionsProposees": "Installation WiFi"
    }
  },
  "rapportCirconstancie": "L'école nécessite des travaux urgents...",
  "signature": {
    "lieu": "Kenge",
    "date": "2025-02-20T00:00:00.000Z",
    "chefEtablissementSignature": "Kalume Pierre",
    "inspecteurSignature": "Inspecteur Kabongo",
    "sceauEtablissement": true
  }
}
```

---

## 25. Partenaires

### `POST /partenaires`
### `PUT /partenaires/:id`

```json
{
  "nom": "UNICEF",
  "description": "Programme d'appui à l'éducation",
  "contact": "unicef@example.com",
  "adresse": "Avenue de la Paix, Kinshasa",
  "datePartenariat": "2024-01-01T00:00:00.000Z"
}
```

---

## 26. Permissions

### `POST /permissions`
### `PUT /permissions/:id`

```json
{
  "role": "Inspecteur",
  "actions": ["create", "read", "update"],
  "resources": ["inspections-pedagogiques", "premieres-visites", "ecoles"]
}
```

| Champ | Type | Enum |
|---|---|---|
| `role` | String | `Administrateur`, `Utilisateur`, `Superviseur`, `Inspecteur`, `Décideur` |
| `actions` | [String] | `create`, `read`, `update`, `delete`, `approve` |

---

## 27. Personnel

### `POST /personnels`
### `PUT /personnels/:id`

```json
{
  "nom": "Kabongo",
  "prenom": "Marie",
  "role": "Enseignante",
  "qualification": "Licenciée en pédagogie",
  "ecole": "ObjectId_ecole",
  "presences": 180,
  "createdBy": "ObjectId_user"
}
```

---

## 28. Présences

### `POST /presences`
### `PUT /presences/:id`

```json
{
  "date": "2025-02-20T00:00:00.000Z",
  "eleveId": "ObjectId_eleve",
  "personnelId": "ObjectId_personnel",
  "present": true
}
```

| Champ | Type | Requis |
|---|---|---|
| `date` | Date | ✅ |
| `eleveId` | ObjectId | ✅ |
| `personnelId` | ObjectId | ❌ (null par défaut) |
| `present` | Boolean | ✅ |

---

## 29. Résultats Scolaires

### `POST /resultats-scolaires`
### `PUT /resultats-scolaires/:id`

```json
{
  "tauxReussite": 78.5,
  "moyenneClasse": 65.2,
  "ecole": "ObjectId_ecole"
}
```

---

## 30. Services

### `POST /services`
### `PUT /services/:id`

```json
{
  "nom": "Service pédagogique",
  "type": "direction",
  "idDirection": "ObjectId_direction",
  "idSousDirection": "ObjectId_sous_direction"
}
```

| Champ | Type | Requis | Enum |
|---|---|---|---|
| `type` | String | ✅ | `direction`, `sousDirection` |

---

## Récapitulatif de tous les endpoints

| # | Méthode | Route | Description |
|---|---|---|---|
| 1 | `POST` | `/signup` | Créer un utilisateur |
| 2 | `POST` | `/login` | Connexion utilisateur |
| 3 | `PUT` | `/users/:id` | Modifier un utilisateur |
| 4 | `PATCH` | `/users/:id/status` | Activer/désactiver utilisateur |
| 5 | `POST` | `/users/:id/upload-photo` | Upload photo (multipart) |
| 6 | `POST` | `/proved/login` | Connexion PROVED |
| 7 | `POST` | `/proved/change-password` | Changer mot de passe PROVED |
| 8 | `POST` | `/proved/create` | Créer identification PROVED |
| 9 | `PUT` | `/proved/:id` | Modifier PROVED |
| 10 | `POST` | `/identification-proved` | Créer identification |
| 11 | `PUT` | `/identification-proved/:id` | Modifier identification |
| 12 | `POST` | `/rapport-activite` | Créer rapport d'activité |
| 13 | `PUT` | `/rapport-activite/:id` | Modifier rapport |
| 14 | `PATCH` | `/rapport-activite/:id/statut` | Changer statut rapport |
| 15 | `POST` | `/effectif-annuel` | Créer/MàJ effectif annuel |
| 16 | `POST` | `/annonces` | Créer annonce |
| 17 | `PUT` | `/annonces/:id` | Modifier annonce |
| 18 | `POST` | `/besoin-ressources` | Créer besoin |
| 19 | `PUT` | `/besoin-ressources/:id` | Modifier besoin |
| 20 | `POST` | `/commissions` | Créer commission |
| 21 | `PUT` | `/commissions/:id` | Modifier commission |
| 22 | `POST` | `/denominations` | Créer dénomination |
| 23 | `POST` | `/denominations/many` | Créer plusieurs dénominations |
| 24 | `PUT` | `/denominations/:id` | Modifier dénomination |
| 25 | `POST` | `/directions` | Créer direction |
| 26 | `PUT` | `/directions/:id` | Modifier direction |
| 27 | `POST` | `/sous-directions` | Créer sous-direction |
| 28 | `PUT` | `/sous-directions/:id` | Modifier sous-direction |
| 29 | `POST` | `/provinces` | Créer province |
| 30 | `PUT` | `/provinces/:id` | Modifier province |
| 31 | `POST` | `/disciplines` | Créer discipline |
| 32 | `POST` | `/disciplines/many` | Créer plusieurs disciplines |
| 33 | `PUT` | `/disciplines/:id` | Modifier discipline |
| 34 | `POST` | `/ecoles` | Créer école |
| 35 | `POST` | `/ecoles/many` | Créer plusieurs écoles |
| 36 | `PUT` | `/ecoles/:id` | Modifier école |
| 37 | `POST` | `/effectifs` | Créer effectif école |
| 38 | `POST` | `/eleves` | Créer élève |
| 39 | `POST` | `/eleves/many` | Créer plusieurs élèves |
| 40 | `PUT` | `/eleves/:id` | Modifier élève |
| 41 | `POST` | `/equipements` | Créer équipement |
| 42 | `POST` | `/equipements/many` | Créer plusieurs équipements |
| 43 | `PUT` | `/equipements/:id` | Modifier équipement |
| 44 | `POST` | `/fiches-administratives` | Créer fiche A1 |
| 45 | `POST` | `/fiches-administratives/many` | Créer plusieurs fiches |
| 46 | `PUT` | `/fiches-administratives/:id` | Modifier fiche A1 |
| 47 | `POST` | `/fiche-auto-evaluation` | Créer auto-évaluation |
| 48 | `PUT` | `/fiche-auto-evaluation/:id` | Modifier auto-évaluation |
| 49 | `PATCH` | `/fiche-auto-evaluation/:id/statut` | Changer statut |
| 50 | `POST` | `/formulaires` | Créer formulaire |
| 51 | `PUT` | `/formulaires/:id` | Modifier formulaire |
| 52 | `POST` | `/type-formulaires` | Créer type formulaire |
| 53 | `PUT` | `/type-formulaires/:id` | Modifier type formulaire |
| 54 | `POST` | `/infrastructures` | Créer infrastructure |
| 55 | `POST` | `/infrastructures/many` | Créer plusieurs infrastructures |
| 56 | `PUT` | `/infrastructures/:id` | Modifier infrastructure |
| 57 | `POST` | `/inspections-pedagogique` | Créer inspection C3 |
| 58 | `POST` | `/inspections-pedagogique/many` | Créer plusieurs inspections |
| 59 | `PUT` | `/inspections-pedagogique/:id` | Modifier inspection C3 |
| 60 | `POST` | `/premieres-visites` | Créer visite C1 |
| 61 | `POST` | `/premieres-visites/many` | Créer plusieurs visites |
| 62 | `PUT` | `/premieres-visites/:id` | Modifier visite C1 |
| 63 | `POST` | `/partenaires` | Créer partenaire |
| 64 | `PUT` | `/partenaires/:id` | Modifier partenaire |
| 65 | `POST` | `/permissions` | Créer permission |
| 66 | `PUT` | `/permissions/:id` | Modifier permission |
| 67 | `POST` | `/personnels` | Créer personnel |
| 68 | `PUT` | `/personnels/:id` | Modifier personnel |
| 69 | `POST` | `/presences` | Créer présence |
| 70 | `PUT` | `/presences/:id` | Modifier présence |
| 71 | `POST` | `/resultats-scolaires` | Créer résultat |
| 72 | `PUT` | `/resultats-scolaires/:id` | Modifier résultat |
| 73 | `POST` | `/services` | Créer service |
| 74 | `PUT` | `/services/:id` | Modifier service |
