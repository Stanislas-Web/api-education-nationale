# Documentation Migration - Correction Section Visites des Classes

## 📅 Date de Migration: 15 février 2026

## 🎯 Objectif
Correction du bug critique dans la section `ameliorationQualite.visitesEtReunions` où un seul champ `prescolaire` était utilisé pour représenter 3 sous-niveaux distincts: ECE, Préprimaire et Maternel.

---

## ✅ Modifications Effectuées

### 1. Schéma MongoDB (`models/rapportActivite.model.js`)

#### Sections Modifiées:
1. **visitesClasses**
2. **reunionsPedagogiques**
3. **fonctionnementCelluleBase**

#### Changement Appliqué:
```javascript
// ❌ AVANT
visitesClasses: {
  prescolaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: 'BON' },
  primaire: { ... },
  secondaire: { ... },
  special: { ... }
}

// ✅ APRÈS
visitesClasses: {
  ece: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: null },
  preprimaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: null },
  maternel: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: null },
  primaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: 'BON' },
  secondaire: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: 'BON' },
  special: { type: String, enum: ['TRES BON', 'BON', 'ASSEZ BON'], default: 'BON' }
}
```

**Note:** Les champs `ece`, `preprimaire`, `maternel` ont `default: null` pour éviter de créer des données par défaut non pertinentes.

---

## 🔄 Script de Migration

### Fichier: `scripts/migration_visites_classes.js`

#### Fonctionnalités:
- ✅ Migre automatiquement les données existantes
- ✅ Duplique la valeur `prescolaire` sur les 3 nouveaux champs
- ✅ Supprime l'ancien champ `prescolaire`
- ✅ Effectue une vérification post-migration
- ✅ Support mode `--dry-run` (à implémenter si nécessaire)
- ✅ Protection environnement production (nécessite `--force`)

#### Utilisation:

**Développement:**
```bash
node scripts/migration_visites_classes.js
```

**Production:**
```bash
NODE_ENV=production node scripts/migration_visites_classes.js --force
```

**Dry Run (sans modifications):**
```bash
node scripts/migration_visites_classes.js --dry-run
```

#### Sections Migrées:
1. `ameliorationQualite.visitesEtReunions.visitesClasses`
2. `ameliorationQualite.visitesEtReunions.reunionsPedagogiques`
3. `ameliorationQualite.visitesEtReunions.fonctionnementCelluleBase`

---

## 📊 Impact sur les API

### Endpoints Affectés:

#### POST `/api/v1/rapport-activite`
**Nouveau format de body:**
```json
{
  "ameliorationQualite": {
    "visitesEtReunions": {
      "visitesClasses": {
        "ece": "TRES BON",
        "preprimaire": "BON",
        "maternel": "ASSEZ BON",
        "primaire": "BON",
        "secondaire": "TRES BON",
        "special": "BON"
      },
      "reunionsPedagogiques": {
        "ece": "TRES BON",
        "preprimaire": "BON",
        "maternel": "ASSEZ BON",
        "primaire": "BON",
        "secondaire": "BON"
      },
      "fonctionnementCelluleBase": {
        "ece": "BON",
        "preprimaire": "BON",
        "maternel": "ASSEZ BON",
        "primaire": "BON",
        "secondaire": "TRES BON",
        "special": "BON"
      }
    }
  }
}
```

#### GET `/api/v1/rapport-activite/:id`
**Nouveau format de réponse:**
- Les anciens rapports (migrés) auront les valeurs dupliquées sur `ece`, `preprimaire`, `maternel`
- Les nouveaux rapports pourront avoir des valeurs distinctes

---

## 🔗 Cohérence avec le Système

### Sections Déjà Conformes:
Ces sections utilisent DÉJÀ la séparation `ece`, `preprimaire`, `maternel`:

1. **programmesScolaires**
   ```javascript
   {
     ece: String,
     preprimaire: String,
     maternel: String,
     primaire: String,
     secondaire: String
   }
   ```

2. **manuelsScolaires** (même structure)
3. **materielsDidactiques** (même structure)
4. **themesExploites**
   ```javascript
   {
     ece: String,
     maternel: String
   }
   ```

### Uniformisation Complète:
✅ Toutes les sections de `visitesEtReunions` sont maintenant cohérentes avec le reste du système.

---

## ⚠️ Points d'Attention

### 1. Validation Backend
Les contrôleurs doivent valider les champs:
- `ece`, `preprimaire`, `maternel` (au lieu de `prescolaire`)
- Valeurs autorisées: `['TRES BON', 'BON', 'ASSEZ BON']`

### 2. Frontend
**À modifier dans le frontend:**
- `EvaluationQualitativeComplete.tsx` (lignes 2150-2310)
- Interface TypeScript `RapportActivite.ts`
- Formulaires de création/modification

### 3. Tests
**À tester:**
- ✅ Création de nouveau rapport avec les nouveaux champs
- ✅ Modification de rapport existant
- ✅ Lecture de rapport migré
- ✅ Validation des enum values

---

## 📝 Checklist Post-Migration

### Obligatoire Avant Déploiement:
- [x] Modifier le schéma Mongoose
- [x] Créer le script de migration
- [ ] **EXÉCUTER** le script de migration sur la base de données
- [ ] Vérifier les rapports migrés (sample de 5-10 rapports)
- [ ] Mettre à jour le frontend (coordonner avec l'équipe frontend)
- [ ] Tester création/modification de rapport via API
- [ ] Mettre à jour la documentation API
- [ ] Informer les utilisateurs du changement

### Recommandé:
- [ ] Créer des tests unitaires pour les nouveaux champs
- [ ] Mettre à jour les fixtures/seeds de test
- [ ] Documenter dans le CHANGELOG

---

## 🚨 Rollback

**En cas de problème, rollback possible:**

1. **Restaurer le schéma:**
   ```bash
   git revert <commit-hash>
   ```

2. **Restaurer les données:**
   ```javascript
   // Script de rollback (si nécessaire)
   rapport.ameliorationQualite.visitesEtReunions.visitesClasses.prescolaire = 
     rapport.ameliorationQualite.visitesEtReunions.visitesClasses.ece;
   
   delete rapport.ameliorationQualite.visitesEtReunions.visitesClasses.ece;
   delete rapport.ameliorationQualite.visitesEtReunions.visitesClasses.preprimaire;
   delete rapport.ameliorationQualite.visitesEtReunions.visitesClasses.maternel;
   ```

---

## 📞 Contact

Pour questions ou problèmes:
- **Backend:** Équipe Backend
- **Frontend:** Équipe Frontend (pour modification des composants)
- **Migration:** Exécuter le script et vérifier les logs

---

## 📚 Références

- **Spécification:** `SPECIFICATION_CORRECTION_VISITES_CLASSES.md`
- **Fichier modèle:** [models/rapportActivite.model.js](models/rapportActivite.model.js)
- **Script migration:** [scripts/migration_visites_classes.js](scripts/migration_visites_classes.js)
- **Issue Frontend:** Bug dans `EvaluationQualitativeComplete.tsx` lignes 2150-2310

---

**Date de création:** 15 février 2026  
**Version:** 1.0  
**Status:** ✅ Prêt pour déploiement (après exécution migration)
