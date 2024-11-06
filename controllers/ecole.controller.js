const { Ecole } = require('../models/ecole.model');

module.exports.createEcole = async (req, res) => {
  const { nom, adresse, localisation, sousDirection, createdBy } = req.body;

  try {
    // Vérification des champs requis
    if (!sousDirection) {
      return res.status(400).send({
        message: "Le champ sousDirection est requis pour créer une école."
      });
    }

    // Création de l'école
    const ecole = new Ecole({
      nom,
      createdBy,
      adresse,
      localisation,
      sousDirection
    });

    const result = await ecole.save();

    return res.status(201).send({
      message: "École créée avec succès",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la création de l'école",
      error: error.message,
    });
  }
};

module.exports.createManyEcoles = async (req, res) => {
  const ecoles = req.body.ecoles; 
  try {
    const result = await Ecole.insertMany(ecoles);
    return res.status(200).send({
      message: "All ecoles inserted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error inserting ecoles",
      error: error.message,
    });
  }
};

module.exports.getAllEcoles = async (req, res) => {
  try {
    const ecoles = await Ecole.find()
      .populate('sousDirection').populate('createdBy');

    return res.status(200).send({
      message: "Liste des écoles récupérée avec succès",
      data: ecoles,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des écoles",
      error: error.message,
    });
  }
};

module.exports.updateEcole = async (req, res) => {
  const ecoleId = req.params.id;
  const updateData = req.body;

  try {
    const updatedEcole = await Ecole.findByIdAndUpdate(ecoleId, updateData, { new: true });

    if (!updatedEcole) {
      return res.status(404).send({
        message: "École non trouvée",
      });
    }

    return res.status(200).send({
      message: "École mise à jour avec succès",
      data: updatedEcole,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la mise à jour de l'école",
      error: error.message,
    });
  }
};

module.exports.deleteEcole = async (req, res) => {
  const ecoleId = req.params.id;

  try {
    const deletedEcole = await Ecole.findByIdAndDelete(ecoleId);

    if (!deletedEcole) {
      return res.status(404).send({
        message: "École non trouvée",
      });
    }

    return res.status(200).send({
      message: "École supprimée avec succès",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la suppression de l'école",
      error: error.message,
    });
  }
};

module.exports.getEcolesBySousDirection = async (req, res) => {
  const { sousDirectionId } = req.params;

  try {
    const ecoles = await Ecole.find({ sousDirectionId })
      .populate('sousDirection').populate('createdBy');

    if (ecoles.length === 0) {
      return res.status(404).send({
        message: "Aucune école trouvée pour cette sous-direction.",
      });
    }

    return res.status(200).send({
      message: "Écoles récupérées avec succès pour la sous-direction",
      data: ecoles,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des écoles",
      error: error.message,
    });
  }
};


module.exports.getEcoleById = async (req, res) => {
  const ecoleId = req.params.id;

  try {
    const ecole = await Ecole.findById(ecoleId).populate('sousDirection').populate('createdBy'); // Remplacez 'sousDirectionId' si un autre champ est utilisé

    if (!ecole) {
      return res.status(404).send({
        message: "École non trouvée",
      });
    }

    return res.status(200).send({
      message: "École récupérée avec succès",
      data: ecole,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération de l'école",
      error: error.message,
    });
  }
};


