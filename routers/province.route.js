const router = require('express').Router();
const { createProvince, getAllProvinces, updateprovince, deleteprovince } = require('../controllers/province.controller');
const {isLoggedIn} = require('../middleware');
/**
 * @swagger
 * /provinces:
 *   post:
 *     summary: Creation d'une nouvelle province
 *     tags: [Provinces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Province'
 *     responses:
 *       201:
 *         description: Province créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Province'
 *       400:
 *         description: Données invalides
 */
router.route('/provinces').post(isLoggedIn,createProvince);

/**
 * @swagger
 * /Provinces:
 *   get:
 *     summary: Récupérer toutes les provinces
 *     tags: [Provinces]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des provinces récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Province'
 *       401:
 *         description: Authentification échouée
 *       500:
 *         description: Erreur du serveur
 */
router.route('/provinces').get(isLoggedIn,getAllProvinces);

/**
 * @swagger
 * /Provinces/{id}:
 *   put:
 *     summary: Modification d'un utilisateur
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *             properties:
 *               nom:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur modifié avec succès"
 *                 Province:
 *                   $ref: '#/components/schemas/Province'
 *       401:
 *         description: Authentification échouée
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */

router.route('/provinces/:id').put(isLoggedIn,updateprovince);

/**
 * @swagger
 * /Provinces/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur supprimé avec succès"
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.route('/provinces/:id').put(isLoggedIn,deleteprovince);



module.exports = router;
