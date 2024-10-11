const bcrypt = require("bcrypt");

const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.signUp = async (req, res) => {
  const password = await bcrypt.hash(req.body.password, 10);

  const { phone, nom, postnom, prenom, photo, email, role, direction, service } = req.body;

  // Vérification du rôle soumis
  const validRoles = ['Administrateur', 'Utilisateur', 'Superviseur', 'Inspecteur', 'Décideur'];
  if (!validRoles.includes(role)) {
    return res.status(400).send({
      message: `Le rôle doit être parmi les suivants : ${validRoles.join(', ')}`
    });
  }

  // Vérification si le numéro de téléphone existe déjà
  const numberExist = await User.findOne({ phone: phone });
  if (numberExist) {
    return res.status(400).send({
      message: "Ce numéro de téléphone existe déjà"
    });
  }

  // Vérification si l'email existe déjà
  const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    return res.status(400).send({
      message: 'Cet email existe déjà'
    });
  }

  try {
    // Création d'un nouvel utilisateur
    const user = new User({
      password,
      phone,
      nom,
      postnom,
      prenom,
      photo,
      email,
      role,
      direction,
      service
    });

    const result = await user.save();

    // Génération du token JWT
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
  const email = req.body.email;
  console.log(req.body);
  const checkEmail = await User.findOne({ email: email });
  console.log(checkEmail);
  if (checkEmail) {
    const checkPassword = await bcrypt.compare(password, checkEmail.password);
    if (checkPassword) {
      return res.status(200).send({
        message: "User login Successfully",
        data: checkEmail,
        token: jwt.sign(
          { name: checkEmail.name, phone: checkEmail.phone, _id: checkEmail._id },
          "RESTFULAPIs"
        ),
      });

    } else {
      return res.status(400).send({ message: "Numéro de téléphone ou mot de passe incorrecte" });

    }
  } else {
    return res.status(400).send({ message: "Numéro de téléphone ou mot de passe incorrecte" });
  }
};

module.exports.hello = async (req, res) => {

  return res.status(200).send({
    message: "Api Rest EDU-NC"
  });
};


