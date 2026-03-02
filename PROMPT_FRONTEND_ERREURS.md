# Prompt pour GitHub Copilot — Affichage des erreurs du rapport d'activité (React)

Copie-colle ce prompt dans Copilot Chat en étant dans ton fichier de formulaire React :

---

Dans mon service API (axios), quand je fais un POST vers `/api/v1/rapport-activite`, le backend renvoie en cas d'erreur de validation un objet JSON avec cette structure :

```json
{
  "success": false,
  "message": "Erreur de validation du rapport",
  "errorCount": 2,
  "errors": {
    "annee": { "message": "Path `annee` is required.", "path": "annee", "kind": "required" },
    "introduction": { "message": "Path `introduction` is required.", "path": "introduction", "kind": "required" }
  }
}
```

En cas d'erreur de doublon (code 409) :

```json
{
  "success": false,
  "message": "Un rapport avec ces données existe déjà",
  "duplicateFields": { "annee": "2024-2025" }
}
```

En cas d'erreur de cast (champ invalide) :

```json
{
  "success": false,
  "message": "Valeur invalide pour le champ \"identificationProved\": abc123",
  "error": "..."
}
```

L'erreur axios est dans `error.response.data`. Ajoute dans mon formulaire de rapport d'activité :

1. Un intercepteur dans mon service de base qui extrait `error.response.data` et le `throw` directement
2. Dans le formulaire, un state `errors` qui stocke l'objet `errors` du backend
3. Un affichage résumé de toutes les erreurs en haut du formulaire (champ + message)
4. Un affichage inline sous chaque champ concerné avec le message d'erreur correspondant, le border du champ en rouge
5. Réinitialiser les erreurs quand l'utilisateur re-soumet
