const Infrastructure = require('../models/infrastructure.model');

// Créer une nouvelle infrastructure
exports.createInfrastructure = async (req, res) => {
  try {
    const infrastructure = new Infrastructure(req.body);
    await infrastructure.save();
    res.status(201).json({ message: 'Infrastructure créée avec succès', infrastructure });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de l\'infrastructure', error });
  }
};

module.exports.createManyInfrastructures = async (req, res) => {
  const infrastructures = req.body.infrastructures; 
  try {
    const result = await Infrastructure.insertMany(infrastructures);
    return res.status(200).send({
      message: "All infrastructures inserted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error inserting infrastructures",
      error: error.message,
    });
  }
};

// Récupérer toutes les infrastructures
exports.getAllInfrastructures = async (req, res) => {
  try {
    const infrastructures = await Infrastructure.find().populate('schoolId').populate('createdBy');
    res.status(200).json(infrastructures);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des infrastructures', error });
  }
};

// Modifier une infrastructure par ID
exports.updateInfrastructure = async (req, res) => {
  const { id } = req.params;
  try {
    const infrastructure = await Infrastructure.findByIdAndUpdate(id, req.body, { new: true });
    if (!infrastructure) return res.status(404).json({ message: 'Infrastructure non trouvée' });
    res.status(200).json({ message: 'Infrastructure mise à jour avec succès', infrastructure });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'infrastructure', error });
  }
};

// Supprimer une infrastructure par ID
exports.deleteInfrastructure = async (req, res) => {
  const { id } = req.params;
  try {
    const infrastructure = await Infrastructure.findByIdAndDelete(id);
    if (!infrastructure) return res.status(404).json({ message: 'Infrastructure non trouvée' });
    res.status(200).json({ message: 'Infrastructure supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'infrastructure', error });
  }
};


