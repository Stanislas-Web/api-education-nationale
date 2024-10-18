const { Service } = require('../models/service.model');


module.exports.createService = async (req, res) => {
  const { nom, type, idDirection, idSousDirection } = req.body;

  try {
    if (type === 'direction' && !idDirection) {
      return res.status(400).send({
        message: "Le champ idDirection est requis pour un service de type 'direction'."
      });
    }

    if (type === 'sousDirection' && !idSousDirection) {
      return res.status(400).send({
        message: "Le champ idSousDirection est requis pour un service de type 'sousDirection'."
      });
    }

    // Création du service
    const service = new Service({ nom, type, idDirection, idSousDirection });
    const result = await service.save();

    return res.status(201).send({
      message: "Service créé avec succès",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la création du service",
      error: error.message,
    });
  }
};


module.exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate('idDirection')
      .populate('idSousDirection');

    return res.status(200).send({
      message: "Liste des services récupérée avec succès",
      data: services,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des services",
      error: error.message,
    });
  }
};

module.exports.updateService = async (req, res) => {
  const serviceId = req.params.id;
  const updateData = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(serviceId, updateData, { new: true });

    if (!updatedService) {
      return res.status(404).send({
        message: "Service non trouvé",
      });
    }

    return res.status(200).send({
      message: "Service mis à jour avec succès",
      data: updatedService,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la mise à jour du service",
      error: error.message,
    });
  }
};


module.exports.deleteService = async (req, res) => {
  const serviceId = req.params.id;

  try {
    const deletedService = await Service.findByIdAndDelete(serviceId);

    if (!deletedService) {
      return res.status(404).send({
        message: "Service non trouvé",
      });
    }

    return res.status(200).send({
      message: "Service supprimé avec succès",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la suppression du service",
      error: error.message,
    });
  }
};
