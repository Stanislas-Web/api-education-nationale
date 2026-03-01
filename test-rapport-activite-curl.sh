#!/bin/bash

# Script de test pour l'API Rapport d'Activité
# ==============================================

echo "=== Test API Rapport d'Activité ==="
echo ""

# Configuration
API_URL="http://localhost:3000/api/v1"
# API_URL="http://134.122.23.150/api/v1"  # Décommenter pour l'URL de production

# Note: Remplacez VOTRE_TOKEN_ICI par votre token d'authentification JWT
TOKEN="VOTRE_TOKEN_ICI"

# ========================================
# 1. CRÉER UN NOUVEAU RAPPORT D'ACTIVITÉ
# ========================================
echo "1. Création d'un nouveau rapport d'activité..."
echo ""

curl -X POST "${API_URL}/rapport-activite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d @rapport-activite-complet.json \
  | jq '.'

echo ""
echo "------------------------------------------------"
echo ""

# ========================================
# 2. RÉCUPÉRER TOUS LES RAPPORTS (avec pagination)
# ========================================
echo "2. Récupération de tous les rapports..."
echo ""

curl -X GET "${API_URL}/rapport-activite?page=1&limit=10" \
  -H "Authorization: Bearer ${TOKEN}" \
  | jq '.'

echo ""
echo "------------------------------------------------"
echo ""

# ========================================
# 3. RÉCUPÉRER UN RAPPORT PAR ID
# ========================================
# Note: Remplacez RAPPORT_ID par l'ID du rapport créé ci-dessus
RAPPORT_ID="VOTRE_RAPPORT_ID_ICI"

echo "3. Récupération d'un rapport spécifique..."
echo ""

curl -X GET "${API_URL}/rapport-activite/${RAPPORT_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  | jq '.'

echo ""
echo "------------------------------------------------"
echo ""

# ========================================
# 4. METTRE À JOUR UN RAPPORT
# ========================================
echo "4. Mise à jour d'un rapport..."
echo ""

curl -X PUT "${API_URL}/rapport-activite/${RAPPORT_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "introduction": "Introduction mise à jour",
    "conclusion": "Conclusion mise à jour"
  }' \
  | jq '.'

echo ""
echo "------------------------------------------------"
echo ""

# ========================================
# 5. CHANGER LE STATUT D'UN RAPPORT
# ========================================
echo "5. Changement du statut d'un rapport..."
echo ""

curl -X PATCH "${API_URL}/rapport-activite/${RAPPORT_ID}/statut" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "statut": "soumis"
  }' \
  | jq '.'

echo ""
echo "------------------------------------------------"
echo ""

# ========================================
# 6. OBTENIR LES STATISTIQUES
# ========================================
echo "6. Obtention des statistiques..."
echo ""

curl -X GET "${API_URL}/rapport-activite/statistiques" \
  -H "Authorization: Bearer ${TOKEN}" \
  | jq '.'

echo ""
echo "------------------------------------------------"
echo ""

# ========================================
# 7. FILTRER LES RAPPORTS PAR ANNÉE ET STATUT
# ========================================
echo "7. Filtrage des rapports par année et statut..."
echo ""

curl -X GET "${API_URL}/rapport-activite?annee=2024-2025&statut=brouillon" \
  -H "Authorization: Bearer ${TOKEN}" \
  | jq '.'

echo ""
echo "------------------------------------------------"
echo ""

echo "=== Tests terminés ==="
