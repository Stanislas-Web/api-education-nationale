const BesoinRessource = require('../models/besoinRessource.model');

module.exports.createBesoinRessource = async (req, res) => {
  const { materielManquant, infrastructuresARenover, ecoleId } = req.body;

  try {
    const besoinRessource = new BesoinRessource({
      materielManquant,
      infrastructuresARenover,
      ecoleId
    });

    const result = await besoinRessource.save();

    return res.status(201).send({
      message: "Besoins en ressources créés avec succès",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la création des besoins en ressources",
      error: error.message,
    });
  }
};

module.exports.getAllBesoinsRessources = async (req, res) => {
  try {
    const besoinsRessources = await BesoinRessource.find()
      .populate('ecoleId'); // Peupler le champ ecoleId si nécessaire

    return res.status(200).send({
      message: "Liste des besoins en ressources récupérée avec succès",
      data: besoinsRessources,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des besoins en ressources",
      error: error.message,
    });
  }
};

module.exports.getBesoinRessourceByEcole = async (req, res) => {
  const ecoleId = req.params.ecoleId;

  try {
    const besoinsRessources = await BesoinRessource.find({ ecoleId })
      .populate('ecoleId'); // Peupler le champ ecoleId si nécessaire

    return res.status(200).send({
      message: "Besoins en ressources récupérés avec succès pour l'école",
      data: besoinsRessources,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des besoins en ressources pour l'école",
      error: error.message,
    });
  }
};

module.exports.updateBesoinRessource = async (req, res) => {
  const besoinRessourceId = req.params.id;
  const updateData = req.body;

  try {
    const updatedBesoinRessource = await BesoinRessource.findByIdAndUpdate(besoinRessourceId, updateData, { new: true });

    if (!updatedBesoinRessource) {
      return res.status(404).send({
        message: "Besoins en ressources non trouvés",
      });
    }

    return res.status(200).send({
      message: "Besoins en ressources mis à jour avec succès",
      data: updatedBesoinRessource,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la mise à jour des besoins en ressources",
      error: error.message,
    });
  }
};

module.exports.deleteBesoinRessource = async (req, res) => {
  const besoinRessourceId = req.params.id;

  try {
    const deletedBesoinRessource = await BesoinRessource.findByIdAndDelete(besoinRessourceId);

    if (!deletedBesoinRessource) {
      return res.status(404).send({
        message: "Besoins en ressources non trouvés",
      });
    }

    return res.status(200).send({
      message: "Besoins en ressources supprimés avec succès",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la suppression des besoins en ressources",
      error: error.message,
    });
  }
};


module.exports.getBesoinsRessourcesBySousDirection = async (req, res) => {
    const sousDirectionId = req.params.sousDirectionId;
  
    try {
      // On suppose que l'école a un champ `sousDirectionId` qui référence la sous-direction.
      const besoinsRessources = await BesoinRessource.find()
        .populate('ecoleId') // Peupler le champ ecoleId si nécessaire
        .then(async (besoins) => {
          // Filtrer les besoins en fonction de la sous-direction
          return besoins.filter(besoin => besoin.ecoleId.sousDirectionId.toString() === sousDirectionId);
        });
  
      return res.status(200).send({
        message: "Besoins en ressources récupérés avec succès pour la sous-direction",
        data: besoinsRessources,
      });
    } catch (error) {
      return res.status(500).send({
        message: "Erreur lors de la récupération des besoins en ressources pour la sous-direction",
        error: error.message,
      });
    }
  };
  