const router = require('express').Router();
const { 
  createDiscipline, 
  getAllDisciplines, 
  getDisciplineById, 
  updateDiscipline, 
  deleteDiscipline,
  createManyDisciplines
} = require('../controllers/discipline.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /disciplines:
 *   post:
 *     summary: Création d'une nouvelle discipline
 *     tags: [Disciplines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Discipline'
 *     responses:
 *       201:
 *         description: Discipline créée avec succès
 */
router.route('/disciplines').post(isLoggedIn, createDiscipline);
/**
 * @swagger
 * /disciplines/many:
 *   post:
 *     summary: Création de plusieurs disciplines
 *     tags: [Disciplines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disciplines:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Discipline'
 *     responses:
 *       200:
 *         description: Toutes les disciplines ont été insérées avec succès
 *       500:
 *         description: Erreur lors de l'insertion des disciplines
 */
router.route('/disciplines/many').post(isLoggedIn, createManyDisciplines);


/**
 * @swagger
 * /disciplines:
 *   get:
 *     summary: Récupérer toutes les disciplines
 *     tags: [Disciplines]
 *     responses:
 *       200:
 *         description: Liste des disciplines récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Discipline'
 */
router.route('/disciplines').get(isLoggedIn, getAllDisciplines);

/**
 * @swagger
 * /disciplines/{id}:
 *   get:
 *     summary: Récupérer une discipline par ID
 *     tags: [Disciplines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID de la discipline
 *     responses:
 *       200:
 *         description: Discipline récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discipline'
 *       404:
 *         description: Discipline non trouvée
 */
router.route('/disciplines/:id').get(isLoggedIn, getDisciplineById);

/**
 * @swagger
 * /disciplines/{id}:
 *   put:
 *     summary: Modifier une discipline
 *     tags: [Disciplines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID de la discipline à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Discipline'
 *     responses:
 *       200:
 *         description: Discipline mise à jour avec succès
 */
router.route('/disciplines/:id').put(isLoggedIn, updateDiscipline);

/**
 * @swagger
 * /disciplines/{id}:
 *   delete:
 *     summary: Supprimer une discipline
 *     tags: [Disciplines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID de la discipline à supprimer
 *     responses:
 *       200:
 *         description: Discipline supprimée avec succès
 */
router.route('/disciplines/:id').delete(isLoggedIn, deleteDiscipline);

module.exports = router;
