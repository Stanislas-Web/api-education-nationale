const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware.js');
const {
  createFicheAutoEvaluation,
  getAllFichesAutoEvaluation,
  getFicheAutoEvaluationById,
  updateFicheAutoEvaluation,
  deleteFicheAutoEvaluation,
  updateStatutFiche,
  getStatistiquesFiches,
  checkFicheToday
} = require('../controllers/ficheAutoEvaluation.controller.js');

/**
 * @swagger
 * tags:
 *   name: FicheAutoEvaluation
 *   description: API pour la gestion des fiches d'auto-évaluation quotidienne de la formation
 */

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
// CRUD principal
router.route('/fiche-auto-evaluation')
  .post(isLoggedIn, createFicheAutoEvaluation)
  .get(isLoggedIn, getAllFichesAutoEvaluation);

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
// Statistiques
router.route('/fiche-auto-evaluation/statistiques')
  .get(isLoggedIn, getStatistiquesFiches);

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
 *                 today:
 *                   type: string
 *                   format: date
 *                   description: Date d'aujourd'hui
 *       401:
 *         description: Non autorisé
 */
// Vérification fiche pour aujourd'hui
router.route('/fiche-auto-evaluation/check-today')
  .get(isLoggedIn, checkFicheToday);

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
// Par ID (GET, PUT, DELETE)
router.route('/fiche-auto-evaluation/:id')
  .get(isLoggedIn, getFicheAutoEvaluationById)
  .put(isLoggedIn, updateFicheAutoEvaluation)
  .delete(isLoggedIn, deleteFicheAutoEvaluation);

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
// Changement de statut
router.route('/fiche-auto-evaluation/:id/statut')
  .patch(isLoggedIn, updateStatutFiche);

module.exports = router;
