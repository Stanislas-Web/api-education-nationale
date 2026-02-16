/**
 * @fileoverview Tests pour les Indicateurs de Rendement (Section III.8)
 * @description Tests unitaires pour efficaciteSecondaire et tauxDiplomesOCDE
 */

const { validateEfficaciteSecondaire, validateTauxDiplomesOCDE, validateIndicateursRendement } = require('../validators/indicateursRendement.validator');

describe('Validateurs - Indicateurs de Rendement', () => {
  
  describe('validateEfficaciteSecondaire()', () => {
    
    it('devrait valider des données correctes', () => {
      const data = {
        tauxAbandon: { tauxGF: 6.8, tauxFilles: 6.2 },
        tauxReussite: { tauxGF: 84.7, tauxFilles: 83.1 },
        tauxEchec: { tauxGF: 8.5, tauxFilles: 10.7 }
      };
      
      const result = validateEfficaciteSecondaire(data);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('devrait rejeter des taux supérieurs à 100', () => {
      const data = {
        tauxAbandon: { tauxGF: 150, tauxFilles: 6.2 }
      };
      
      const result = validateEfficaciteSecondaire(data);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('tauxAbandon.tauxGF doit être entre 0 et 100 (valeur: 150)');
    });
    
    it('devrait rejeter des taux négatifs', () => {
      const data = {
        tauxReussite: { tauxGF: -5, tauxFilles: 10 }
      };
      
      const result = validateEfficaciteSecondaire(data);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('tauxReussite.tauxGF doit être entre 0 et 100 (valeur: -5)');
    });
    
    it('devrait rejeter tauxFilles > tauxGF', () => {
      const data = {
        tauxAbandon: { tauxGF: 5, tauxFilles: 10 }
      };
      
      const result = validateEfficaciteSecondaire(data);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(err => err.includes('tauxFilles (10%) ne peut pas dépasser tauxGF (5%)'))).toBe(true);
    });
    
    it('devrait rejeter si la somme des taux n\'est pas proche de 100%', () => {
      const data = {
        tauxAbandon: { tauxGF: 10, tauxFilles: 8 },
        tauxReussite: { tauxGF: 50, tauxFilles: 45 },
        tauxEchec: { tauxGF: 20, tauxFilles: 22 }
      };
      
      const result = validateEfficaciteSecondaire(data);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(err => err.includes('somme des taux GF'))).toBe(true);
    });
    
    it('devrait accepter une somme proche de 100% (avec tolérance)', () => {
      const data = {
        tauxAbandon: { tauxGF: 6.7, tauxFilles: 6.2 },
        tauxReussite: { tauxGF: 84.8, tauxFilles: 83.1 },
        tauxEchec: { tauxGF: 8.5, tauxFilles: 10.7 }
      };
      
      const result = validateEfficaciteSecondaire(data);
      
      expect(result.valid).toBe(true);
    });
    
    it('devrait accepter null ou undefined', () => {
      expect(validateEfficaciteSecondaire(null).valid).toBe(true);
      expect(validateEfficaciteSecondaire(undefined).valid).toBe(true);
    });
  });
  
  describe('validateTauxDiplomesOCDE()', () => {
    
    it('devrait valider des données correctes', () => {
      const data = {
        humanitesScientifiques: { tauxGF: 88.5, tauxFilles: 86.2 },
        humanitesTechniques: { tauxGF: 86.1, tauxFilles: 82.4 }
      };
      
      const result = validateTauxDiplomesOCDE(data);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('devrait rejeter des taux supérieurs à 100', () => {
      const data = {
        humanitesScientifiques: { tauxGF: 110, tauxFilles: 86.2 }
      };
      
      const result = validateTauxDiplomesOCDE(data);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('humanitesScientifiques.tauxGF doit être entre 0 et 100 (valeur: 110)');
    });
    
    it('devrait rejeter des taux négatifs', () => {
      const data = {
        humanitesTechniques: { tauxGF: 50, tauxFilles: -10 }
      };
      
      const result = validateTauxDiplomesOCDE(data);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('humanitesTechniques.tauxFilles doit être entre 0 et 100 (valeur: -10)');
    });
    
    it('devrait rejeter tauxFilles > tauxGF', () => {
      const data = {
        humanitesScientifiques: { tauxGF: 80, tauxFilles: 90 }
      };
      
      const result = validateTauxDiplomesOCDE(data);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(err => err.includes('tauxFilles (90%) ne peut pas dépasser tauxGF (80%)'))).toBe(true);
    });
    
    it('devrait rejeter si la somme des taux dépasse 100%', () => {
      const data = {
        humanitesScientifiques: { tauxGF: 60, tauxFilles: 55 },
        humanitesTechniques: { tauxGF: 50, tauxFilles: 48 }
      };
      
      const result = validateTauxDiplomesOCDE(data);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(err => err.includes('somme des taux GF') && err.includes('ne peut pas dépasser 100%'))).toBe(true);
    });
    
    it('devrait accepter une somme égale ou inférieure à 100%', () => {
      const data = {
        humanitesScientifiques: { tauxGF: 45, tauxFilles: 42 },
        humanitesTechniques: { tauxGF: 55, tauxFilles: 50 }
      };
      
      const result = validateTauxDiplomesOCDE(data);
      
      expect(result.valid).toBe(true);
    });
    
    it('devrait accepter null ou undefined', () => {
      expect(validateTauxDiplomesOCDE(null).valid).toBe(true);
      expect(validateTauxDiplomesOCDE(undefined).valid).toBe(true);
    });
  });
  
  describe('validateIndicateursRendement()', () => {
    
    it('devrait valider les deux sections simultanément', () => {
      const indicateurs = {
        efficaciteSecondaire: {
          tauxAbandon: { tauxGF: 6.8, tauxFilles: 6.2 },
          tauxReussite: { tauxGF: 84.7, tauxFilles: 83.1 },
          tauxEchec: { tauxGF: 8.5, tauxFilles: 10.7 }
        },
        tauxDiplomesOCDE: {
          humanitesScientifiques: { tauxGF: 88.5, tauxFilles: 86.2 },
          humanitesTechniques: { tauxGF: 86.1, tauxFilles: 82.4 }
        }
      };
      
      const result = validateIndicateursRendement(indicateurs);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('devrait cumuler les erreurs des deux sections', () => {
      const indicateurs = {
        efficaciteSecondaire: {
          tauxAbandon: { tauxGF: 150, tauxFilles: 6.2 } // Invalide
        },
        tauxDiplomesOCDE: {
          humanitesScientifiques: { tauxGF: 110, tauxFilles: 86.2 } // Invalide
        }
      };
      
      const result = validateIndicateursRendement(indicateurs);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(err => err.includes('[Efficacité Secondaire]'))).toBe(true);
      expect(result.errors.some(err => err.includes('[Taux Diplômés OCDE]'))).toBe(true);
    });
    
    it('devrait accepter null ou undefined', () => {
      expect(validateIndicateursRendement(null).valid).toBe(true);
      expect(validateIndicateursRendement(undefined).valid).toBe(true);
      expect(validateIndicateursRendement({}).valid).toBe(true);
    });
  });
});
