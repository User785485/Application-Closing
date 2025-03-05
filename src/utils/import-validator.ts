"use client";

import { appLogger } from './logger';

type ValidatorResult = {
  valid: boolean;
  errors: string[];
};

/**
 * Valide les imports de modules et composants dans un fichier
 * 
 * @param imports Objet contenant les imports à valider (nom -> valeur importée)
 * @param sourceFile Fichier source qui utilise ces imports
 * @returns Résultat de validation avec statut et erreurs éventuelles
 */
export function validateImports(
  imports: Record<string, any>,
  sourceFile: string
): ValidatorResult {
  const result: ValidatorResult = {
    valid: true,
    errors: [],
  };

  for (const [name, importedValue] of Object.entries(imports)) {
    if (importedValue === undefined) {
      result.valid = false;
      const errorMessage = `Import '${name}' est undefined. Vérifiez le chemin d'import et si le module exporte correctement cette valeur.`;
      result.errors.push(errorMessage);
      appLogger.error(`Erreur d'import dans ${sourceFile}: ${errorMessage}`);
    }
  }

  return result;
}

/**
 * Vérifie la compatibilité de la structure d'un composant React
 * (particulièrement utile pour les composants composés)
 * 
 * @param component Composant React à valider
 * @param expectedProps Les propriétés attendues sur ce composant (comme les sous-composants)
 * @param componentName Nom du composant pour les logs
 * @returns Résultat de validation
 */
export function validateReactComponentStructure(
  component: any,
  expectedProps: string[],
  componentName: string
): ValidatorResult {
  const result: ValidatorResult = {
    valid: true,
    errors: [],
  };

  if (!component) {
    result.valid = false;
    result.errors.push(`Le composant ${componentName} est undefined`);
    return result;
  }

  for (const propName of expectedProps) {
    if (component[propName] === undefined) {
      result.valid = false;
      const errorMessage = `Le composant ${componentName} n'a pas la propriété attendue '${propName}'`;
      result.errors.push(errorMessage);
      appLogger.error(errorMessage);
    }
  }

  return result;
}

/**
 * Valide une dépendance externe
 * 
 * @param dependency Dépendance à valider
 * @param name Nom de la dépendance
 * @returns Résultat de validation
 */
export function validateExternalDependency(
  dependency: any,
  name: string
): ValidatorResult {
  const result: ValidatorResult = {
    valid: true,
    errors: [],
  };

  if (!dependency) {
    result.valid = false;
    const errorMessage = `La dépendance ${name} n'est pas disponible. Vérifiez qu'elle est correctement installée et importée.`;
    result.errors.push(errorMessage);
    appLogger.error(errorMessage);
  }

  return result;
}
