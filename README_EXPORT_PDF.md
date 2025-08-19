# Export PDF - Rapport d'Activités

## Description

Cette fonctionnalité permet d'exporter les rapports d'activités en format PDF. Le système utilise plusieurs méthodes de génération PDF en cascade pour assurer la compatibilité et la fiabilité.

## Méthodes d'Export

### 1. Puppeteer (Méthode principale)
- **Avantages** : Rendu HTML fidèle, support CSS complet
- **Inconvénients** : Dépendance lourde, peut avoir des problèmes de compatibilité
- **Utilisation** : Première méthode essayée

### 2. html-pdf-node (Fallback 1)
- **Avantages** : Plus léger que Puppeteer
- **Inconvénients** : Support CSS limité
- **Utilisation** : Si Puppeteer échoue

### 3. PDFKit (Fallback 2)
- **Avantages** : Très léger, pas de dépendances externes
- **Inconvénients** : Pas de support HTML/CSS, génération manuelle
- **Utilisation** : Si les deux premières méthodes échouent

## Endpoint API

```
GET /api/v1/rapport-activite/:id/export
```

### Paramètres
- `id` : ID du rapport d'activités à exporter

### Headers requis
- `Authorization: Bearer <token>` : Token JWT d'authentification

### Réponse
- **Succès** : Fichier PDF en téléchargement
- **Erreur 404** : Rapport non trouvé
- **Erreur 500** : Erreur lors de la génération

## Structure du PDF

Le PDF généré contient les sections suivantes :

1. **En-tête officiel**
   - République Démocratique du Congo
   - Ministère de l'Enseignement
   - Province Éducationnelle
   - Titre du rapport

2. **Identification de la PROVED**
   - Informations administratives
   - Coordonnées
   - Directeur Provincial

3. **Introduction** (si disponible)
   - Texte d'introduction du rapport

4. **Paramètres Clés**
   - Niveau Préscolaire
   - Niveau Primaire
   - Niveau Secondaire
   - Effectifs et statistiques

5. **Personnel**
   - Personnel Enseignant
   - Personnel Administratif

6. **Réalisations**
   - Accès, Accessibilité et Équité
   - Nouvelles infrastructures
   - Indicateurs de performance

7. **Conclusion** (si disponible)
   - Texte de conclusion

8. **Informations Générales**
   - Année, statut, dates

9. **Signatures**
   - Signature du Directeur Provincial
   - Cachet et signature

## Configuration

### Variables d'environnement
```bash
# Chemin vers l'exécutable Chrome (optionnel)
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Mode de développement (pour les détails d'erreur)
NODE_ENV=development
```

### Dépendances installées
```json
{
  "puppeteer": "^19.11.1",
  "html-pdf-node": "^1.0.8",
  "pdfkit": "^0.14.0"
}
```

## Dépannage

### Erreur "ReadableStream is not defined"
- **Cause** : Incompatibilité avec la version de Node.js
- **Solution** : Utilisation de Puppeteer v19.11.1 compatible avec Node.js 16

### Erreur de lancement de Puppeteer
- **Cause** : Chrome/Chromium non installé ou inaccessible
- **Solution** : Le système bascule automatiquement vers html-pdf-node puis PDFKit

### PDF vide ou mal formaté
- **Cause** : Problème de rendu HTML/CSS
- **Solution** : Vérifier les données du rapport et les styles CSS

## Logs

Le système génère des logs détaillés :
```
🔄 Tentative d'export avec Puppeteer...
✅ Export réussi avec Puppeteer
⚠️ Échec avec Puppeteer, tentative avec html-pdf-node...
✅ Export réussi avec html-pdf-node
⚠️ Échec avec html-pdf-node, tentative avec PDFKit...
✅ Export réussi avec PDFKit
```

## Exemple d'utilisation

```javascript
// Requête HTTP
const response = await fetch('/api/v1/rapport-activite/64f8a1b2c3d4e5f6a7b8c9d0/export', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
});

// Téléchargement du PDF
if (response.ok) {
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rapport-activite-2024-province.pdf';
  a.click();
}
```

## Maintenance

### Mise à jour des dépendances
```bash
npm update puppeteer html-pdf-node pdfkit
```

### Test de la fonctionnalité
```bash
# Tester l'endpoint avec curl
curl -X GET \
  -H "Authorization: Bearer your-token" \
  -o rapport-test.pdf \
  http://localhost:3000/api/v1/rapport-activite/rapport-id/export
```

## Support

Pour toute question ou problème lié à l'export PDF, vérifiez :
1. Les logs du serveur
2. La version de Node.js (recommandée : 18.x)
3. Les permissions d'écriture
4. La connectivité réseau (pour Puppeteer)
