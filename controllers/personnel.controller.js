const { Personnel } = require('../models/personnel.model');

module.exports.createPersonnel = async (req, res) => {
  const { nom, prenom, role, qualification, ecole, createdBy } = req.body;

  try {
    const personnel = new Personnel({ nom, prenom, role, qualification, ecole, createdBy });
    const result = await personnel.save();

    return res.status(201).send({
      message: "Personnel créé avec succès",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la création du personnel",
      error: error.message,
    });
  }
};

module.exports.getAllPersonnel = async (req, res) => {
  try {
    const personnel = await Personnel.find().populate('ecole').populate('createdBy');
    
    return res.status(200).send({
      message: "Liste du personnel récupérée avec succès",
      data: personnel,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération du personnel",
      error: error.message,
    });
  }
};

module.exports.getPersonnelById = async (req, res) => {
  const personnelId = req.params.id;

  try {
    const personnel = await Personnel.findById(personnelId).populate('ecole');

    if (!personnel) {
      return res.status(404).send({
        message: "Personnel non trouvé",
      });
    }

    return res.status(200).send({
      message: "Personnel récupéré avec succès",
      data: personnel,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération du personnel",
      error: error.message,
    });
  }
};

module.exports.updatePersonnel = async (req, res) => {
  const personnelId = req.params.id;
  const updateData = req.body;

  try {
    const updatedPersonnel = await Personnel.findByIdAndUpdate(personnelId, updateData, { new: true });

    if (!updatedPersonnel) {
      return res.status(404).send({
        message: "Personnel non trouvé",
      });
    }

    return res.status(200).send({
      message: "Personnel mis à jour avec succès",
      data: updatedPersonnel,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la mise à jour du personnel",
      error: error.message,
    });
  }
};

module.exports.deletePersonnel = async (req, res) => {
  const personnelId = req.params.id;

  try {
    const deletedPersonnel = await Personnel.findByIdAndDelete(personnelId);

    if (!deletedPersonnel) {
      return res.status(404).send({
        message: "Personnel non trouvé",
      });
    }

    return res.status(200).send({
      message: "Personnel supprimé avec succès",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la suppression du personnel",
      error: error.message,
    });
  }
};

// Récupérer le personnel par rapport à une école
module.exports.getPersonnelByEcole = async (req, res) => {
  const ecoleId = req.params.ecoleId;

  try {
    const personnel = await Personnel.find({ ecole: ecoleId });

    return res.status(200).send({
      message: "Personnel récupéré avec succès par rapport à l'école",
      data: personnel,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération du personnel par rapport à l'école",
      error: error.message,
    });
  }
};

module.exports.getPersonnelBySousDirection = async (req, res) => {
    const sousDirectionId = req.params.sousDirectionId;
  
    try {
      const personnel = await Personnel.find({ sousDirection: sousDirectionId })
        .populate('ecole'); // Assurez-vous que le champ 'ecole' est peuplé si nécessaire
  
      return res.status(200).send({
        message: "Personnel récupéré avec succès par sous-direction",
        data: personnel,
      });
    } catch (error) {
      return res.status(500).send({
        message: "Erreur lors de la récupération du personnel par sous-direction",
        error: error.message,
      });
    }
  };
