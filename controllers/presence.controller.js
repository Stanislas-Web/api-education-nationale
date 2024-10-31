const Presence = require('../models/presence.model');

// Create a new attendance record
module.exports.createPresence = async (req, res) => {
  const { date, eleveId, personnelId, present } = req.body;

  try {
    const presence = new Presence({ date, eleveId, personnelId, present });
    const result = await presence.save();

    return res.status(201).send({
      message: "Présence enregistrée avec succès",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de l'enregistrement de la présence",
      error: error.message,
    });
  }
};

// Get all attendance records
module.exports.getAllPresences = async (req, res) => {
  try {
    const presences = await Presence.find()
      .populate('eleveId')
      .populate('personnelId');

    return res.status(200).send({
      message: "Liste des présences récupérée avec succès",
      data: presences,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des présences",
      error: error.message,
    });
  }
};

// Get attendance by student ID
module.exports.getPresenceByEleveId = async (req, res) => {
  const { id } = req.params;

  try {
    const presences = await Presence.find({ eleveId: id });

    if (!presences.length) {
      return res.status(404).send({
        message: "Aucune présence trouvée pour cet élève",
      });
    }

    return res.status(200).send({
      message: "Présences récupérées avec succès",
      data: presences,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des présences",
      error: error.message,
    });
  }
};

// Update an attendance record
module.exports.updatePresence = async (req, res) => {
  const presenceId = req.params.id;
  const updateData = req.body;

  try {
    const updatedPresence = await Presence.findByIdAndUpdate(presenceId, updateData, { new: true });

    if (!updatedPresence) {
      return res.status(404).send({
        message: "Présence non trouvée",
      });
    }

    return res.status(200).send({
      message: "Présence mise à jour avec succès",
      data: updatedPresence,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la mise à jour de la présence",
      error: error.message,
    });
  }
};

// Delete an attendance record
module.exports.deletePresence = async (req, res) => {
  const presenceId = req.params.id;

  try {
    const deletedPresence = await Presence.findByIdAndDelete(presenceId);

    if (!deletedPresence) {
      return res.status(404).send({
        message: "Présence non trouvée",
      });
    }

    return res.status(200).send({
      message: "Présence supprimée avec succès",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la suppression de la présence",
      error: error.message,
    });
  }
};

// Get attendance by personnel ID
module.exports.getPresenceByPersonnelId = async (req, res) => {
  const { id } = req.params;

  try {
    const presences = await Presence.find({ personnelId: id });

    if (!presences.length) {
      return res.status(404).send({
        message: "Aucune présence trouvée pour ce personnel",
      });
    }

    return res.status(200).send({
      message: "Présences récupérées avec succès",
      data: presences,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des présences",
      error: error.message,
    });
  }
};
