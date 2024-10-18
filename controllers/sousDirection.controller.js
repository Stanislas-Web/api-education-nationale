const { SousDirection } = require('../models/sousDirection.model');


module.exports.createSousDirection = async (req, res) => {
  const { nom, idDirection } = req.body;

  try {
    // Création de la sous-direction
    const sousDirection = new SousDirection({ nom, idDirection });
    const result = await sousDirection.save();

    return res.status(201).send({
      message: "Sous-direction créée avec succès",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la création de la sous-direction",
      error: error.message,
    });
  }
};

module.exports.getAllSousDirections = async (req, res) => {
  try {
    const sousDirections = await SousDirection.find().populate('idDirection');

    return res.status(200).send({
      message: "Liste des sous-directions récupérée avec succès",
      data: sousDirections,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des sous-directions",
      error: error.message,
    });
  }
};

module.exports.updateSousDirection = async (req, res) => {
  const sousDirectionId = req.params.id;
  const updateData = req.body;

  try {
    const updatedSousDirection = await SousDirection.findByIdAndUpdate(sousDirectionId, updateData, { new: true });

    if (!updatedSousDirection) {
      return res.status(404).send({
        message: "Sous-direction non trouvée",
      });
    }

    return res.status(200).send({
      message: "Sous-direction mise à jour avec succès",
      data: updatedSousDirection,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la mise à jour de la sous-direction",
      error: error.message,
    });
  }
};

/**
 * Supprime une sous-direction par son ID.
 * @param {Object} req - Requête HTTP contenant l'ID de la sous-direction à supprimer.
 * @param {Object} res - Réponse HTTP.
 */
module.exports.deleteSousDirection = async (req, res) => {
  const sousDirectionId = req.params.id;

  try {
    const deletedSousDirection = await SousDirection.findByIdAndDelete(sousDirectionId);

    if (!deletedSousDirection) {
      return res.status(404).send({
        message: "Sous-direction non trouvée",
      });
    }

    return res.status(200).send({
      message: "Sous-direction supprimée avec succès",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la suppression de la sous-direction",
      error: error.message,
    });
  }
};
