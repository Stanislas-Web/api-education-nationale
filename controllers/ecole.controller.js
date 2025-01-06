const { Ecole } = require('../models/ecole.model');

module.exports.createEcole = async (req, res) => {
  const {
    nom,
    localisation,
    sousDirection,
    createdBy,
    secope,
    arreteMinisteriel,
    denomination,
    rueOuAvenue,
    quartier,
    communeOuTerritoire,
    district,
    ville,
    village,
    secteur,
    bp,
    n,
    tel,
    matricule
  } = req.body;

  try {
    // Vérification des champs requis
    if (!sousDirection || !nom || !denomination ) {
      return res.status(400).send({
        message: "Certains champs obligatoires sont manquants.",
      });
    }

    // Création de l'école
    const ecole = new Ecole({
      nom,
      createdBy,
      localisation,
      sousDirection,
      secope,
      arreteMinisteriel,
      denomination,
      rueOuAvenue,
      quartier,
      communeOuTerritoire,
      district,
      ville,
      village,
      secteur,
      bp,
      matricule,
      tel,
      n
    });

    const result = await ecole.save();

    return res.status(201).send({
      message: "École créée avec succès",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la création de l'école",
      error: error.message,
    });
  }
};


module.exports.createManyEcoles = async (req, res) => {
  const ecoles = req.body.ecoles; 
  try {
    const result = await Ecole.insertMany(ecoles);
    return res.status(200).send({
      message: "All ecoles inserted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error inserting ecoles",
      error: error.message,
    });
  }
};

module.exports.getAllEcoles = async (req, res) => {
  try {
    const ecoles = await Ecole.find()
      .populate('sousDirection')
      .populate('createdBy')
      .populate('denomination'); // Peupler la dénomination si nécessaire

    return res.status(200).send({
      message: "Liste des écoles récupérée avec succès",
      data: ecoles,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des écoles",
      error: error.message,
    });
  }
};


// module.exports.getAllEcoles = async (req, res) => {
//   try {
//     const ecoles = await Ecole.find()
//       .populate('sousDirection')  // Remplir la référence 'sousDirection'
//       .populate('createdBy');     // Remplir la référence 'createdBy'

//     // Calculer l'effectif pour chaque école
//     const ecolesWithEffectifs = await Promise.all(ecoles.map(async (ecole) => {
//       const effectifs = ecole.eleves.length + ecole.personnel.length;  // Calcul de l'effectif
//       ecole.effectifs = effectifs;  // Mise à jour de l'effectif dans l'école
//       return ecole;
//     }));

//     return res.status(200).send({
//       message: "Liste des écoles récupérée avec succès",
//       data: ecolesWithEffectifs,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       message: "Erreur lors de la récupération des écoles",
//       error: error.message,
//     });
//   }
// };


module.exports.updateEcole = async (req, res) => {
  const ecoleId = req.params.id;
  const updateData = req.body;

  try {
    const updatedEcole = await Ecole.findByIdAndUpdate(ecoleId, updateData, {
      new: true,
    });

    if (!updatedEcole) {
      return res.status(404).send({
        message: "École non trouvée",
      });
    }

    return res.status(200).send({
      message: "École mise à jour avec succès",
      data: updatedEcole,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la mise à jour de l'école",
      error: error.message,
    });
  }
};


module.exports.deleteEcole = async (req, res) => {
  const ecoleId = req.params.id;

  try {
    const deletedEcole = await Ecole.findByIdAndDelete(ecoleId);

    if (!deletedEcole) {
      return res.status(404).send({
        message: "École non trouvée",
      });
    }

    return res.status(200).send({
      message: "École supprimée avec succès",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la suppression de l'école",
      error: error.message,
    });
  }
};

module.exports.getEcolesBySousDirection = async (req, res) => {
  const { sousDirectionId } = req.params;

  try {
    const ecoles = await Ecole.find({ sousDirectionId })
      .populate('sousDirection').populate('createdBy');

    if (ecoles.length === 0) {
      return res.status(404).send({
        message: "Aucune école trouvée pour cette sous-direction.",
      });
    }

    return res.status(200).send({
      message: "Écoles récupérées avec succès pour la sous-direction",
      data: ecoles,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des écoles",
      error: error.message,
    });
  }
};


module.exports.getEcoleById = async (req, res) => {
  const ecoleId = req.params.id;

  try {
    const ecole = await Ecole.findById(ecoleId).populate('sousDirection').populate('createdBy'); // Remplacez 'sousDirectionId' si un autre champ est utilisé

    if (!ecole) {
      return res.status(404).send({
        message: "École non trouvée",
      });
    }

    return res.status(200).send({
      message: "École récupérée avec succès",
      data: ecole,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération de l'école",
      error: error.message,
    });
  }
};


