const { FicheAutoEvaluation } = require('../models/ficheAutoEvaluation.model.js');

/**
 * @swagger
 * /fiche-auto-evaluation:
 *   post:
 *     summary: Créer une nouvelle fiche d'auto-évaluation quotidienne
 *     tags: [FicheAutoEvaluation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FicheAutoEvaluation'
 *     responses:
 *       201:
 *         description: Fiche créée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
const createFicheAutoEvaluation = async (req, res) => {
  try {
    const currentUser = req.user;
    
    // Chercher l'IdentificationProved créée par cet utilisateur
    const { IdentificationProved } = require('../models/identificationProved.model.js');
    const identificationProved = await IdentificationProved.findOne({ createdBy: currentUser._id });
    
    if (!identificationProved) {
      return res.status(400).json({
        success: false,
        message: 'Aucune PROVED trouvée pour cet utilisateur. Veuillez d\'abord créer une PROVED.'
      });
    }
    
    // Utiliser l'ID de l'IdentificationProved trouvée
    const ficheData = {
      intituleFormation: req.body.intituleFormation,
      contenuComprehension: req.body.contenuComprehension,
      participationImplication: req.body.participationImplication,
      pertinenceUtilite: req.body.pertinenceUtilite,
      suggestionsCommentaires: req.body.suggestionsCommentaires,
      identificationProved: identificationProved._id
    };

    const fiche = new FicheAutoEvaluation(ficheData);
    await fiche.save();

    // Populate l'identification de la PROVED
    await fiche.populate('identificationProved');

    res.status(201).json({
      success: true,
      message: 'Fiche d\'auto-évaluation créée avec succès',
      data: fiche
    });
  } catch (error) {
    console.error('Erreur lors de la création de la fiche:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création de la fiche',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /fiche-auto-evaluation:
 *   get:
 *     summary: Récupérer toutes les fiches d'auto-évaluation
 *     tags: [FicheAutoEvaluation]
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
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *         description: Filtrer par statut
 *       - in: query
 *         name: provenance
 *         schema:
 *           type: string
 *           enum: ['Proved', 'IPP']
 *         description: Filtrer par provenance
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Filtrer par province
 *     responses:
 *       200:
 *         description: Liste des fiches récupérée avec succès
 *       401:
 *         description: Non autorisé
 */
const getAllFichesAutoEvaluation = async (req, res) => {
  try {
    const { page = 1, limit = 10, date, statut, provenance, province } = req.query;
    const currentUser = req.user;
    
    console.log('🔍 Récupération des fiches pour l\'utilisateur:', currentUser._id);
    console.log('👤 Rôle de l\'utilisateur:', currentUser.role);
    console.log('👤 Type de l\'utilisateur:', currentUser.type);
    
    // Construire le filtre de base
    const filter = {};
    
    // Si l'utilisateur n'est pas admin, filtrer seulement ses fiches
    if (currentUser.role !== 'admin' && currentUser.type !== 'ADMIN') {
      console.log('🔒 Utilisateur non-admin, filtrage des fiches personnelles');
      
      // Méthode 1: Chercher les fiches où identificationProved = userId
      const fichesDirectes = await FicheAutoEvaluation.find({ identificationProved: currentUser._id })
        .populate('identificationProved', 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt');
      
      console.log('📊 Fiches directes trouvées:', fichesDirectes.length);
      
      // Méthode 2: Chercher les identifications créées par l'utilisateur, puis les fiches associées
      const { IdentificationProved } = require('../models/identificationProved.model.js');
      const identifications = await IdentificationProved.find({ createdBy: currentUser._id }).select('_id provinceAdministrative createdBy');
      console.log('📋 Identifications créées par l\'utilisateur:', identifications.length);
      
      let fichesViaIdentifications = [];
      if (identifications.length > 0) {
        const identificationIds = identifications.map(id => id._id);
        fichesViaIdentifications = await FicheAutoEvaluation.find({
          identificationProved: { $in: identificationIds }
        }).populate('identificationProved', 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt');
      }
      
      console.log('📊 Fiches via identifications trouvées:', fichesViaIdentifications.length);
      
      // Combiner les deux méthodes et éliminer les doublons
      const toutesLesFiches = [...fichesDirectes, ...fichesViaIdentifications];
      const fichesUniques = toutesLesFiches.filter((fiche, index, self) => 
        index === self.findIndex(f => f._id.toString() === fiche._id.toString())
      );
      
      console.log('📊 Total des fiches uniques:', fichesUniques.length);
      
      // Appliquer les filtres supplémentaires
      let fichesFiltrees = fichesUniques;
      if (date) {
        const dateFilter = new Date(date);
        fichesFiltrees = fichesFiltrees.filter(fiche => 
          fiche.createdAt.toDateString() === dateFilter.toDateString()
        );
      }
      if (statut) {
        fichesFiltrees = fichesFiltrees.filter(fiche => fiche.statut === statut);
      }
      if (provenance) {
        fichesFiltrees = fichesFiltrees.filter(fiche => fiche.provenance === provenance);
      }
      if (province) {
        fichesFiltrees = fichesFiltrees.filter(fiche => 
          fiche.identificationProved && 
          fiche.identificationProved.provinceAdministrative && 
          fiche.identificationProved.provinceAdministrative.toLowerCase().includes(province.toLowerCase())
        );
      }
      
      console.log('📊 Fiches après filtres:', fichesFiltrees.length);
      
      // Pagination manuelle
      const totalDocs = fichesFiltrees.length;
      const totalPages = Math.ceil(totalDocs / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const docs = fichesFiltrees.slice(startIndex, endIndex);
      
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
        message: 'Fiches d\'auto-évaluation récupérées avec succès (utilisateur)',
        data: result,
        debug: {
          userId: currentUser._id,
          role: currentUser.role,
          type: currentUser.type,
          fichesDirectes: fichesDirectes.length,
          identificationsCount: identifications.length,
          fichesViaIdentifications: fichesViaIdentifications.length,
          totalFiches: toutesLesFiches.length,
          fichesUniques: fichesUniques.length,
          fichesFiltrees: fichesFiltrees.length
        }
      });
      
    } else {
      console.log('👑 Utilisateur admin, récupération de toutes les fiches');
      
      // Pour les admins, récupérer toutes les fiches
      if (date) {
        const dateFilter = new Date(date);
        filter.createdAt = {
          $gte: new Date(dateFilter.setHours(0, 0, 0, 0)),
          $lt: new Date(dateFilter.setHours(23, 59, 59, 999))
        };
      }
      if (statut) filter.statut = statut;
      if (provenance) filter.provenance = provenance;
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

      const result = await FicheAutoEvaluation.paginate(filter, options);

      res.status(200).json({
        success: true,
        message: 'Fiches d\'auto-évaluation récupérées avec succès (admin)',
        data: result,
        debug: {
          userId: currentUser._id,
          role: currentUser.role,
          type: currentUser.type,
          filter,
          totalFiches: result.totalDocs
        }
      });
    }
    
  } catch (error) {
    console.error('Erreur lors de la récupération des fiches:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des fiches',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /fiche-auto-evaluation/{id}:
 *   get:
 *     summary: Récupérer une fiche d'auto-évaluation par ID
 *     tags: [FicheAutoEvaluation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la fiche
 *     responses:
 *       200:
 *         description: Fiche récupérée avec succès
 *       404:
 *         description: Fiche non trouvée
 *       401:
 *         description: Non autorisé
 */
const getFicheAutoEvaluationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const fiche = await FicheAutoEvaluation.findById(id)
      .populate({
        path: 'identificationProved',
        select: 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt'
      });

    if (!fiche) {
      return res.status(404).json({
        success: false,
        message: 'Fiche d\'auto-évaluation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fiche d\'auto-évaluation récupérée avec succès',
      data: fiche
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la fiche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la fiche',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /fiche-auto-evaluation/{id}:
 *   put:
 *     summary: Mettre à jour une fiche d'auto-évaluation
 *     tags: [FicheAutoEvaluation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la fiche
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FicheAutoEvaluation'
 *     responses:
 *       200:
 *         description: Fiche mise à jour avec succès
 *       404:
 *         description: Fiche non trouvée
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
const updateFicheAutoEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      intituleFormation: req.body.intituleFormation,
      contenuComprehension: req.body.contenuComprehension,
      participationImplication: req.body.participationImplication,
      pertinenceUtilite: req.body.pertinenceUtilite,
      suggestionsCommentaires: req.body.suggestionsCommentaires
    };

    const fiche = await FicheAutoEvaluation.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate({
      path: 'identificationProved',
      select: 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt'
    });

    if (!fiche) {
      return res.status(404).json({
        success: false,
        message: 'Fiche d\'auto-évaluation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fiche d\'auto-évaluation mise à jour avec succès',
      data: fiche
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la fiche:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la fiche',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /fiche-auto-evaluation/{id}:
 *   delete:
 *     summary: Supprimer une fiche d'auto-évaluation
 *     tags: [FicheAutoEvaluation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la fiche
 *     responses:
 *       200:
 *         description: Fiche supprimée avec succès
 *       404:
 *         description: Fiche non trouvée
 *       401:
 *         description: Non autorisé
 */
const deleteFicheAutoEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const fiche = await FicheAutoEvaluation.findByIdAndDelete(id);

    if (!fiche) {
      return res.status(404).json({
        success: false,
        message: 'Fiche d\'auto-évaluation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fiche d\'auto-évaluation supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la fiche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la fiche',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /fiche-auto-evaluation/{id}/statut:
 *   patch:
 *     summary: Changer le statut d'une fiche d'auto-évaluation
 *     tags: [FicheAutoEvaluation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la fiche
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
 *         description: Fiche non trouvée
 *       400:
 *         description: Statut invalide
 *       401:
 *         description: Non autorisé
 */
const updateStatutFiche = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!['brouillon', 'soumis', 'approuve', 'rejete'].includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const fiche = await FicheAutoEvaluation.findByIdAndUpdate(
      id,
      { 
        statut
      },
      { new: true }
    ).populate({
      path: 'identificationProved',
      select: 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt'
    });

    if (!fiche) {
      return res.status(404).json({
        success: false,
        message: 'Fiche d\'auto-évaluation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Statut de la fiche mis à jour avec succès',
      data: fiche
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
 * /fiche-auto-evaluation/statistiques:
 *   get:
 *     summary: Obtenir les statistiques des fiches d'auto-évaluation
 *     tags: [FicheAutoEvaluation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date pour les statistiques
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *       401:
 *         description: Non autorisé
 */
const getStatistiquesFiches = async (req, res) => {
  try {
    const { date } = req.query;
    const filter = {};
    
    if (date) {
      const dateFilter = new Date(date);
      filter.createdAt = {
        $gte: new Date(dateFilter.setHours(0, 0, 0, 0)),
        $lt: new Date(dateFilter.setHours(23, 59, 59, 999))
      };
    }

    const [
      totalFiches,
      fichesParStatut,
      fichesParProvenance,
      fichesParProvince,
      fichesParDate
    ] = await Promise.all([
      FicheAutoEvaluation.countDocuments(filter),
      FicheAutoEvaluation.aggregate([
        { $match: filter },
        { $group: { _id: '$statut', count: { $sum: 1 } } }
      ]),
      FicheAutoEvaluation.aggregate([
        { $match: filter },
        { $group: { _id: '$provenance', count: { $sum: 1 } } }
      ]),
      FicheAutoEvaluation.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'identificationproveds',
            localField: 'identificationProved',
            foreignField: '_id',
            as: 'identificationProved'
          }
        },
        { $unwind: '$identificationProved' },
        { $group: { _id: '$identificationProved.provinceAdministrative', count: { $sum: 1 } } }
      ]),
      FicheAutoEvaluation.aggregate([
        { $match: filter },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: -1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      message: 'Statistiques récupérées avec succès',
      data: {
        totalFiches,
        fichesParStatut,
        fichesParProvenance,
        fichesParProvince,
        fichesParDate
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
 * /fiche-auto-evaluation/check-today:
 *   get:
 *     summary: Vérifier si l'utilisateur a déjà rempli une fiche aujourd'hui
 *     tags: [FicheAutoEvaluation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vérification effectuée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 hasFilledToday:
 *                   type: boolean
 *                   description: Indique si l'utilisateur a déjà rempli une fiche aujourd'hui
 *                 existingFiche:
 *                   type: object
 *                   description: Détails de la fiche existante (si elle existe)
 *       401:
 *         description: Non autorisé
 */
const checkFicheToday = async (req, res) => {
  try {
    const currentUser = req.user;
    
    // Chercher l'IdentificationProved créée par cet utilisateur
    const { IdentificationProved } = require('../models/identificationProved.model.js');
    const identificationProved = await IdentificationProved.findOne({ createdBy: currentUser._id });
    
    if (!identificationProved) {
      return res.status(400).json({
        success: false,
        message: 'Aucune PROVED trouvée pour cet utilisateur. Veuillez d\'abord créer une PROVED.'
      });
    }
    
    // Obtenir la date d'aujourd'hui (début et fin de journée)
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    
    console.log('🔍 Vérification fiche pour aujourd\'hui:', startOfDay.toISOString(), 'à', endOfDay.toISOString());
    console.log('👤 Utilisateur:', currentUser._id);
    console.log('🏢 IdentificationProved:', identificationProved._id);
    
    // Chercher une fiche créée aujourd'hui pour cette IdentificationProved
    const existingFiche = await FicheAutoEvaluation.findOne({
      identificationProved: identificationProved._id,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).populate({
      path: 'identificationProved',
      select: 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt'
    });
    
    const hasFilledToday = !!existingFiche;
    
    console.log('📊 Fiche trouvée pour aujourd\'hui:', hasFilledToday);
    
    res.status(200).json({
      success: true,
      message: hasFilledToday ? 'Une fiche existe déjà pour aujourd\'hui' : 'Aucune fiche trouvée pour aujourd\'hui',
      hasFilledToday,
      existingFiche: hasFilledToday ? existingFiche : null,
      today: startOfDay.toISOString().split('T')[0], // Date au format YYYY-MM-DD
      debug: {
        userId: currentUser._id,
        identificationProvedId: identificationProved._id,
        startOfDay: startOfDay.toISOString(),
        endOfDay: endOfDay.toISOString(),
        searchCriteria: {
          identificationProved: identificationProved._id,
          dateRange: {
            start: startOfDay.toISOString(),
            end: endOfDay.toISOString()
          }
        }
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la vérification de la fiche pour aujourd\'hui:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de la fiche pour aujourd\'hui',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /fiche-auto-evaluation/my-proved:
 *   get:
 *     summary: Récupérer l'identification PROVED de l'utilisateur connecté
 *     tags: [FicheAutoEvaluation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Identification PROVED récupérée avec succès
 *       404:
 *         description: Aucune PROVED trouvée pour cet utilisateur
 *       401:
 *         description: Non autorisé
 */
const getMyIdentificationProved = async (req, res) => {
  try {
    const currentUser = req.user;
    
    console.log('🔍 Récupération de l\'identification PROVED pour l\'utilisateur:', currentUser._id);
    
    // Chercher l'IdentificationProved créée par cet utilisateur
    const { IdentificationProved } = require('../models/identificationProved.model.js');
    const identificationProved = await IdentificationProved.findOne({ 
      createdBy: currentUser._id 
    }).select('provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt');
    
    if (!identificationProved) {
      return res.status(404).json({
        success: false,
        message: 'Aucune PROVED trouvée pour cet utilisateur. Veuillez d\'abord créer une PROVED.'
      });
    }
    
    console.log('✅ PROVED trouvée:', identificationProved.directeurProvincial);
    
    res.status(200).json({
      success: true,
      message: 'Identification PROVED récupérée avec succès',
      data: identificationProved
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'identification PROVED:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'identification PROVED',
      error: error.message
    });
  }
};

module.exports = {
  createFicheAutoEvaluation,
  getAllFichesAutoEvaluation,
  getFicheAutoEvaluationById,
  updateFicheAutoEvaluation,
  deleteFicheAutoEvaluation,
  updateStatutFiche,
  getStatistiquesFiches,
  checkFicheToday,
  getMyIdentificationProved
};
