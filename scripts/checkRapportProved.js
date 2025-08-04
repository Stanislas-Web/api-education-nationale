const mongoose = require('mongoose');

// Connexion à MongoDB
mongoose.connect("mongodb+srv://stanislasmakengo1:CmO8NytrFHAsW4yI@cluster0.rl7g5.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const { RapportActivite } = require('../models/rapportActivite.model');
const { IdentificationProved } = require('../models/identificationProved.model');

async function checkRapportProved() {
  try {
    console.log('Vérification des rapports d\'activité...');
    
    // Récupérer tous les rapports
    const rapports = await RapportActivite.find({});
    console.log(`Nombre total de rapports: ${rapports.length}`);
    
    // Récupérer toutes les PROVED
    const provedList = await IdentificationProved.find({});
    console.log(`Nombre total de PROVED: ${provedList.length}`);
    
    if (provedList.length === 0) {
      console.log('Aucune PROVED trouvée dans la base de données!');
      return;
    }
    
    // Prendre la première PROVED comme référence par défaut
    const defaultProved = provedList[0];
    console.log(`PROVED par défaut: ${defaultProved.provinceAdministrative} (${defaultProved._id})`);
    
    let updatedCount = 0;
    
    for (const rapport of rapports) {
      console.log(`\nVérification du rapport: ${rapport._id}`);
      console.log(`identificationProved actuel: ${rapport.identificationProved}`);
      
      if (!rapport.identificationProved) {
        console.log('Rapport sans identification PROVED - mise à jour...');
        
        rapport.identificationProved = defaultProved._id;
        await rapport.save();
        updatedCount++;
        
        console.log('Rapport mis à jour avec succès!');
      } else {
        // Vérifier si la référence existe
        const provedExists = await IdentificationProved.findById(rapport.identificationProved);
        if (!provedExists) {
          console.log('Référence PROVED invalide - mise à jour...');
          
          rapport.identificationProved = defaultProved._id;
          await rapport.save();
          updatedCount++;
          
          console.log('Rapport mis à jour avec succès!');
        } else {
          console.log('Référence PROVED valide');
        }
      }
    }
    
    console.log(`\nRésumé:`);
    console.log(`- Rapports vérifiés: ${rapports.length}`);
    console.log(`- Rapports mis à jour: ${updatedCount}`);
    console.log(`- PROVED disponibles: ${provedList.length}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    process.exit(1);
  }
}

// Exécuter le script
checkRapportProved(); 