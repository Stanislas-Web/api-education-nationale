const router = require('express').Router();
const {
  createPresence,
  getAllPresences,
  getPresenceByEleveId,
  updatePresence,
  deletePresence,
  getPresenceByPersonnelId,
} = require('../controllers/presence.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /presences:
 *   post:
 *     summary: Créer un nouvel enregistrement de présence
 *     tags: [Présences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date de la présence
 *               eleveId:
 *                 type: string
 *                 description: ID de l'élève
 *               personnelId:
 *                 type: string
 *                 description: ID du personnel (facultatif)
 *               present:
 *                 type: boolean
 *                 description: Indique si l'élève ou le personnel est présent
 *     responses:
 *       201:
 *         description: Présence créée avec succès
 */
router.post('/presences', isLoggedIn, createPresence);

/**
 * @swagger
 * /presences:
 *   get:
 *     summary: Récupérer tous les enregistrements de présence
 *     tags: [Présences]
 *     responses:
 *       200:
 *         description: Liste des présences récupérée avec succès
 */
router.get('/presences', isLoggedIn, getAllPresences);

/**
 * @swagger
 * /presences/eleve/{id}:
 *   get:
 *     summary: Récupérer les présences d'un élève par ID
 *     tags: [Présences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Présences récupérées avec succès
 *       404:
 *         description: Aucune présence trouvée pour cet élève
 */
router.get('/presences/eleve/:id', isLoggedIn, getPresenceByEleveId);

/**
 * @swagger
 * /presences/{id}:
 *   put:
 *     summary: Mettre à jour un enregistrement de présence
 *     tags: [Présences]
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
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               eleveId:
 *                 type: string
 *               personnelId:
 *                 type: string
 *               present:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Présence mise à jour avec succès
 *       404:
 *         description: Présence non trouvée
 */
router.put('/presences/:id', isLoggedIn, updatePresence);

/**
 * @swagger
 * /presences/{id}:
 *   delete:
 *     summary: Supprimer un enregistrement de présence
 *     tags: [Présences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Présence supprimée avec succès
 *       404:
 *         description: Présence non trouvée
 */
router.delete('/presences/:id', isLoggedIn, deletePresence);

/**
 * @swagger
 * /presences/personnel/{id}:
 *   get:
 *     summary: Récupérer les présences d'un personnel par ID
 *     tags: [Présences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Présences récupérées avec succès
 *       404:
 *         description: Aucune présence trouvée pour ce personnel
 */
router.get('/presences/personnel/:id', isLoggedIn, getPresenceByPersonnelId);

module.exports = router;
