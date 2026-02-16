#!/bin/bash

# ============================================
# Script de Test - Indicateurs de Rendement
# ============================================

# Configuration
API_URL="http://localhost:5000/api/rapport-activite"
TOKEN="YOUR_TOKEN_HERE"

echo "🧪 Tests des Indicateurs de Rendement"
echo "========================================"
echo ""

# ============================================
# Test 1: Création avec données valides
# ============================================
echo "Test 1: ✅ Création avec données valides"
echo "----------------------------------------"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "annee": "2024-2025",
    "ameliorationQualite": {
      "indicateursRendement": {
        "efficaciteSecondaire": {
          "tauxAbandon": { "tauxGF": 6.8, "tauxFilles": 6.2 },
          "tauxReussite": { "tauxGF": 84.7, "tauxFilles": 83.1 },
          "tauxEchec": { "tauxGF": 8.5, "tauxFilles": 10.7 }
        },
        "tauxDiplomesOCDE": {
          "humanitesScientifiques": { "tauxGF": 88.5, "tauxFilles": 86.2 },
          "humanitesTechniques": { "tauxGF": 86.1, "tauxFilles": 82.4 }
        }
      }
    }
  }' | jq '.'

echo ""
echo ""

# ============================================
# Test 2: Validation - Taux > 100
# ============================================
echo "Test 2: ❌ Validation - Taux > 100"
echo "----------------------------------------"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "annee": "2024-2025",
    "ameliorationQualite": {
      "indicateursRendement": {
        "efficaciteSecondaire": {
          "tauxAbandon": { "tauxGF": 150, "tauxFilles": 6.2 }
        }
      }
    }
  }' | jq '.'

echo ""
echo ""

# ============================================
# Test 3: Validation - Taux négatif
# ============================================
echo "Test 3: ❌ Validation - Taux négatif"
echo "----------------------------------------"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "annee": "2024-2025",
    "ameliorationQualite": {
      "indicateursRendement": {
        "tauxDiplomesOCDE": {
          "humanitesScientifiques": { "tauxGF": -10, "tauxFilles": 50 }
        }
      }
    }
  }' | jq '.'

echo ""
echo ""

# ============================================
# Test 4: Validation - tauxFilles > tauxGF
# ============================================
echo "Test 4: ❌ Validation - tauxFilles > tauxGF"
echo "----------------------------------------"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "annee": "2024-2025",
    "ameliorationQualite": {
      "indicateursRendement": {
        "efficaciteSecondaire": {
          "tauxAbandon": { "tauxGF": 5, "tauxFilles": 10 }
        }
      }
    }
  }' | jq '.'

echo ""
echo ""

# ============================================
# Test 5: Validation - Somme ≠ 100%
# ============================================
echo "Test 5: ❌ Validation - Somme ≠ 100%"
echo "----------------------------------------"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
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
  }' | jq '.'

echo ""
echo ""

# ============================================
# Test 6: Validation - Somme OCDE > 100%
# ============================================
echo "Test 6: ❌ Validation - Somme OCDE > 100%"
echo "----------------------------------------"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "annee": "2024-2025",
    "ameliorationQualite": {
      "indicateursRendement": {
        "tauxDiplomesOCDE": {
          "humanitesScientifiques": { "tauxGF": 60, "tauxFilles": 55 },
          "humanitesTechniques": { "tauxGF": 50, "tauxFilles": 48 }
        }
      }
    }
  }' | jq '.'

echo ""
echo ""

# ============================================
# Test 7: Données complètes (fichier)
# ============================================
echo "Test 7: ✅ Données complètes depuis fichier"
echo "----------------------------------------"
if [ -f "test-data-indicateurs-rendement.json" ]; then
  curl -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d @test-data-indicateurs-rendement.json | jq '.'
else
  echo "⚠️  Fichier test-data-indicateurs-rendement.json non trouvé"
fi

echo ""
echo ""
echo "✅ Tests terminés!"
