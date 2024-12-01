const { FicheAdministrative } = require('../models/ficheAdministrative.model');

// Créer une nouvelle fiche administrative
const createFicheAdministrative = async (req, res) => {
  try {
    const { etablissement,idSousDirection, idDirection, destinateurs, createdBy, structureEtPeuplement, personnel, miseEnPlace } = req.body;

    // Vérification si les données nécessaires sont présentes
    if (!etablissement || !structureEtPeuplement) {
      return res.status(400).json({ message: 'Établissement et structure et peuplement sont requis.' });
    }

    // Créer un nouvel objet fiche administrative avec le code par défaut 'A1'
    const ficheAdministrative = new FicheAdministrative({
      etablissement,
      destinateurs,
      createdBy,
      code: 'A1',
      structureEtPeuplement,
      personnel,
      miseEnPlace,
      idDirection,
      idSousDirection
    });    

    // Sauvegarder la fiche administrative dans la base de données
    await ficheAdministrative.save();
    res.status(201).json(ficheAdministrative);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const createManyFicheAdministrative = async (req, res) => {
  const ficheAdministratives = req.body.ficheAdministratives; 
  try {
    const result = await FicheAdministrative.insertMany(ficheAdministratives);
    return res.status(200).send({
      message: "All ficheAdministratives inserted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error inserting ficheAdministratives",
      error: error.message,
    });
  }
};

// Récupérer toutes les fiches administratives avec les destinateurs peuplés
const getAllFichesAdministratives = async (req, res) => {
  try {
    const fichesAdministratives = await FicheAdministrative.find()
      .populate("idSousDirection")
      .populate("idDirection")
      .populate("createdBy")
      .populate({
        path: "etablissement",
        populate: {
          path: "denomination", // Champ dans le modèle Etablissement qui fait référence aux dénominations
          select: "appellation sigle code", // Sélectionnez uniquement les champs nécessaires
        },
        select: "nom adresse", // Sélectionnez uniquement les champs nécessaires pour l'établissement
      })
      .populate("destinateurs");

    res.status(200).json(fichesAdministratives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Récupérer une fiche administrative par ID avec les destinateurs peuplés
const getFicheAdministrativeById = async (req, res) => {
  try {
    const ficheAdministrative = await FicheAdministrative.findById(req.params.id)
      .populate('destinateurs', 'nom email')
      .populate('createdBy', 'nom email')
      .populate('etablissement', 'nom adresse');

    if (!ficheAdministrative) {
      return res.status(404).json({ message: 'Fiche administrative non trouvée' });
    }
    res.status(200).json(ficheAdministrative);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une fiche administrative par ID
const updateFicheAdministrative = async (req, res) => {
  try {
    const { structureEtPeuplement, personnel, miseEnPlace } = req.body;

    const ficheAdministrative = await FicheAdministrative.findByIdAndUpdate(
      req.params.id,
      { structureEtPeuplement, personnel, miseEnPlace },
      { new: true, runValidators: true }
    )
    .populate('destinateurs', 'nom email')
    .populate('createdBy', 'nom email')
    .populate('etablissement', 'nom adresse');

    if (!ficheAdministrative) {
      return res.status(404).json({ message: 'Fiche administrative non trouvée' });
    }

    res.status(200).json(ficheAdministrative);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer une fiche administrative par ID
const deleteFicheAdministrative = async (req, res) => {
  try {
    const ficheAdministrative = await FicheAdministrative.findByIdAndDelete(req.params.id);
    if (!ficheAdministrative) {
      return res.status(404).json({ message: 'Fiche administrative non trouvée' });
    }
    res.status(200).json({ message: 'Fiche administrative supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFicheAdministrative,
  getAllFichesAdministratives,
  getFicheAdministrativeById,
  updateFicheAdministrative,
  deleteFicheAdministrative,
  createManyFicheAdministrative
};
