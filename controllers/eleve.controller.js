const { Eleve } = require('../models/eleve.model');

// Création d'un nouvel élève
module.exports.createEleve = async (req, res) => {
  const { nom, prenom, age, sexe, classe, ecole } = req.body;

  try {
    const eleve = new Eleve({ nom, prenom, age, sexe, classe, ecole });
    const result = await eleve.save();

    return res.status(201).send({
      message: "Élève créé avec succès",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la création de l'élève",
      error: error.message,
    });
  }
};

// Récupérer tous les élèves
module.exports.getAllEleves = async (req, res) => {
  try {
    const eleves = await Eleve.find().populate('ecole');
    return res.status(200).send({
      message: "Liste des élèves récupérée avec succès",
      data: eleves,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des élèves",
      error: error.message,
    });
  }
};

// Récupérer un élève par ID
module.exports.getEleveById = async (req, res) => {
  const eleveId = req.params.id;

  try {
    const eleve = await Eleve.findById(eleveId).populate('ecole');

    if (!eleve) {
      return res.status(404).send({
        message: "Élève non trouvé",
      });
    }

    return res.status(200).send({
      message: "Élève récupéré avec succès",
      data: eleve,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération de l'élève",
      error: error.message,
    });
  }
};

// Récupérer les élèves par rapport à l'école
module.exports.getElevesByEcole = async (req, res) => {
  const ecoleId = req.params.ecoleId;

  try {
    const eleves = await Eleve.find({ ecole: ecoleId }).populate('ecole');

    return res.status(200).send({
      message: "Liste des élèves récupérée avec succès pour l'école",
      data: eleves,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des élèves par école",
      error: error.message,
    });
  }
};

// Récupérer les élèves par rapport à la sous-direction
module.exports.getElevesBySousDirection = async (req, res) => {
  const sousDirectionId = req.params.sousDirectionId;

  try {
    const eleves = await Eleve.find()
      .populate({
        path: 'ecole',
        match: { directionId: sousDirectionId } // Filtrer par sous-direction
      });

    // Filtrer les élèves dont l'école est présente après le peuplement
    const filteredEleves = eleves.filter(eleve => eleve.ecole);

    return res.status(200).send({
      message: "Liste des élèves récupérée avec succès pour la sous-direction",
      data: filteredEleves,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des élèves par sous-direction",
      error: error.message,
    });
  }
};

// Mettre à jour un élève
module.exports.updateEleve = async (req, res) => {
  const eleveId = req.params.id;
  const updateData = req.body;

  try {
    const updatedEleve = await Eleve.findByIdAndUpdate(eleveId, updateData, { new: true });

    if (!updatedEleve) {
      return res.status(404).send({
        message: "Élève non trouvé",
      });
    }

    return res.status(200).send({
      message: "Élève mis à jour avec succès",
      data: updatedEleve,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la mise à jour de l'élève",
      error: error.message,
    });
  }
};

// Supprimer un élève
module.exports.deleteEleve = async (req, res) => {
  const eleveId = req.params.id;

  try {
    const deletedEleve = await Eleve.findByIdAndDelete(eleveId);

    if (!deletedEleve) {
      return res.status(404).send({
        message: "Élève non trouvé",
      });
    }

    return res.status(200).send({
      message: "Élève supprimé avec succès",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la suppression de l'élève",
      error: error.message,
    });
  }
};
