const mongoose = require('mongoose');
const { EffectifAnnuel } = require('../models/effectifAnnuel.model');
const { IdentificationProved } = require('../models/identificationProved.model');

// Connexion à MongoDB
mongoose.connect("mongodb+srv://stanislasmakengo1:CmO8NytrFHAsW4yI@cluster0.rl7g5.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true })
  .then(() => console.log('✅ Connexion à MongoDB réussie !'))
  .catch((err) => console.log('❌ Connexion échouée !', err));

/**
 * Générer des effectifs réalistes basés sur la province
 * Suivant exactement la structure du modèle EffectifAnnuel
 */
function generateEffectifs(province) {
  let factor = 1;
  
  // Kinshasa est une grande province, donc factor = 1.5
  const grandesProvinces = ['Kinshasa', 'Lubumbashi', 'Goma', 'Kananga', 'Kisangani'];
  const moyennesProvinces = ['Matadi', 'Bukavu', 'Mbuji-Mayi', 'Kolwezi'];
  
  if (grandesProvinces.some(p => province.includes(p))) {
    factor = 1.5;
  } else if (moyennesProvinces.some(p => province.includes(p))) {
    factor = 1.0;
  } else {
    factor = 0.7;
  }

  // Génération des effectifs suivant exactement la structure du modèle
  return {
    niveauPrescolaire: {
      espaceCommunautaireEveil: {
        effectifGarconsFilles: Math.round(100 * factor),
        effectifFilles: Math.round(50 * factor)
      },
      maternel: {
        effectifGarconsFilles: Math.round(1000 * factor),
        effectifFilles: Math.round(500 * factor)
      },
      prePrimaire: {
        effectifGarconsFilles: Math.round(80 * factor),
        effectifFilles: Math.round(40 * factor)
      },
      special: {
        effectifGarconsFilles: 0,
        effectifFilles: 0
      }
    },
    niveauPrimaire: {
      enseignementSpecial: {
        effectifGarconsFilles: Math.round(50 * factor),
        effectifFilles: Math.round(25 * factor)
      },
      enseignementPrimaire: {
        effectifGarconsFilles: Math.round(5000 * factor),
        effectifFilles: Math.round(2500 * factor)
      }
    },
    niveauSecondaire: {
      enseignementSpecial: {
        effectifGarcons: Math.round(30 * factor),
        effectifFilles: Math.round(15 * factor)
      },
      enseignementSecondaire: {
        septiemeCTEB: {
          effectifGarcons: Math.round(800 * factor),
          effectifFilles: Math.round(400 * factor)
        },
        huitiemeCTEB: {
          effectifGarcons: Math.round(700 * factor),
          effectifFilles: Math.round(350 * factor)
        },
        premiereHumanite: {
          effectifGarcons: Math.round(600 * factor),
          effectifFilles: Math.round(300 * factor)
        },
        quatriemeHumanite: {
          effectifGarcons: Math.round(500 * factor),
          effectifFilles: Math.round(250 * factor)
        }
      }
    }
  };
}

/**
 * Créer les effectifs 2025-2026 pour la PROVED spécifiée
 */
async function createTestEffectifs() {
  try {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║   CRÉATION EFFECTIFS TEST 2025-2026 POUR PROVED SPÉCIFIQUE ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    const identificationProvedId = '688e233933e7549384753bdc';
    const annee = '2025-2026';

    // Vérifier que la PROVED existe
    const proved = await IdentificationProved.findById(identificationProvedId);
    
    if (!proved) {
      console.log(`❌ PROVED avec l'ID ${identificationProvedId} non trouvée`);
      process.exit(1);
    }

    console.log(`✅ PROVED trouvée: ${proved.provinceEducationnelle}`);
    console.log(`   Province Administrative: ${proved.provinceAdministrative}`);
    console.log(`   Chef Lieu: ${proved.chefLieuProved}\n`);

    // Générer les effectifs selon la province
    const effectifs = generateEffectifs(proved.provinceEducationnelle);

    console.log('📊 Effectifs générés:');
    console.log(`   Prescolaire - Maternel: ${effectifs.niveauPrescolaire.maternel.effectifGarconsFilles} élèves`);
    console.log(`   Primaire: ${effectifs.niveauPrimaire.enseignementPrimaire.effectifGarconsFilles} élèves`);
    console.log(`   Secondaire - 7ème CTEB: ${effectifs.niveauSecondaire.enseignementSecondaire.septiemeCTEB.effectifGarcons} garçons\n`);

    // Vérifier si des effectifs existent déjà pour cette année
    const existing = await EffectifAnnuel.findOne({
      identificationProved: identificationProvedId,
      annee: annee
    });

    if (existing) {
      console.log('⚠️  Des effectifs existent déjà pour cette année.');
      console.log('   Ils vont être mis à jour...\n');
    }

    // Créer ou mettre à jour les effectifs
    const result = await EffectifAnnuel.findOneAndUpdate(
      { 
        identificationProved: identificationProvedId,
        annee: annee
      },
      {
        identificationProved: identificationProvedId,
        annee: annee,
        effectifs: effectifs
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );

    const isNew = !existing || (result.createdAt && result.updatedAt && result.createdAt.getTime() === result.updatedAt.getTime());
    
    if (isNew) {
      console.log(`✅ Effectifs CRÉÉS pour l'année ${annee}`);
    } else {
      console.log(`🔄 Effectifs MIS À JOUR pour l'année ${annee}`);
    }

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                      RÉSUMÉ                                ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    
    console.log(`📋 PROVED: ${proved.provinceEducationnelle}`);
    console.log(`📅 Année: ${annee}`);
    console.log(`\n📊 Effectifs détaillés:`);
    console.log(`\n   PRESCOLAIRE:`);
    console.log(`   - Espace Communautaire Éveil: ${result.effectifs.niveauPrescolaire.espaceCommunautaireEveil.effectifGarconsFilles} élèves (${result.effectifs.niveauPrescolaire.espaceCommunautaireEveil.effectifFilles} filles)`);
    console.log(`   - Maternel: ${result.effectifs.niveauPrescolaire.maternel.effectifGarconsFilles} élèves (${result.effectifs.niveauPrescolaire.maternel.effectifFilles} filles)`);
    console.log(`   - Pré-primaire: ${result.effectifs.niveauPrescolaire.prePrimaire.effectifGarconsFilles} élèves (${result.effectifs.niveauPrescolaire.prePrimaire.effectifFilles} filles)`);
    console.log(`   - Spécial: ${result.effectifs.niveauPrescolaire.special.effectifGarconsFilles} élèves`);
    
    console.log(`\n   PRIMAIRE:`);
    console.log(`   - Enseignement Spécial: ${result.effectifs.niveauPrimaire.enseignementSpecial.effectifGarconsFilles} élèves (${result.effectifs.niveauPrimaire.enseignementSpecial.effectifFilles} filles)`);
    console.log(`   - Enseignement Primaire: ${result.effectifs.niveauPrimaire.enseignementPrimaire.effectifGarconsFilles} élèves (${result.effectifs.niveauPrimaire.enseignementPrimaire.effectifFilles} filles)`);
    
    console.log(`\n   SECONDAIRE:`);
    console.log(`   - Enseignement Spécial: ${result.effectifs.niveauSecondaire.enseignementSpecial.effectifGarcons} garçons, ${result.effectifs.niveauSecondaire.enseignementSpecial.effectifFilles} filles`);
    console.log(`   - 7ème CTEB: ${result.effectifs.niveauSecondaire.enseignementSecondaire.septiemeCTEB.effectifGarcons} garçons, ${result.effectifs.niveauSecondaire.enseignementSecondaire.septiemeCTEB.effectifFilles} filles`);
    console.log(`   - 8ème CTEB: ${result.effectifs.niveauSecondaire.enseignementSecondaire.huitiemeCTEB.effectifGarcons} garçons, ${result.effectifs.niveauSecondaire.enseignementSecondaire.huitiemeCTEB.effectifFilles} filles`);
    console.log(`   - 1ère Humanité: ${result.effectifs.niveauSecondaire.enseignementSecondaire.premiereHumanite.effectifGarcons} garçons, ${result.effectifs.niveauSecondaire.enseignementSecondaire.premiereHumanite.effectifFilles} filles`);
    console.log(`   - 4ème Humanité: ${result.effectifs.niveauSecondaire.enseignementSecondaire.quatriemeHumanite.effectifGarcons} garçons, ${result.effectifs.niveauSecondaire.enseignementSecondaire.quatriemeHumanite.effectifFilles} filles`);

    console.log('\n✅ Données de test créées avec succès !');
    console.log(`\n🔗 Vous pouvez maintenant tester l'endpoint:`);
    console.log(`   GET /api/v1/effectif-annuel/previous/${identificationProvedId}/2026-2027\n`);

    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERREUR:', error);
    console.error('Détails:', error.message);
    process.exit(1);
  }
}

// Attendre la connexion puis exécuter
setTimeout(() => {
  createTestEffectifs();
}, 2000);





