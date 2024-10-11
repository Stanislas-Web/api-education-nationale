const {Schema, model} = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - password
 *         - nom
 *         - postnom
 *         - prenom
 *         - photo
 *         - email
 *         - role
 *         - direction
 *         - service
 *         - phone
 *       properties:
 *         password:
 *           type: string
 *           description: Mot de passe de l'utilisateur
 *         nom:
 *           type: string
 *           description: Nom de l'utilisateur
 *         postnom:
 *           type: string
 *           description: Post-nom de l'utilisateur
 *         prenom:
 *           type: string
 *           description: Prénom de l'utilisateur
 *         photo:
 *           type: string
 *           description: URL ou chemin de la photo de l'utilisateur
 *         email:
 *           type: string
 *           description: Adresse email de l'utilisateur
 *         role:
 *           type: string
 *           description: Rôle de l'utilisateur dans le système
 *         direction:
 *           type: string
 *           description: Direction ou département de l'utilisateur
 *         service:
 *           type: string
 *           description: Service spécifique de l'utilisateur
 *         phone:
 *           type: string
 *           description: Numéro de téléphone de l'utilisateur
 */
const userSchema = new Schema({
    password: { type: String, required: true },
    nom: { type: String, required: true },
    postnom: { type: String, required: true },
    prenom: { type: String, required: true },
    photo: {type: String, required: true},
    email: {type: String, required: true},
    role: {type: String, required: true},
    direction: {type: String, required: true},
    service: {type: String, required: true},
    phone: {type: String, required: true},
},{timestamps: true, versionKey: false });

module.exports.User = model('User', userSchema);
