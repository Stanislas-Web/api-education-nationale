const { Schema, model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     InspectionFinanciere:
 *       type: object
 *       required:
 *         - numeroRapport
 *         - inspecteur
 *         - etablissement
 *       properties:
 *         numeroRapport:
 *           type: string
 *           description: Numéro unique du rapport d'inspection
 *         codeFormulaire:
 *           type: string
 *           default: "C4"
 *           description: Code du formulaire (C4)
 *         inspecteur:
 *           type: string
 *           format: uuid
 *           description: Référence à l'inspecteur
 *         etablissement:
 *           type: string
 *           format: uuid
 *           description: Référence à l'établissement
 *         ordonnateur:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *               description: Nom et post-nom de l'ordonnateur
 *             fonction:
 *               type: string
 *               description: Fonction de l'ordonnateur
 *             ordre:
 *               type: string
 *               description: Ordre (numéro, date, numéro)
 *         gestionFinanciere:
 *           type: object
 *           properties:
 *             previsionBudgetaire:
 *               type: object
 *               properties:
 *                 estimationRecettes:
 *                   type: number
 *                 estimationDepenses:
 *                   type: number
 *                 estimationDisponible:
 *                   type: number
 *             controleRecettes:
 *               type: object
 *               properties:
 *                 contributionCaractereObligatoire:
 *                   type: object
 *                   properties:
 *                     minerval:
 *                       type: number
 *                     fraisFonctionnement:
 *                       type: number
 *                     fraisEtatTENAFEP:
 *                       type: number
 *                     fraisAssuranceScolaire:
 *                       type: number
 *                     fraisMedicaux:
 *                       type: number
 *                     fraisInterventionPonctuelle:
 *                       type: number
 *                     fraisImprevus:
 *                       type: number
 *                     tauxAutorise:
 *                       type: number
 *                     tauxPratique:
 *                       type: number
 *                     ref:
 *                       type: string
 *                 autresContributions:
 *                   type: string
 *                   description: Autres contributions à caractère obligatoire (à préciser)
 *                 autresEncaissements:
 *                   type: string
 *                   description: Autres encaissements (à préciser)
 *                 produitAutofinancement:
 *                   type: string
 *                   description: Produit de l'autofinancement
 *                 controlePrets:
 *                   type: string
 *                   description: Contrôle des prêts (interroger les bénéficiaires)
 *                 controleImpayes:
 *                   type: string
 *                   description: Contrôle des impayés (évaluer les possibilités des cas)
 *             controleDepenses:
 *               type: object
 *               properties:
 *                 depensesObligatoires:
 *                   type: object
 *                   properties:
 *                     minerval:
 *                       type: number
 *                     fraisFonctionnement:
 *                       type: number
 *                     fraisExamenEtat:
 *                       type: number
 *                     fraisAssuranceScolaire:
 *                       type: number
 *                     fraisMedicaux:
 *                       type: number
 *                     fraisInterventionPonctuelle:
 *                       type: number
 *                     fraisImprevus:
 *                       type: number
 *                     ref:
 *                       type: string
 *                 depensesFonctionnement:
 *                   type: string
 *                 depensesInvestissement:
 *                   type: string
 *                 depensesAutofinancement:
 *                   type: string
 *                 controleRapportsComptables:
 *                   type: string
 *                 controleSoldes:
 *                   type: string
 *         gestionComptable:
 *           type: object
 *           properties:
 *             conformiteSystemeRegime:
 *               type: string
 *             fiabiliteJustificatifs:
 *               type: string
 *             exhaustiviteOperations:
 *               type: string
 *             exactitudeCalculs:
 *               type: string
 *             regulariteLivre:
 *               type: string
 *         irregularites:
 *           type: string
 *           description: Irrégularités constatées
 *         observationsConseils:
 *           type: string
 *           description: Observations et conseils
 *         avis:
 *           type: string
 *           description: Avis de l'inspecteur
 *         signatureChefEtablissement:
 *           type: string
 *           description: Signature du chef d'établissement
 *         signatureInspecteur:
 *           type: string
 *           description: Signature de l'inspecteur
 *         dateInspection:
 *           type: Date
 *           default: Date.now
 *           description: Date de l'inspection
 */

const inspectionFinanciereSchema = new Schema({
  numeroRapport: {
    type: String,
    required: true,
    unique: true
  },
  codeFormulaire: {
    type: String,
    default: "C4"
  },
  inspecteur: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  etablissement: {
    type: Schema.Types.ObjectId,
    ref: 'Ecole',
    required: true
  },
  ordonnateur: {
    nom: String,
    fonction: String,
    ordre: String
  },
  gestionFinanciere: {
    previsionBudgetaire: {
      estimationRecettes: Number,
      estimationDepenses: Number,
      estimationDisponible: Number
    },
    controleRecettes: {
      contributionCaractereObligatoire: {
        minerval: Number,
        fraisFonctionnement: Number,
        fraisEtatTENAFEP: Number,
        fraisAssuranceScolaire: Number,
        fraisMedicaux: Number,
        fraisInterventionPonctuelle: Number,
        fraisImprevus: Number,
        tauxAutorise: Number,
        tauxPratique: Number,
        ref: String
      },
      autresContributions: String,
      autresEncaissements: String,
      produitAutofinancement: String,
      controlePrets: String,
      controleImpayes: String
    },
    controleDepenses: {
      depensesObligatoires: {
        minerval: Number,
        fraisFonctionnement: Number,
        fraisExamenEtat: Number,
        fraisAssuranceScolaire: Number,
        fraisMedicaux: Number,
        fraisInterventionPonctuelle: Number,
        fraisImprevus: Number,
        ref: String
      },
      depensesFonctionnement: String,
      depensesInvestissement: String,
      depensesAutofinancement: String,
      controleRapportsComptables: String,
      controleSoldes: String
    }
  },
  gestionComptable: {
    conformiteSystemeRegime: String,
    fiabiliteJustificatifs: String,
    exhaustiviteOperations: String,
    exactitudeCalculs: String,
    regulariteLivre: String
  },
  irregularites: String,
  observationsConseils: String,
  avis: String,
  signatureChefEtablissement: String,
  signatureInspecteur: String,
  dateInspection: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = model('InspectionFinanciere', inspectionFinanciereSchema);