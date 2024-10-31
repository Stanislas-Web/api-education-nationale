const router = require('express').Router();
const { createBesoinRessource, getAllBesoinsRessources, getBesoinRessourceByEcole, updateBesoinRessource, deleteBesoinRessource, getBesoinsRessourcesBySousDirection } = require('../controllers/besoinRessource.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /besoin-ressources:
 *   post:
 *     summary: Créer de nouveaux besoins en ressources
 *     tags: [Besoins en Ressources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BesoinRessource'
 *     responses:
 *       201:
 *         description: Besoins en ressources créés avec succès
 */
router.route('/besoin-ressources').post(isLoggedIn, createBesoinRessource);

/**
 * @swagger
 * /besoin-ressources:
 *   get:
 *     summary: Récupérer tous les besoins en ressources
 *     tags: [Besoins en Ressources]
 *     responses:
 *       200:
 *         description: Liste des besoins en ressources récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BesoinRessource'
 */
router.route('/besoin-ressources').get(isLoggedIn, getAllBesoinsRessources);

/**
 * @swagger
 * /besoin-ressources/ecole/{ecoleId}:
 *   get:
 *     summary: Récupérer les besoins en ressources par école
 *     tags: [Besoins en Ressources]
 *     parameters:
 *       - in: path
 *         name: ecoleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Besoins en ressources récupérés avec succès pour l'école
 */
router.route('/besoin-ressources/ecole/:ecoleId').get(isLoggedIn, getBesoinRessourceByEcole);

/**
 * @swagger
 * /besoin-ressources/sous-direction/{sousDirectionId}:
 *   get:
 *     summary: Récupérer les besoins en ressources par sous-direction
 *     tags: [Besoins en Ressources]
 *     parameters:
 *       - in: path
 *         name: sousDirectionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Besoins en ressources récupérés avec succès pour la sous-direction
 */
router.route('/besoin-ressources/sous-direction/:sousDirectionId').get(isLoggedIn, getBesoinsRessourcesBySousDirection);

/**
 * @swagger
 * /besoin-ressources/{id}:
 *   put:
 *     summary: Mettre à jour un besoin en ressources
 *     tags: [Besoins en Ressources]
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
 *             $ref: '#/components/schemas/BesoinRessource'
 *     responses:
 *       200:
 *         description: Besoins en ressources mis à jour avec succès
 */
router.route('/besoin-ressources/:id').put(isLoggedIn, updateBesoinRessource);

/**
 * @swagger
 * /besoin-ressources/{id}:
 *   delete:
 *     summary: Supprimer un besoin en ressources
 *     tags: [Besoins en Ressources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Besoins en ressources supprimés avec succès
 */
router.route('/besoin-ressources/:id').delete(isLoggedIn, deleteBesoinRessource);

module.exports = router;
