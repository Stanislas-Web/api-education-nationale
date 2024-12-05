const express = require('express');
const router = express.Router();
const {
  createInspection,
  getAllInspections,
  getInspectionById,
  updateInspection,
  deleteInspection,
  createManyInspectionsPedagogiques
} = require('../controllers/inspectionPedagogique.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /inspections-pedagogique:
 *   post:
 *     summary: Créer une nouvelle inspection pédagogique
 *     tags: [Inspections Pédagogiques]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InspectionPedagogique'
 *     responses:
 *       201:
 *         description: Inspection pédagogique créée avec succès
 *       500:
 *         description: Erreur lors de la création de l’inspection pédagogique
 */
router.post('/inspections-pedagogique', isLoggedIn, createInspection);

/**
 * @swagger
 * /inspections-pedagogique:
 *   get:
 *     summary: Récupérer toutes les inspections pédagogiques
 *     tags: [Inspections Pédagogiques]
 *     responses:
 *       200:
 *         description: Liste des inspections pédagogiques récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InspectionPedagogique'
 *       500:
 *         description: Erreur lors de la récupération des inspections pédagogiques
 */
router.get('/inspections-pedagogique', getAllInspections);

/**
 * @swagger
 * /inspections-pedagogique/many:
 *   post:
 *     summary: Création de plusieurs Fiche C3
 *     tags: [Inspections Pédagogiques]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inspectionsPedagogiques:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/InspectionPedagogique'
 *     responses:
 *       200:
 *         description: Toutes les fiches ont été insérées avec succès
 *       500:
 *         description: Erreur lors de l'insertion des fiches
 */
router.post('/inspections-pedagogique/many', isLoggedIn,createManyInspectionsPedagogiques);

/**
 * @swagger
 * /inspections-pedagogique/{id}:
 *   get:
 *     summary: Récupérer une inspection pédagogique par son ID
 *     tags: [Inspections Pédagogiques]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’inspection pédagogique à récupérer
 *     responses:
 *       200:
 *         description: Inspection pédagogique récupérée avec succès
 *       404:
 *         description: Inspection pédagogique introuvable
 *       500:
 *         description: Erreur lors de la récupération de l’inspection pédagogique
 */
router.get('/inspections-pedagogique/:id', getInspectionById);

/**
 * @swagger
 * /inspections-pedagogique/{id}:
 *   put:
 *     summary: Mettre à jour une inspection pédagogique
 *     tags: [Inspections Pédagogiques]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’inspection pédagogique à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InspectionPedagogique'
 *     responses:
 *       200:
 *         description: Inspection pédagogique mise à jour avec succès
 *       404:
 *         description: Inspection pédagogique introuvable
 *       500:
 *         description: Erreur lors de la mise à jour de l’inspection pédagogique
 */
router.put('/inspections-pedagogique/:id', isLoggedIn, updateInspection);

/**
 * @swagger
 * /inspections-pedagogique/{id}:
 *   delete:
 *     summary: Supprimer une inspection pédagogique
 *     tags: [Inspections Pédagogiques]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’inspection pédagogique à supprimer
 *     responses:
 *       200:
 *         description: Inspection pédagogique supprimée avec succès
 *       404:
 *         description: Inspection pédagogique introuvable
 *       500:
 *         description: Erreur lors de la suppression de l’inspection pédagogique
 */
router.delete('/inspections-pedagogique/:id', isLoggedIn, deleteInspection);

module.exports = router;
