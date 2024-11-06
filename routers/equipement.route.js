// routes/equipement.route.js

const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const { 
  createEquipement, 
  getAllEquipements, 
  getEquipementById, 
  updateEquipement, 
  deleteEquipement, 
  createManyEquipements 
} = require('../controllers/equipement.controller');

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
router.route('/equipements').post(isLoggedIn, createEquipement);

/**
 * @swagger
 * /equipements/many:
 *   post:
 *     summary: Créer plusieurs équipements
 *     tags: [Equipements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equipements:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Equipement'
 *     responses:
 *       200:
 *         description: Tous les équipements ont été créés avec succès
 */
router.route('/equipements/many').post(isLoggedIn, createManyEquipements);

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
router.route('/equipements').get(isLoggedIn, getAllEquipements);

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
router.route('/equipements/:id').get(isLoggedIn, getEquipementById);

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
router.route('/equipements/:id').put(isLoggedIn, updateEquipement);

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
router.route('/equipements/:id').delete(isLoggedIn, deleteEquipement);

module.exports = router;
