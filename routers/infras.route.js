const router = require('express').Router();
const { 
  createInfrastructure, 
  getAllInfrastructures, 
  updateInfrastructure, 
  deleteInfrastructure, 
  createManyInfrastructures 
} = require('../controllers/infrastructure.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /infrastructures:
 *   post:
 *     summary: Créer une nouvelle infrastructure
 *     tags: [Infrastructures]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Infrastructure'
 *     responses:
 *       201:
 *         description: Infrastructure créée avec succès
 *       500:
 *         description: Erreur lors de la création de l'infrastructure
 */
router.route('/infrastructures').post(isLoggedIn, createInfrastructure);

/**
 * @swagger
 * /infrastructures/many:
 *   post:
 *     summary: Créer plusieurs infrastructures
 *     tags: [Infrastructures]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               infrastructures:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Infrastructure'
 *     responses:
 *       200:
 *         description: Toutes les infrastructures ont été insérées avec succès
 *       500:
 *         description: Erreur lors de l'insertion des infrastructures
 */
router.route('/infrastructures/many').post(isLoggedIn, createManyInfrastructures);

/**
 * @swagger
 * /infrastructures:
 *   get:
 *     summary: Récupérer toutes les infrastructures
 *     tags: [Infrastructures]
 *     responses:
 *       200:
 *         description: Liste des infrastructures récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Infrastructure'
 *       500:
 *         description: Erreur lors de la récupération des infrastructures
 */
router.route('/infrastructures').get(isLoggedIn, getAllInfrastructures);

/**
 * @swagger
 * /infrastructures/{id}:
 *   put:
 *     summary: Modifier une infrastructure par ID
 *     tags: [Infrastructures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'infrastructure à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Infrastructure'
 *     responses:
 *       200:
 *         description: Infrastructure mise à jour avec succès
 *       404:
 *         description: Infrastructure non trouvée
 *       500:
 *         description: Erreur lors de la mise à jour de l'infrastructure
 */
router.route('/infrastructures/:id').put(isLoggedIn, updateInfrastructure);

/**
 * @swagger
 * /infrastructures/{id}:
 *   delete:
 *     summary: Supprimer une infrastructure par ID
 *     tags: [Infrastructures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'infrastructure à supprimer
 *     responses:
 *       200:
 *         description: Infrastructure supprimée avec succès
 *       404:
 *         description: Infrastructure non trouvée
 *       500:
 *         description: Erreur lors de la suppression de l'infrastructure
 */
router.route('/infrastructures/:id').delete(isLoggedIn, deleteInfrastructure);

module.exports = router;
