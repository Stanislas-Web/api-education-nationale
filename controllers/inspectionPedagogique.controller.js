const InspectionPedagogique = require('../models/inspectionPedagogique.model');

// Créer une nouvelle inspection pédagogique
exports.createInspection = async (req, res) => {
  try {
    const inspection = new InspectionPedagogique(req.body);
    const savedInspection = await inspection.save();
    res.status(201).json(savedInspection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de l’inspection pédagogique.' });
  }
};

// Récupérer toutes les inspections pédagogiques
exports.getAllInspections = async (req, res) => {
  try {
    const inspections = await InspectionPedagogique.find()
      .populate('inspecteur', 'nom prenom')
      .populate('etablissement', 'nom localisation')
      .populate('enseignant', 'nom prenom');
    res.status(200).json(inspections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des inspections pédagogiques.' });
  }
};

// Récupérer une inspection pédagogique par ID
exports.getInspectionById = async (req, res) => {
  try {
    const inspection = await InspectionPedagogique.findById(req.params.id)
      .populate('inspecteur')
      .populate('etablissement')
      .populate('enseignant');
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection pédagogique introuvable.' });
    }
    res.status(200).json(inspection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l’inspection pédagogique.' });
  }
};

// Mettre à jour une inspection pédagogique par ID
exports.updateInspection = async (req, res) => {
  try {
    const updatedInspection = await InspectionPedagogique.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedInspection) {
      return res.status(404).json({ error: 'Inspection pédagogique introuvable.' });
    }
    res.status(200).json(updatedInspection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l’inspection pédagogique.' });
  }
};

// Supprimer une inspection pédagogique par ID
exports.deleteInspection = async (req, res) => {
  try {
    const deletedInspection = await InspectionPedagogique.findByIdAndDelete(req.params.id);
    if (!deletedInspection) {
      return res.status(404).json({ error: 'Inspection pédagogique introuvable.' });
    }
    res.status(200).json({ message: 'Inspection pédagogique supprimée avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l’inspection pédagogique.' });
  }
};
