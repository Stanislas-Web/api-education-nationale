# 🧪 Guide de Test - Indicateurs de Rendement

## ✅ Modifications Complétées

### Fichiers Modifiés/Créés
- ✅ `models/rapportActivite.model.js` - Ajout de efficaciteSecondaire et tauxDiplomesOCDE
- ✅ `validators/indicateursRendement.validator.js` - Nouveau fichier de validation
- ✅ `controllers/rapportActivite.controller.js` - Intégration des validations
- ✅ `tests/indicateursRendement.test.js` - Tests unitaires
- ✅ `test-data-indicateurs-rendement.json` - Données d'exemple

---

## 🚀 Tests Rapides

### 1. Test de Création avec les Nouveaux Champs

```bash
# Test avec données valides
curl -X POST http://localhost:5000/api/rapport-activite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @test-data-indicateurs-rendement.json
```

**Résultat Attendu**: Status 201 avec le rapport créé

### 2. Test de Validation - Taux Invalide (> 100)

```bash
curl -X POST http://localhost:5000/api/rapport-activite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "annee": "2024-2025",
    "ameliorationQualite": {
      "indicateursRendement": {
        "efficaciteSecondaire": {
          "tauxAbandon": { "tauxGF": 150, "tauxFilles": 6.2 }
        }
      }
    }
  }'
```

**Résultat Attendu**: Status 400 avec message d'erreur

```json
{
  "success": false,
  "message": "Données des indicateurs de rendement invalides",
  "errors": [
    "[Efficacité Secondaire] tauxAbandon.tauxGF doit être entre 0 et 100 (valeur: 150)"
  ]
}
```

### 3. Test de Validation - Somme ≠ 100%

```bash
curl -X POST http://localhost:5000/api/rapport-activite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "annee": "2024-2025",
    "ameliorationQualite": {
      "indicateursRendement": {
        "efficaciteSecondaire": {
          "tauxAbandon": { "tauxGF": 10, "tauxFilles": 8 },
          "tauxReussite": { "tauxGF": 50, "tauxFilles": 45 },
          "tauxEchec": { "tauxGF": 20, "tauxFilles": 22 }
        }
      }
    }
  }'
```

**Résultat Attendu**: Status 400 avec message sur la somme

```json
{
  "success": false,
  "message": "Données des indicateurs de rendement invalides",
  "errors": [
    "[Efficacité Secondaire] La somme des taux GF (80.0%) devrait être proche de 100% ..."
  ]
}
```

### 4. Test de Validation - tauxFilles > tauxGF

```bash
curl -X POST http://localhost:5000/api/rapport-activite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "annee": "2024-2025",
    "ameliorationQualite": {
      "indicateursRendement": {
        "tauxDiplomesOCDE": {
          "humanitesScientifiques": { "tauxGF": 80, "tauxFilles": 90 }
        }
      }
    }
  }'
```

**Résultat Attendu**: Status 400 avec message de cohérence

```json
{
  "success": false,
  "message": "Données des indicateurs de rendement invalides",
  "errors": [
    "[Taux Diplômés OCDE] humanitesScientifiques: tauxFilles (90%) ne peut pas dépasser tauxGF (80%)"
  ]
}
```

### 5. Test de Mise à Jour

```bash
curl -X PUT http://localhost:5000/api/rapport-activite/RAPPORT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "ameliorationQualite": {
      "indicateursRendement": {
        "efficaciteSecondaire": {
          "tauxAbandon": { "tauxGF": 7.2, "tauxFilles": 6.8 },
          "tauxReussite": { "tauxGF": 83.5, "tauxFilles": 82.1 },
          "tauxEchec": { "tauxGF": 9.3, "tauxFilles": 11.1 }
        }
      }
    }
  }'
```

**Résultat Attendu**: Status 200 avec rapport mis à jour

### 6. Test de Récupération

```bash
curl -X GET http://localhost:5000/api/rapport-activite/RAPPORT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Résultat Attendu**: Voir les nouveaux champs dans la réponse

```json
{
  "success": true,
  "data": {
    "ameliorationQualite": {
      "indicateursRendement": {
        "efficaciteSecondaire": { ... },
        "tauxDiplomesOCDE": { ... }
      }
    }
  }
}
```

---

## 🧪 Tests Unitaires

### Lancer les Tests

```bash
# Installer Jest si nécessaire
npm install --save-dev jest

# Lancer les tests
npm test tests/indicateursRendement.test.js
```

### Tests Couverts

- ✅ Validation de données correctes
- ✅ Rejet de taux > 100
- ✅ Rejet de taux négatifs
- ✅ Rejet de tauxFilles > tauxGF
- ✅ Validation de la somme des taux
- ✅ Gestion de null/undefined
- ✅ Validation combinée des deux sections

---

## 🔍 Vérification de la Structure MongoDB

### Vérifier un Rapport Existant

```javascript
// Dans mongo shell ou MongoDB Compass
db.rapportactivites.findOne(
  { annee: "2024-2025" },
  { "ameliorationQualite.indicateursRendement": 1 }
)
```

**Structure Attendue**:
```json
{
  "ameliorationQualite": {
    "indicateursRendement": {
      "rendementInterne": { ... },
      "rendementExterne": { ... },
      "efficacitePrimaire": { ... },
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
  }
}
```

---

## ✅ Checklist de Validation

- [ ] Le serveur démarre sans erreur
- [ ] POST avec les nouveaux champs fonctionne
- [ ] Validation des taux > 100 est active
- [ ] Validation des taux négatifs est active
- [ ] Validation tauxFilles > tauxGF fonctionne
- [ ] Validation de la somme des taux (efficaciteSecondaire) fonctionne
- [ ] Validation de la somme des taux (tauxDiplomesOCDE) fonctionne
- [ ] PUT avec les nouveaux champs fonctionne
- [ ] GET retourne les nouveaux champs
- [ ] Rétrocompatibilité: rapports sans ces champs fonctionnent
- [ ] Les tests unitaires passent

---

## 📊 Données de Test Valides

### Efficacité Secondaire (Somme = 100%)
```json
{
  "tauxAbandon": { "tauxGF": 6.8, "tauxFilles": 6.2 },
  "tauxReussite": { "tauxGF": 84.7, "tauxFilles": 83.1 },
  "tauxEchec": { "tauxGF": 8.5, "tauxFilles": 10.7 }
}
```

### Taux Diplômés OCDE (Somme ≤ 100%)
```json
{
  "humanitesScientifiques": { "tauxGF": 45.0, "tauxFilles": 42.5 },
  "humanitesTechniques": { "tauxGF": 55.0, "tauxFilles": 52.0 }
}
```

---

## 🐛 Dépannage

### Erreur: "Cannot find module validators/..."
```bash
# Vérifier que le dossier existe
ls validators/

# Si absent, créer le dossier
mkdir validators
```

### Erreur de Validation Persiste
```bash
# Vérifier la structure exacte
console.log(JSON.stringify(req.body.ameliorationQualite.indicateursRendement, null, 2));
```

### Les Nouveaux Champs n'Apparaissent Pas
```bash
# Redémarrer le serveur
npm restart

# Vider le cache MongoDB si nécessaire
db.rapportactivites.updateMany({}, { $unset: { "__v": 1 } })
```

---

## 📝 Notes Importantes

1. **Rétrocompatibilité**: Les anciens rapports sans ces champs restent valides
2. **Champs Optionnels**: efficaciteSecondaire et tauxDiplomesOCDE sont optionnels
3. **Valeurs par Défaut**: Si non fournis, les taux sont à 0
4. **Tolérance**: La somme des taux accepte une tolérance de ±0.5%

---

## 🎯 Prochaines Étapes

1. Tester localement avec les commandes ci-dessus
2. Lancer les tests unitaires
3. Tester l'intégration avec le frontend
4. Déployer en staging
5. Valider en production
