"use client";

import { useEffect, useRef } from 'react';
import { uiLogger } from '../utils/logger';

interface ComponentLoggerOptions {
  componentName: string;
  props: Record<string, any>;
  validations?: {
    prop: string;
    validValues?: any[];
    validator?: (value: any) => boolean;
    message?: string;
  }[];
}

/**
 * Hook pour suivre et valider l'utilisation des composants UI
 */
export function useComponentLogger({
  componentName,
  props,
  validations = []
}: ComponentLoggerOptions) {
  const renderedRef = useRef(false);

  useEffect(() => {
    // Ne journaliser qu'au premier rendu pour éviter la surcharge
    if (!renderedRef.current) {
      uiLogger.debug(`Component rendered: ${componentName}`, { props });
      renderedRef.current = true;
    }

    // Exécuter les validations de propriétés
    validations.forEach(validation => {
      const propValue = props[validation.prop];
      
      // Ignorer si la propriété n'est pas définie
      if (propValue === undefined) return;
      
      let isValid = true;
      
      // Valider contre une liste de valeurs valides
      if (validation.validValues) {
        isValid = validation.validValues.includes(propValue);
      }
      
      // Valider avec une fonction personnalisée
      if (validation.validator) {
        isValid = validation.validator(propValue);
      }
      
      // Journaliser l'erreur si la validation échoue
      if (!isValid) {
        const message = validation.message || 
          `Invalid value for ${validation.prop}: ${propValue}. Expected one of: ${validation.validValues?.join(', ')}`;
        
        uiLogger.warn(`${componentName}: ${message}`);
      }
    });
  }, []);

  /**
   * Journalise un événement lié au composant
   */
  const logEvent = (eventName: string, details?: Record<string, any>) => {
    uiLogger.debug(`${componentName} event: ${eventName}`, details);
  };

  return { logEvent };
}
