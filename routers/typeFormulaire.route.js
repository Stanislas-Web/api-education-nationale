const express = require('express');
const router = express.Router();
const {
  createTypeFormulaire,
  getAllTypeFormulaires,
  getTypeFormulaireById,
  updateTypeFormulaire,
  deleteTypeFormulaire
} = require('../controllers/typeFormulaire.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /type-formulaires:
 *   post:
 *     summary: Créer un nouveau type de formulaire
 *     tags: [Types de Formulaires]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TypeFormulaire'
 *     responses:
 *       201:
 *         description: Type de formulaire créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TypeFormulaire'
 *       400:
 *         description: Données invalides
 */
router.route('/type-formulaires').post(isLoggedIn, createTypeFormulaire);

/**
 * @swagger
 * /type-formulaires:
 *   get:
 *     summary: Récupérer tous les types de formulaires
 *     tags: [Types de Formulaires]
 *     responses:
 *       200:
 *         description: Liste des types de formulaires récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TypeFormulaire'
 */
router.route('/type-formulaires').get(getAllTypeFormulaires);

/**
 * @swagger
 * /type-formulaires/{id}:
 *   get:
 *     summary: Récupérer un type de formulaire par son ID
 *     tags: [Types de Formulaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du type de formulaire à récupérer
 *     responses:
 *       200:
 *         description: Type de formulaire récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TypeFormulaire'
 *       404:
 *         description: Type de formulaire non trouvé
 */
router.route('/type-formulaires/:id').get(getTypeFormulaireById);

/**
 * @swagger
 * /type-formulaires/{id}:
 *   put:
 *     summary: Modifier un type de formulaire
 *     tags: [Types de Formulaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du type de formulaire à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TypeFormulaire'
 *     responses:
 *       200:
 *         description: Type de formulaire modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TypeFormulaire'
 *       404:
 *         description: Type de formulaire non trouvé
 */
router.route('/type-formulaires/:id').put(isLoggedIn, updateTypeFormulaire);

/**
 * @swagger
 * /type-formulaires/{id}:
 *   delete:
 *     summary: Supprimer un type de formulaire
 *     tags: [Types de Formulaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du type de formulaire à supprimer
 *     responses:
 *       200:
 *         description: Type de formulaire supprimé avec succès
 *       404:
 *         description: Type de formulaire non trouvé
 */
router.route('/type-formulaires/:id').delete(isLoggedIn, deleteTypeFormulaire);

module.exports = router;
