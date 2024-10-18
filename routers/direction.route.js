const router = require('express').Router();
const { createDirection, getAllDirections, updateDirection, deleteDirection } = require('../controllers/direction.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /directions:
 *   post:
 *     summary: Création d'une nouvelle direction
 *     tags: [Directions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Direction'
 *     responses:
 *       201:
 *         description: Direction créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Direction'
 *       400:
 *         description: Données invalides
 */
router.route('/directions').post(isLoggedIn, createDirection);

/**
 * @swagger
 * /directions:
 *   get:
 *     summary: Récupérer toutes les directions
 *     tags: [Directions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des directions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Direction'
 *       401:
 *         description: Authentification échouée
 *       500:
 *         description: Erreur interne du serveur
 */
router.route('/directions').get(isLoggedIn, getAllDirections);

/**
 * @swagger
 * /directions/{id}:
 *   put:
 *     summary: Modification d'une direction
 *     tags: [Directions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la direction à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *             properties:
 *               nom:
 *                 type: string
 *               idProvince:
 *                 type: string
 *     responses:
 *       200:
 *         description: Direction modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Direction modifiée avec succès"
 *                 Direction:
 *                   $ref: '#/components/schemas/Direction'
 *       401:
 *         description: Authentification échouée
 *       404:
 *         description: Direction non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.route('/directions/:id').put(isLoggedIn, updateDirection);

/**
 * @swagger
 * /directions/{id}:
 *   delete:
 *     summary: Supprimer une direction
 *     tags: [Directions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la direction à supprimer
 *     responses:
 *       200:
 *         description: Direction supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Direction supprimée avec succès"
 *       404:
 *         description: Direction non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.route('/directions/:id').delete(isLoggedIn, deleteDirection);

module.exports = router;
