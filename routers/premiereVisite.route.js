const express = require('express');
const router = express.Router();
const {
  createPremiereVisite,
  getAllPremieresVisites,
  getPremiereVisiteById,
  updatePremiereVisite,
  deletePremiereVisite
} = require('../controllers/premiereVisite.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /premieres-visites:
 *   post:
 *     summary: Créer une nouvelle première visite
 *     tags: [Premières Visites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PremiereVisite'
 *     responses:
 *       201:
 *         description: Première visite créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PremiereVisite'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
router.post('/premieres-visites', isLoggedIn, createPremiereVisite);

/**
 * @swagger
 * /premieres-visites:
 *   get:
 *     summary: Récupérer toutes les premières visites
 *     tags: [Premières Visites]
 *     responses:
 *       200:
 *         description: Liste des premières visites récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PremiereVisite'
 *       500:
 *         description: Erreur serveur
 */
router.get('/premieres-visites', getAllPremieresVisites);

/**
 * @swagger
 * /premieres-visites/{id}:
 *   get:
 *     summary: Récupérer une première visite par son ID
 *     tags: [Premières Visites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la première visite
 *     responses:
 *       200:
 *         description: Première visite récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PremiereVisite'
 *       404:
 *         description: Première visite non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/premieres-visites/:id', getPremiereVisiteById);

/**
 * @swagger
 * /premieres-visites/{id}:
 *   put:
 *     summary: Modifier une première visite
 *     tags: [Premières Visites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la première visite à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PremiereVisite'
 *     responses:
 *       200:
 *         description: Première visite modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PremiereVisite'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Première visite non trouvée
 */
router.put('/premieres-visites/:id', isLoggedIn, updatePremiereVisite);

/**
 * @swagger
 * /premieres-visites/{id}:
 *   delete:
 *     summary: Supprimer une première visite
 *     tags: [Premières Visites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la première visite à supprimer
 *     responses:
 *       200:
 *         description: Première visite supprimée avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Première visite non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/premieres-visites/:id', isLoggedIn, deletePremiereVisite);

module.exports = router;