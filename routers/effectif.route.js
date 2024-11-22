const router = require('express').Router();
const { createEffectif, getEffectifByEcole, getEffectifBySousDirection } = require('../controllers/effectif.controller');

/**
 * @swagger
 * /effectifs:
 *   post:
 *     summary: Créer un effectif pour une école
 *     tags: [Effectifs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ecoleId:
 *                 type: string
 *                 description: ID de l'école
 *     responses:
 *       201:
 *         description: Effectif créé avec succès
 */
router.route('/effectifs').post(createEffectif);

/**
 * @swagger
 * /effectifs/{ecoleId}:
 *   get:
 *     summary: Récupérer l'effectif d'une école par son ID
 *     tags: [Effectifs]
 *     parameters:
 *       - in: path
 *         name: ecoleId
 *         required: true
 *         description: ID de l'école pour laquelle récupérer l'effectif
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Effectif récupéré avec succès
 *       404:
 *         description: Effectif non trouvé
 */
router.route('/effectifs/:ecoleId').get(getEffectifByEcole);

/**
 * @swagger
 * /effectifs/sous-direction/{sousDirectionId}:
 *   get:
 *     summary: Récupérer l'effectif par sous-direction
 *     tags: [Effectifs]
 *     parameters:
 *       - in: path
 *         name: sousDirectionId
 *         required: true
 *         description: ID de la sous-direction pour laquelle récupérer les effectifs
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Effectifs récupérés avec succès
 *       404:
 *         description: Aucune école trouvée pour cette sous-direction
 */
router.route('/effectifs/sous-direction/:sousDirectionId').get(getEffectifBySousDirection);

module.exports = router;
