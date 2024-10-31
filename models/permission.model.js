const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       required:
 *         - role
 *         - actions
 *         - resources
 *       properties:
 *         role:
 *           type: string
 *           enum: ['Administrateur', 'Utilisateur', 'Superviseur', 'Inspecteur', 'Décideur']
 *           description: Le rôle auquel les permissions sont associées
 *         actions:
 *           type: array
 *           items:
 *             type: string
 *             enum: ['create', 'read', 'update', 'delete', 'approve']
 *           description: Liste des actions autorisées pour ce rôle
 *         resources:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des ressources auxquelles le rôle a accès
 */
const permissionSchema = new Schema({
  role: {
    type: String,
    enum: ['Administrateur', 'Utilisateur', 'Superviseur', 'Inspecteur', 'Décideur'],
    required: true,
  },
  actions: {
    type: [{
      type: String,
      enum: ['create', 'read', 'update', 'delete', 'approve'],
      required: true,
    }],
    required: true,
  },
  resources: {
    type: [{
      type: String,
    }],
    required: true,
  },
}, { timestamps: true, versionKey: false });

const Permission = model('Permission', permissionSchema);
module.exports = Permission;
