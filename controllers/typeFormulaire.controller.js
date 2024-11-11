const { TypeFormulaire } = require('../models/typeFormulaire.model');

// Créer un nouveau type de formulaire
const createTypeFormulaire = async (req, res) => {
  try {
    const { code, nom, destinateurs, champs, createdBy } = req.body;

    // Vérification si les données nécessaires sont présentes
    if (!code || !nom || !createdBy) {
      return res.status(400).json({ message: 'Code, nom et créateur sont requis.' });
    }

    // Créer un nouvel objet de type de formulaire
    const typeFormulaire = new TypeFormulaire({
      code,
      nom,
      destinateurs,
      champs,
      createdBy
    });

    // Sauvegarder le type de formulaire dans la base de données
    await typeFormulaire.save();
    res.status(201).json(typeFormulaire);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer tous les types de formulaires avec les destinateurs peuplés
const getAllTypeFormulaires = async (req, res) => {
    try {
      const typeFormulaires = await TypeFormulaire.find()
        .populate({
          path: 'destinateurs', // Peuple le champ destinateurs avec les utilisateurs
          select: 'nom postnom prenom grade fonction email direction sousDirection service', // Sélectionne les champs nécessaires
          populate: [
            {
              path: 'direction', // Peuple le champ direction dans les utilisateurs
              select: 'nom', // Sélectionne uniquement le champ 'nom' de la direction
            },
            {
              path: 'sousDirection', // Peuple le champ sousDirection dans les utilisateurs
              select: 'nom', // Sélectionne uniquement le champ 'nom' de la sousDirection
            },
            {
              path: 'service', // Peuple le champ service dans les utilisateurs
              select: 'nom', // Sélectionne uniquement le champ 'nom' du service
            }
          ]
        });
  
      res.status(200).json(typeFormulaires);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Récupérer un type de formulaire par ID avec les destinateurs peuplés
const getTypeFormulaireById = async (req, res) => {
  try {
    const typeFormulaire = await TypeFormulaire.findById(req.params.id)
      .populate('destinateurs', 'nom email');  // Peuplé avec les champs 'nom' et 'email' des utilisateurs
    
    if (!typeFormulaire) {
      return res.status(404).json({ message: 'Type de formulaire non trouvé' });
    }
    res.status(200).json(typeFormulaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un type de formulaire par ID
const updateTypeFormulaire = async (req, res) => {
  try {
    const { code, nom, destinateurs, champs, createdBy } = req.body;

    // Vérification si les données nécessaires sont présentes
    if (!code || !nom || !createdBy) {
      return res.status(400).json({ message: 'Code, nom et créateur sont requis.' });
    }

    const typeFormulaire = await TypeFormulaire.findByIdAndUpdate(
      req.params.id,
      { code, nom, destinateurs, champs, createdBy },
      { new: true, runValidators: true }
    )
    .populate('destinateurs', 'nom email');  // Peuplé avec les champs 'nom' et 'email' des utilisateurs
    
    if (!typeFormulaire) {
      return res.status(404).json({ message: 'Type de formulaire non trouvé' });
    }
    
    res.status(200).json(typeFormulaire);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un type de formulaire par ID
const deleteTypeFormulaire = async (req, res) => {
  try {
    const typeFormulaire = await TypeFormulaire.findByIdAndDelete(req.params.id);
    if (!typeFormulaire) {
      return res.status(404).json({ message: 'Type de formulaire non trouvé' });
    }
    res.status(200).json({ message: 'Type de formulaire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTypeFormulaire,
  getAllTypeFormulaires,
  getTypeFormulaireById,
  updateTypeFormulaire,
  deleteTypeFormulaire
};
