const { Schema, model } = require('mongoose');

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
 *         - grade
 *         - fonction
 *         - phone
 *         - provinces
 *         - isActive
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
 *           enum: ['Administrateur', 'Utilisateur', 'Superviseur', 'Inspecteur', 'Décideur']
 *           description: Rôle de l'utilisateur dans le système
 *         provinces:
 *           type: string
 *           description: Province de la direction de l'utilisateur
 *         direction:
 *           type: string
 *           description: Direction ou département de l'utilisateur
 *         sousDirection:
 *           type: string
 *           description: Sous-direction de la direction de l'utilisateur
 *         service:
 *           type: string
 *           description: Service spécifique de l'utilisateur
 *         grade:
 *           type: string
 *           description: Grade de l'utilisateur
 *         fonction:
 *           type: string
 *           description: Fonction de l'utilisateur
 *         phone:
 *           type: string
 *           description: Numéro de téléphone de l'utilisateur
 *         niveauOuDiscipline: 
 *           type: string
 *           description: niveau de l'inspecteur ou sa descipline
 *         isActive:
 *           type: boolean
 *           description: Indicateur d'activité de l'utilisateur
 */

const userSchema = new Schema({
  password: { type: String, required: true },
  nom: { type: String, required: true },
  postnom: { type: String, required: true },
  prenom: { type: String, required: true },
  photo: { type: String, required: true },
  email: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Administrateur', 'Utilisateur', 'Superviseur', 'Inspecteur', 'Décideur'],
    required: true 
  },
  provinces: { type: String, required: true },
  direction: { type: Schema.Types.ObjectId, ref: 'Direction', required: true }, // Référence à Direction
  sousDirection: { type: Schema.Types.ObjectId, ref: 'SousDirection' }, // Référence à SousDirection
  service: { type: Schema.Types.ObjectId, ref: 'Service', required: true }, // Référence à Service
  phone: { type: String, required: true },
  grade: { type: String, required: true },
  fonction: { type: String, required: true },
  niveauOuDiscipline: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false });

module.exports.User = model('User', userSchema);
