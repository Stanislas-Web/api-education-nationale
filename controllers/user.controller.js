const bcrypt = require("bcrypt");
const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const path = require('path');

module.exports.uploadUserPhoto = async (req, res) => {
  const userId = req.params.id;

  // Vérifier si un fichier a été téléchargé
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier n\'a été téléchargé' });
  }

  try {
    // Récupérer l'URL de l'image stockée localement
    const imageUrl = `/uploads/${req.file.filename}`;

    // Mettre à jour l'utilisateur avec l'URL de l'image
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { photo: imageUrl }, // Enregistrer le chemin de l'image dans la base de données
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    return res.status(200).json({
      message: 'Image téléchargée avec succès',
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Fonction pour afficher l'image de l'utilisateur
module.exports.getUserPhoto = (req, res) => {
  const { id } = req.params;

  User.findById(id, (err, user) => {
    if (err || !user || !user.photo) {
      return res.status(404).json({ message: 'Utilisateur ou photo non trouvée' });
    }

    // Retourner simplement le chemin de l'image
    const imageUrl = `${user.photo}`;
    return res.status(200).json({ imagePath: imageUrl });
  });
};


module.exports.signUp = async (req, res) => {
  const password = await bcrypt.hash(req.body.password, 10);

  const { phone, nom, postnom, prenom, photo, email, role, direction, service, fonction, grade, provinces, sousDirection, niveauOuDiscipline } = req.body;

  const validRoles = ['Administrateur', 'Utilisateur', 'Superviseur', 'Inspecteur', 'Décideur'];
  if (!validRoles.includes(role)) {
    return res.status(400).send({
      message: `Le rôle doit être parmi les suivants : ${validRoles.join(', ')}`
    });
  }

  const numberExist = await User.findOne({ phone: phone });
  if (numberExist) {
    return res.status(400).send({ message: "Ce numéro de téléphone existe déjà" });
  }

  const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    return res.status(400).send({ message: 'Cet email existe déjà' });
  }

  try {
    const user = new User({
      password,
      phone,
      nom,
      postnom,
      prenom,
      photo: "/uploads/default.jpg",
      email,
      role,
      fonction,
      grade,
      direction,
      sousDirection,
      service,
      provinces,
      niveauOuDiscipline
    });

    const result = await user.save();

    const token = jwt.sign(
      {
        nom: result.nom,
        postnom: result.postnom,
        prenom: result.prenom,
        phone: result.phone,
        _id: result._id,
      },
      "RESTFULAPIs"
    );

    return res.status(201).send({
      message: "Inscription réussie",
      data: result,
      token: token
    });
  } catch (error) {
    return res.status(500).send({
      message: "Une erreur est survenue lors de l'inscription",
      error: error.message
    });
  }
};

module.exports.login = async (req, res) => {
  const password = req.body.password;
  const identifier = req.body.email; // Utiliser le même champ pour email ou téléphone

  console.log(req.body);

  const checkUser = await User.findOne({
    $or: [
      { email: identifier },
      { phone: identifier }
    ]
  }).populate('direction')
    .populate('sousDirection')
    .populate('service');

  console.log(checkUser);

  if (checkUser) {
    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (checkPassword) {
      return res.status(200).send({
        message: "User login Successfully",
        data: checkUser,
        token: jwt.sign(
          { name: checkUser.name, phone: checkUser.phone, _id: checkUser._id },
          "RESTFULAPIs"
        ),
      });
    } else {
      return res.status(400).send({ message: "Numéro de téléphone ou mot de passe incorrect" });
    }
  } else {
    return res.status(400).send({ message: "Numéro de téléphone ou mot de passe incorrect" });
  }
};


// Récupérer tous les utilisateurs
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate('direction')
      .populate('sousDirection')
      .populate('service');
    return res.status(200).send({
      message: "get all users",
      data: users,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Une erreur est survenue lors du get all users",
      error: error.message
    });
  }
};

module.exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).send({
        message: "Utilisateur non trouvé",
      });
    }

    return res.status(201).send({
      message: "Utilisateur mis à jour avec succès",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Une erreur est survenue lors de la mise à jour de l'utilisateur",
      error: error.message,
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send({
        message: "Utilisateur non trouvé",
      });
    }

    return res.status(200).send({
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Une erreur est survenue lors de la suppression de l'utilisateur",
      error: error.message,
    });
  }
};

module.exports.toggleUserStatus = async (req, res) => {
  const userId = req.params.id;
  const { action } = req.body;

  try {
    const isActive = action === 'enable' ? true : false;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({
        message: "Utilisateur non trouvé",
      });
    }

    const message = isActive
      ? "Utilisateur activé avec succès"
      : "Utilisateur désactivé avec succès";

    return res.status(200).send({
      message,
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Une erreur est survenue lors de la mise à jour du statut de l'utilisateur",
      error: error.message,
    });
  }
};

