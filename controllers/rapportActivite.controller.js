const { RapportActivite } = require('../models/rapportActivite.model.js');

/**
 * @swagger
 * /rapport-activite:
 *   post:
 *     summary: Créer un nouveau rapport d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RapportActivite'
 *     responses:
 *       201:
 *         description: Rapport créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
const createRapportActivite = async (req, res) => {
  try {
    // Utiliser automatiquement la PROVED de l'utilisateur connecté
    const rapportData = {
      ...req.body,
      identificationProved: req.user._id // ID de la PROVED connectée
    };

    const rapport = new RapportActivite(rapportData);
    await rapport.save();

    // Populate l'identification de la PROVED
    await rapport.populate('identificationProved');

    res.status(201).json({
      success: true,
      message: 'Rapport d\'activités créé avec succès',
      data: rapport
    });
  } catch (error) {
    console.error('Erreur lors de la création du rapport:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du rapport',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /rapport-activite:
 *   get:
 *     summary: Récupérer tous les rapports d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: annee
 *         schema:
 *           type: integer
 *         description: Filtrer par année
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *         description: Filtrer par statut
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Filtrer par province
 *     responses:
 *       200:
 *         description: Liste des rapports récupérée avec succès
 *       401:
 *         description: Non autorisé
 */
const getAllRapportsActivite = async (req, res) => {
  try {
    const { page = 1, limit = 10, annee, statut, province } = req.query;
    const currentUser = req.user;
    
    console.log('🔍 Récupération des rapports pour l\'utilisateur:', currentUser._id);
    console.log('👤 Rôle de l\'utilisateur:', currentUser.role);
    console.log('👤 Type de l\'utilisateur:', currentUser.type);
    
    // Construire le filtre de base
    const filter = {};
    
    // Si l'utilisateur n'est pas admin, filtrer seulement ses rapports
    if (currentUser.role !== 'admin' && currentUser.type !== 'ADMIN') {
      console.log('🔒 Utilisateur non-admin, filtrage des rapports personnels');
      
      // Méthode 1: Chercher les rapports où identificationProved = userId (comme dans createRapportActivite)
      const rapportsDirects = await RapportActivite.find({ identificationProved: currentUser._id })
        .populate('identificationProved', 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt');
      
      console.log('📊 Rapports directs trouvés:', rapportsDirects.length);
      
      // Méthode 2: Chercher les identifications créées par l'utilisateur, puis les rapports associés
      const { IdentificationProved } = require('../models/identificationProved.model.js');
      const identifications = await IdentificationProved.find({ createdBy: currentUser._id }).select('_id provinceAdministrative createdBy');
      console.log('📋 Identifications créées par l\'utilisateur:', identifications.length);
      
      let rapportsViaIdentifications = [];
      if (identifications.length > 0) {
        const identificationIds = identifications.map(id => id._id);
        rapportsViaIdentifications = await RapportActivite.find({
          identificationProved: { $in: identificationIds }
        }).populate('identificationProved', 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt');
      }
      
      console.log('📊 Rapports via identifications trouvés:', rapportsViaIdentifications.length);
      
      // Combiner les deux méthodes et éliminer les doublons
      const tousLesRapports = [...rapportsDirects, ...rapportsViaIdentifications];
      const rapportsUniques = tousLesRapports.filter((rapport, index, self) => 
        index === self.findIndex(r => r._id.toString() === rapport._id.toString())
      );
      
      console.log('📊 Total des rapports uniques:', rapportsUniques.length);
      
      // Appliquer les filtres supplémentaires
      let rapportsFiltres = rapportsUniques;
      if (annee) {
        rapportsFiltres = rapportsFiltres.filter(rapport => rapport.annee === parseInt(annee));
      }
      if (statut) {
        rapportsFiltres = rapportsFiltres.filter(rapport => rapport.statut === statut);
      }
      if (province) {
        rapportsFiltres = rapportsFiltres.filter(rapport => 
          rapport.identificationProved && 
          rapport.identificationProved.provinceAdministrative && 
          rapport.identificationProved.provinceAdministrative.toLowerCase().includes(province.toLowerCase())
        );
      }
      
      console.log('📊 Rapports après filtres:', rapportsFiltres.length);
      
      // Pagination manuelle
      const totalDocs = rapportsFiltres.length;
      const totalPages = Math.ceil(totalDocs / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const docs = rapportsFiltres.slice(startIndex, endIndex);
      
      const result = {
        docs,
        totalDocs,
        limit: parseInt(limit),
        page: parseInt(page),
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      };
      
      res.status(200).json({
        success: true,
        message: 'Rapports d\'activités récupérés avec succès (utilisateur)',
        data: result,
        debug: {
          userId: currentUser._id,
          role: currentUser.role,
          type: currentUser.type,
          rapportsDirects: rapportsDirects.length,
          identificationsCount: identifications.length,
          rapportsViaIdentifications: rapportsViaIdentifications.length,
          totalRapports: tousLesRapports.length,
          rapportsUniques: rapportsUniques.length,
          rapportsFiltres: rapportsFiltres.length
        }
      });
      
    } else {
      console.log('👑 Utilisateur admin, récupération de tous les rapports');
      
      // Pour les admins, récupérer tous les rapports
      if (annee) filter.annee = parseInt(annee);
      if (statut) filter.statut = statut;
      if (province) {
        filter['identificationProved.provinceAdministrative'] = { $regex: province, $options: 'i' };
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: [
          { 
            path: 'identificationProved',
            select: 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt'
          }
        ]
      };

      const result = await RapportActivite.paginate(filter, options);

      res.status(200).json({
        success: true,
        message: 'Rapports d\'activités récupérés avec succès (admin)',
        data: result,
        debug: {
          userId: currentUser._id,
          role: currentUser.role,
          type: currentUser.type,
          filter,
          totalRapports: result.totalDocs
        }
      });
    }
    
  } catch (error) {
    console.error('Erreur lors de la récupération des rapports:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des rapports',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /rapport-activite/{id}:
 *   get:
 *     summary: Récupérer un rapport d'activités par ID
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     responses:
 *       200:
 *         description: Rapport récupéré avec succès
 *       404:
 *         description: Rapport non trouvé
 *       401:
 *         description: Non autorisé
 */
const getRapportActiviteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rapport = await RapportActivite.findById(id)
      .populate({
        path: 'identificationProved',
        select: 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt'
      });

    if (!rapport) {
      return res.status(404).json({
        success: false,
        message: 'Rapport d\'activités non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Rapport d\'activités récupéré avec succès',
      data: rapport
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du rapport:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du rapport',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /rapport-activite/{id}:
 *   put:
 *     summary: Mettre à jour un rapport d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RapportActivite'
 *     responses:
 *       200:
 *         description: Rapport mis à jour avec succès
 *       404:
 *         description: Rapport non trouvé
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
const updateRapportActivite = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body
    };

    const rapport = await RapportActivite.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate({
      path: 'identificationProved',
      select: 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt'
    });

    if (!rapport) {
      return res.status(404).json({
        success: false,
        message: 'Rapport d\'activités non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Rapport d\'activités mis à jour avec succès',
      data: rapport
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rapport:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du rapport',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /rapport-activite/{id}:
 *   delete:
 *     summary: Supprimer un rapport d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     responses:
 *       200:
 *         description: Rapport supprimé avec succès
 *       404:
 *         description: Rapport non trouvé
 *       401:
 *         description: Non autorisé
 */
const deleteRapportActivite = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rapport = await RapportActivite.findByIdAndDelete(id);

    if (!rapport) {
      return res.status(404).json({
        success: false,
        message: 'Rapport d\'activités non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Rapport d\'activités supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du rapport:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du rapport',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /rapport-activite/{id}/statut:
 *   patch:
 *     summary: Changer le statut d'un rapport d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [brouillon, soumis, approuve, rejete]
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       404:
 *         description: Rapport non trouvé
 *       400:
 *         description: Statut invalide
 *       401:
 *         description: Non autorisé
 */
const updateStatutRapport = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!['brouillon', 'soumis', 'approuve', 'rejete'].includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const rapport = await RapportActivite.findByIdAndUpdate(
      id,
      { 
        statut
      },
      { new: true }
    ).populate({
      path: 'identificationProved',
      select: 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt'
    });

    if (!rapport) {
      return res.status(404).json({
        success: false,
        message: 'Rapport d\'activités non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Statut du rapport mis à jour avec succès',
      data: rapport
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /rapport-activite/statistiques:
 *   get:
 *     summary: Obtenir les statistiques des rapports d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: annee
 *         schema:
 *           type: integer
 *         description: Année pour les statistiques
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *       401:
 *         description: Non autorisé
 */
const getStatistiquesRapports = async (req, res) => {
  try {
    const { annee } = req.query;
    const filter = annee ? { annee: parseInt(annee) } : {};

    const [
      totalRapports,
      rapportsParStatut,
      rapportsParProvince,
      rapportsParAnnee
    ] = await Promise.all([
      RapportActivite.countDocuments(filter),
      RapportActivite.aggregate([
        { $match: filter },
        { $group: { _id: '$statut', count: { $sum: 1 } } }
      ]),
      RapportActivite.aggregate([
        { $match: filter },
        { $group: { _id: '$identification.provinceAdministrative', count: { $sum: 1 } } }
      ]),
      RapportActivite.aggregate([
        { $match: filter },
        { $group: { _id: '$annee', count: { $sum: 1 } } },
        { $sort: { _id: -1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      message: 'Statistiques récupérées avec succès',
      data: {
        totalRapports,
        rapportsParStatut,
        rapportsParProvince,
        rapportsParAnnee
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /rapport-activite/{id}/export:
 *   get:
 *     summary: Exporter un rapport d'activités en PDF
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     responses:
 *       200:
 *         description: Rapport exporté avec succès
 *       404:
 *         description: Rapport non trouvé
 *       401:
 *         description: Non autorisé
 */
const exportRapportPDF = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rapport = await RapportActivite.findById(id)
      .populate({
        path: 'identificationProved',
        select: 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt'
      });

    if (!rapport) {
      return res.status(404).json({
        success: false,
        message: 'Rapport d\'activités non trouvé'
      });
    }

    // Ici vous pouvez intégrer une bibliothèque comme PDFKit ou Puppeteer
    // pour générer le PDF basé sur le canevas fourni
    
    res.status(200).json({
      success: true,
      message: 'Fonctionnalité d\'export PDF à implémenter',
      data: rapport
    });
  } catch (error) {
    console.error('Erreur lors de l\'export du rapport:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export du rapport',
      error: error.message
    });
  }
};

module.exports = {
  createRapportActivite,
  getAllRapportsActivite,
  getRapportActiviteById,
  updateRapportActivite,
  deleteRapportActivite,
  updateStatutRapport,
  getStatistiquesRapports,
  exportRapportPDF
}; 