const Effectif = require('../models/effectif.model');
const Eleve = require('../models/eleve.model');
const Personnel = require('../models/personnel.model');

module.exports.createEffectif = async (req, res) => {
  const { ecoleId } = req.body;

  try {
    const totalEleves = await Eleve.countDocuments({ ecole: ecoleId });
    const totalPersonnel = await Personnel.countDocuments({ ecole: ecoleId });

    const repartitionSexe = await Eleve.aggregate([
      { $match: { ecole: ecoleId } },
      { $group: {
        _id: "$sexe",
        count: { $sum: 1 }
      }},
      { $project: {
        sexe: "$_id",
        count: "$count"
      }}
    ]);

    const repartition = { garcons: 0, filles: 0 };
    repartitionSexe.forEach(({ sexe, count }) => {
      if (sexe === 'M') {
        repartition.garcons = count;
      } else if (sexe === 'F') {
        repartition.filles = count;
      }
    });

    const effectif = new Effectif({
      ecoleId,
      totalEleves,
      totalPersonnel,
      repartitionSexe: repartition,
    });

    const result = await effectif.save();

    return res.status(201).send({
      message: "Effectif créé avec succès",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la création de l'effectif",
      error: error.message,
    });
  }
};

module.exports.getEffectifByEcole = async (req, res) => {
  const { ecoleId } = req.params;

  try {
    const effectif = await Effectif.findOne({ ecoleId });

    if (!effectif) {
      return res.status(404).send({
        message: "Effectif non trouvé pour cette école",
      });
    }

    return res.status(200).send({
      message: "Effectif récupéré avec succès",
      data: effectif,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération de l'effectif",
      error: error.message,
    });
  }
};

// New method to get Effectif by SousDirection
module.exports.getEffectifBySousDirection = async (req, res) => {
  const { sousDirectionId } = req.params;

  try {
    // Assuming you have a way to get all schools under a sousDirection
    const ecoles = await Ecole.find({ sousDirection: sousDirectionId });

    // If no schools found
    if (!ecoles.length) {
      return res.status(404).send({
        message: "Aucune école trouvée pour cette sous-direction",
      });
    }

    // Aggregate effectifs for all schools under the sous-direction
    const effectifs = await Effectif.find({ ecoleId: { $in: ecoles.map(ecole => ecole._id) } });

    return res.status(200).send({
      message: "Effectifs récupérés avec succès",
      data: effectifs,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des effectifs par sous-direction",
      error: error.message,
    });
  }
};
