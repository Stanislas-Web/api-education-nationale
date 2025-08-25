const mongoose = require('mongoose');

// Connexion à MongoDB
mongoose.connect("mongodb+srv://stanislasmakengo1:CmO8NytrFHAsW4yI@cluster0.rl7g5.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const { IdentificationProved } = require('../models/identificationProved.model');

// Mots de passe originaux utilisés lors de la création
const originalPasswords = {
  'Administration Centrale': '1234',
  'Kinshasa-Lukunga': 'Kinshasalukunga@123',
  'Sud-Ubangi1': 'Sudubangi1@123',
  'Kwango2': 'Kwango2@123',
  'Bas-Uele': 'Basuele@123',
  'Mai-Ndombe2': 'Maindombe2@123',
  'Mongala2': 'Mongala2@123',
  'Nord-Ubangi1': 'Nordubangi1@123',
  'KongoCentral1': 'Kongocentral1@123',
  'Kinshasa-Tshangu': 'Kinshasatshangu@123',
  'Mai-Ndombe1': 'Maindombe1@123',
  'KasaiOriental1': 'Kasaioriental1@123',
  'Sud-Ubangi2': 'Sudubangi2@123',
  'KasaiCentral2': 'Kasaicentral2@123',
  'Equateur2': 'Equateur2@123',
  'Equateur1': 'Equateur1@123',
  'Kwilu1': 'Kwilu1@123',
  'Nord-Kivu3': 'Nordkivu3@123',
  'Nord-Kivu2': 'Nordkivu2@123',
  'Haut-Uele1': 'Hautuele1@123',
  'Haut-Uele2': 'Hautuele2@123',
  'Nord-Ubangi2': 'Nordubangi2@123',
  'Haut-Katanga2': 'Hautkatanga2@123',
  'Kinshasa-Funa': 'Kinshasafuna@123',
  'Haut-Lomami2': 'Hautlomami2@123',
  'Mongala1': 'Mongala1@123',
  'Ituri1': 'Ituri1@123',
  'Kinshasa-Plateau': 'Kinshasaplateau@123',
  'Mongala1-Bis': 'Mongala1bis@123',
  'Kwilu2': 'Kwilu2@123',
  'Kwilu3': 'Kwilu3@123',
  'Tshopo1': 'Tshopo1@123',
  'Kinshasa-MontAmba': 'Kinshasamontamba@123',
  'KasaiOriental2': 'Kasaioriental2@123',
  'Nord-Kivu1': 'Nordkivu1@123',
  'Tanganyika2': 'Tanganyika2@123',
  'Tanganyika1': 'Tanganyika1@123',
  'KasaiCentral1': 'Kasaicentral1@123',
  'Sankuru1': 'Sankuru1@123',
  'Lualaba2': 'Lualaba2@123',
  'Lualaba1': 'Lualaba1@123',
  'Tshuapa2': 'Tshuapa2@123',
  'Kasai1': 'Kasai1@123',
  'Kwango1': 'Kwango1@123',
  'Lomami2': 'Lomami2@123',
  'Lomami1': 'Lomami1@123',
  'Mai-Ndombe3': 'Maindombe3@123',
  'Haut-Katanga1': 'Hautkatanga1@123',
  'Tshopo2': 'Tshopo2@123'
};

async function getProvedPasswords() {
  try {
    console.log('Récupération des mots de passe des comptes PROVED...\n');
    
    // Récupérer tous les comptes PROVED
    const existingAccounts = await IdentificationProved.find({}).sort({ provinceAdministrative: 1 });
    
    if (existingAccounts.length === 0) {
      console.log('Aucun compte PROVED trouvé.');
      return;
    }

    console.log(`=== MOTS DE PASSE DES ${existingAccounts.length} COMPTES PROVED ===\n`);
    
    // Afficher les informations de chaque compte avec mot de passe
    existingAccounts.forEach((account, index) => {
      const password = originalPasswords[account.provinceAdministrative] || '[MOT DE PASSE NON DÉFINI]';
      
      console.log(`${index + 1}. ${account.provinceAdministrative}`);
      console.log(`   📧 Email: ${account.emailProfessionnel || 'Non défini'}`);
      console.log(`   📱 Téléphone: ${account.telephone || 'Non défini'}`);
      console.log(`   🔑 Mot de passe: ${password}`);
      console.log(`   🔑 Rôle: ${account.role || 'user'}`);
      console.log('');
    });

    // Afficher un résumé formaté pour copier-coller
    console.log('=== FORMAT POUR COPIE-COLLER (AVEC MOTS DE PASSE) ===\n');
    existingAccounts.forEach((account, index) => {
      const email = account.emailProfessionnel || 'Non défini';
      const phone = account.telephone || 'Non défini';
      const password = originalPasswords[account.provinceAdministrative] || '[MOT DE PASSE NON DÉFINI]';
      
      console.log(`${account.provinceAdministrative} | ${phone} | ${email} | ${password}`);
    });

    console.log(`\n=== RÉSUMÉ ===`);
    console.log(`Total des comptes: ${existingAccounts.length}`);
    console.log(`Comptes avec mot de passe défini: ${Object.keys(originalPasswords).length}`);
    console.log(`Comptes sans mot de passe défini: ${existingAccounts.length - Object.keys(originalPasswords).length}`);

    process.exit(0);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des mots de passe:', error);
    process.exit(1);
  }
}

// Exécuter le script
getProvedPasswords();
