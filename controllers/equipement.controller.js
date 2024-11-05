// controllers/equipement.controller.js

const Equipement = require('../models/equipement.model');

// Create new equipment
exports.createEquipement = async (req, res) => {
  try {
    const equipement = new Equipement(req.body);
    await equipement.save();
    res.status(201).json(equipement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all equipment
exports.getAllEquipements = async (req, res) => {
  try {
    const equipements = await Equipement.find().populate('ecoleId').populate('createdBy');
    res.status(200).json(equipements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get equipment by ID
exports.getEquipementById = async (req, res) => {
  try {
    const equipement = await Equipement.findById(req.params.id).populate('ecoleId');
    if (!equipement) return res.status(404).json({ message: "Équipement non trouvé" });
    res.status(200).json(equipement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update equipment
exports.updateEquipement = async (req, res) => {
  try {
    const equipement = await Equipement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!equipement) return res.status(404).json({ message: "Équipement non trouvé" });
    res.status(200).json(equipement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete equipment
exports.deleteEquipement = async (req, res) => {
  try {
    const equipement = await Equipement.findByIdAndDelete(req.params.id);
    if (!equipement) return res.status(404).json({ message: "Équipement non trouvé" });
    res.status(200).json({ message: "Équipement supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
