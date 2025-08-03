const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Connexion à MongoDB
mongoose.connect("mongodb+srv://stanislasmakengo1:CmO8NytrFHAsW4yI@cluster0.rl7g5.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const { IdentificationProved } = require('../models/identificationProved.model');

async function hashProvedPasswords() {
  try {
    console.log('Début du script de hashage des mots de passe PROVED...');
    
    // Récupérer toutes les PROVED
    const provedList = await IdentificationProved.find({});
    console.log(`Nombre de PROVED trouvées: ${provedList.length}`);
    
    for (const proved of provedList) {
      console.log(`\nTraitement de la PROVED: ${proved.provinceAdministrative}`);
      console.log(`Email: ${proved.emailProfessionnel}`);
      console.log(`Mot de passe actuel: ${proved.motDePasse ? 'Existe' : 'N\'existe pas'}`);
      
      // Si le mot de passe existe et n'est pas déjà hashé (pas de $2b$ au début)
      if (proved.motDePasse && !proved.motDePasse.startsWith('$2b$')) {
        console.log('Hashage du mot de passe...');
        const hashedPassword = await bcrypt.hash(proved.motDePasse, 10);
        proved.motDePasse = hashedPassword;
        await proved.save();
        console.log('Mot de passe hashé avec succès!');
      } else if (proved.motDePasse && proved.motDePasse.startsWith('$2b$')) {
        console.log('Mot de passe déjà hashé');
      } else {
        console.log('Aucun mot de passe à hasher');
      }
    }
    
    console.log('\nScript terminé avec succès!');
    process.exit(0);
    
  } catch (error) {
    console.error('Erreur lors du hashage:', error);
    process.exit(1);
  }
}

// Exécuter le script
hashProvedPasswords(); 