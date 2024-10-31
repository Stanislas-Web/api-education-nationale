const { Annonce } = require('../models/annonce.model');

// Créer une nouvelle annonce
const createAnnonce = async (req, res) => {
  try {
    const annonce = new Annonce(req.body);
    await annonce.save();
    res.status(201).json(annonce);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer toutes les annonces
const getAllAnnonces = async (req, res) => {
  try {
    const annonces = await Annonce.find();
    res.status(200).json(annonces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une annonce
const updateAnnonce = async (req, res) => {
  const { id } = req.params;
  try {
    const annonce = await Annonce.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!annonce) {
      return res.status(404).json({ message: 'Annonce non trouvée' });
    }
    res.status(200).json({ message: 'Annonce mise à jour avec succès', annonce });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer une annonce
const deleteAnnonce = async (req, res) => {
  const { id } = req.params;
  try {
    const annonce = await Annonce.findByIdAndDelete(id);
    if (!annonce) {
      return res.status(404).json({ message: 'Annonce non trouvée' });
    }
    res.status(200).json({ message: 'Annonce supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAnnonce,
  getAllAnnonces,
  updateAnnonce,
  deleteAnnonce,
};
