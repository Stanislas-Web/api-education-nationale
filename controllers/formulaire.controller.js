// controllers/formulaire.controller.js
const { Formulaire } = require('../models/formulaire.model');
const { TypeFormulaire } = require('../models/typeFormulaire.model');

// Créer un formulaire en fonction du type de formulaire
const createFormulaire = async (req, res) => {
  try {
    const { typeFormulaire, reponses, destinateurs, idSousDirection, createdBy } = req.body;

    // Vérifier si le type de formulaire existe
    const type = await TypeFormulaire.findById(typeFormulaire);
    if (!type) {
      return res.status(400).json({ message: 'Type de formulaire non trouvé' });
    }

    // Créer le formulaire avec les réponses associées et les destinataires
    const formulaire = new Formulaire({
      typeFormulaire,
      reponses,
      destinateurs,
      idSousDirection,
      createdBy
    });

    await formulaire.save();
    res.status(201).json(formulaire);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer tous les formulaires
const getAllFormulaires = async (req, res) => {
  try {
    const formulaires = await Formulaire.find().populate('typeFormulaire').populate('idSousDirection');
    res.status(200).json(formulaires);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un formulaire par ID
const getFormulaireById = async (req, res) => {
  try {
    const formulaire = await Formulaire.findById(req.params.id)
      .populate('typeFormulaire')
      .populate('idSousDirection');
    if (!formulaire) {
      return res.status(404).json({ message: 'Formulaire non trouvé' });
    }
    res.status(200).json(formulaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un formulaire
const updateFormulaire = async (req, res) => {
  try {
    const { typeFormulaire, reponses, destinateurs, idSousDirection, updatedBy } = req.body;

    // Chercher le formulaire à mettre à jour
    const formulaire = await Formulaire.findById(req.params.id);
    if (!formulaire) {
      return res.status(404).json({ message: 'Formulaire non trouvé' });
    }

    // Mettre à jour le formulaire
    formulaire.typeFormulaire = typeFormulaire || formulaire.typeFormulaire;
    formulaire.reponses = reponses || formulaire.reponses;
    formulaire.destinateurs = destinateurs || formulaire.destinateurs;
    formulaire.idSousDirection = idSousDirection || formulaire.idSousDirection;
    formulaire.updatedBy = updatedBy || formulaire.updatedBy;

    await formulaire.save();
    res.status(200).json(formulaire);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un formulaire
const deleteFormulaire = async (req, res) => {
  try {
    const formulaire = await Formulaire.findByIdAndDelete(req.params.id);
    if (!formulaire) {
      return res.status(404).json({ message: 'Formulaire non trouvé' });
    }
    res.status(200).json({ message: 'Formulaire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  createFormulaire,
  getAllFormulaires,
  getFormulaireById,
  updateFormulaire, 
  deleteFormulaire
};
