const { EffectifAnnuel } = require('../models/effectifAnnuel.model');

/**
 * Helper pour calculer l'année scolaire précédente
 * @param {String} anneeScolaire - Format "2024-2025"
 * @returns {String} - Format "2023-2024"
 */
function getPreviousYear(anneeScolaire) {
  const [debut, fin] = anneeScolaire.split('-');
  const debutPrecedent = parseInt(debut) - 1;
  const finPrecedent = parseInt(fin) - 1;
  return `${debutPrecedent}-${finPrecedent}`;
}

/**
 * Calculer tous les taux d'accroissement pour un rapport d'activité
 * @param {ObjectId} identificationProved - ID de la PROVED
 * @param {String} anneeActuelle - Année scolaire actuelle (ex: "2024-2025")
 * @param {Object} effectifsActuels - Effectifs de l'année actuelle
 * @returns {Object} - Effectifs avec taux d'accroissement calculés
 */
async function calculateAllTauxAccroissement(identificationProved, anneeActuelle, effectifsActuels) {
  try {
    // Récupérer les effectifs de l'année précédente
    const anneePrecedente = getPreviousYear(anneeActuelle);
    const effectifsPrecedents = await EffectifAnnuel.getEffectifByYear(identificationProved, anneePrecedente);

    // Si pas d'effectifs précédents, retourner les effectifs actuels avec taux à 0
    if (!effectifsPrecedents) {
      console.log(`Aucun effectif trouvé pour ${anneePrecedente}, taux = 0`);
      return addZeroTaux(effectifsActuels);
    }

    console.log(`Calcul des taux : ${anneePrecedente} → ${anneeActuelle}`);

    // Calculer les taux d'accroissement
    const result = {
      niveauPrescolaire: {},
      niveauPrimaire: {},
      niveauSecondaire: {}
    };

    // NIVEAU PRÉSCOLAIRE
    const niveauxPrescolaire = ['espaceCommunautaireEveil', 'maternel', 'prePrimaire', 'special'];
    niveauxPrescolaire.forEach(niveau => {
      const actuel = effectifsActuels.niveauPrescolaire[niveau];
      const precedent = effectifsPrecedents.effectifs.niveauPrescolaire[niveau];

      result.niveauPrescolaire[niveau] = {
        effectifGarconsFilles: actuel.effectifGarconsFilles || 0,
        effectifFilles: actuel.effectifFilles || 0,
        tauxAccroissementGarconsFilles: EffectifAnnuel.calculateTauxAccroissement(
          actuel.effectifGarconsFilles || 0,
          precedent.effectifGarconsFilles || 0
        ),
        tauxAccroissementFilles: EffectifAnnuel.calculateTauxAccroissement(
          actuel.effectifFilles || 0,
          precedent.effectifFilles || 0
        )
      };
    });

    // NIVEAU PRIMAIRE
    const niveauxPrimaire = ['enseignementSpecial', 'enseignementPrimaire'];
    niveauxPrimaire.forEach(niveau => {
      const actuel = effectifsActuels.niveauPrimaire[niveau];
      const precedent = effectifsPrecedents.effectifs.niveauPrimaire[niveau];

      result.niveauPrimaire[niveau] = {
        effectifGarconsFilles: actuel.effectifGarconsFilles || 0,
        effectifFilles: actuel.effectifFilles || 0,
        tauxAccroissementGarconsFilles: EffectifAnnuel.calculateTauxAccroissement(
          actuel.effectifGarconsFilles || 0,
          precedent.effectifGarconsFilles || 0
        ),
        tauxAccroissementFilles: EffectifAnnuel.calculateTauxAccroissement(
          actuel.effectifFilles || 0,
          precedent.effectifFilles || 0
        )
      };
    });

    // NIVEAU SECONDAIRE - Enseignement Spécial
    const actuelSecSpecial = effectifsActuels.niveauSecondaire.enseignementSpecial;
    const precedentSecSpecial = effectifsPrecedents.effectifs.niveauSecondaire.enseignementSpecial;

    result.niveauSecondaire.enseignementSpecial = {
      effectifGarcons: actuelSecSpecial.effectifGarcons || 0,
      effectifFilles: actuelSecSpecial.effectifFilles || 0,
      tauxGarcons: EffectifAnnuel.calculateTauxAccroissement(
        actuelSecSpecial.effectifGarcons || 0,
        precedentSecSpecial.effectifGarcons || 0
      ),
      tauxFilles: EffectifAnnuel.calculateTauxAccroissement(
        actuelSecSpecial.effectifFilles || 0,
        precedentSecSpecial.effectifFilles || 0
      )
    };

    // NIVEAU SECONDAIRE - Enseignement Secondaire
    const classesSecondaire = ['septiemeCTEB', 'huitiemeCTEB', 'premiereHumanite', 'quatriemeHumanite'];
    result.niveauSecondaire.enseignementSecondaire = {};

    classesSecondaire.forEach(classe => {
      const actuel = effectifsActuels.niveauSecondaire.enseignementSecondaire[classe];
      const precedent = effectifsPrecedents.effectifs.niveauSecondaire.enseignementSecondaire[classe];

      result.niveauSecondaire.enseignementSecondaire[classe] = {
        effectifGarcons: actuel.effectifGarcons || 0,
        effectifFilles: actuel.effectifFilles || 0,
        tauxGarcons: EffectifAnnuel.calculateTauxAccroissement(
          actuel.effectifGarcons || 0,
          precedent.effectifGarcons || 0
        ),
        tauxFilles: EffectifAnnuel.calculateTauxAccroissement(
          actuel.effectifFilles || 0,
          precedent.effectifFilles || 0
        )
      };
    });

    return result;

  } catch (error) {
    console.error('Erreur lors du calcul des taux d\'accroissement:', error);
    throw error;
  }
}

/**
 * Ajouter des taux à 0 quand il n'y a pas d'effectifs précédents
 */
function addZeroTaux(effectifs) {
  const result = {
    niveauPrescolaire: {},
    niveauPrimaire: {},
    niveauSecondaire: {}
  };

  // NIVEAU PRÉSCOLAIRE
  const niveauxPrescolaire = ['espaceCommunautaireEveil', 'maternel', 'prePrimaire', 'special'];
  niveauxPrescolaire.forEach(niveau => {
    const niv = effectifs.niveauPrescolaire[niveau] || {};
    result.niveauPrescolaire[niveau] = {
      effectifGarconsFilles: niv.effectifGarconsFilles || 0,
      effectifFilles: niv.effectifFilles || 0,
      tauxAccroissementGarconsFilles: 0,
      tauxAccroissementFilles: 0
    };
  });

  // NIVEAU PRIMAIRE
  const niveauxPrimaire = ['enseignementSpecial', 'enseignementPrimaire'];
  niveauxPrimaire.forEach(niveau => {
    const niv = effectifs.niveauPrimaire[niveau] || {};
    result.niveauPrimaire[niveau] = {
      effectifGarconsFilles: niv.effectifGarconsFilles || 0,
      effectifFilles: niv.effectifFilles || 0,
      tauxAccroissementGarconsFilles: 0,
      tauxAccroissementFilles: 0
    };
  });

  // NIVEAU SECONDAIRE - Enseignement Spécial
  const secSpecial = effectifs.niveauSecondaire.enseignementSpecial || {};
  result.niveauSecondaire.enseignementSpecial = {
    effectifGarcons: secSpecial.effectifGarcons || 0,
    effectifFilles: secSpecial.effectifFilles || 0,
    tauxGarcons: 0,
    tauxFilles: 0
  };

  // NIVEAU SECONDAIRE - Enseignement Secondaire
  const classesSecondaire = ['septiemeCTEB', 'huitiemeCTEB', 'premiereHumanite', 'quatriemeHumanite'];
  result.niveauSecondaire.enseignementSecondaire = {};

  classesSecondaire.forEach(classe => {
    const cls = effectifs.niveauSecondaire.enseignementSecondaire[classe] || {};
    result.niveauSecondaire.enseignementSecondaire[classe] = {
      effectifGarcons: cls.effectifGarcons || 0,
      effectifFilles: cls.effectifFilles || 0,
      tauxGarcons: 0,
      tauxFilles: 0
    };
  });

  return result;
}

/**
 * Sauvegarder les effectifs actuels pour utilisation future
 */
async function saveEffectifsForFutureCalculations(identificationProved, annee, effectifs) {
  try {
    await EffectifAnnuel.saveEffectifs(identificationProved, annee, effectifs);
    console.log(`✅ Effectifs sauvegardés pour l'année ${annee}`);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des effectifs:', error);
    throw error;
  }
}

module.exports = {
  calculateAllTauxAccroissement,
  saveEffectifsForFutureCalculations
};
