const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware.js');
const {
  createRapportActivite,
  getAllRapportsActivite,
  getRapportActiviteById,
  updateRapportActivite,
  deleteRapportActivite,
  updateStatutRapport,
  getStatistiquesRapports,
  exportRapportPDF
} = require('../controllers/rapportActivite.controller.js');

/**
 * @swagger
 * tags:
 *   name: RapportActivite
 *   description: API pour la gestion des rapports d'activités du Directeur Provincial
 */

/**
 * @swagger
 * /rapport-activite:
 *   post:
 *     summary: Créer un nouveau rapport d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RapportActivite'
 *     responses:
 *       201:
 *         description: Rapport créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
// CRUD principal
router.route('/rapport-activite')
  .post(isLoggedIn, createRapportActivite)
  .get(isLoggedIn, getAllRapportsActivite);

/**
 * @swagger
 * /rapport-activite:
 *   get:
 *     summary: Récupérer tous les rapports d'activités
 *     tags: [RapportActivite]
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
 *         name: annee
 *         schema:
 *           type: integer
 *         description: Filtrer par année
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *         description: Filtrer par statut
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Filtrer par province
 *     responses:
 *       200:
 *         description: Liste des rapports récupérée avec succès
 *       401:
 *         description: Non autorisé
 */

/**
 * @swagger
 * /rapport-activite/statistiques:
 *   get:
 *     summary: Obtenir les statistiques des rapports d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: annee
 *         schema:
 *           type: integer
 *         description: Année pour les statistiques
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *       401:
 *         description: Non autorisé
 */
// Statistiques
router.route('/rapport-activite/statistiques')
  .get(isLoggedIn, getStatistiquesRapports);

/**
 * @swagger
 * /rapport-activite/{id}:
 *   get:
 *     summary: Récupérer un rapport d'activités par ID
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     responses:
 *       200:
 *         description: Rapport récupéré avec succès
 *       404:
 *         description: Rapport non trouvé
 *       401:
 *         description: Non autorisé
 */
// Par ID (GET, PUT, DELETE)
router.route('/rapport-activite/:id')
  .get(isLoggedIn, getRapportActiviteById)
  .put(isLoggedIn, updateRapportActivite)
  .delete(isLoggedIn, deleteRapportActivite);

/**
 * @swagger
 * /rapport-activite/{id}:
 *   put:
 *     summary: Mettre à jour un rapport d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RapportActivite'
 *     responses:
 *       200:
 *         description: Rapport mis à jour avec succès
 *       404:
 *         description: Rapport non trouvé
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */

/**
 * @swagger
 * /rapport-activite/{id}:
 *   delete:
 *     summary: Supprimer un rapport d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     responses:
 *       200:
 *         description: Rapport supprimé avec succès
 *       404:
 *         description: Rapport non trouvé
 *       401:
 *         description: Non autorisé
 */

/**
 * @swagger
 * /rapport-activite/{id}/statut:
 *   patch:
 *     summary: Changer le statut d'un rapport d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
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
 *         description: Rapport non trouvé
 *       400:
 *         description: Statut invalide
 *       401:
 *         description: Non autorisé
 */
// Changement de statut
router.route('/rapport-activite/:id/statut')
  .patch(isLoggedIn, updateStatutRapport);

/**
 * @swagger
 * /rapport-activite/{id}/export:
 *   get:
 *     summary: Exporter un rapport d'activités en PDF
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     responses:
 *       200:
 *         description: Rapport exporté avec succès
 *       404:
 *         description: Rapport non trouvé
 *       401:
 *         description: Non autorisé
 */
// Export PDF
router.route('/rapport-activite/:id/export')
  .get(isLoggedIn, exportRapportPDF);

module.exports = router; 