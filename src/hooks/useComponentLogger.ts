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
    // Ne journaliser qu'au premier rendu pour u00e9viter la surcharge
    if (!renderedRef.current) {
      uiLogger.debug(`Component rendered: ${componentName}`, { props });
      renderedRef.current = true;
    }

    // Exu00e9cuter les validations de propriu00e9tu00e9s
    validations.forEach(validation => {
      const propValue = props[validation.prop];
      
      // Ignorer si la propriu00e9tu00e9 n'est pas du00e9finie
      if (propValue === undefined) return;
      
      let isValid = true;
      
      // Valider contre une liste de valeurs valides
      if (validation.validValues) {
        isValid = validation.validValues.includes(propValue);
      }
      
      // Valider avec une fonction personnalisu00e9e
      if (validation.validator) {
        isValid = validation.validator(propValue);
      }
      
      // Journaliser l'erreur si la validation u00e9choue
      if (!isValid) {
        const message = validation.message || 
          `Invalid value for ${validation.prop}: ${propValue}. Expected one of: ${validation.validValues?.join(', ')}`;
        
        uiLogger.warn(`${componentName}: ${message}`);
      }
    });
  }, []);

  /**
   * Journalise un u00e9vu00e9nement liu00e9 au composant
   */
  const logEvent = (eventName: string, details?: Record<string, any>) => {
    uiLogger.debug(`${componentName} event: ${eventName}`, details);
  };

  return { logEvent };
}
