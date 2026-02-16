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
  if (!data) return { valid: true, errors: [] };
  
  const indicateursRequis = ['tauxAbandon', 'tauxReussite', 'tauxEchec'];
  const errors = [];

  indicateursRequis.forEach(indicateur => {
    if (!data[indicateur]) return;

    const { tauxGF, tauxFilles } = data[indicateur];

    // Validation des types
    if (typeof tauxGF !== 'number' || typeof tauxFilles !== 'number') {
      errors.push(`${indicateur}: tauxGF et tauxFilles doivent être des nombres`);
      return;
    }

    // Validation des plages (0-100%)
    if (tauxGF < 0 || tauxGF > 100) {
      errors.push(`${indicateur}.tauxGF doit être entre 0 et 100 (valeur: ${tauxGF})`);
    }
    if (tauxFilles < 0 || tauxFilles > 100) {
      errors.push(`${indicateur}.tauxFilles doit être entre 0 et 100 (valeur: ${tauxFilles})`);
    }

    // Cohérence logique: tauxFilles ≤ tauxGF
    if (tauxFilles > tauxGF) {
      errors.push(`${indicateur}: tauxFilles (${tauxFilles}%) ne peut pas dépasser tauxGF (${tauxGF}%)`);
    }
  });

  // Validation de la somme des taux (≈ 100%)
  if (data.tauxAbandon && data.tauxReussite && data.tauxEchec) {
    const sommeGF = (data.tauxAbandon.tauxGF || 0) + 
                     (data.tauxReussite.tauxGF || 0) + 
                     (data.tauxEchec.tauxGF || 0);
    
    if (Math.abs(sommeGF - 100) > 0.5) {
      errors.push(
        `La somme des taux GF (${sommeGF.toFixed(1)}%) devrait être proche de 100% ` +
        `(abandon: ${data.tauxAbandon.tauxGF}%, réussite: ${data.tauxReussite.tauxGF}%, échec: ${data.tauxEchec.tauxGF}%)`
      );
    }

    const sommeFilles = (data.tauxAbandon.tauxFilles || 0) + 
                        (data.tauxReussite.tauxFilles || 0) + 
                        (data.tauxEchec.tauxFilles || 0);
    
    if (Math.abs(sommeFilles - 100) > 0.5) {
      errors.push(
        `La somme des taux Filles (${sommeFilles.toFixed(1)}%) devrait être proche de 100% ` +
        `(abandon: ${data.tauxAbandon.tauxFilles}%, réussite: ${data.tauxReussite.tauxFilles}%, échec: ${data.tauxEchec.tauxFilles}%)`
      );
    }
  }

  return { valid: errors.length === 0, errors };
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
  if (!data) return { valid: true, errors: [] };
  
  const filieresRequises = ['humanitesScientifiques', 'humanitesTechniques'];
  const errors = [];

  filieresRequises.forEach(filiere => {
    if (!data[filiere]) return;

    const { tauxGF, tauxFilles } = data[filiere];

    // Validation des types
    if (typeof tauxGF !== 'number' || typeof tauxFilles !== 'number') {
      errors.push(`${filiere}: tauxGF et tauxFilles doivent être des nombres`);
      return;
    }

    // Validation des plages (0-100%)
    if (tauxGF < 0 || tauxGF > 100) {
      errors.push(`${filiere}.tauxGF doit être entre 0 et 100 (valeur: ${tauxGF})`);
    }
    if (tauxFilles < 0 || tauxFilles > 100) {
      errors.push(`${filiere}.tauxFilles doit être entre 0 et 100 (valeur: ${tauxFilles})`);
    }

    // Cohérence logique: tauxFilles ≤ tauxGF
    if (tauxFilles > tauxGF) {
      errors.push(`${filiere}: tauxFilles (${tauxFilles}%) ne peut pas dépasser tauxGF (${tauxGF}%)`);
    }
  });

  // Validation de la somme (≤ 100%)
  if (data.humanitesScientifiques && data.humanitesTechniques) {
    const sommeGF = (data.humanitesScientifiques.tauxGF || 0) + 
                    (data.humanitesTechniques.tauxGF || 0);
    
    if (sommeGF > 100) {
      errors.push(
        `La somme des taux GF (${sommeGF.toFixed(1)}%) ne peut pas dépasser 100% ` +
        `(scientifiques: ${data.humanitesScientifiques.tauxGF}%, techniques: ${data.humanitesTechniques.tauxGF}%)`
      );
    }

    const sommeFilles = (data.humanitesScientifiques.tauxFilles || 0) + 
                        (data.humanitesTechniques.tauxFilles || 0);
    
    if (sommeFilles > 100) {
      errors.push(
        `La somme des taux Filles (${sommeFilles.toFixed(1)}%) ne peut pas dépasser 100% ` +
        `(scientifiques: ${data.humanitesScientifiques.tauxFilles}%, techniques: ${data.humanitesTechniques.tauxFilles}%)`
      );
    }
  }

  return { valid: errors.length === 0, errors };
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
