const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Connexion à MongoDB
mongoose.connect("mongodb+srv://stanislasmakengo1:CmO8NytrFHAsW4yI@cluster0.rl7g5.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const { IdentificationProved } = require('../models/identificationProved.model');

async function createProvedAdmin() {
  try {
    console.log('Création du compte admin PROVED...');
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await IdentificationProved.findOne({
      telephone: '+243826016607'
    });

    if (existingAdmin) {
      console.log('Le compte admin existe déjà!');
      console.log('Email/Téléphone:', existingAdmin.emailProfessionnel || existingAdmin.telephone);
      console.log('Rôle:', existingAdmin.role);
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('1234', 10);

    // Créer le compte admin
    const adminProved = new IdentificationProved({
      provinceAdministrative: 'Administration Centrale',
      provinceEducationnelle: 'Administration Centrale',
      chefLieuProved: 'Kinshasa',
      emailProfessionnel: 'admin.proved@education.cd',
      telephone: '+243826016607',
      statutOccupation: 'Propriétaire',
      nombreTerritoires: 0,
      nombreSousDivisions: 0,
      directeurProvincial: 'Administrateur Système',
      motDePasse: hashedPassword,
      role: 'admin',
      isActive: true
    });

    await adminProved.save();

    console.log('Compte admin PROVED créé avec succès!');
    console.log('Téléphone:', adminProved.telephone);
    console.log('Mot de passe:', '1234');
    console.log('Rôle:', adminProved.role);

    process.exit(0);
    
  } catch (error) {
    console.error('Erreur lors de la création du compte admin:', error);
    process.exit(1);
  }
}

// Exécuter le script
createProvedAdmin(); 