const router = require('express').Router();
const { createPermission, getAllPermissions, updatePermission, deletePermission } = require('../controllers/permission.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: Créer une nouvelle permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       201:
 *         description: Permission créée avec succès
 */
router.route('/permissions').post(isLoggedIn, createPermission);

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Récupérer toutes les permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: Liste des permissions récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 */
router.route('/permissions').get(isLoggedIn, getAllPermissions);

/**
 * @swagger
 * /permissions/{id}:
 *   put:
 *     summary: Modifier une permission par ID
 *     tags: [Permissions]
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
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       200:
 *         description: Permission mise à jour avec succès
 */
router.route('/permissions/:id').put(isLoggedIn, updatePermission);

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     summary: Supprimer une permission par ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission supprimée avec succès
 */
router.route('/permissions/:id').delete(isLoggedIn, deletePermission);

module.exports = router;
