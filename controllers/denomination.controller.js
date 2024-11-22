const { Denomination } = require("../models/denomination.model");

module.exports.createDenomination = async (req, res) => {
  const { appellation, sigle, code } = req.body;

  try {
    // Vérification des champs requis
    if (!appellation || !sigle) {
      return res.status(400).send({
        message: "Les champs 'appellation' et 'sigle' sont obligatoires.",
      });
    }

    // Création de la dénomination
    const denomination = new Denomination({ appellation, sigle, code });
    const result = await denomination.save();

    return res.status(201).send({
      message: "Dénomination créée avec succès",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la création de la dénomination",
      error: error.message,
    });
  }
};


module.exports.createManyDenominations = async (req, res) => {
  const denominatios = req.body.denominations; 
  try {
    const result = await Denomination.insertMany(denominatios);
    return res.status(200).send({
      message: "All denominations inserted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error inserting Denominations",
      error: error.message,
    });
  }
};

module.exports.getAllDenominations = async (req, res) => {
  try {
    const denominations = await Denomination.find();
    return res.status(200).send({
      message: "Liste des dénominations récupérée avec succès",
      data: denominations,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des dénominations",
      error: error.message,
    });
  }
};

module.exports.updateDenomination = async (req, res) => {
  const denominationId = req.params.id;
  const updateData = req.body;

  try {
    const updatedDenomination = await Denomination.findByIdAndUpdate(
      denominationId,
      updateData,
      { new: true }
    );

    if (!updatedDenomination) {
      return res.status(404).send({
        message: "Dénomination non trouvée",
      });
    }

    return res.status(200).send({
      message: "Dénomination mise à jour avec succès",
      data: updatedDenomination,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la mise à jour de la dénomination",
      error: error.message,
    });
  }
};

module.exports.deleteDenomination = async (req, res) => {
  const denominationId = req.params.id;

  try {
    const deletedDenomination = await Denomination.findByIdAndDelete(denominationId);

    if (!deletedDenomination) {
      return res.status(404).send({
        message: "Dénomination non trouvée",
      });
    }

    return res.status(200).send({
      message: "Dénomination supprimée avec succès",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la suppression de la dénomination",
      error: error.message,
    });
  }
};

module.exports.getDenominationById = async (req, res) => {
  const denominationId = req.params.id;

  try {
    const denomination = await Denomination.findById(denominationId);

    if (!denomination) {
      return res.status(404).send({
        message: "Dénomination non trouvée",
      });
    }

    return res.status(200).send({
      message: "Dénomination récupérée avec succès",
      data: denomination,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération de la dénomination",
      error: error.message,
    });
  }
};
