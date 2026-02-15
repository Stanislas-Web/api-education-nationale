/**
 * Script de migration - Correction Section Visites des Classes
 * Date: 15 février 2026
 * 
 * Objectif: Migrer les données de 'prescolaire' vers 'ece', 'preprimaire', 'maternel'
 * pour les sections:
 * - visitesClasses
 * - reunionsPedagogiques
 * - fonctionnementCelluleBase
 */

const mongoose = require('mongoose');
const RapportActivite = require('../models/rapportActivite.model');

// Configuration de la connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/education-nationale';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connexion à MongoDB réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
}

async function migrateVisitesClasses() {
  console.log('\n📋 Migration de visitesClasses...');
  
  const rapports = await RapportActivite.find({
    'ameliorationQualite.visitesEtReunions.visitesClasses.prescolaire': { $exists: true, $ne: null }
  });

  console.log(`   Trouvé ${rapports.length} rapports avec visitesClasses.prescolaire`);
  
  let updated = 0;
  for (const rapport of rapports) {
    const prescolaireValue = rapport.ameliorationQualite?.visitesEtReunions?.visitesClasses?.prescolaire;
    
    if (prescolaireValue) {
      rapport.ameliorationQualite.visitesEtReunions.visitesClasses.ece = prescolaireValue;
      rapport.ameliorationQualite.visitesEtReunions.visitesClasses.preprimaire = prescolaireValue;
      rapport.ameliorationQualite.visitesEtReunions.visitesClasses.maternel = prescolaireValue;
      
      // Supprimer l'ancien champ
      rapport.ameliorationQualite.visitesEtReunions.visitesClasses.prescolaire = undefined;
      
      await rapport.save();
      updated++;
    }
  }
  
  console.log(`   ✅ ${updated} rapports migrés pour visitesClasses`);
  return updated;
}

async function migrateReunionsPedagogiques() {
  console.log('\n📋 Migration de reunionsPedagogiques...');
  
  const rapports = await RapportActivite.find({
    'ameliorationQualite.visitesEtReunions.reunionsPedagogiques.prescolaire': { $exists: true, $ne: null }
  });

  console.log(`   Trouvé ${rapports.length} rapports avec reunionsPedagogiques.prescolaire`);
  
  let updated = 0;
  for (const rapport of rapports) {
    const prescolaireValue = rapport.ameliorationQualite?.visitesEtReunions?.reunionsPedagogiques?.prescolaire;
    
    if (prescolaireValue) {
      rapport.ameliorationQualite.visitesEtReunions.reunionsPedagogiques.ece = prescolaireValue;
      rapport.ameliorationQualite.visitesEtReunions.reunionsPedagogiques.preprimaire = prescolaireValue;
      rapport.ameliorationQualite.visitesEtReunions.reunionsPedagogiques.maternel = prescolaireValue;
      
      // Supprimer l'ancien champ
      rapport.ameliorationQualite.visitesEtReunions.reunionsPedagogiques.prescolaire = undefined;
      
      await rapport.save();
      updated++;
    }
  }
  
  console.log(`   ✅ ${updated} rapports migrés pour reunionsPedagogiques`);
  return updated;
}

async function migrateFonctionnementCelluleBase() {
  console.log('\n📋 Migration de fonctionnementCelluleBase...');
  
  const rapports = await RapportActivite.find({
    'ameliorationQualite.visitesEtReunions.fonctionnementCelluleBase.prescolaire': { $exists: true, $ne: null }
  });

  console.log(`   Trouvé ${rapports.length} rapports avec fonctionnementCelluleBase.prescolaire`);
  
  let updated = 0;
  for (const rapport of rapports) {
    const prescolaireValue = rapport.ameliorationQualite?.visitesEtReunions?.fonctionnementCelluleBase?.prescolaire;
    
    if (prescolaireValue) {
      rapport.ameliorationQualite.visitesEtReunions.fonctionnementCelluleBase.ece = prescolaireValue;
      rapport.ameliorationQualite.visitesEtReunions.fonctionnementCelluleBase.preprimaire = prescolaireValue;
      rapport.ameliorationQualite.visitesEtReunions.fonctionnementCelluleBase.maternel = prescolaireValue;
      
      // Supprimer l'ancien champ
      rapport.ameliorationQualite.visitesEtReunions.fonctionnementCelluleBase.prescolaire = undefined;
      
      await rapport.save();
      updated++;
    }
  }
  
  console.log(`   ✅ ${updated} rapports migrés pour fonctionnementCelluleBase`);
  return updated;
}

async function verifyMigration() {
  console.log('\n🔍 Vérification de la migration...');
  
  // Vérifier qu'il ne reste plus de champs 'prescolaire'
  const visitesRest = await RapportActivite.countDocuments({
    'ameliorationQualite.visitesEtReunions.visitesClasses.prescolaire': { $exists: true, $ne: null }
  });
  
  const reunionsRest = await RapportActivite.countDocuments({
    'ameliorationQualite.visitesEtReunions.reunionsPedagogiques.prescolaire': { $exists: true, $ne: null }
  });
  
  const celluleRest = await RapportActivite.countDocuments({
    'ameliorationQualite.visitesEtReunions.fonctionnementCelluleBase.prescolaire': { $exists: true, $ne: null }
  });
  
  console.log(`   Champs prescolaire restants:`);
  console.log(`   - visitesClasses: ${visitesRest}`);
  console.log(`   - reunionsPedagogiques: ${reunionsRest}`);
  console.log(`   - fonctionnementCelluleBase: ${celluleRest}`);
  
  if (visitesRest === 0 && reunionsRest === 0 && celluleRest === 0) {
    console.log('   ✅ Migration complète - aucun champ prescolaire restant');
  } else {
    console.log('   ⚠️ Attention: certains champs prescolaire n\'ont pas été migrés');
  }
  
  // Vérifier les nouveaux champs
  const newEce = await RapportActivite.countDocuments({
    'ameliorationQualite.visitesEtReunions.visitesClasses.ece': { $exists: true, $ne: null }
  });
  
  console.log(`\n   Nouveaux champs créés:`);
  console.log(`   - visitesClasses.ece: ${newEce} rapports`);
}

async function run() {
  console.log('🚀 Démarrage de la migration - Correction Section Visites des Classes');
  console.log('📅 Date:', new Date().toLocaleString('fr-FR'));
  console.log('─'.repeat(70));
  
  try {
    await connectDB();
    
    // Exécuter les migrations
    const totalVisites = await migrateVisitesClasses();
    const totalReunions = await migrateReunionsPedagogiques();
    const totalCellule = await migrateFonctionnementCelluleBase();
    
    // Vérification
    await verifyMigration();
    
    console.log('\n' + '─'.repeat(70));
    console.log('📊 Résumé de la migration:');
    console.log(`   - visitesClasses: ${totalVisites} rapports migrés`);
    console.log(`   - reunionsPedagogiques: ${totalReunions} rapports migrés`);
    console.log(`   - fonctionnementCelluleBase: ${totalCellule} rapports migrés`);
    console.log(`   - TOTAL: ${totalVisites + totalReunions + totalCellule} modifications`);
    console.log('─'.repeat(70));
    console.log('✅ Migration terminée avec succès');
    
  } catch (error) {
    console.error('\n❌ Erreur durant la migration:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

// Options en ligne de commande
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isForce = args.includes('--force');

if (isDryRun) {
  console.log('⚠️ Mode DRY-RUN activé - Aucune modification ne sera effectuée');
  // À implémenter si nécessaire
} else if (!isForce && process.env.NODE_ENV === 'production') {
  console.log('⚠️ Vous êtes en environnement PRODUCTION');
  console.log('   Utilisez --force pour confirmer l\'exécution de la migration');
  process.exit(0);
}

// Exécuter la migration
if (require.main === module) {
  run();
}

module.exports = { run, migrateVisitesClasses, migrateReunionsPedagogiques, migrateFonctionnementCelluleBase };
