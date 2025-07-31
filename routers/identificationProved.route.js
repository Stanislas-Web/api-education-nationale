const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware.js');
const {
  createIdentificationProved,
  getAllIdentificationsProved,
  getIdentificationProvedById,
  getActiveIdentificationProved,
  updateIdentificationProved,
  deleteIdentificationProved,
  activateIdentificationProved
} = require('../controllers/identificationProved.controller.js');

/**
 * @swagger
 * tags:
 *   name: IdentificationProved
 *   description: API pour la gestion de l'identification de la PROVED
 */

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
router.route('/identification-proved')
  .post(isLoggedIn, createIdentificationProved)
  .get(isLoggedIn, getAllIdentificationsProved);

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
router.route('/identification-proved/active')
  .get(isLoggedIn, getActiveIdentificationProved);

router.route('/identification-proved/:id')
  .get(isLoggedIn, getIdentificationProvedById)
  .put(isLoggedIn, updateIdentificationProved)
  .delete(isLoggedIn, deleteIdentificationProved);

router.route('/identification-proved/:id/activate')
  .patch(isLoggedIn, activateIdentificationProved);

module.exports = router; 