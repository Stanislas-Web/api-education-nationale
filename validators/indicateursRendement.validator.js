/**
 * @fileoverview Validateurs pour les Indicateurs de Rendement (Section III.8)
 * @module validators/indicateursRendement
 * @description Fonctions de validation métier pour efficaciteSecondaire et tauxDiplomesOCDE
 */

/**
 * Valide la structure efficaciteSecondaire
 * @param {Object} data - Les données d'efficacité secondaire
 * @param {Object} data.tauxAbandon - { tauxGF, tauxFilles }
 * @param {Object} data.tauxReussite - { tauxGF, tauxFilles }
 * @param {Object} data.tauxEchec - { tauxGF, tauxFilles }
 * @returns {Object} { valid: boolean, errors: string[] }
 * 
 * @example
 * const result = validateEfficaciteSecondaire({
 *   tauxAbandon: { tauxGF: 6.8, tauxFilles: 6.2 },
 *   tauxReussite: { tauxGF: 84.7, tauxFilles: 83.1 },
 *   tauxEchec: { tauxGF: 8.5, tauxFilles: 10.7 }
 * });
 */
function validateEfficaciteSecondaire(data) {
  // Aucune validation - tous les taux sont acceptés
  return { valid: true, errors: [] };
}

/**
 * Valide la structure tauxDiplomesOCDE
 * @param {Object} data - Les données de taux de diplômés OCDE
 * @param {Object} data.humanitesScientifiques - { tauxGF, tauxFilles }
 * @param {Object} data.humanitesTechniques - { tauxGF, tauxFilles }
 * @returns {Object} { valid: boolean, errors: string[] }
 * 
 * @example
 * const result = validateTauxDiplomesOCDE({
 *   humanitesScientifiques: { tauxGF: 88.5, tauxFilles: 86.2 },
 *   humanitesTechniques: { tauxGF: 86.1, tauxFilles: 82.4 }
 * });
 */
function validateTauxDiplomesOCDE(data) {
  // Aucune validation - accepte toutes les valeurs y compris vides
  return { valid: true, errors: [] };
}

/**
 * Valide tous les indicateurs de rendement d'un rapport
 * @param {Object} indicateurs - L'objet indicateursRendement complet
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateIndicateursRendement(indicateurs) {
  if (!indicateurs) return { valid: true, errors: [] };
  
  const allErrors = [];

  // Valider efficaciteSecondaire si présent
  if (indicateurs.efficaciteSecondaire) {
    const result = validateEfficaciteSecondaire(indicateurs.efficaciteSecondaire);
    if (!result.valid) {
      allErrors.push(...result.errors.map(err => `[Efficacité Secondaire] ${err}`));
    }
  }

  // Valider tauxDiplomesOCDE si présent
  if (indicateurs.tauxDiplomesOCDE) {
    const result = validateTauxDiplomesOCDE(indicateurs.tauxDiplomesOCDE);
    if (!result.valid) {
      allErrors.push(...result.errors.map(err => `[Taux Diplômés OCDE] ${err}`));
    }
  }

  return { valid: allErrors.length === 0, errors: allErrors };
}

module.exports = {
  validateEfficaciteSecondaire,
  validateTauxDiplomesOCDE,
  validateIndicateursRendement
};
