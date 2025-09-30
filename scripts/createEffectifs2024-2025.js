const mongoose = require('mongoose');
const { EffectifAnnuel } = require('../models/effectifAnnuel.model');
const { IdentificationProved } = require('../models/identificationProved.model');

// Connexion à MongoDB
mongoose.connect("mongodb+srv://stanislasmakengo1:CmO8NytrFHAsW4yI@cluster0.rl7g5.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true })
  .then(() => console.log('✅ Connexion à MongoDB réussie !'))
  .catch((err) => console.log('❌ Connexion échouée !', err));

/**
 * Générer des effectifs pour 2024-2025 (avec augmentation de ~5-10%)
 */
function generateEffectifs2024(province) {
  let factor = 1;
  
  const grandesProvinces = ['Kinshasa', 'Lubumbashi', 'Goma', 'Kananga', 'Kisangani'];
  const moyennesProvinces = ['Matadi', 'Bukavu', 'Mbuji-Mayi', 'Kolwezi'];
  
  if (grandesProvinces.some(p => province.includes(p))) {
    factor = 1.6; // 1.5 * 1.07 (augmentation de ~7%)
  } else if (moyennesProvinces.some(p => province.includes(p))) {
    factor = 1.05; // 1.0 * 1.05 (augmentation de 5%)
  } else {
    factor = 0.75; // 0.7 * 1.07
  }

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
 * Créer les effectifs 2024-2025 pour toutes les PROVED
 */
async function createEffectifs2024() {
  try {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║   CRÉATION EFFECTIFS 2024-2025 POUR TOUTES LES PROVED   ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    // Récupérer toutes les PROVED actives
    const proveds = await IdentificationProved.find({ isActive: true });
    
    if (proveds.length === 0) {
      console.log('⚠️  Aucune PROVED active trouvée');
      process.exit(0);
    }

    console.log(`✅ ${proveds.length} PROVED(s) active(s) trouvée(s)\n`);

    let created = 0;
    let updated = 0;

    for (const proved of proveds) {
      const effectifs = generateEffectifs2024(proved.provinceEducationnelle);

      try {
        const result = await EffectifAnnuel.findOneAndUpdate(
          { 
            identificationProved: proved._id,
            annee: '2024-2025'
          },
          {
            identificationProved: proved._id,
            annee: '2024-2025',
            effectifs: effectifs
          },
          { 
            upsert: true, 
            new: true,
            setDefaultsOnInsert: true
          }
        );

        const isNew = !result.createdAt || result.createdAt.getTime() === result.updatedAt.getTime();
        
        if (isNew) {
          created++;
          console.log(`✅ [${created + updated}/${proveds.length}] ${proved.provinceEducationnelle} - CRÉÉ`);
        } else {
          updated++;
          console.log(`🔄 [${created + updated}/${proveds.length}] ${proved.provinceEducationnelle} - MIS À JOUR`);
        }

        console.log(`   Maternel: ${result.effectifs.niveauPrescolaire.maternel.effectifGarconsFilles}`);

      } catch (error) {
        console.log(`❌ ${proved.provinceEducationnelle} - ERREUR:`, error.message);
      }
    }

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                        RÉSUMÉ                             ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    console.log(`✅ Nouveaux effectifs créés: ${created}`);
    console.log(`🔄 Effectifs mis à jour: ${updated}`);
    console.log(`📊 Total traités: ${created + updated}/${proveds.length}`);
    
    // Comparer avec 2023-2024
    const exemple2024 = await EffectifAnnuel.findOne({ annee: '2024-2025' })
      .populate('identificationProved', 'provinceEducationnelle');
    
    const exemple2023 = await EffectifAnnuel.findOne({ 
      identificationProved: exemple2024.identificationProved._id,
      annee: '2023-2024'
    });
    
    if (exemple2024 && exemple2023) {
      console.log('\n📊 EXEMPLE DE COMPARAISON:');
      console.log('─'.repeat(60));
      console.log(`PROVED: ${exemple2024.identificationProved.provinceEducationnelle}`);
      
      const maternel2023 = exemple2023.effectifs.niveauPrescolaire.maternel.effectifGarconsFilles;
      const maternel2024 = exemple2024.effectifs.niveauPrescolaire.maternel.effectifGarconsFilles;
      const taux = ((maternel2024 - maternel2023) / maternel2023) * 100;
      
      console.log(`\nMaternel:`);
      console.log(`  2023-2024: ${maternel2023} élèves`);
      console.log(`  2024-2025: ${maternel2024} élèves`);
      console.log(`  Taux d'accroissement: ${taux.toFixed(2)}%`);
    }

    console.log('\n🎉 Terminé avec succès !\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERREUR:', error);
    process.exit(1);
  }
}

// Attendre la connexion puis exécuter
setTimeout(() => {
  createEffectifs2024();
}, 2000);
