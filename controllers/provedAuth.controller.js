const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { IdentificationProved } = require('../models/identificationProved.model');

/**
 * @swagger
 * components:
 *   schemas:
 *     ProvedLogin:
 *       type: object
 *       required:
 *         - identifier
 *         - motDePasse
 *       properties:
 *         identifier:
 *           type: string
 *           description: Email professionnel ou téléphone de la PROVED
 *         motDePasse:
 *           type: string
 *           description: Mot de passe de la PROVED
 */

// Login pour les PROVED
module.exports.provedLogin = async (req, res) => {
  try {
    const { identifier, motDePasse } = req.body;

    // Validation des données d'entrée
    if (!identifier || !motDePasse) {
      return res.status(400).send({
        message: "L'identifiant et le mot de passe sont requis"
      });
    }

    console.log('Tentative de connexion PROVED:', { identifier });

    // Rechercher la PROVED par email professionnel ou téléphone
    const proved = await IdentificationProved.findOne({
      $or: [
        { emailProfessionnel: identifier },
        { telephone: identifier }
      ],
      isActive: true
    });

    console.log('PROVED trouvée:', proved ? 'Oui' : 'Non');
    if (proved) {
      console.log('PROVED ID:', proved._id);
      console.log('Email:', proved.emailProfessionnel);
      console.log('Téléphone:', proved.telephone);
      console.log('Mot de passe hashé:', proved.motDePasse ? 'Existe' : 'N\'existe pas');
    }

    if (!proved) {
      return res.status(400).send({
        message: "Identifiant ou mot de passe incorrect"
      });
    }

    // Vérifier que le mot de passe existe
    if (!proved.motDePasse) {
      return res.status(400).send({
        message: "Identifiant ou mot de passe incorrect"
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(motDePasse, proved.motDePasse);
    
    if (!isPasswordValid) {
      return res.status(400).send({
        message: "Identifiant ou mot de passe incorrect"
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      {
        _id: proved._id,
        provinceAdministrative: proved.provinceAdministrative,
        provinceEducationnelle: proved.provinceEducationnelle,
        directeurProvincial: proved.directeurProvincial,
        type: 'PROVED'
      },
      "RESTFULAPIs",
      { expiresIn: '24h' }
    );

    // Retourner la réponse sans le mot de passe
    const provedData = proved.toObject();
    delete provedData.motDePasse;

    return res.status(200).send({
      message: "Connexion PROVED réussie",
      data: provedData,
      token: token
    });

  } catch (error) {
    console.error('Erreur lors de la connexion PROVED:', error);
    return res.status(500).send({
      message: "Une erreur est survenue lors de la connexion",
      error: error.message
    });
  }
};

// Vérifier le token PROVED
module.exports.verifyProvedToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).send({
        message: "Token d'authentification manquant"
      });
    }

    const decoded = jwt.verify(token, "RESTFULAPIs");
    
    if (decoded.type !== 'PROVED') {
      return res.status(401).send({
        message: "Token invalide pour les PROVED"
      });
    }

    const proved = await IdentificationProved.findById(decoded._id).select('-motDePasse');
    
    if (!proved || !proved.isActive) {
      return res.status(401).send({
        message: "PROVED non trouvée ou inactive"
      });
    }

    return res.status(200).send({
      message: "Token PROVED valide",
      data: proved
    });

  } catch (error) {
    return res.status(401).send({
      message: "Token invalide ou expiré",
      error: error.message
    });
  }
};

// Changer le mot de passe PROVED
module.exports.changeProvedPassword = async (req, res) => {
  try {
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;
    const provedId = req.user._id; // Depuis le middleware d'authentification

    if (!ancienMotDePasse || !nouveauMotDePasse) {
      return res.status(400).send({
        message: "L'ancien et le nouveau mot de passe sont requis"
      });
    }

    if (nouveauMotDePasse.length < 6) {
      return res.status(400).send({
        message: "Le nouveau mot de passe doit contenir au moins 6 caractères"
      });
    }

    const proved = await IdentificationProved.findById(provedId);
    
    if (!proved) {
      return res.status(404).send({
        message: "PROVED non trouvée"
      });
    }

    // Vérifier l'ancien mot de passe
    const isOldPasswordValid = await bcrypt.compare(ancienMotDePasse, proved.motDePasse);
    
    if (!isOldPasswordValid) {
      return res.status(400).send({
        message: "L'ancien mot de passe est incorrect"
      });
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(nouveauMotDePasse, 10);
    
    // Mettre à jour le mot de passe
    proved.motDePasse = hashedNewPassword;
    await proved.save();

    return res.status(200).send({
      message: "Mot de passe modifié avec succès"
    });

  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    return res.status(500).send({
      message: "Une erreur est survenue lors du changement de mot de passe",
      error: error.message
    });
  }
};

// Récupérer le profil PROVED
module.exports.getProvedProfile = async (req, res) => {
  try {
    const provedId = req.user._id;
    
    const proved = await IdentificationProved.findById(provedId).select('-motDePasse');
    
    if (!proved) {
      return res.status(404).send({
        message: "PROVED non trouvée"
      });
    }

    return res.status(200).send({
      message: "Profil PROVED récupéré avec succès",
      data: proved
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return res.status(500).send({
      message: "Une erreur est survenue lors de la récupération du profil",
      error: error.message
    });
  }
};

// Récupérer toutes les PROVED
module.exports.getAllProved = async (req, res) => {
  try {
    const { isActive } = req.query;
    
    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const provedList = await IdentificationProved.find(filter)
      .select('-motDePasse')
      .sort({ createdAt: -1 });

    return res.status(200).send({
      message: "Liste des PROVED récupérée avec succès",
      count: provedList.length,
      data: provedList
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des PROVED:', error);
    return res.status(500).send({
      message: "Une erreur est survenue lors de la récupération des PROVED",
      error: error.message
    });
  }
}; 