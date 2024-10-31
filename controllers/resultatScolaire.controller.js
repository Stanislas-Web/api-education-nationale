const { ResultatScolaire } = require('../models/resultatScolaire.model');
const { Ecole } = require('../models/ecole.model');

// Create a new ResultatScolaire
module.exports.createResultatScolaire = async (req, res) => {
  const { tauxReussite, moyenneClasse, ecole } = req.body;

  try {
    // Check if the associated school exists
    const school = await Ecole.findById(ecole);
    if (!school) {
      return res.status(404).send({ message: "Ecole not found." });
    }

    const resultat = new ResultatScolaire({ tauxReussite, moyenneClasse, ecole });
    const savedResult = await resultat.save();

    return res.status(201).send({
      message: "Resultat scolaire créé avec succès",
      data: savedResult,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la création du resultat scolaire",
      error: error.message,
    });
  }
};

// Get all ResultatScolaire
module.exports.getAllResultatsScolaires = async (req, res) => {
  try {
    const resultats = await ResultatScolaire.find().populate('ecole', 'nom localisation');
    return res.status(200).send({
      message: "Liste des résultats scolaires récupérée avec succès",
      data: resultats,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des résultats scolaires",
      error: error.message,
    });
  }
};

// Get ResultatScolaire by ID
module.exports.getResultatScolaireById = async (req, res) => {
  const { id } = req.params;

  try {
    const resultat = await ResultatScolaire.findById(id).populate('ecole', 'nom localisation');
    if (!resultat) {
      return res.status(404).send({ message: "Resultat scolaire non trouvé" });
    }

    return res.status(200).send({
      message: "Resultat scolaire récupéré avec succès",
      data: resultat,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération du resultat scolaire",
      error: error.message,
    });
  }
};

// Update ResultatScolaire
module.exports.updateResultatScolaire = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedResultat = await ResultatScolaire.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedResultat) {
      return res.status(404).send({ message: "Resultat scolaire non trouvé" });
    }

    return res.status(200).send({
      message: "Resultat scolaire mis à jour avec succès",
      data: updatedResultat,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la mise à jour du resultat scolaire",
      error: error.message,
    });
  }
};

// Delete ResultatScolaire
module.exports.deleteResultatScolaire = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedResultat = await ResultatScolaire.findByIdAndDelete(id);
    if (!deletedResultat) {
      return res.status(404).send({ message: "Resultat scolaire non trouvé" });
    }

    return res.status(200).send({
      message: "Resultat scolaire supprimé avec succès",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la suppression du resultat scolaire",
      error: error.message,
    });
  }
};

// Get ResultatsScolaires by School (Ecole)
module.exports.getResultatsByEcole = async (req, res) => {
  const { ecoleId } = req.params;

  try {
    const resultats = await ResultatScolaire.find({ ecole: ecoleId }).populate('ecole', 'nom localisation');
    if (!resultats || resultats.length === 0) {
      return res.status(404).send({ message: "Aucun resultat scolaire trouvé pour cette école" });
    }

    return res.status(200).send({
      message: "Résultats scolaires de l'école récupérés avec succès",
      data: resultats,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des résultats scolaires de l'école",
      error: error.message,
    });
  }
};
