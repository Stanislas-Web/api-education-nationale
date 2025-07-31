const { IdentificationProved } = require('../models/identificationProved.model.js');

/**
 * @swagger
 * /identification-proved:
 *   post:
 *     summary: Créer une nouvelle identification de PROVED
 *     tags: [IdentificationProved]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IdentificationProved'
 *     responses:
 *       201:
 *         description: Identification créée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
const createIdentificationProved = async (req, res) => {
  try {
    const identificationData = {
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id
    };

    const identification = new IdentificationProved(identificationData);
    await identification.save();

    // Populate les informations de l'utilisateur
    await identification.populate('createdBy', 'nom prenom email');
    await identification.populate('updatedBy', 'nom prenom email');

    res.status(201).json({
      success: true,
      message: 'Identification de PROVED créée avec succès',
      data: identification
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'identification:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création de l\'identification',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /identification-proved:
 *   get:
 *     summary: Récupérer toutes les identifications de PROVED
 *     tags: [IdentificationProved]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filtrer par statut actif
 *     responses:
 *       200:
 *         description: Liste des identifications récupérée avec succès
 *       401:
 *         description: Non autorisé
 */
const getAllIdentificationsProved = async (req, res) => {
  try {
    const { isActive } = req.query;
    
    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const identifications = await IdentificationProved.find(filter)
      .populate('createdBy', 'nom prenom email')
      .populate('updatedBy', 'nom prenom email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Identifications de PROVED récupérées avec succès',
      data: identifications
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des identifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des identifications',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /identification-proved/{id}:
 *   get:
 *     summary: Récupérer une identification de PROVED par ID
 *     tags: [IdentificationProved]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'identification
 *     responses:
 *       200:
 *         description: Identification récupérée avec succès
 *       404:
 *         description: Identification non trouvée
 *       401:
 *         description: Non autorisé
 */
const getIdentificationProvedById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const identification = await IdentificationProved.findById(id)
      .populate('createdBy', 'nom prenom email')
      .populate('updatedBy', 'nom prenom email');

    if (!identification) {
      return res.status(404).json({
        success: false,
        message: 'Identification de PROVED non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Identification de PROVED récupérée avec succès',
      data: identification
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'identification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'identification',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /identification-proved/active:
 *   get:
 *     summary: Récupérer l'identification active de la PROVED
 *     tags: [IdentificationProved]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Identification active récupérée avec succès
 *       404:
 *         description: Aucune identification active trouvée
 *       401:
 *         description: Non autorisé
 */
const getActiveIdentificationProved = async (req, res) => {
  try {
    const identification = await IdentificationProved.findOne({ isActive: true })
      .populate('createdBy', 'nom prenom email')
      .populate('updatedBy', 'nom prenom email');

    if (!identification) {
      return res.status(404).json({
        success: false,
        message: 'Aucune identification active trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Identification active récupérée avec succès',
      data: identification
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'identification active:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'identification active',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /identification-proved/{id}:
 *   put:
 *     summary: Mettre à jour une identification de PROVED
 *     tags: [IdentificationProved]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'identification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IdentificationProved'
 *     responses:
 *       200:
 *         description: Identification mise à jour avec succès
 *       404:
 *         description: Identification non trouvée
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
const updateIdentificationProved = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.user._id
    };

    const identification = await IdentificationProved.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'nom prenom email')
     .populate('updatedBy', 'nom prenom email');

    if (!identification) {
      return res.status(404).json({
        success: false,
        message: 'Identification de PROVED non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Identification de PROVED mise à jour avec succès',
      data: identification
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'identification:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'identification',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /identification-proved/{id}:
 *   delete:
 *     summary: Supprimer une identification de PROVED
 *     tags: [IdentificationProved]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'identification
 *     responses:
 *       200:
 *         description: Identification supprimée avec succès
 *       404:
 *         description: Identification non trouvée
 *       401:
 *         description: Non autorisé
 */
const deleteIdentificationProved = async (req, res) => {
  try {
    const { id } = req.params;
    
    const identification = await IdentificationProved.findByIdAndDelete(id);

    if (!identification) {
      return res.status(404).json({
        success: false,
        message: 'Identification de PROVED non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Identification de PROVED supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'identification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'identification',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /identification-proved/{id}/activate:
 *   patch:
 *     summary: Activer une identification de PROVED
 *     tags: [IdentificationProved]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'identification
 *     responses:
 *       200:
 *         description: Identification activée avec succès
 *       404:
 *         description: Identification non trouvée
 *       401:
 *         description: Non autorisé
 */
const activateIdentificationProved = async (req, res) => {
  try {
    const { id } = req.params;

    // Désactiver toutes les autres identifications
    await IdentificationProved.updateMany(
      { _id: { $ne: id } },
      { isActive: false }
    );

    // Activer l'identification spécifiée
    const identification = await IdentificationProved.findByIdAndUpdate(
      id,
      { 
        isActive: true,
        updatedBy: req.user._id
      },
      { new: true }
    ).populate('createdBy', 'nom prenom email')
     .populate('updatedBy', 'nom prenom email');

    if (!identification) {
      return res.status(404).json({
        success: false,
        message: 'Identification de PROVED non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Identification de PROVED activée avec succès',
      data: identification
    });
  } catch (error) {
    console.error('Erreur lors de l\'activation de l\'identification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'activation de l\'identification',
      error: error.message
    });
  }
};

module.exports = {
  createIdentificationProved,
  getAllIdentificationsProved,
  getIdentificationProvedById,
  getActiveIdentificationProved,
  updateIdentificationProved,
  deleteIdentificationProved,
  activateIdentificationProved
}; 