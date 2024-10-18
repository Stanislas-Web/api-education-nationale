const { Direction } = require("../models/direction.model");
const { Province } = require("../models/province.model");

module.exports.createDirection = async (req, res) => {
  const { nom, idProvince } = req.body;

  try {
    // Vérification si la province existe
    const province = await Province.findById(idProvince);
    if (!province) {
      return res.status(404).send({
        message: "Province non trouvée",
      });
    }

    // Création de la nouvelle direction
    const direction = new Direction({
      nom,
      idProvince,
    });

    const result = await direction.save();

    return res.status(201).send({
      message: "Création de la direction réussie",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Une erreur est survenue lors de la création",
      error: error.message,
    });
  }
};

module.exports.getAllDirections = async (req, res) => {
  try {
    const directions = await Direction.find().populate('idProvince');

    return res.status(200).send({
      message: "Liste de toutes les directions",
      data: directions,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Une erreur est survenue lors de la récupération des directions",
      error: error.message,
    });
  }
};

module.exports.updateDirection = async (req, res) => {
  const directionId = req.params.id;
  const { nom, idProvince } = req.body;

  try {
    // Vérification si la province existe
    if (idProvince) {
      const province = await Province.findById(idProvince);
      if (!province) {
        return res.status(404).send({
          message: "Province non trouvée",
        });
      }
    }

    const updatedDirection = await Direction.findByIdAndUpdate(
      directionId,
      { nom, idProvince },
      { new: true }
    ).populate('idProvince');

    if (!updatedDirection) {
      return res.status(404).send({
        message: "Direction non trouvée",
      });
    }

    return res.status(200).send({
      message: "Direction mise à jour avec succès",
      data: updatedDirection,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Une erreur est survenue lors de la mise à jour de la direction",
      error: error.message,
    });
  }
};

module.exports.deleteDirection = async (req, res) => {
  const directionId = req.params.id;

  try {
    const deletedDirection = await Direction.findByIdAndDelete(directionId);

    if (!deletedDirection) {
      return res.status(404).send({
        message: "Direction non trouvée",
      });
    }

    return res.status(200).send({
      message: "Direction supprimée avec succès",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Une erreur est survenue lors de la suppression de la direction",
      error: error.message,
    });
  }
};
