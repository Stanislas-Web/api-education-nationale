const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     RapportInspection:
 *       type: object
 *       required:
 *         - inspecteur
 *         - anneeScolaire
 *         - activitesRealisees
 *       properties:
 *         inspecteur:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *               description: Nom complet de l'inspecteur.
 *             sexe:
 *               type: string
 *               enum: [M, F]
 *               description: Sexe de l'inspecteur.
 *             niveauDiscipline:
 *               type: string
 *               description: Niveau et discipline de l'inspecteur.
 *             posteAttache:
 *               type: string
 *               description: Poste d'attache de l'inspecteur.
 *             telephone:
 *               type: string
 *               description: Numéro de téléphone de l'inspecteur.
 *             email:
 *               type: string
 *               description: Adresse email de l'inspecteur.
 *         anneeScolaire:
 *           type: object
 *           properties:
 *             debut:
 *               type: integer
 *               description: Année de début de l'année scolaire.
 *             fin:
 *               type: integer
 *               description: Année de fin de l'année scolaire.
 *         activitesRealisees:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               mois:
 *                 type: string
 *                 description: Mois d'exécution de l'activité.
 *               dateDebut:
 *                 type: string
 *                 format: date
 *                 description: Date de début de l'activité.
 *               dateFin:
 *                 type: string
 *                 format: date
 *                 description: Date de fin de l'activité.
 *               lieuEtablissement:
 *                 type: string
 *                 description: Lieu ou établissement inspecté.
 *               nombreClasses:
 *                 type: integer
 *                 description: Nombre de classes inspectées.
 *               typeActivite:
 *                 type: string
 *                 description: Type d'activité réalisée.
 *               nombreJours:
 *                 type: integer
 *                 description: Nombre de jours de l'activité.
 *         syntheseTotaux:
 *           type: object
 *           properties:
 *             sousTotaux:
 *               type: object
 *               properties:
 *                 nombreClasses:
 *                   type: integer
 *                 nombreActivites:
 *                   type: integer
 *                 nombreJours:
 *                   type: integer
 *             totalGeneral:
 *               type: object
 *               properties:
 *                 nombreClasses:
 *                   type: integer
 *                 nombreActivites:
 *                   type: integer
 *                 nombreJours:
 *                   type: integer
 *         validation:
 *           type: object
 *           properties:
 *             lieu:
 *               type: string
 *               description: Lieu de validation du rapport.
 *             date:
 *               type: string
 *               format: date
 *               description: Date de validation du rapport.
 *             nomInspecteur:
 *               type: string
 *               description: Nom de l'inspecteur validant le rapport.
 *             signature:
 *               type: string
 *               description: Signature électronique ou référence à une signature.
 */

const rapportInspectionSchema = new Schema({
    code: {
        type: String,
        default: "A1",
        immutable: true, // Pour rendre le champ code immuable
    },
    inspecteur: {
        nom: { type: String, required: true },
        sexe: { type: String, enum: ['M', 'F'], required: true },
        niveauDiscipline: { type: String, required: true },
        posteAttache: { type: String, required: true },
        telephone: { type: String, required: true },
        email: { type: String, required: true },
    },
    anneeScolaire: {
        debut: { type: Number, required: true },
        fin: { type: Number, required: true },
    },
    activitesRealisees: [
        {
            mois: { type: String, required: true },
            dateDebut: { type: Date, required: true },
            dateFin: { type: Date, required: true },
            lieuEtablissement: { type: String, required: true },
            nombreClasses: { type: Number, default: 0 },
            typeActivite: { type: String, required: true },
            nombreJours: { type: Number, default: 0 },
        },
    ],
    syntheseTotaux: {
        sousTotaux: {
            nombreClasses: { type: Number, default: 0 },
            nombreActivites: { type: Number, default: 0 },
            nombreJours: { type: Number, default: 0 },
        },
        totalGeneral: {
            nombreClasses: { type: Number, default: 0 },
            nombreActivites: { type: Number, default: 0 },
            nombreJours: { type: Number, default: 0 },
        },
    },
    validation: {
        lieu: { type: String, required: true },
        date: { type: Date, required: true },
        nomInspecteur: { type: String, required: true },
        signature: { type: String },
    },
}, { timestamps: true, versionKey: false });

module.exports.RapportInspection = model('RapportInspection', rapportInspectionSchema);
