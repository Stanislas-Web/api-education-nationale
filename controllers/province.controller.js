const bcrypt = require("bcrypt");

const { Province } = require("../models/province.model");
const jwt = require("jsonwebtoken");

module.exports.createProvince = async (req, res) => {


  const { nom } = req.body;



  try {
    // Création d'un nouvel utilisateur
    const province = new Province({
      nom,
    });

    const result = await province.save();

    return res.status(201).send({
      message: "creation de la province réussie",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Une erreur est survenue lors de la creation",
      error: error.message
    });
  }
};


module.exports.getAllProvinces = async (req, res) => {

  try {
    const provinces = await Province.find();

    return res.status(200).send({
      message: "get all Provinces",
      data: provinces,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Une erreur est survenue lors du get all provinces",
      error: error.message
    });
  }
};


module.exports.updateprovince = async (req, res) => {
  const provinceId = req.params.id;
  const updateData = req.body;

  try {
    const updatedprovince = await Province.findByIdAndUpdate(provinceId, updateData, { new: true });

    if (!updatedprovince) {
      return res.status(404).send({
        message: "Province non trouvé",
      });
    }

    return res.status(200).send({
      message: "Province mise à jour avec succès",
      data: updatedprovince,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Une erreur est survenue lors de la mise à jour de la province",
      error: error.message,
    });
  }
};


module.exports.deleteprovince = async (req, res) => {
  const provinceId = req.params.id;

  try {
    const deletedprovince = await Province.findByIdAndDelete(provinceId);

    if (!deletedprovince) {
      return res.status(404).send({
        message: "Province non trouvée",
      });
    }

    return res.status(200).send({
      message: "Province supprimé avec succès",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Une erreur est survenue lors de la suppression de la privince",
      error: error.message,
    });
  }
};




