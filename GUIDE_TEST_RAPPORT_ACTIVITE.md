# Guide d'Utilisation - API Rapport d'Activité

## 📄 Fichiers Fournis

1. **rapport-activite-complet.json** - JSON complet pour le rapport d'activité
2. **test-rapport-activite-curl.sh** - Script de test automatisé avec curl
3. Ce README avec toutes les commandes

## 🔧 Configuration Avant de Tester

### 1. Modifier le fichier JSON
Ouvrez `rapport-activite-complet.json` et remplacez :
```json
"identificationProved": "VOTRE_ID_PROVED_ICI"
```
Par l'ID de votre PROVED (obtenu après authentification).

### 2. Obtenir un Token d'Authentification
Vous devez d'abord vous connecter pour obtenir un token :

```bash
# Connexion (remplacez avec vos identifiants réels)
curl -X POST "http://localhost:3000/api/v1/proved/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "votre-email@exemple.com",
    "motDePasse": "votre-mot-de-passe"
  }'
```

La réponse contiendra votre token JWT :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

Copiez le token pour l'utiliser dans les requêtes suivantes.

## 🚀 Tests avec Curl

### Méthode 1 : Commandes Individuelles

#### 1️⃣ Créer un Nouveau Rapport d'Activité

```bash
curl -X POST "http://localhost:3000/api/v1/rapport-activite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d @rapport-activite-complet.json
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Rapport d'activité créé avec succès",
  "data": {
    "_id": "67b9c1e2f3a4b5c6d7e8f9a0",
    "identificationProved": "...",
    "annee": "2024-2025",
    ...
  }
}
```

#### 2️⃣ Récupérer Tous les Rapports (avec pagination)

```bash
curl -X GET "http://localhost:3000/api/v1/rapport-activite?page=1&limit=10" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

#### 3️⃣ Récupérer un Rapport Spécifique par ID

```bash
# Remplacez RAPPORT_ID par l'ID du rapport créé
curl -X GET "http://localhost:3000/api/v1/rapport-activite/RAPPORT_ID" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

#### 4️⃣ Mettre à Jour un Rapport

```bash
curl -X PUT "http://localhost:3000/api/v1/rapport-activite/RAPPORT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "introduction": "Introduction mise à jour après révision",
    "conclusion": "Conclusion actualisée avec nouvelles données"
  }'
```

#### 5️⃣ Changer le Statut d'un Rapport

```bash
# Statuts possibles : "brouillon", "soumis", "approuve", "rejete"
curl -X PATCH "http://localhost:3000/api/v1/rapport-activite/RAPPORT_ID/statut" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d '{
    "statut": "soumis"
  }'
```

#### 6️⃣ Obtenir les Statistiques des Rapports

```bash
curl -X GET "http://localhost:3000/api/v1/rapport-activite/statistiques" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

#### 7️⃣ Filtrer les Rapports

```bash
# Par année
curl -X GET "http://localhost:3000/api/v1/rapport-activite?annee=2024-2025" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"

# Par statut
curl -X GET "http://localhost:3000/api/v1/rapport-activite?statut=brouillon" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"

# Combinaison de filtres
curl -X GET "http://localhost:3000/api/v1/rapport-activite?annee=2024-2025&statut=soumis&page=1&limit=5" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

#### 8️⃣ Exporter un Rapport en PDF

```bash
curl -X GET "http://localhost:3000/api/v1/rapport-activite/RAPPORT_ID/export" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  --output rapport.pdf
```

#### 9️⃣ Supprimer un Rapport

```bash
curl -X DELETE "http://localhost:3000/api/v1/rapport-activite/RAPPORT_ID" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

### Méthode 2 : Script Automatisé

Rendre le script exécutable et le lancer :

```bash
# Rendre le script exécutable
chmod +x test-rapport-activite-curl.sh

# Éditer le script pour ajouter votre token
nano test-rapport-activite-curl.sh
# Remplacez TOKEN="VOTRE_TOKEN_ICI" par votre vrai token

# Exécuter le script
./test-rapport-activite-curl.sh
```

## 📊 Structure du JSON Rapport d'Activité

Le JSON contient les sections suivantes :

```
├── identificationProved (String - ID de la PROVED)
├── annee (String - Année scolaire)
├── introduction (String)
│
├── parametresCles
│   ├── nombreEcolesClasses
│   │   ├── niveauPrescolaire
│   │   ├── niveauPrimaire
│   │   └── niveauSecondaire
│   └── effectifScolaire
│       ├── niveauPrescolaire
│       ├── niveauPrimaire
│       └── niveauSecondaire
│
├── personnel
│   ├── personnelEnseignant
│   └── personnelAdministratif
│
├── realisations
│   └── accesAccessibiliteEquite
│
├── ameliorationQualite
│   ├── disponibiliteMoyensEnseignement
│   ├── visitesEtReunions
│   ├── activitesInspectorales
│   └── indicateursRendement
│
├── gouvernance
│   ├── miseEnOeuvreSSEF
│   ├── inspectionsAdministrativesC2B
│   ├── comitesProvinciaux
│   ├── remunerationPersonnel
│   └── infrastructureBureaux
│
├── educationUrgence
│   ├── planStockContingence
│   ├── catastrophesNaturelles
│   └── recommandations
│
├── autresProblemes
├── conclusion
└── statut (brouillon | soumis | approuve | rejete)
```

## 🔍 Tester avec jq (Formatage JSON)

Pour une meilleure lisibilité des résultats, installez `jq` et utilisez-le :

```bash
# Installation de jq
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Utilisation
curl -X GET "http://localhost:3000/api/v1/rapport-activite" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  | jq '.'
```

## 🌐 URL de Production

Pour tester avec l'API en production, remplacez :
```bash
http://localhost:3000/api/v1
```
par :
```bash
http://134.122.23.150/api/v1
```

## 📝 Exemple Complet : Workflow Typique

```bash
# 1. Se connecter
TOKEN=$(curl -s -X POST "http://localhost:3000/api/v1/proved/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "votre-email@exemple.com", "motDePasse": "votre-mot-de-passe"}' \
  | jq -r '.token')

echo "Token obtenu: $TOKEN"

# 2. Créer un rapport
RAPPORT_ID=$(curl -s -X POST "http://localhost:3000/api/v1/rapport-activite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @rapport-activite-complet.json \
  | jq -r '.data._id')

echo "Rapport créé avec ID: $RAPPORT_ID"

# 3. Récupérer le rapport créé
curl -X GET "http://localhost:3000/api/v1/rapport-activite/$RAPPORT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'

# 4. Modifier le statut à "soumis"
curl -X PATCH "http://localhost:3000/api/v1/rapport-activite/$RAPPORT_ID/statut" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"statut": "soumis"}' \
  | jq '.'

# 5. Exporter en PDF
curl -X GET "http://localhost:3000/api/v1/rapport-activite/$RAPPORT_ID/export" \
  -H "Authorization: Bearer $TOKEN" \
  --output "rapport-$RAPPORT_ID.pdf"

echo "Rapport exporté : rapport-$RAPPORT_ID.pdf"
```

## ⚠️ Gestion des Erreurs

### Erreur 401 - Non autorisé
```json
{
  "success": false,
  "message": "Token invalide ou expiré"
}
```
➡️ Solution : Reconnectez-vous pour obtenir un nouveau token.

### Erreur 400 - Données invalides
```json
{
  "success": false,
  "message": "Données de rapport invalides",
  "errors": [...]
}
```
➡️ Solution : Vérifiez la structure de votre JSON.

### Erreur 404 - Rapport non trouvé
```json
{
  "success": false,
  "message": "Rapport non trouvé"
}
```
➡️ Solution : Vérifiez l'ID du rapport.

## 🎯 Conseils pour le Frontend

### Exemple avec Fetch (JavaScript)

```javascript
// Configuration
const API_URL = 'http://localhost:3000/api/v1';
const token = localStorage.getItem('authToken');

// Créer un rapport
async function creerRapport(rapportData) {
  try {
    const response = await fetch(`${API_URL}/rapport-activite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(rapportData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Rapport créé:', result.data);
      return result.data;
    } else {
      console.error('Erreur:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erreur réseau:', error);
    throw error;
  }
}

// Récupérer tous les rapports
async function obtenirRapports(page = 1, limit = 10) {
  const response = await fetch(
    `${API_URL}/rapport-activite?page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return await response.json();
}

// Mettre à jour le statut
async function changerStatut(rapportId, nouveauStatut) {
  const response = await fetch(
    `${API_URL}/rapport-activite/${rapportId}/statut`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ statut: nouveauStatut })
    }
  );
  
  return await response.json();
}
```

### Exemple avec Axios (JavaScript)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Créer un rapport
export const creerRapport = async (rapportData) => {
  const response = await api.post('/rapport-activite', rapportData);
  return response.data;
};

// Récupérer tous les rapports
export const obtenirRapports = async (page = 1, limit = 10) => {
  const response = await api.get('/rapport-activite', {
    params: { page, limit }
  });
  return response.data;
};

// Mettre à jour un rapport
export const mettreAJourRapport = async (id, data) => {
  const response = await api.put(`/rapport-activite/${id}`, data);
  return response.data;
};

// Changer le statut
export const changerStatut = async (id, statut) => {
  const response = await api.patch(`/rapport-activite/${id}/statut`, { statut });
  return response.data;
};
```

## 📞 Support

Pour toute question ou problème :
- Vérifiez d'abord que votre serveur est démarré : `npm start`
- Consultez les logs de l'API pour les erreurs détaillées
- Vérifiez votre connexion à la base de données MongoDB

## ✅ Checklist de Test

- [ ] Obtenir un token d'authentification
- [ ] Modifier le JSON avec votre ID PROVED
- [ ] Tester la création d'un rapport
- [ ] Vérifier que le rapport apparaît dans la liste
- [ ] Tester la récupération d'un rapport par ID
- [ ] Tester la mise à jour d'un rapport
- [ ] Tester le changement de statut
- [ ] Tester les filtres (année, statut)
- [ ] Tester les statistiques
- [ ] Tester l'export PDF
- [ ] Intégrer dans le frontend

Bon test ! 🚀
