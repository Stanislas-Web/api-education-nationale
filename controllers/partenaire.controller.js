// controllers/partenaire.controller.js

const { Partenaire } = require('../models/partenaire.model');

// Créer un nouveau partenaire
const createPartenaire = async (req, res) => {
  try {
    const partenaire = new Partenaire(req.body);
    await partenaire.save();
    res.status(201).json(partenaire);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer tous les partenaires
const getAllPartenaires = async (req, res) => {
  try {
    const partenaires = await Partenaire.find();
    res.status(200).json(partenaires);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un partenaire par ID
const getPartenaireById = async (req, res) => {
  try {
    const partenaire = await Partenaire.findById(req.params.id);
    if (!partenaire) {
      return res.status(404).json({ message: 'Partenaire non trouvé' });
    }
    res.status(200).json(partenaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un partenaire par ID
const updatePartenaire = async (req, res) => {
  try {
    const partenaire = await Partenaire.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!partenaire) {
      return res.status(404).json({ message: 'Partenaire non trouvé' });
    }
    res.status(200).json(partenaire);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un partenaire par ID
const deletePartenaire = async (req, res) => {
  try {
    const partenaire = await Partenaire.findByIdAndDelete(req.params.id);
    if (!partenaire) {
      return res.status(404).json({ message: 'Partenaire non trouvé' });
    }
    res.status(200).json({ message: 'Partenaire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPartenaire,
  getAllPartenaires,
  getPartenaireById,
  updatePartenaire,
  deletePartenaire,
};
