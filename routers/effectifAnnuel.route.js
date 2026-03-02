const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const {
  getEffectifsPreviousYear,
  saveEffectifs,
  getAllEffectifsByProved,
  getLastEffectif
} = require('../controllers/effectifAnnuel.controller');

/**
 * @swagger
 * tags:
 *   name: EffectifAnnuel
 *   description: API pour la gestion des effectifs annuels
 */

/**
 * Récupérer les effectifs de l'année précédente
 */
router.get('/effectif-annuel/previous/:identificationProved/:annee', isLoggedIn, getEffectifsPreviousYear);

/**
 * Récupérer le dernier effectif enregistré d'une PROVED
 */
router.get('/effectif-annuel/last/:identificationProved', isLoggedIn, getLastEffectif);

/**
 * Récupérer l'historique complet des effectifs d'une PROVED
 */
router.get('/effectif-annuel/historique/:identificationProved', isLoggedIn, getAllEffectifsByProved);

/**
 * Sauvegarder manuellement des effectifs
 */
router.post('/effectif-annuel', isLoggedIn, saveEffectifs);

module.exports = router;
