const router = require('express').Router();
const { signUp, login, getAllUsers, updateUser, deleteUser, toggleUserStatus, uploadUserPhoto, getUserPhoto } = require('../controllers/user.controller');
const {isLoggedIn} = require('../middleware');
const upload = require('../config/multer');
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 */
router.route('/signup').post(signUp);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentification échouée
 */
router.route('/login').post(login);
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentification échouée
 *       500:
 *         description: Erreur du serveur
 */
router.route('/users').get(isLoggedIn,getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Modification d'un utilisateur
 *     tags: [Users]
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
 *               - email
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               nom:
 *                 type: string
 *                 example: "John"
 *               postnom:
 *                 type: string
 *                 example: "Doe"
 *               prenom:
 *                 type: string
 *                 example: "John"
 *               photo:
 *                 type: string
 *                 example: "photo.jpg"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: ["Administrateur", "Utilisateur", "Superviseur", "Inspecteur", "Décideur"]
 *                 example: "Utilisateur"
 *               direction:
 *                 type: string
 *                 example: "Direction 1"
 *               statut:
 *                 type: string
 *                 example: "Actif"
 *               service:
 *                 type: string
 *                 example: "Service 1"
 *               fonction:
 *                 type: string
 *                 example: "Fonction 1"
 *               grade:
 *                 type: string
 *                 example: "grade 1"
 *               provinces:
 *                 type: string
 *                 example: "Kinshasa"
 * 
 *               phone:
 *                 type: string
 *                 example: "123456789"
 *               isActive:
 *                 type: boolean
 *                 example: true

 *     responses:
 *       201:
 *         description: Utilisateur modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur modifié avec succès"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentification échouée
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */

router.route('/users/:id').put(isLoggedIn,updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
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
router.route('/users/:id').delete(isLoggedIn,deleteUser);

/**
 * @swagger
 * /users/{id}/status:
 *   patch:
 *     summary: Activer ou désactiver un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à activer ou désactiver
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [enable, disable]
 *                 description: L'action à effectuer, soit 'enable' pour activer, soit 'disable' pour désactiver
 *                 example: "disable"
 *     responses:
 *       200:
 *         description: Utilisateur activé ou désactivé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur activé avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.route('/users/:id/status').patch(isLoggedIn, toggleUserStatus);
/**
 * @swagger
 * /users/{id}/upload-photo:
 *   post:
 *     summary: Upload une image pour un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image téléchargée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image téléchargée avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Aucun fichier téléchargé
 *       500:
 *         description: Erreur interne du serveur
 */
router.route('/users/:id/upload-photo')
  .post(isLoggedIn, upload.single('photo'), uploadUserPhoto);

/**
 * @swagger
 * /users/{id}/photo:
 *   get:
 *     summary: Récupérer la photo de l'utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Image récupérée avec succès
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image non trouvée
 *       500:
 *         description: Erreur du serveur
 */
router.route('/users/:id/photo').get(isLoggedIn, getUserPhoto);
  



module.exports = router;
