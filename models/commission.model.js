// models/Commission.model.js

const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Commission:
 *       type: object
 *       required:
 *         - name
 *         - creationDate
 *         - objective
 *         - initiator
 *         - candidate
 *         - position
 *         - direction
 *         - service
 *         - status
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the commission
 *         creationDate:
 *           type: string
 *           description: Creation date of the commission
 *         objective:
 *           type: string
 *           description: Objective of the commission
 *         initiator:
 *           type: string
 *           description: ID reference to the initiating User
 *         candidate:
 *           type: string
 *           description: Candidate being considered by the commission
 *         position:
 *           type: string
 *           description: Position related to the commission
 *         direction:
 *           type: string
 *           description: Direction associated with the commission
 *         service:
 *           type: string
 *           description: Service involved with the commission
 *         status:
 *           type: string
 *           description: Current status of the commission
 */

const CommissionSchema = new Schema(
  {
    name: { type: String, required: true },
    creationDate: { type: String, required: true },
    objective: { type: String, required: true },
    initiator: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    candidate: { type: String, required: true },
    position: { type: String, required: true },
    direction: { type: String, required: true },
    service: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model('Commission', CommissionSchema);
