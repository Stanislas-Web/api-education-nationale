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
 */
function generateEffectifs(province) {
  let factor = 1;
  
  const grandesProvinces = ['Kinshasa', 'Lubumbashi', 'Goma', 'Kananga', 'Kisangani'];
  const moyennesProvinces = ['Matadi', 'Bukavu', 'Mbuji-Mayi', 'Kolwezi'];
  
  if (grandesProvinces.some(p => province.includes(p))) {
    factor = 1.5;
  } else if (moyennesProvinces.some(p => province.includes(p))) {
    factor = 1.0;
  } else {
    factor = 0.7;
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
 * Créer les effectifs 2023-2024 pour toutes les PROVED
 */
async function createEffectifs() {
  try {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║   CRÉATION EFFECTIFS 2023-2024 POUR TOUTES LES PROVED   ║');
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
      const effectifs = generateEffectifs(proved.provinceEducationnelle);

      try {
        const result = await EffectifAnnuel.findOneAndUpdate(
          { 
            identificationProved: proved._id,
            annee: '2023-2024'
          },
          {
            identificationProved: proved._id,
            annee: '2023-2024',
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
    
    // Afficher un exemple
    const exemple = await EffectifAnnuel.findOne({ annee: '2023-2024' })
      .populate('identificationProved', 'provinceEducationnelle');
    
    if (exemple) {
      console.log('\n📋 EXEMPLE DE DONNÉES:');
      console.log('─'.repeat(60));
      console.log(`PROVED: ${exemple.identificationProved.provinceEducationnelle}`);
      console.log(`Année: ${exemple.annee}`);
      console.log(`\nEffectifs:`);
      console.log(`  Maternel: ${exemple.effectifs.niveauPrescolaire.maternel.effectifGarconsFilles} élèves`);
      console.log(`  Primaire: ${exemple.effectifs.niveauPrimaire.enseignementPrimaire.effectifGarconsFilles} élèves`);
      console.log(`  7ème CTEB: ${exemple.effectifs.niveauSecondaire.enseignementSecondaire.septiemeCTEB.effectifGarcons} garçons`);
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
  createEffectifs();
}, 2000);
