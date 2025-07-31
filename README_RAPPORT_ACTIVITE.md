# Module Rapport d'Activités - Directeur Provincial

## Description

Ce module permet la gestion complète des rapports d'activités du Directeur Provincial de l'Education Nationale et Nouvelle Citoyenneté (MINEDU-NC) selon le canevas officiel fourni par le Secrétariat Général.

## Structure du Module

### 1. Modèle de Données (`models/rapportActivite.model.js`)

Le modèle comprend toutes les sections du canevas officiel :

- **Identification de la Province Educationnelle**
  - Province administrative et éducationnelle
  - Chef lieu de la PROVED
  - Informations de contact
  - Statut d'occupation
  - Nombre de territoires et sous-divisions

- **Introduction**
  - Description de la genèse
  - Présentation de la situation sociogéographique

- **Les Quatre Paramètres Clés du Système Educatif**
  - Niveau Préscolaire (ECE, Maternel, Pré-Primaire, Spécial)
  - Niveau Primaire (Enseignement Spécial, Primaire)
  - Niveau Secondaire (Enseignement Spécial, Secondaire)
  - Effectifs scolaires et taux d'accroissement

- **Personnel**
  - Personnel enseignant (par niveau)
  - Personnel administratif (par bureau gestionnaire)

- **Réalisations par Axe Stratégique**
  - Accès, Accessibilité & Équité
  - Amélioration de la Qualité de l'Education
  - Gouvernance (Gestion et Pilotage)

- **Education en Situation d'Urgence**
  - Plan et stock de contingence
  - Espaces temporaires d'apprentissage

## API Endpoints

### Endpoints Principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/rapport-activite` | Créer un nouveau rapport |
| GET | `/api/v1/rapport-activite` | Récupérer tous les rapports (avec pagination) |
| GET | `/api/v1/rapport-activite/:id` | Récupérer un rapport par ID |
| PUT | `/api/v1/rapport-activite/:id` | Mettre à jour un rapport |
| DELETE | `/api/v1/rapport-activite/:id` | Supprimer un rapport |

### Endpoints Spécialisés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| PATCH | `/api/v1/rapport-activite/:id/statut` | Changer le statut d'un rapport |
| GET | `/api/v1/rapport-activite/statistiques` | Obtenir les statistiques |
| GET | `/api/v1/rapport-activite/:id/export` | Exporter en PDF (à implémenter) |

## Paramètres de Filtrage

### GET `/api/v1/rapport-activite`

- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 10)
- `annee` : Filtrer par année
- `statut` : Filtrer par statut (brouillon, soumis, approuve, rejete)
- `province` : Filtrer par province administrative

### Exemple de requête :
```
GET /api/v1/rapport-activite?page=1&limit=20&annee=2024&statut=soumis
```

## Statuts des Rapports

- **brouillon** : Rapport en cours de rédaction
- **soumis** : Rapport soumis pour validation
- **approuve** : Rapport approuvé
- **rejete** : Rapport rejeté

## Exemple d'Utilisation

### Créer un nouveau rapport

```javascript
const rapportData = {
  identification: {
    provinceAdministrative: "Kinshasa",
    provinceEducationnelle: "Kinshasa",
    chefLieuProved: "Kinshasa",
    emailProfessionnel: "directeur@minedu-nc.cd",
    telephone: "+243 123 456 789",
    statutOccupation: "Propriétaire",
    nombreTerritoires: 4,
    nombreSousDivisions: 12,
    directeurProvincial: "Jean Pierre MULUMBA",
    dateSignature: new Date()
  },
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

### Changer le statut d'un rapport

```javascript
fetch('/api/v1/rapport-activite/64bca7a2e5d12c0012345678/statut', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    statut: 'soumis'
  })
});
```

## Statistiques Disponibles

L'endpoint `/api/v1/rapport-activite/statistiques` retourne :

- **totalRapports** : Nombre total de rapports
- **rapportsParStatut** : Répartition par statut
- **rapportsParProvince** : Répartition par province
- **rapportsParAnnee** : Répartition par année

## Intégration avec l'Interface

Le module est prêt pour l'intégration avec une interface utilisateur qui permettra :

1. **Création de rapports** avec formulaire structuré selon le canevas
2. **Édition en temps réel** avec sauvegarde automatique
3. **Validation et soumission** avec workflow d'approbation
4. **Export PDF** selon le format officiel
5. **Tableau de bord** avec statistiques et indicateurs

## Sécurité

- Tous les endpoints nécessitent une authentification JWT
- Les données sont validées selon le schéma défini
- Traçabilité des modifications (createdBy, updatedBy)

## Prochaines Étapes

1. **Implémentation de l'export PDF** avec PDFKit ou Puppeteer
2. **Interface utilisateur** avec React/Vue.js
3. **Workflow d'approbation** avec notifications
4. **Synchronisation** avec d'autres modules (écoles, personnel, etc.)
5. **Rapports automatisés** et alertes

## Support

Pour toute question ou problème avec ce module, contactez l'équipe de développement. 