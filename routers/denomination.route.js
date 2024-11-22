const router = require('express').Router();
const { 
  createDenomination, 
  getAllDenominations, 
  getDenominationById, 
  updateDenomination, 
  deleteDenomination, 
  createManyDenominations 
} = require('../controllers/denomination.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /denominations:
 *   post:
 *     summary: Création d'une nouvelle dénomination
 *     tags: [Denominations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Denomination'
 *     responses:
 *       201:
 *         description: Dénomination créée avec succès
 */
router.route('/denominations').post(isLoggedIn, createDenomination);

/**
 * @swagger
 * /denominations/many:
 *   post:
 *     summary: Création de plusieurs dénominations
 *     tags: [Denominations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               denominations:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Denomination'
 *     responses:
 *       200:
 *         description: Toutes les dénominations ont été insérées avec succès
 *       500:
 *         description: Erreur lors de l'insertion des dénominations
 */
router.route('/denominations/many').post(isLoggedIn, createManyDenominations);

/**
 * @swagger
 * /denominations:
 *   get:
 *     summary: Récupérer toutes les dénominations
 *     tags: [Denominations]
 *     responses:
 *       200:
 *         description: Liste des dénominations récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Denomination'
 */
router.route('/denominations').get(isLoggedIn, getAllDenominations);

/**
 * @swagger
 * /denominations/{id}:
 *   get:
 *     summary: Récupérer une dénomination par ID
 *     tags: [Denominations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID de la dénomination
 *     responses:
 *       200:
 *         description: Dénomination récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Denomination'
 *       404:
 *         description: Dénomination non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.route('/denominations/:id').get(isLoggedIn, getDenominationById);

/**
 * @swagger
 * /denominations/{id}:
 *   put:
 *     summary: Modifier une dénomination
 *     tags: [Denominations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID de la dénomination à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Denomination'
 *     responses:
 *       200:
 *         description: Dénomination mise à jour avec succès
 */
router.route('/denominations/:id').put(isLoggedIn, updateDenomination);

/**
 * @swagger
 * /denominations/{id}:
 *   delete:
 *     summary: Supprimer une dénomination
 *     tags: [Denominations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID de la dénomination à supprimer
 *     responses:
 *       200:
 *         description: Dénomination supprimée avec succès
 */
router.route('/denominations/:id').delete(isLoggedIn, deleteDenomination);

module.exports = router;
