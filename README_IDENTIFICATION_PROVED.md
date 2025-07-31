# Module Identification de la PROVED

## Description

Ce module permet de gérer l'identification de la Province Educationnelle (PROVED) de manière centralisée. Une fois configurée, cette identification sera automatiquement utilisée dans tous les rapports d'activités, évitant la répétition des informations.

## Avantages

1. **Centralisation** : Une seule source de vérité pour les informations de la PROVED
2. **Réutilisabilité** : Pas besoin de répéter les informations à chaque rapport
3. **Cohérence** : Toutes les informations sont uniformes
4. **Facilité de maintenance** : Modification en un seul endroit

## Structure

### Modèle IdentificationProved

```javascript
{
  provinceAdministrative: "Kinshasa",
  provinceEducationnelle: "Kinshasa", 
  chefLieuProved: "Kinshasa",
  emailProfessionnel: "directeur@minedu-nc.cd",
  telephone: "+243 123 456 789",
  statutOccupation: "Propriétaire",
  nombreTerritoires: 4,
  nombreSousDivisions: 12,
  directeurProvincial: "Jean Pierre MULUMBA",
  isActive: true
  // createdBy, updatedBy, createdAt, updatedAt sont automatiques
}
```

## API Endpoints

### Endpoints Principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/identification-proved` | Créer une nouvelle identification |
| GET | `/api/v1/identification-proved` | Récupérer toutes les identifications |
| GET | `/api/v1/identification-proved/active` | Récupérer l'identification active |
| GET | `/api/v1/identification-proved/:id` | Récupérer une identification par ID |
| PUT | `/api/v1/identification-proved/:id` | Mettre à jour une identification |
| DELETE | `/api/v1/identification-proved/:id` | Supprimer une identification |
| PATCH | `/api/v1/identification-proved/:id/activate` | Activer une identification |

## Workflow d'Utilisation

### 1. Créer l'Identification de la PROVED

```javascript
// Créer l'identification de la PROVED
const identificationData = {
  provinceAdministrative: "Kinshasa",
  provinceEducationnelle: "Kinshasa",
  chefLieuProved: "Kinshasa",
  emailProfessionnel: "directeur@minedu-nc.cd",
  telephone: "+243 123 456 789",
  statutOccupation: "Propriétaire",
  nombreTerritoires: 4,
  nombreSousDivisions: 12,
  directeurProvincial: "Jean Pierre MULUMBA",
  isActive: true
  // createdBy, updatedBy, createdAt, updatedAt sont automatiques
};

fetch('/api/v1/identification-proved', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify(identificationData)
});
```

### 2. Créer un Rapport d'Activités

```javascript
// Créer un rapport d'activités avec l'identification existante
const rapportData = {
  identificationProved: "64bca7a2e5d12c0012345678", // ID de l'identification
  introduction: "Brève description de la situation...",
  annee: 2024,
  parametresCles: {
    niveauPrescolaire: {
      ecoleEspaceCommunautaire: {
        nombreEcoles: 15,
        nombreClasses: 45,
        effectifGarcons: 1200,
        effectifFilles: 1100,
        tauxAccroissement: 5.2
      }
      // ... autres niveaux
    }
  }
  // ... autres sections
};

fetch('/api/v1/rapport-activite', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify(rapportData)
});
```

### 3. Récupérer l'Identification Active

```javascript
// Récupérer l'identification active pour l'utiliser dans un formulaire
fetch('/api/v1/identification-proved/active', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
});
```

### 4. Changer l'Identification Active

```javascript
// Activer une autre identification (désactive automatiquement les autres)
fetch('/api/v1/identification-proved/64bca7a2e5d12c0012345678/activate', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
});
```

## Gestion des Versions

Le système permet de gérer plusieurs versions d'identification :

- **Une seule identification active** à la fois
- **Historique complet** des identifications
- **Activation/désactivation** facile

### Exemple de Gestion des Versions

```javascript
// 1. Créer une nouvelle identification
const nouvelleIdentification = {
  provinceAdministrative: "Kinshasa",
  provinceEducationnelle: "Kinshasa",
  chefLieuProved: "Kinshasa",
  directeurProvincial: "Nouveau Directeur",
  // ... autres champs
  isActive: false // Ne pas activer immédiatement
};

// 2. Activer la nouvelle identification
fetch('/api/v1/identification-proved/NEW_ID/activate', {
  method: 'PATCH',
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
});
```

## Intégration avec les Rapports

### Avant (Ancien système)
```javascript
const rapportData = {
  identification: {
    provinceAdministrative: "Kinshasa",
    provinceEducationnelle: "Kinshasa",
    chefLieuProved: "Kinshasa",
    // ... répétition des données
  },
  // ... reste du rapport
};
```

### Après (Nouveau système)
```javascript
const rapportData = {
  identificationProved: "64bca7a2e5d12c0012345678", // Référence simple
  // ... reste du rapport
};
```

## Avantages pour l'Interface Utilisateur

1. **Formulaire simplifié** : Plus besoin de saisir les informations de la PROVED
2. **Sélection automatique** : L'identification active est pré-remplie
3. **Validation centralisée** : Les données sont cohérentes
4. **Gestion des versions** : Possibilité de changer d'identification

## Migration des Données Existantes

Si vous avez des rapports existants avec l'ancien format, vous devrez :

1. Créer une identification de PROVED avec les données existantes
2. Mettre à jour les rapports pour utiliser la référence
3. Supprimer les anciennes données d'identification

## Sécurité

- Toutes les opérations nécessitent une authentification
- Seul un utilisateur autorisé peut modifier l'identification active
- Traçabilité complète des modifications

## Support

Pour toute question sur ce module, contactez l'équipe de développement. 