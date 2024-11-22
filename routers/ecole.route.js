const router = require('express').Router();
const { 
  createEcole, 
  getAllEcoles, 
  getEcoleById,
  getEcolesBySousDirection, 
  updateEcole, 
  deleteEcole,
  createManyEcoles
} = require('../controllers/ecole.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /ecoles:
 *   post:
 *     summary: Création d'une nouvelle école
 *     tags: [Ecoles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ecole'
 *     responses:
 *       201:
 *         description: École créée avec succès
 */
router.route('/ecoles').post(isLoggedIn, createEcole);
/**
 * @swagger
 * /ecoles/many:
 *   post:
 *     summary: Création de plusieurs écoles
 *     tags: [Ecoles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ecoles:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Ecole'
 *     responses:
 *       200:
 *         description: Toutes les écoles ont été insérées avec succès
 *       500:
 *         description: Erreur lors de l'insertion des écoles
 */
router.route('/ecoles/many').post(isLoggedIn, createManyEcoles);

/**
 * @swagger
 * /ecoles:
 *   get:
 *     summary: Récupérer toutes les écoles
 *     tags: [Ecoles]
 *     responses:
 *       200:
 *         description: Liste des écoles récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ecole'
 */
router.route('/ecoles').get(isLoggedIn, getAllEcoles);

/**
 * @swagger
 * /ecoles/{id}:
 *   get:
 *     summary: Récupérer une école par ID
 *     tags: [Ecoles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID de l'école
 *     responses:
 *       200:
 *         description: École récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ecole'
 *       404:
 *         description: École non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.route('/ecoles/:id').get(isLoggedIn, getEcoleById);

/**
 * @swagger
 * /ecoles/sousDirection/{sousDirectionId}:
 *   get:
 *     summary: Récupérer les écoles par sous-direction
 *     tags: [Ecoles]
 *     parameters:
 *       - in: path
 *         name: sousDirectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sous-direction
 *     responses:
 *       200:
 *         description: Écoles récupérées avec succès par sous-direction
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ecole'
 */
router.route('/ecoles/sousDirection/:sousDirectionId').get(isLoggedIn, getEcolesBySousDirection);

/**
 * @swagger
 * /ecoles/{id}:
 *   put:
 *     summary: Modifier une école
 *     tags: [Ecoles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'école à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ecole'
 *     responses:
 *       200:
 *         description: École mise à jour avec succès
 */
router.route('/ecoles/:id').put(isLoggedIn, updateEcole);

/**
 * @swagger
 * /ecoles/{id}:
 *   delete:
 *     summary: Supprimer une école
 *     tags: [Ecoles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'école à supprimer
 *     responses:
 *       200:
 *         description: École supprimée avec succès
 */
router.route('/ecoles/:id').delete(isLoggedIn, deleteEcole);

module.exports = router;
