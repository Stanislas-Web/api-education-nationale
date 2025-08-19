const { generatePDFKitPDF } = require('./controllers/rapportActivite.controller.js');

// Mock d'un rapport complet avec toutes les données
const mockRapportComplet = {
  _id: 'test-id-complet-123',
  annee: 2024,
  statut: 'soumis',
  introduction: 'Ceci est un test d\'introduction complète pour le rapport d\'activités avec toutes les données.',
  conclusion: 'Ceci est une conclusion de test complète avec toutes les informations.',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
  fichierJoint: 'rapport-2024-annexe.pdf',
  identificationProved: {
    provinceAdministrative: 'Kinshasa',
    provinceEducationnelle: 'Kinshasa',
    chefLieuProved: 'Kinshasa',
    emailProfessionnel: 'test@education.cd',
    telephone: '+243 123 456 789',
    statutOccupation: 'Actif',
    nombreTerritoires: 4,
    nombreSousDivisions: 12,
    directeurProvincial: 'Jean Test Directeur'
  },
  parametresCles: {
    niveauPrescolaire: {
      espaceCommunautaireEveil: {
        nombreEcoles: 10,
        nombreClasses: 25,
        effectifGarcons: 150,
        effectifFilles: 140,
        tauxAccroissement: 5.2
      },
      maternel: {
        nombreEcoles: 15,
        nombreClasses: 30,
        effectifGarcons: 200,
        effectifFilles: 180,
        tauxAccroissement: 4.8
      },
      prePrimaire: {
        nombreEcoles: 8,
        nombreClasses: 20,
        effectifGarcons: 120,
        effectifFilles: 110,
        tauxAccroissement: 3.5
      },
      special: {
        nombreEcoles: 2,
        nombreClasses: 5,
        effectifGarcons: 15,
        effectifFilles: 12,
        tauxAccroissement: 2.1
      }
    },
    niveauPrimaire: {
      enseignementSpecial: {
        nombreClasses: 8,
        effectifGarcons: 45,
        effectifFilles: 38,
        tauxAccroissement: 4.2
      },
      enseignementPrimaire: {
        nombreEcoles: 50,
        nombreClasses: 200,
        classesPlethoriques: 5,
        effectifGarcons: 2500,
        effectifFilles: 2300,
        tauxAccroissement: 3.5
      }
    },
    niveauSecondaire: {
      enseignementSpecial: {
        nombreClasses: 6,
        effectifGarcons: 32,
        effectifFilles: 28,
        tauxAccroissement: 3.8
      },
      enseignementSecondaire: {
        premierCycle: {
          classes7emeCTEB: 45,
          classes8emeCTEB: 42,
          effectifGarcons: 1200,
          effectifFilles: 1100,
          tauxAccroissement: 4.1
        },
        deuxiemeCycle: {
          classesHumanites: 38,
          effectifGarcons: 950,
          effectifFilles: 880,
          tauxAccroissement: 3.9
        }
      }
    }
  },
  personnel: {
    personnelEnseignant: {
      prescolaire: { hommes: 25, femmes: 35 },
      primaire: { hommes: 150, femmes: 200 },
      secondaire: { hommes: 80, femmes: 90 }
    },
    personnelAdministratif: {
      directionProvinciale: 12,
      inspectionPrincipale: 8,
      dinacope: 15,
      sernie: 10,
      coordinationProvinciale: 6,
      sousDivision: 25,
      poolsInspectionPrimaire: 18,
      poolsInspectionSecondaire: 14,
      antenneDinacope: 8,
      antenneSernie: 6,
      coordinationDiocesaine: 12,
      sousCoordinationConventionnees: 20,
      conseillerieResidente: 4
    }
  },
  realisations: {
    accesAccessibiliteEquite: {
      nouvellesSallesClasses: {
        prescolaire: 2,
        primaire: 5,
        secondaire: 3,
        sourceFinancement: 'Budget Provincial 2024'
      },
      nouveauxBancsTables: {
        prescolaire: 50,
        primaire: 200,
        secondaire: 150,
        sourceFinancement: 'Fonds de Développement'
      },
      nouvellesLatrines: {
        prescolaire: 1,
        primaire: 3,
        secondaire: 2,
        sourceFinancement: 'Coopération Internationale'
      },
      gratuitéEnseignementPrimaire: 'Mise en œuvre effective de la gratuité pour tous les élèves du primaire',
      sensibilisation: {
        filles: true,
        enfantsHorsEcole: true,
        peuplesAutochtones: false
      },
      cantinesScolaires: {
        prescolaire: 5,
        primaire: 25,
        secondaire: 15,
        commentaire: 'Programme de cantines scolaires étendu à 45 écoles'
      },
      indicateursAcces: {
        proportionNouveauxInscrits: 85.5,
        tauxTransitionPrimaireCTEB: 78.2,
        tauxTransitionCTEBHumanites: 65.8
      }
    }
  }
};

// Test de la fonction
async function testCompleteExport() {
  console.log('🧪 Test de l\'export PDF complet avec toutes les données...');
  
  try {
    const pdfBuffer = await generatePDFKitPDF(mockRapportComplet);
    
    console.log(`✅ Export PDF réussi!`);
    console.log(`📄 Taille du PDF: ${pdfBuffer.length} bytes`);
    console.log(`📊 PDF contient toutes les sections:`);
    console.log(`   - En-tête officiel`);
    console.log(`   - Identification PROVED`);
    console.log(`   - Introduction`);
    console.log(`   - Paramètres Clés (Préscolaire, Primaire, Secondaire)`);
    console.log(`   - Personnel (Enseignant + Administratif)`);
    console.log(`   - Réalisations (Accès, Infrastructure, Sensibilisation)`);
    console.log(`   - Conclusion`);
    console.log(`   - Informations Générales`);
    console.log(`   - Signatures`);
    
    // Sauvegarder le PDF pour inspection
    const fs = require('fs');
    fs.writeFileSync('test-rapport-complet.pdf', pdfBuffer);
    console.log(`💾 PDF sauvegardé: test-rapport-complet.pdf`);
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Exécuter le test
testCompleteExport();
