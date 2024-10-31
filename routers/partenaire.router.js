// routes/partenaire.route.js

const express = require('express');
const router = express.Router();
const {
  createPartenaire,
  getAllPartenaires,
  getPartenaireById,
  updatePartenaire,
  deletePartenaire
} = require('../controllers/partenaire.controller');

/**
 * @swagger
 * tags:
 *   name: Partenaires
 *   description: API pour gérer les partenaires
 */

/**
 * @swagger
 * /partenaires:
 *   post:
 *     summary: Créer un nouveau partenaire
 *     tags: [Partenaires]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Partenaire'
 *     responses:
 *       201:
 *         description: Partenaire créé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post('/partenaires', createPartenaire);

/**
 * @swagger
 * /partenaires:
 *   get:
 *     summary: Récupérer tous les partenaires
 *     tags: [Partenaires]
 *     responses:
 *       200:
 *         description: Liste de tous les partenaires
 */
router.get('/partenaires', getAllPartenaires);

/**
 * @swagger
 * /partenaires/{id}:
 *   get:
 *     summary: Récupérer un partenaire par ID
 *     tags: [Partenaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du partenaire
 *     responses:
 *       200:
 *         description: Partenaire récupéré avec succès
 *       404:
 *         description: Partenaire non trouvé
 */
router.get('/partenaires/:id', getPartenaireById);

/**
 * @swagger
 * /partenaires/{id}:
 *   put:
 *     summary: Mettre à jour un partenaire par ID
 *     tags: [Partenaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du partenaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Partenaire'
 *     responses:
 *       200:
 *         description: Partenaire mis à jour avec succès
 *       404:
 *         description: Partenaire non trouvé
 *       400:
 *         description: Erreur de validation
 */
router.put('/partenaires/:id', updatePartenaire);

/**
 * @swagger
 * /partenaires/{id}:
 *   delete:
 *     summary: Supprimer un partenaire par ID
 *     tags: [Partenaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du partenaire
 *     responses:
 *       200:
 *         description: Partenaire supprimé avec succès
 *       404:
 *         description: Partenaire non trouvé
 */
router.delete('/partenaires/:id', deletePartenaire);

module.exports = router;
