const router = require('express').Router();
const { 
  createPersonnel, 
  getAllPersonnel, 
  getPersonnelById, 
  updatePersonnel, 
  deletePersonnel, 
  getPersonnelByEcole,
  getPersonnelBySousDirection
} = require('../controllers/personnel.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /personnels:
 *   post:
 *     summary: Création d'un nouveau personnel
 *     tags: [Personnel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Personnel'
 *     responses:
 *       201:
 *         description: Personnel créé avec succès
 */
router.route('/personnels').post(isLoggedIn, createPersonnel);

/**
 * @swagger
 * /personnels:
 *   get:
 *     summary: Récupérer tous les personnels
 *     tags: [Personnel]
 *     responses:
 *       200:
 *         description: Liste des personnels récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Personnel'
 */
router.route('/personnels').get(isLoggedIn, getAllPersonnel);

/**
 * @swagger
 * /personnels/{id}:
 *   get:
 *     summary: Récupérer un personnel par ID
 *     tags: [Personnel]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Personnel récupéré avec succès
 */
router.route('/personnels/:id').get(isLoggedIn, getPersonnelById);

/**
 * @swagger
 * /personnels/sous-direction/{sousDirectionId}:
 *   get:
 *     summary: Récupérer le personnel par rapport à une sous-direction
 *     tags: [Personnel]
 *     parameters:
 *       - in: path
 *         name: sousDirectionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Personnel récupéré avec succès par sous-direction
 */
router.route('/personnels/sous-direction/:sousDirectionId').get(isLoggedIn, getPersonnelBySousDirection);
/**
 * @swagger
 * /personnels/ecole/{ecoleId}:
 *   get:
 *     summary: Récupérer le personnel par rapport à une école
 *     tags: [Personnel]
 *     parameters:
 *       - in: path
 *         name: ecoleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Personnel récupéré avec succès par rapport à l'école
 */
router.route('/personnels/ecole/:ecoleId').get(isLoggedIn, getPersonnelByEcole);

/**
 * @swagger
 * /personnels/{id}:
 *   put:
 *     summary: Modifier un personnel
 *     tags: [Personnel]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Personnel'
 *     responses:
 *       200:
 *         description: Personnel mis à jour avec succès
 */
router.route('/personnels/:id').put(isLoggedIn, updatePersonnel);

/**
 * @swagger
 * /personnels/{id}:
 *   delete:
 *     summary: Supprimer un personnel
 *     tags: [Personnel]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Personnel supprimé avec succès
 */
router.route('/personnels/:id').delete(isLoggedIn, deletePersonnel);



module.exports = router;
