const router = require('express').Router();
const { createAnnonce, getAllAnnonces, updateAnnonce, deleteAnnonce } = require('../controllers/annonce.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * tags:
 *   name: Annonces
 *   description: Gestion des annonces
 */

/**
 * @swagger
 * /annonces:
 *   post:
 *     summary: Créer une nouvelle annonce
 *     tags: [Annonces]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Annonce'
 *     responses:
 *       201:
 *         description: Annonce créée avec succès
 */
router.post('/annonces', isLoggedIn, createAnnonce);

/**
 * @swagger
 * /annonces:
 *   get:
 *     summary: Récupérer toutes les annonces
 *     tags: [Annonces]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des annonces récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Annonce'
 */
router.get('/annonces', isLoggedIn, getAllAnnonces);

/**
 * @swagger
 * /annonces/{id}:
 *   put:
 *     summary: Mettre à jour une annonce
 *     tags: [Annonces]
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/Annonce'
 *     responses:
 *       200:
 *         description: Annonce mise à jour avec succès
 */
router.put('/annonces/:id', isLoggedIn, updateAnnonce);

/**
 * @swagger
 * /annonces/{id}:
 *   delete:
 *     summary: Supprimer une annonce
 *     tags: [Annonces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Annonce supprimée avec succès
 */
router.delete('/annonces/:id', isLoggedIn, deleteAnnonce);

module.exports = router;
