const router = require('express').Router();
const { createInfrastructure, getAllInfrastructures, updateInfrastructure, deleteInfrastructure } = require('../controllers/infrastructure.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /infrastructures:
 *   post:
 *     summary: Créer une nouvelle infrastructure
 *     tags: [Infrastructures]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Infrastructure'
 *     responses:
 *       201:
 *         description: Infrastructure créée avec succès
 */
router.route('/infrastructures').post(isLoggedIn, createInfrastructure);

/**
 * @swagger
 * /infrastructures:
 *   get:
 *     summary: Récupérer toutes les infrastructures
 *     tags: [Infrastructures]
 *     responses:
 *       200:
 *         description: Liste des infrastructures récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Infrastructure'
 */
router.route('/infrastructures').get(isLoggedIn, getAllInfrastructures);

/**
 * @swagger
 * /infrastructures/{id}:
 *   put:
 *     summary: Modifier une infrastructure par ID
 *     tags: [Infrastructures]
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
 *             $ref: '#/components/schemas/Infrastructure'
 *     responses:
 *       200:
 *         description: Infrastructure mise à jour avec succès
 */
router.route('/infrastructures/:id').put(isLoggedIn, updateInfrastructure);

/**
 * @swagger
 * /infrastructures/{id}:
 *   delete:
 *     summary: Supprimer une infrastructure par ID
 *     tags: [Infrastructures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Infrastructure supprimée avec succès
 */
router.route('/infrastructures/:id').delete(isLoggedIn, deleteInfrastructure);

module.exports = router;
