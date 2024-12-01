const PremiereVisite  = require('../models/premiereVisite.modal');

// Créer une nouvelle première visite
const createPremiereVisite = async (req, res) => {
  try {
    const {
      inspecteur,
      etablissement,
      nomChefEtablissement,
      telephone,
      postes,
      rapportCirconstancie,
      signature
    } = req.body;

    // Vérification des champs requis
    if (!inspecteur || !etablissement || !signature) {
      return res.status(400).json({ 
        message: 'Inspecteur, établissement et signature sont requis.' 
      });
    }

    // Créer un nouvel objet première visite
    const premiereVisite = new PremiereVisite({
      inspecteur,
      etablissement,
      nomChefEtablissement,
      telephone,
      postes,
      rapportCirconstancie,
      signature
    });

    // Sauvegarder dans la base de données
    await premiereVisite.save();
    res.status(201).json(premiereVisite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createManyPremiereVisite = async (req, res) => {
  const premieresVisites = req.body.premieresVisites; 
  try {
    const result = await PremiereVisite.insertMany(premieresVisites);
    return res.status(200).send({
      message: "All premieresVisites inserted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error inserting premieresVisites",
      error: error.message,
    });
  }
};

// Récupérer toutes les premières visites
const getAllPremieresVisites = async (req, res) => {
  try {
    const premieresVisites = await PremiereVisite.find()
      .populate('inspecteur', 'nom email')
      .populate({
        path: 'etablissement',
        populate: {
          path: 'denomination',
          select: 'appellation sigle code'
        },
        select: 'nom adresse'
      });

    res.status(200).json(premieresVisites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer une première visite par ID
const getPremiereVisiteById = async (req, res) => {
  try {
    const premiereVisite = await PremiereVisite.findById(req.params.id)
      .populate('inspecteur', 'nom email')
      .populate('etablissement', 'nom adresse');

    if (!premiereVisite) {
      return res.status(404).json({ 
        message: 'Première visite non trouvée' 
      });
    }

    res.status(200).json(premiereVisite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une première visite
const updatePremiereVisite = async (req, res) => {
  try {
    const {
      nomChefEtablissement,
      telephone,
      postes,
      rapportCirconstancie,
      signature
    } = req.body;

    const premiereVisite = await PremiereVisite.findByIdAndUpdate(
      req.params.id,
      {
        nomChefEtablissement,
        telephone,
        postes,
        rapportCirconstancie,
        signature
      },
      { new: true, runValidators: true }
    )
    .populate('inspecteur', 'nom email')
    .populate('etablissement', 'nom adresse');

    if (!premiereVisite) {
      return res.status(404).json({ 
        message: 'Première visite non trouvée' 
      });
    }

    res.status(200).json(premiereVisite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer une première visite
const deletePremiereVisite = async (req, res) => {
  try {
    const premiereVisite = await PremiereVisite.findByIdAndDelete(req.params.id);
    
    if (!premiereVisite) {
      return res.status(404).json({ 
        message: 'Première visite non trouvée' 
      });
    }

    res.status(200).json({ 
      message: 'Première visite supprimée avec succès' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPremiereVisite,
  getAllPremieresVisites,
  getPremiereVisiteById,
  updatePremiereVisite,
  deletePremiereVisite,
  createManyPremiereVisite
};