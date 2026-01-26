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
        { telephone: identifier },
        { motDePasse: motDePasse }
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
        role: proved.role,
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
    // Vérifier que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).send({
        message: "Utilisateur non authentifié"
      });
    }
    
    const provedId = req.user._id;
    const userRole = req.user.role;
    
    console.log('Récupération du profil PROVED:', { provedId, userRole });
    
    const proved = await IdentificationProved.findById(provedId)
      .select('-motDePasse')
      .populate('createdBy', 'nom prenom email')
      .populate('updatedBy', 'nom prenom email');
    
    if (!proved) {
      return res.status(404).send({
        message: "PROVED non trouvée"
      });
    }

    return res.status(200).send({
      message: "Profil PROVED récupéré avec succès",
      userRole: userRole,
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
    
    // Vérifier que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).send({
        message: "Utilisateur non authentifié"
      });
    }
    
    const userRole = req.user.role;
    const userId = req.user._id;
    
    console.log('Utilisateur connecté:', { role: userRole, id: userId });
    
    const filter = {};
    
    // Filtre par statut actif si spécifié
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    // Si l'utilisateur n'est pas admin, il ne voit que les PROVED qu'il a créées
    if (userRole !== 'admin') {
      filter.createdBy = userId;
      console.log('Filtre appliqué: PROVED créées par l\'utilisateur');
    } else {
      console.log('Admin: accès à toutes les PROVED');
    }

    const provedList = await IdentificationProved.find(filter)
      .select('-motDePasse')
      .populate('createdBy', 'nom prenom email')
      .populate('updatedBy', 'nom prenom email')
      .sort({ createdAt: -1 });

    return res.status(200).send({
      message: userRole === 'admin' 
        ? "Liste de toutes les PROVED récupérée avec succès" 
        : "Liste de vos PROVED récupérée avec succès",
      count: provedList.length,
      userRole: userRole,
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

// Créer une nouvelle PROVED (admin seulement)
module.exports.createProved = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).send({
        message: "Utilisateur non authentifié"
      });
    }
    
    const userRole = req.user.role;
    const userId = req.user._id;
    
    console.log('Tentative de création PROVED:', { userRole, userId });
    
    // Vérifier que l'utilisateur est admin
    if (userRole !== 'admin') {
      return res.status(403).send({
        message: "Accès refusé. Seuls les administrateurs peuvent créer des PROVED"
      });
    }

    const { motDePasse, ...provedData } = req.body;

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    // Créer la nouvelle PROVED
    const newProved = new IdentificationProved({
      ...provedData,
      motDePasse: hashedPassword,
      role: 'user', // Par défaut, les nouvelles PROVED sont des utilisateurs
      createdBy: userId,
      updatedBy: userId
    });

    await newProved.save();

    // Populate les informations de l'admin créateur
    await newProved.populate('createdBy', 'nom prenom email');
    await newProved.populate('updatedBy', 'nom prenom email');

    // Retourner la réponse sans le mot de passe
    const provedResponse = newProved.toObject();
    delete provedResponse.motDePasse;

    return res.status(201).send({
      message: "PROVED créée avec succès",
      createdBy: req.user,
      data: provedResponse
    });

  } catch (error) {
    console.error('Erreur lors de la création de la PROVED:', error);
    return res.status(500).send({
      message: "Une erreur est survenue lors de la création de la PROVED",
      error: error.message
    });
  }
};

// Mettre à jour une PROVED (admin seulement)
module.exports.updateProved = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).send({
        message: "Accès refusé. Seuls les administrateurs peuvent modifier des PROVED"
      });
    }

    const { id } = req.params;
    const updateData = { ...req.body, updatedBy: req.user._id };

    // Si un nouveau mot de passe est fourni, le hasher
    if (updateData.motDePasse) {
      updateData.motDePasse = await bcrypt.hash(updateData.motDePasse, 10);
    }

    const proved = await IdentificationProved.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-motDePasse');

    if (!proved) {
      return res.status(404).send({
        message: "PROVED non trouvée"
      });
    }

    return res.status(200).send({
      message: "PROVED mise à jour avec succès",
      data: proved
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la PROVED:', error);
    return res.status(500).send({
      message: "Une erreur est survenue lors de la mise à jour de la PROVED",
      error: error.message
    });
  }
};

// Supprimer une PROVED (admin seulement)
module.exports.deleteProved = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).send({
        message: "Accès refusé. Seuls les administrateurs peuvent supprimer des PROVED"
      });
    }

    const { id } = req.params;

    const proved = await IdentificationProved.findByIdAndDelete(id);

    if (!proved) {
      return res.status(404).send({
        message: "PROVED non trouvée"
      });
    }

    return res.status(200).send({
      message: "PROVED supprimée avec succès"
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la PROVED:', error);
    return res.status(500).send({
      message: "Une erreur est survenue lors de la suppression de la PROVED",
      error: error.message
    });
  }
}; 