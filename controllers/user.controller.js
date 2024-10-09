const bcrypt = require("bcrypt");

const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.signUp = async (req, res) => {
  const password = await bcrypt.hash(req.body.password, 10);

  const { phone, nom, postnom, prenom, photo, email, role, direction, service } = req.body;


  const numberExist = await User.findOne({ number: number });
  const emailExist = await User.findOne({ email: email });

  if (numberExist) {
    return res.status(400).send({
      message: "ce numéro de télephone existe déjà "
    });
  } else if (emailExist) {
    return res.status(400).send({
      message: 'ce courriel existe déjà'
    });

  } else {
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

    return res.status(200).send({
      message: "User Registration Successfully",
      data: result,
      token: jwt.sign(
        { nom: result.nom, postnom: result.postnom, prenom: result.prenom, phone: result.phone, _id: result._id },
        "RESTFULAPIs"
      ),
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
    message: "Api Rest Bantou - store"
  });
};


