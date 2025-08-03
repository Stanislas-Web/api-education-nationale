const router = require('express').Router();
const { provedLogin, verifyProvedToken, changeProvedPassword, getProvedProfile, getAllProved, createProved, updateProved, deleteProved } = require('../controllers/provedAuth.controller');
const { isProvedLoggedIn } = require('../middleware');

/**
 * @swagger
 * /proved/login:
 *   post:
 *     summary: Connexion d'une PROVED
 *     tags: [PROVED Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - motDePasse
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Email professionnel ou téléphone de la PROVED
 *               motDePasse:
 *                 type: string
 *                 description: Mot de passe de la PROVED
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/IdentificationProved'
 *                 token:
 *                   type: string
 *       400:
 *         description: Identifiants incorrects
 *       500:
 *         description: Erreur du serveur
 */
router.route('/login').post(provedLogin);

/**
 * @swagger
 * /proved/verify:
 *   get:
 *     summary: Vérifier le token PROVED
 *     tags: [PROVED Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token valide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/IdentificationProved'
 *       401:
 *         description: Token invalide
 */
router.route('/verify').get(verifyProvedToken);

/**
 * @swagger
 * /proved/profile:
 *   get:
 *     summary: Récupérer le profil PROVED
 *     tags: [PROVED Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/IdentificationProved'
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: PROVED non trouvée
 */
router.route('/profile').get(isProvedLoggedIn, getProvedProfile);

/**
 * @swagger
 * /proved/change-password:
 *   post:
 *     summary: Changer le mot de passe PROVED
 *     tags: [PROVED Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ancienMotDePasse
 *               - nouveauMotDePasse
 *             properties:
 *               ancienMotDePasse:
 *                 type: string
 *                 description: Ancien mot de passe
 *               nouveauMotDePasse:
 *                 type: string
 *                 description: Nouveau mot de passe (minimum 6 caractères)
 *     responses:
 *       200:
 *         description: Mot de passe modifié avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: PROVED non trouvée
 */
router.route('/change-password').post(isProvedLoggedIn, changeProvedPassword);

/**
 * @swagger
 * /proved/all:
 *   get:
 *     summary: Récupérer toutes les PROVED
 *     tags: [PROVED Authentication]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filtrer par statut actif
 *     responses:
 *       200:
 *         description: Liste des PROVED récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/IdentificationProved'
 *       500:
 *         description: Erreur du serveur
 */
router.route('/all').get(getAllProved);

/**
 * @swagger
 * /proved/create:
 *   post:
 *     summary: Créer une nouvelle PROVED (admin seulement)
 *     tags: [PROVED Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IdentificationProved'
 *     responses:
 *       201:
 *         description: PROVED créée avec succès
 *       403:
 *         description: Accès refusé (admin seulement)
 *       500:
 *         description: Erreur du serveur
 */
router.route('/create').post(isProvedLoggedIn, createProved);

/**
 * @swagger
 * /proved/{id}:
 *   put:
 *     summary: Mettre à jour une PROVED (admin seulement)
 *     tags: [PROVED Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la PROVED
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IdentificationProved'
 *     responses:
 *       200:
 *         description: PROVED mise à jour avec succès
 *       403:
 *         description: Accès refusé (admin seulement)
 *       404:
 *         description: PROVED non trouvée
 *       500:
 *         description: Erreur du serveur
 */
router.route('/:id').put(isProvedLoggedIn, updateProved);

/**
 * @swagger
 * /proved/{id}:
 *   delete:
 *     summary: Supprimer une PROVED (admin seulement)
 *     tags: [PROVED Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la PROVED
 *     responses:
 *       200:
 *         description: PROVED supprimée avec succès
 *       403:
 *         description: Accès refusé (admin seulement)
 *       404:
 *         description: PROVED non trouvée
 *       500:
 *         description: Erreur du serveur
 */
router.route('/:id').delete(isProvedLoggedIn, deleteProved);

module.exports = router; 