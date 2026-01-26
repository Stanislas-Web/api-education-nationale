const mongoose = require('mongoose');
const { IdentificationProved } = require('../models/identificationProved.model.js');
const { User } = require('../models/user.model.js');

// Configuration de la connexion MongoDB
const MONGODB_URI = "mongodb+srv://stanislasmakengo1:CmO8NytrFHAsW4yI@cluster0.rl7g5.mongodb.net/?retryWrites=true&w=majority";

async function listIdentificationProveds() {
  try {
    // Connexion à MongoDB
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connexion à MongoDB réussie !\n');

    // Récupération de toutes les identifications
    console.log('🔍 Récupération des identifications de PROVED...');
    const identifications = await IdentificationProved.find({})
      .populate('createdBy', 'nom prenom email')
      .populate('updatedBy', 'nom prenom email')
      .sort({ createdAt: -1 });

    console.log(`📊 Nombre total d'identifications trouvées: ${identifications.length}\n`);

    if (identifications.length === 0) {
      console.log('❌ Aucune identification de PROVED trouvée dans la base de données.');
      return;
    }

    // Affichage des informations
    console.log('📋 LISTE DES IDENTIFICATIONS DE PROVED:');
    console.log('=' .repeat(80));

    identifications.forEach((identification, index) => {
      console.log(`\n${index + 1}. ID: ${identification._id}`);
      console.log(`   Province Administrative: ${identification.provinceAdministrative}`);
      console.log(`   Province Éducationnelle: ${identification.provinceEducationnelle}`);
      console.log(`   Chef Lieu PROVED: ${identification.chefLieuProved}`);
      console.log(`   Directeur Provincial: ${identification.directeurProvincial}`);
      console.log(`   Email Professionnel: ${identification.emailProfessionnel || 'Non renseigné'}`);
      console.log(`   Téléphone: ${identification.telephone || 'Non renseigné'}`);
      console.log(`   Statut Occupation: ${identification.statutOccupation || 'Non renseigné'}`);
      console.log(`   Nombre de Territoires: ${identification.nombreTerritoires}`);
      console.log(`   Nombre de Sous-divisions: ${identification.nombreSousDivisions}`);
      console.log(`   Rôle: ${identification.role}`);
      console.log(`   Statut Actif: ${identification.isActive ? '✅ Actif' : '❌ Inactif'}`);
      console.log(`   Créé le: ${identification.createdAt.toLocaleString('fr-FR')}`);
      console.log(`   Modifié le: ${identification.updatedAt.toLocaleString('fr-FR')}`);
      
      if (identification.createdBy) {
        console.log(`   Créé par: ${identification.createdBy.nom} ${identification.createdBy.prenom} (${identification.createdBy.email})`);
      }
      
      if (identification.updatedBy) {
        console.log(`   Modifié par: ${identification.updatedBy.nom} ${identification.updatedBy.prenom} (${identification.updatedBy.email})`);
      }
      
      console.log('   ' + '-'.repeat(60));
    });

    // Statistiques
    console.log('\n📈 STATISTIQUES:');
    console.log('=' .repeat(40));
    const activeCount = identifications.filter(id => id.isActive).length;
    const inactiveCount = identifications.length - activeCount;
    const adminCount = identifications.filter(id => id.role === 'admin').length;
    const userCount = identifications.filter(id => id.role === 'user').length;

    console.log(`Total d'identifications: ${identifications.length}`);
    console.log(`Identifications actives: ${activeCount}`);
    console.log(`Identifications inactives: ${inactiveCount}`);
    console.log(`Rôle Admin: ${adminCount}`);
    console.log(`Rôle User: ${userCount}`);

    // Identification active
    const activeIdentification = identifications.find(id => id.isActive);
    if (activeIdentification) {
      console.log(`\n🎯 IDENTIFICATION ACTIVE:`);
      console.log(`   ${activeIdentification.provinceAdministrative} - ${activeIdentification.directeurProvincial}`);
    } else {
      console.log(`\n⚠️  Aucune identification active trouvée.`);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des identifications:', error.message);
    console.error('Détails de l\'erreur:', error);
  } finally {
    // Fermeture de la connexion
    await mongoose.connection.close();
    console.log('\n🔌 Connexion à MongoDB fermée.');
  }
}

// Exécution du script
if (require.main === module) {
  console.log('🚀 Démarrage du script de liste des identifications de PROVED...\n');
  listIdentificationProveds()
    .then(() => {
      console.log('\n✅ Script terminé avec succès !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { listIdentificationProveds };
