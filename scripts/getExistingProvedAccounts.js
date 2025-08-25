const mongoose = require('mongoose');

// Connexion à MongoDB
mongoose.connect("mongodb+srv://stanislasmakengo1:CmO8NytrFHAsW4yI@cluster0.rl7g5.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const { IdentificationProved } = require('../models/identificationProved.model');

async function getExistingProvedAccounts() {
  try {
    console.log('Récupération des comptes PROVED existants...\n');
    
    // Récupérer tous les comptes PROVED
    const existingAccounts = await IdentificationProved.find({}).sort({ provinceAdministrative: 1 });
    
    if (existingAccounts.length === 0) {
      console.log('Aucun compte PROVED trouvé.');
      return;
    }

    console.log(`=== ${existingAccounts.length} COMPTES PROVED EXISTANTS ===\n`);
    
    // Afficher les informations de chaque compte
    existingAccounts.forEach((account, index) => {
      console.log(`${index + 1}. ${account.provinceAdministrative}`);
      console.log(`   📧 Email: ${account.emailProfessionnel || 'Non défini'}`);
      console.log(`   📱 Téléphone: ${account.telephone || 'Non défini'}`);
      console.log(`   🏢 Chef lieu: ${account.chefLieuProved || 'Non défini'}`);
      console.log(`   👤 Directeur: ${account.directeurProvincial || 'Non défini'}`);
      console.log(`   🏠 Statut: ${account.statutOccupation || 'Non défini'}`);
      console.log(`   🔑 Rôle: ${account.role || 'user'}`);
      console.log(`   ✅ Actif: ${account.isActive ? 'Oui' : 'Non'}`);
      console.log(`   📅 Créé le: ${account.createdAt ? account.createdAt.toLocaleDateString('fr-FR') : 'Non défini'}`);
      console.log('');
    });

    // Afficher un résumé formaté pour copier-coller
    console.log('=== FORMAT POUR COPIE-COLLER ===\n');
    existingAccounts.forEach((account, index) => {
      const email = account.emailProfessionnel || 'Non défini';
      const phone = account.telephone || 'Non défini';
      const password = account.motDePasse ? '[MOT DE PASSE HACHÉ]' : 'Non défini';
      
      console.log(`${account.provinceAdministrative} | ${phone} | ${email} | ${password}`);
    });

    console.log(`\n=== RÉSUMÉ ===`);
    console.log(`Total des comptes: ${existingAccounts.length}`);
    console.log(`Comptes actifs: ${existingAccounts.filter(a => a.isActive).length}`);
    console.log(`Comptes inactifs: ${existingAccounts.filter(a => !a.isActive).length}`);

    process.exit(0);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des comptes:', error);
    process.exit(1);
  }
}

// Exécuter le script
getExistingProvedAccounts();
