const router = require('express').Router();
const { createSousDirection, getAllSousDirections, updateSousDirection, deleteSousDirection } = require('../controllers/sousDirection.controller');
const { isLoggedIn } = require('../middleware'); // Si tu as une vérification de connexion

/**
 * @swagger
 * /sous-directions:
 *   post:
 *     summary: Création d'une nouvelle sous-direction
 *     tags: [Sous-Directions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SousDirection'
 *     responses:
 *       201:
 *         description: Sous-direction créée avec succès
 */
router.route('/sous-directions').post(isLoggedIn, createSousDirection);

/**
 * @swagger
 * /sous-directions:
 *   get:
 *     summary: Récupérer toutes les sous-directions
 *     tags: [Sous-Directions]
 *     responses:
 *       200:
 *         description: Liste des sous-directions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SousDirection'
 */
router.route('/sous-directions').get(isLoggedIn, getAllSousDirections);

/**
 * @swagger
 * /sous-directions/{id}:
 *   put:
 *     summary: Modifier une sous-direction
 *     tags: [Sous-Directions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SousDirection'
 *     responses:
 *       200:
 *         description: Sous-direction mise à jour avec succès
 */
router.route('/sous-directions/:id').put(isLoggedIn, updateSousDirection);

/**
 * @swagger
 * /sous-directions/{id}:
 *   delete:
 *     summary: Supprimer une sous-direction
 *     tags: [Sous-Directions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sous-direction supprimée avec succès
 */
router.route('/sous-directions/:id').delete(isLoggedIn, deleteSousDirection);

module.exports = router;
