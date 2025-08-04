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
    
    // Construire le filtre
    const filter = {};
    if (annee) filter.annee = parseInt(annee);
    if (statut) filter.statut = statut;
    if (province) {
      filter['identification.provinceAdministrative'] = { $regex: province, $options: 'i' };
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
      message: 'Rapports d\'activités récupérés avec succès',
      data: result
    });
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