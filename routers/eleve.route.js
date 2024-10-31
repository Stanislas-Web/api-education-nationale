const router = require('express').Router();
const { 
  createEleve, 
  getAllEleves, 
  getEleveById, 
  getElevesByEcole,
  getElevesBySousDirection,
  updateEleve, 
  deleteEleve 
} = require('../controllers/eleve.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /eleves:
 *   post:
 *     summary: Création d'un nouvel élève
 *     tags: [Élèves]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Eleve'
 *     responses:
 *       201:
 *         description: Élève créé avec succès
 */
router.route('/eleves').post(isLoggedIn, createEleve);

/**
 * @swagger
 * /eleves:
 *   get:
 *     summary: Récupérer tous les élèves
 *     tags: [Élèves]
 *     responses:
 *       200:
 *         description: Liste des élèves récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Eleve'
 */
router.route('/eleves').get(isLoggedIn, getAllEleves);

/**
 * @swagger
 * /eleves/{id}:
 *   get:
 *     summary: Récupérer un élève par ID
 *     tags: [Élèves]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Élève récupéré avec succès
 */
router.route('/eleves/:id').get(isLoggedIn, getEleveById);

/**
 * @swagger
 * /eleves/ecole/{id}:
 *   get:
 *     summary: Récupérer les élèves par école
 *     tags: [Élèves]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Élèves récupérés avec succès
 */
router.route('/eleves/ecole/:id').get(isLoggedIn, getElevesByEcole);

/**
 * @swagger
 * /eleves/sousdirection/{id}:
 *   get:
 *     summary: Récupérer les élèves par sous-direction
 *     tags: [Élèves]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Élèves récupérés avec succès
 */
router.route('/eleves/sousdirection/:id').get(isLoggedIn, getElevesBySousDirection);

/**
 * @swagger
 * /eleves/{id}:
 *   put:
 *     summary: Modifier un élève
 *     tags: [Élèves]
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
 *             $ref: '#/components/schemas/Eleve'
 *     responses:
 *       200:
 *         description: Élève mis à jour avec succès
 */
router.route('/eleves/:id').put(isLoggedIn, updateEleve);

/**
 * @swagger
 * /eleves/{id}:
 *   delete:
 *     summary: Supprimer un élève
 *     tags: [Élèves]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Élève supprimé avec succès
 */
router.route('/eleves/:id').delete(isLoggedIn, deleteEleve);

module.exports = router;
