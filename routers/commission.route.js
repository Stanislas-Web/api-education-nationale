// routes/commission.route.js

const router = require('express').Router();
const { createCommission, getAllCommissions, getCommissionById, updateCommission, deleteCommission } = require('../controllers/commission.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /commissions:
 *   post:
 *     summary: Créer une nouvelle commission
 *     tags: [Commissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Commission'
 *     responses:
 *       201:
 *         description: Commission créée avec succès
 */
router.route('/commissions').post(isLoggedIn, createCommission);

/**
 * @swagger
 * /commissions:
 *   get:
 *     summary: Récupérer toutes les commissions
 *     tags: [Commissions]
 *     responses:
 *       200:
 *         description: Liste des commissions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Commission'
 */
router.route('/commissions').get(isLoggedIn, getAllCommissions);

/**
 * @swagger
 * /commissions/{id}:
 *   get:
 *     summary: Récupérer une commission par ID
 *     tags: [Commissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commission
 *     responses:
 *       200:
 *         description: Détails de la commission
 *       404:
 *         description: Commission non trouvée
 */
router.route('/commissions/:id').get(isLoggedIn, getCommissionById);

/**
 * @swagger
 * /commissions/{id}:
 *   put:
 *     summary: Mettre à jour une commission
 *     tags: [Commissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Commission'
 *     responses:
 *       200:
 *         description: Commission mise à jour avec succès
 *       404:
 *         description: Commission non trouvée
 */
router.route('/commissions/:id').put(isLoggedIn, updateCommission);

/**
 * @swagger
 * /commissions/{id}:
 *   delete:
 *     summary: Supprimer une commission
 *     tags: [Commissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commission
 *     responses:
 *       200:
 *         description: Commission supprimée avec succès
 *       404:
 *         description: Commission non trouvée
 */
router.route('/commissions/:id').delete(isLoggedIn, deleteCommission);

module.exports = router;
