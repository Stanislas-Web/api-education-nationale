const { EffectifAnnuel } = require('../models/effectifAnnuel.model');

/**
 * Récupérer les effectifs de l'année précédente
 */
const getEffectifsPreviousYear = async (req, res) => {
  try {
    const { identificationProved, annee } = req.params;
    
    // Calculer l'année précédente: "2024-2025" -> "2023-2024"
    const [debut, fin] = annee.split('-');
    const anneePrecedente = `${parseInt(debut) - 1}-${parseInt(fin) - 1}`;

    let effectifs = await EffectifAnnuel.findOne({
      identificationProved,
      annee: anneePrecedente
    }).populate('identificationProved', 'provinceEducationnelle directeurProvincial');

    // Si aucun effectif trouvé, créer un effectif par défaut avec des valeurs réalistes
    if (!effectifs) {
      const effectifParDefaut = {
        identificationProved,
        annee: anneePrecedente,
        effectifs: {
          niveauPrescolaire: {
            espaceCommunautaireEveil: {
              effectifGarconsFilles: 150,
              effectifFilles: 75
            },
            maternel: {
              effectifGarconsFilles: 200,
              effectifFilles: 100
            },
            prePrimaire: {
              effectifGarconsFilles: 180,
              effectifFilles: 90
            },
            special: {
              effectifGarconsFilles: 50,
              effectifFilles: 25
            }
          },
          niveauPrimaire: {
            enseignementSpecial: {
              effectifGarconsFilles: 80,
              effectifFilles: 40
            },
            enseignementPrimaire: {
              effectifGarconsFilles: 1200,
              effectifFilles: 600
            }
          },
          niveauSecondaire: {
            enseignementSpecial: {
              effectifGarcons: 45,
              effectifFilles: 35
            },
            enseignementSecondaire: {
              septiemeCTEB: {
                effectifGarcons: 250,
                effectifFilles: 200
              },
              huitiemeCTEB: {
                effectifGarcons: 220,
                effectifFilles: 180
              },
              premiereHumanite: {
                effectifGarcons: 200,
                effectifFilles: 170
              },
              quatriemeHumanite: {
                effectifGarcons: 180,
                effectifFilles: 150
              }
            }
          }
        }
      };

      effectifs = effectifParDefaut;
    }

    res.status(200).json({
      success: true,
      message: effectifs._id 
        ? `Effectifs de l'année ${anneePrecedente} récupérés avec succès`
        : `Aucun effectif trouvé pour ${anneePrecedente}, valeurs par défaut fournies`,
      anneePrecedente: anneePrecedente,
      anneeActuelle: annee,
      isDefaultData: !effectifs._id,
      data: effectifs
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des effectifs précédents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des effectifs précédents',
      error: error.message
    });
  }
};

/**
 * Sauvegarder manuellement des effectifs
 */
const saveEffectifs = async (req, res) => {
  try {
    const { identificationProved, annee, effectifs } = req.body;

    const savedEffectifs = await EffectifAnnuel.findOneAndUpdate(
      { identificationProved, annee },
      { effectifs },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Effectifs sauvegardés avec succès',
      data: savedEffectifs
    });

  } catch (error) {
    console.error('Erreur lors de la sauvegarde des effectifs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la sauvegarde des effectifs',
      error: error.message
    });
  }
};

/**
 * Récupérer tous les effectifs d'une PROVED (historique)
 */
const getAllEffectifsByProved = async (req, res) => {
  try {
    const { identificationProved } = req.params;

    const effectifs = await EffectifAnnuel.find({
      identificationProved
    })
    .sort({ annee: -1 })
    .populate('identificationProved', 'provinceEducationnelle directeurProvincial');

    if (!effectifs || effectifs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucun historique d\'effectifs trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Historique des effectifs récupéré avec succès',
      count: effectifs.length,
      data: effectifs
    });

  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération',
      error: error.message
    });
  }
};

module.exports = {
  getEffectifsPreviousYear,
  saveEffectifs,
  getAllEffectifsByProved
};