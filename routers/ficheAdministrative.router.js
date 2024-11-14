const express = require('express');
const router = express.Router();
const {
  createFicheAdministrative,
  getAllFichesAdministratives,
  getFicheAdministrativeById,
  updateFicheAdministrative,
  deleteFicheAdministrative
} = require('../controllers/ficheAdministratif.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /fiches-administratives:
 *   post:
 *     summary: Créer une nouvelle fiche administrative
 *     tags: [Fiches Administratives]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FicheAdministrative'
 *     responses:
 *       201:
 *         description: Fiche administrative créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FicheAdministrative'
 *       400:
 *         description: Données invalides
 */
router.post('/fiches-administratives', isLoggedIn, createFicheAdministrative);

/**
 * @swagger
 * /fiches-administratives:
 *   get:
 *     summary: Récupérer toutes les fiches administratives
 *     tags: [Fiches Administratives]
 *     responses:
 *       200:
 *         description: Liste des fiches administratives récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FicheAdministrative'
 */
router.get('/fiches-administratives', getAllFichesAdministratives);

/**
 * @swagger
 * /fiches-administratives/{id}:
 *   get:
 *     summary: Récupérer une fiche administrative par son ID
 *     tags: [Fiches Administratives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la fiche administrative à récupérer
 *     responses:
 *       200:
 *         description: Fiche administrative récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FicheAdministrative'
 *       404:
 *         description: Fiche administrative non trouvée
 */
router.get('/fiches-administratives/:id', getFicheAdministrativeById);

/**
 * @swagger
 * /fiches-administratives/{id}:
 *   put:
 *     summary: Modifier une fiche administrative
 *     tags: [Fiches Administratives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la fiche administrative à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FicheAdministrative'
 *     responses:
 *       200:
 *         description: Fiche administrative modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FicheAdministrative'
 *       404:
 *         description: Fiche administrative non trouvée
 */
router.put('/fiches-administratives/:id', isLoggedIn, updateFicheAdministrative);

/**
 * @swagger
 * /fiches-administratives/{id}:
 *   delete:
 *     summary: Supprimer une fiche administrative
 *     tags: [Fiches Administratives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la fiche administrative à supprimer
 *     responses:
 *       200:
 *         description: Fiche administrative supprimée avec succès
 *       404:
 *         description: Fiche administrative non trouvée
 */
router.delete('/fiches-administratives/:id', isLoggedIn, deleteFicheAdministrative);

module.exports = router;
