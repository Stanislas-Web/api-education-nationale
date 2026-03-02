# API Effectifs Annuels

## Base URL

```
http://localhost:3000/api/v1
```

## Authentification

Toutes les requêtes nécessitent un token JWT dans le header :

```
Authorization: Bearer <token>
```

Le token est obtenu via :

```
POST /proved/login
Content-Type: application/json

{
  "identifier": "+243XXXXXXXXX",
  "motDePasse": "votre_mot_de_passe"
}
```

---

## Endpoints

### 1. `GET /effectif-annuel/last/:identificationProved`

Récupère le **dernier effectif enregistré** pour une PROVED, sans spécifier d'année.

#### Paramètres URL

| Paramètre              | Type             | Description    |
| ---------------------- | ---------------- | -------------- |
| `identificationProved` | String (ObjectId) | ID de la PROVED |

#### Réponse 200 — Succès

```json
{
  "success": true,
  "message": "Dernier effectif enregistré (2024-2025) récupéré avec succès",
  "anneePrecedente": "2024-2025",
  "anneeActuelle": "2025-2026",
  "isDefaultData": false,
  "data": {
    "_id": "...",
    "identificationProved": "...",
    "annee": "2024-2025",
    "effectifs": { ... }
  }
}
```

#### Réponse 404 — Aucun effectif

```json
{
  "success": false,
  "message": "Aucun effectif enregistré pour cette PROVED"
}
```

#### Cas d'utilisation

Au chargement initial d'une page pour afficher les dernières données connues sans connaître l'année en cours.

---

### 2. `GET /effectif-annuel/previous/:identificationProved/:annee`

Récupère les effectifs de l'**année précédente** par rapport à l'année fournie.

#### Paramètres URL

| Paramètre              | Type             | Exemple       | Description                                    |
| ---------------------- | ---------------- | ------------- | ---------------------------------------------- |
| `identificationProved` | String (ObjectId) | `6970af4d...` | ID de la PROVED                                |
| `annee`                | String           | `2025-2026`   | Année scolaire **actuelle** (format `YYYY-YYYY`) |

> L'API calcule automatiquement l'année précédente : `2025-2026` → cherche `2024-2025`

#### Réponse 200 — Données trouvées

```json
{
  "success": true,
  "message": "Effectifs de l'année 2024-2025 récupérés avec succès",
  "anneePrecedente": "2024-2025",
  "anneeActuelle": "2025-2026",
  "isDefaultData": false,
  "data": { ... }
}
```

#### Réponse 200 — Valeurs par défaut (aucune donnée en base)

```json
{
  "success": true,
  "message": "Aucun effectif trouvé pour 2023-2024, valeurs par défaut fournies",
  "anneePrecedente": "2023-2024",
  "anneeActuelle": "2024-2025",
  "isDefaultData": true,
  "data": { ... }
}
```

> ⚠️ **Important** : Si `isDefaultData` est `true`, les données retournées sont des valeurs par défaut, pas des données réelles.

#### Cas d'utilisation

Pré-remplir un formulaire de saisie ou calculer les taux d'accroissement par rapport à l'année précédente.

---

### 3. `POST /effectif-annuel`

Crée ou met à jour les effectifs d'une PROVED pour une année donnée (**upsert**).

#### Body (JSON)

```json
{
  "identificationProved": "6970af4de0355a44bca8a5b9",
  "annee": "2024-2025",
  "effectifs": {
    "niveauPrescolaire": {
      "espaceCommunautaireEveil": {
        "effectifGarconsFilles": 1500,
        "effectifFilles": 700
      },
      "maternel": {
        "effectifGarconsFilles": 2000,
        "effectifFilles": 950
      },
      "prePrimaire": {
        "effectifGarconsFilles": 1120,
        "effectifFilles": 548
      },
      "special": {
        "effectifGarconsFilles": 228,
        "effectifFilles": 108
      }
    },
    "niveauPrimaire": {
      "enseignementSpecial": {
        "effectifGarconsFilles": 298,
        "effectifFilles": 142
      },
      "enseignementPrimaire": {
        "effectifGarconsFilles": 34500,
        "effectifFilles": 16675
      }
    },
    "niveauSecondaire": {
      "enseignementSpecial": {
        "effectifGarcons": 118,
        "effectifFilles": 92
      },
      "enseignementSecondaire": {
        "septiemeCTEB": {
          "effectifGarcons": 4000,
          "effectifFilles": 3500
        },
        "huitiemeCTEB": {
          "effectifGarcons": 2950,
          "effectifFilles": 2600
        },
        "premiereHumanite": {
          "effectifGarcons": 2700,
          "effectifFilles": 2400
        },
        "quatriemeHumanite": {
          "effectifGarcons": 2200,
          "effectifFilles": 1900
        }
      }
    }
  }
}
```

#### Réponse 200

```json
{
  "success": true,
  "message": "Effectifs sauvegardés avec succès",
  "data": {
    "_id": "...",
    "identificationProved": "6970af4de0355a44bca8a5b9",
    "annee": "2024-2025",
    "effectifs": { ... },
    "createdAt": "2026-03-01T...",
    "updatedAt": "2026-03-01T..."
  }
}
```

> **Comportement UPSERT** : Si un enregistrement existe déjà pour la combinaison `identificationProved` + `annee`, il est **mis à jour**. Sinon, un nouveau document est **créé**.

---

### 4. `GET /effectif-annuel/historique/:identificationProved`

Récupère l'**historique complet** de tous les effectifs enregistrés pour une PROVED.

#### Paramètres URL

| Paramètre              | Type             | Description    |
| ---------------------- | ---------------- | -------------- |
| `identificationProved` | String (ObjectId) | ID de la PROVED |

#### Réponse 200

```json
{
  "success": true,
  "message": "Historique des effectifs récupéré avec succès",
  "count": 3,
  "data": [
    { "annee": "2024-2025", "effectifs": { ... } },
    { "annee": "2023-2024", "effectifs": { ... } },
    { "annee": "2022-2023", "effectifs": { ... } }
  ]
}
```

> Les résultats sont triés du **plus récent au plus ancien**.

#### Réponse 404

```json
{
  "success": false,
  "message": "Aucun historique d'effectifs trouvé"
}
```

---

## Structure des effectifs

```
effectifs
├── niveauPrescolaire
│   ├── espaceCommunautaireEveil  → { effectifGarconsFilles, effectifFilles }
│   ├── maternel                  → { effectifGarconsFilles, effectifFilles }
│   ├── prePrimaire               → { effectifGarconsFilles, effectifFilles }
│   └── special                   → { effectifGarconsFilles, effectifFilles }
│
├── niveauPrimaire
│   ├── enseignementSpecial       → { effectifGarconsFilles, effectifFilles }
│   └── enseignementPrimaire      → { effectifGarconsFilles, effectifFilles }
│
└── niveauSecondaire
    ├── enseignementSpecial        → { effectifGarcons, effectifFilles }
    └── enseignementSecondaire
        ├── septiemeCTEB           → { effectifGarcons, effectifFilles }
        ├── huitiemeCTEB           → { effectifGarcons, effectifFilles }
        ├── premiereHumanite       → { effectifGarcons, effectifFilles }
        └── quatriemeHumanite      → { effectifGarcons, effectifFilles }
```

### Note importante sur les champs

| Niveau                      | Champs                                      |
| --------------------------- | ------------------------------------------- |
| Préscolaire et Primaire     | `effectifGarconsFilles` (total mixte) + `effectifFilles` |
| Secondaire                  | `effectifGarcons` + `effectifFilles` (séparés)            |

---

## Champs de réponse communs

| Champ             | Type    | Description                                                            |
| ----------------- | ------- | ---------------------------------------------------------------------- |
| `success`         | Boolean | `true` si la requête a réussi                                          |
| `message`         | String  | Message descriptif du résultat                                         |
| `anneePrecedente` | String  | Année scolaire de l'effectif retourné (ex: `"2024-2025"`)             |
| `anneeActuelle`   | String  | Année scolaire suivante calculée automatiquement (ex: `"2025-2026"`)  |
| `isDefaultData`   | Boolean | `true` = valeurs par défaut, `false` = données réelles de la base     |
| `data`            | Object  | Le document effectif complet                                           |

---

## Récapitulatif

| Méthode | Route                                         | Description                     |
| ------- | --------------------------------------------- | ------------------------------- |
| `GET`   | `/effectif-annuel/last/:id`                   | Dernier effectif enregistré     |
| `GET`   | `/effectif-annuel/previous/:id/:annee`        | Effectif de l'année précédente  |
| `POST`  | `/effectif-annuel`                            | Créer / mettre à jour           |
| `GET`   | `/effectif-annuel/historique/:id`             | Historique complet              |

---

## Exemple d'intégration Frontend

```javascript
const API_BASE = 'http://localhost:3000/api/v1';
const token = 'votre_jwt_token';
const provedId = '6970af4de0355a44bca8a5b9';
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

// 1. Charger le dernier effectif
const lastRes = await fetch(`${API_BASE}/effectif-annuel/last/${provedId}`, { headers });
const lastData = await lastRes.json();

if (lastData.success) {
  console.log('Année:', lastData.anneePrecedente);
  console.log('Données réelles:', !lastData.isDefaultData);
  // Utiliser lastData.data.effectifs pour remplir le formulaire
}

// 2. Charger l'effectif précédent pour une année spécifique
const prevRes = await fetch(`${API_BASE}/effectif-annuel/previous/${provedId}/2025-2026`, { headers });
const prevData = await prevRes.json();

if (prevData.isDefaultData) {
  console.log('Attention: valeurs par défaut, pas de données réelles');
}

// 3. Sauvegarder des effectifs
const saveRes = await fetch(`${API_BASE}/effectif-annuel`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    identificationProved: provedId,
    annee: '2025-2026',
    effectifs: {
      niveauPrescolaire: {
        espaceCommunautaireEveil: { effectifGarconsFilles: 1600, effectifFilles: 780 },
        maternel: { effectifGarconsFilles: 2100, effectifFilles: 1000 },
        prePrimaire: { effectifGarconsFilles: 1200, effectifFilles: 580 },
        special: { effectifGarconsFilles: 240, effectifFilles: 115 }
      },
      niveauPrimaire: {
        enseignementSpecial: { effectifGarconsFilles: 310, effectifFilles: 150 },
        enseignementPrimaire: { effectifGarconsFilles: 36000, effectifFilles: 17500 }
      },
      niveauSecondaire: {
        enseignementSpecial: { effectifGarcons: 125, effectifFilles: 98 },
        enseignementSecondaire: {
          septiemeCTEB: { effectifGarcons: 4200, effectifFilles: 3700 },
          huitiemeCTEB: { effectifGarcons: 3100, effectifFilles: 2750 },
          premiereHumanite: { effectifGarcons: 2850, effectifFilles: 2550 },
          quatriemeHumanite: { effectifGarcons: 2350, effectifFilles: 2050 }
        }
      }
    }
  })
});
const saveData = await saveRes.json();
console.log('Sauvegardé:', saveData.success);

// 4. Charger l'historique complet
const histRes = await fetch(`${API_BASE}/effectif-annuel/historique/${provedId}`, { headers });
const histData = await histRes.json();
console.log(`${histData.count} année(s) enregistrée(s)`);
```

---

## Gestion des erreurs

Toutes les erreurs serveur retournent :

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "error": "Détail technique"
}
```

| Code HTTP | Signification                        |
| --------- | ------------------------------------ |
| 200       | Succès                               |
| 404       | Aucune donnée trouvée                |
| 401       | Token manquant ou invalide           |
| 500       | Erreur serveur                       |
