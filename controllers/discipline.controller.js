const {Discipline} = require('../models/discipline.model'); // Assurez-vous que le chemin est correct

module.exports.createDiscipline = async (req, res) => {
  const { nom } = req.body;

  try {
    const discipline = new Discipline({ nom });
    const result = await discipline.save();

    return res.status(201).send({
      message: "Discipline créée avec succès",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la création de la discipline",
      error: error.message,
    });
  }
};

module.exports.getAllDisciplines = async (req, res) => {
  try {
    const disciplines = await Discipline.find();

    return res.status(200).send({
      message: "Liste des disciplines récupérée avec succès",
      data: disciplines,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération des disciplines",
      error: error.message,
    });
  }
};

module.exports.getDisciplineById = async (req, res) => {
  const disciplineId = req.params.id;

  try {
    const discipline = await Discipline.findById(disciplineId);

    if (!discipline) {
      return res.status(404).send({
        message: "Discipline non trouvée",
      });
    }

    return res.status(200).send({
      message: "Discipline récupérée avec succès",
      data: discipline,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la récupération de la discipline",
      error: error.message,
    });
  }
};

module.exports.updateDiscipline = async (req, res) => {
  const disciplineId = req.params.id;
  const updateData = req.body;

  try {
    const updatedDiscipline = await Discipline.findByIdAndUpdate(disciplineId, updateData, { new: true });

    if (!updatedDiscipline) {
      return res.status(404).send({
        message: "Discipline non trouvée",
      });
    }

    return res.status(200).send({
      message: "Discipline mise à jour avec succès",
      data: updatedDiscipline,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la mise à jour de la discipline",
      error: error.message,
    });
  }
};

module.exports.deleteDiscipline = async (req, res) => {
  const disciplineId = req.params.id;

  try {
    const deletedDiscipline = await Discipline.findByIdAndDelete(disciplineId);

    if (!deletedDiscipline) {
      return res.status(404).send({
        message: "Discipline non trouvée",
      });
    }

    return res.status(200).send({
      message: "Discipline supprimée avec succès",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Erreur lors de la suppression de la discipline",
      error: error.message,
    });
  }
};
