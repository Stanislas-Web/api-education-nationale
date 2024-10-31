// routes/equipement.route.js

const express = require('express');
const router = express.Router();
const { createEquipement, getAllEquipements, getEquipementById, updateEquipement, deleteEquipement } = require('../controllers/equipement.controller');

/**
 * @swagger
 * /equipements:
 *   post:
 *     summary: Créer un nouvel équipement
 *     tags: [Equipements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipement'
 *     responses:
 *       201:
 *         description: Équipement créé avec succès
 */
router.post('/equipements', createEquipement);

/**
 * @swagger
 * /equipements:
 *   get:
 *     summary: Obtenir tous les équipements
 *     tags: [Equipements]
 *     responses:
 *       200:
 *         description: Liste de tous les équipements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipement'
 */
router.get('/equipements', getAllEquipements);

/**
 * @swagger
 * /equipements/{id}:
 *   get:
 *     summary: Obtenir un équipement par son ID
 *     tags: [Equipements]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'équipement
 *     responses:
 *       200:
 *         description: Équipement trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipement'
 */
router.get('/equipements/:id', getEquipementById);

/**
 * @swagger
 * /equipements/{id}:
 *   put:
 *     summary: Mettre à jour un équipement
 *     tags: [Equipements]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'équipement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipement'
 *     responses:
 *       200:
 *         description: Équipement mis à jour avec succès
 */
router.put('/equipements/:id', updateEquipement);

/**
 * @swagger
 * /equipements/{id}:
 *   delete:
 *     summary: Supprimer un équipement
 *     tags: [Equipements]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'équipement
 *     responses:
 *       200:
 *         description: Équipement supprimé avec succès
 */
router.delete('/equipements/:id', deleteEquipement);

module.exports = router;
