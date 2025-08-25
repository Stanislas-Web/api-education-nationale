const mongoose = require('mongoose');

// Connexion à MongoDB
mongoose.connect("mongodb+srv://stanislasmakengo1:CmO8NytrFHAsW4yI@cluster0.rl7g5.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const { IdentificationProved } = require('../models/identificationProved.model');
const { FicheAutoEvaluation } = require('../models/ficheAutoEvaluation.model');

async function createFicheAutoEvaluation() {
  try {
    console.log('Création d\'une fiche d\'autoévaluation pour Tshopo1...\n');
    
    // Trouver le compte Tshopo1
    const tshopo1Account = await IdentificationProved.findOne({
      telephone: '+243829166417'
    });

    if (!tshopo1Account) {
      console.log('❌ Compte Tshopo1 non trouvé avec le numéro +243829166417');
      return;
    }

    console.log(`✅ Compte trouvé: ${tshopo1Account.provinceAdministrative}`);
    console.log(`📧 Email: ${tshopo1Account.emailProfessionnel}`);
    console.log(`📱 Téléphone: ${tshopo1Account.telephone}\n`);

    // Créer la fiche d'autoévaluation
    const ficheAutoEvaluation = new FicheAutoEvaluation({
      identificationProved: tshopo1Account._id,
      intituleFormation: 'Formation sur la Gestion Administrative des Établissements Scolaires',
      contenuComprehension: {
        contenuClair: 'Beaucoup',
        nouvellesConnaissances: 'Tout à fait'
      },
      participationImplication: {
        participationActive: 'Beaucoup',
        rythmeAdapte: 'Assez'
      },
      pertinenceUtilite: {
        themesUtiles: 'Tout à fait',
        capaciteApplication: 'Beaucoup'
      },
      suggestionsCommentaires: {
        ceQuiApprecie: 'La formation a été très enrichissante. Les méthodes de gestion administrative présentées sont pratiques et applicables dans notre contexte. Les échanges avec les autres participants ont été très constructifs.',
        ameliorations: 'Il serait bien d\'avoir plus d\'exemples concrets et de cas pratiques spécifiques à notre région. Aussi, une session de suivi après quelques mois serait utile.',
        autresCommentaires: 'Merci pour cette excellente formation. Nous espérons pouvoir participer à d\'autres sessions similaires à l\'avenir.'
      },
      statut: 'soumis'
    });

    await ficheAutoEvaluation.save();

    console.log('✅ Fiche d\'autoévaluation créée avec succès!');
    console.log('\n=== DÉTAILS DE LA FICHE ===');
    console.log(`📋 Intitulé: ${ficheAutoEvaluation.intituleFormation}`);
    console.log(`📊 Statut: ${ficheAutoEvaluation.statut}`);
    console.log(`📅 Date de création: ${ficheAutoEvaluation.createdAt.toLocaleDateString('fr-FR')}`);
    console.log(`🆔 ID de la fiche: ${ficheAutoEvaluation._id}`);
    
    console.log('\n=== ÉVALUATIONS ===');
    console.log('📚 Contenu et Compréhension:');
    console.log(`   - Clarté du contenu: ${ficheAutoEvaluation.contenuComprehension.contenuClair}`);
    console.log(`   - Nouvelles connaissances: ${ficheAutoEvaluation.contenuComprehension.nouvellesConnaissances}`);
    
    console.log('\n🎯 Participation et Implication:');
    console.log(`   - Participation active: ${ficheAutoEvaluation.participationImplication.participationActive}`);
    console.log(`   - Rythme adapté: ${ficheAutoEvaluation.participationImplication.rythmeAdapte}`);
    
    console.log('\n💼 Pertinence et Utilité:');
    console.log(`   - Thèmes utiles: ${ficheAutoEvaluation.pertinenceUtilite.themesUtiles}`);
    console.log(`   - Capacité d'application: ${ficheAutoEvaluation.pertinenceUtilite.capaciteApplication}`);
    
    console.log('\n💬 Commentaires:');
    console.log(`   - Ce qui a été apprécié: ${ficheAutoEvaluation.suggestionsCommentaires.ceQuiApprecie}`);
    console.log(`   - Améliorations suggérées: ${ficheAutoEvaluation.suggestionsCommentaires.ameliorations}`);
    console.log(`   - Autres commentaires: ${ficheAutoEvaluation.suggestionsCommentaires.autresCommentaires}`);

    // Calculer et afficher le score global
    const scoreGlobal = ficheAutoEvaluation.scoreGlobal;
    console.log(`\n⭐ Score global: ${scoreGlobal}/5`);

    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de la fiche d\'autoévaluation:', error);
    process.exit(1);
  }
}

// Exécuter le script
createFicheAutoEvaluation();
