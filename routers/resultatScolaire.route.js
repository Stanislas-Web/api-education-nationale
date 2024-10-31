const express = require('express');
const router = express.Router();
const {
  createResultatScolaire,
  getAllResultatsScolaires,
  getResultatScolaireById,
  updateResultatScolaire,
  deleteResultatScolaire,
  getResultatsByEcole
} = require('../controllers/resultatScolaire.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /resultats-scolaires:
 *   post:
 *     summary: Créer un nouveau resultat scolaire
 *     tags: [ResultatsScolaires]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResultatScolaire'
 *     responses:
 *       201:
 *         description: Résultat scolaire créé avec succès
 */
router.post('/resultats-scolaires', isLoggedIn, createResultatScolaire);

/**
 * @swagger
 * /resultats-scolaires:
 *   get:
 *     summary: Récupérer tous les résultats scolaires
 *     tags: [ResultatsScolaires]
 *     responses:
 *       200:
 *         description: Liste des résultats scolaires récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ResultatScolaire'
 */
router.get('/resultats-scolaires', isLoggedIn, getAllResultatsScolaires);

/**
 * @swagger
 * /resultats-scolaires/{id}:
 *   get:
 *     summary: Récupérer un résultat scolaire par ID
 *     tags: [ResultatsScolaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du résultat scolaire
 *     responses:
 *       200:
 *         description: Résultat scolaire récupéré avec succès
 */
router.get('/resultats-scolaires/:id', isLoggedIn, getResultatScolaireById);

/**
 * @swagger
 * /resultats-scolaires/{id}:
 *   put:
 *     summary: Mettre à jour un résultat scolaire par ID
 *     tags: [ResultatsScolaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du résultat scolaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResultatScolaire'
 *     responses:
 *       200:
 *         description: Résultat scolaire mis à jour avec succès
 */
router.put('/resultats-scolaires/:id', isLoggedIn, updateResultatScolaire);

/**
 * @swagger
 * /resultats-scolaires/{id}:
 *   delete:
 *     summary: Supprimer un résultat scolaire par ID
 *     tags: [ResultatsScolaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du résultat scolaire
 *     responses:
 *       200:
 *         description: Résultat scolaire supprimé avec succès
 */
router.delete('/resultats-scolaires/:id', isLoggedIn, deleteResultatScolaire);

/**
 * @swagger
 * /resultats-scolaires/ecole/{ecoleId}:
 *   get:
 *     summary: Récupérer les résultats scolaires par école
 *     tags: [ResultatsScolaires]
 *     parameters:
 *       - in: path
 *         name: ecoleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'école
 *     responses:
 *       200:
 *         description: Résultats scolaires de l'école récupérés avec succès
 */
router.get('/resultats-scolaires/ecole/:ecoleId', isLoggedIn, getResultatsByEcole);

module.exports = router;
