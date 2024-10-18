const router = require('express').Router();
const { createService, getAllServices, updateService, deleteService } = require('../controllers/service.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Création d'un nouveau service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service créé avec succès
 */
router.route('/services').post(isLoggedIn, createService);

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Récupérer tous les services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Liste des services récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
router.route('/services').get(isLoggedIn, getAllServices);

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Modifier un service
 *     tags: [Services]
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
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Service mis à jour avec succès
 */
router.route('/services/:id').put(isLoggedIn, updateService);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Supprimer un service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service supprimé avec succès
 */
router.route('/services/:id').delete(isLoggedIn, deleteService);

module.exports = router;
