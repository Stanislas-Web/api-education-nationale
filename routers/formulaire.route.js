const router = require('express').Router();
const {
  createFormulaire,
  getAllFormulaires,
  getFormulaireById,
  updateFormulaire,
  deleteFormulaire
} = require('../controllers/formulaire.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /formulaires:
 *   post:
 *     summary: Créer un nouveau formulaire
 *     tags: [Formulaires]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Formulaire'
 *     responses:
 *       201:
 *         description: Formulaire créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Formulaire'
 *       400:
 *         description: Données invalides
 */
router.route('/formulaires').post(isLoggedIn, createFormulaire);

/**
 * @swagger
 * /formulaires:
 *   get:
 *     summary: Récupérer tous les formulaires
 *     tags: [Formulaires]
 *     responses:
 *       200:
 *         description: Liste des formulaires récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Formulaire'
 */
router.route('/formulaires').get(getAllFormulaires);

/**
 * @swagger
 * /formulaires/{id}:
 *   get:
 *     summary: Récupérer un formulaire par son ID
 *     tags: [Formulaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du formulaire à récupérer
 *     responses:
 *       200:
 *         description: Formulaire récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Formulaire'
 *       404:
 *         description: Formulaire non trouvé
 */
router.route('/formulaires/:id').get(getFormulaireById);

/**
 * @swagger
 * /formulaires/{id}:
 *   put:
 *     summary: Modifier un formulaire
 *     tags: [Formulaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du formulaire à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Formulaire'
 *     responses:
 *       200:
 *         description: Formulaire modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Formulaire'
 *       404:
 *         description: Formulaire non trouvé
 */
router.route('/formulaires/:id').put(isLoggedIn, updateFormulaire);

/**
 * @swagger
 * /formulaires/{id}:
 *   delete:
 *     summary: Supprimer un formulaire
 *     tags: [Formulaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du formulaire à supprimer
 *     responses:
 *       200:
 *         description: Formulaire supprimé avec succès
 *       404:
 *         description: Formulaire non trouvé
 */
router.route('/formulaires/:id').delete(isLoggedIn, deleteFormulaire);


module.exports = router;
