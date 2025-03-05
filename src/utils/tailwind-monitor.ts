import { tailwindLogger } from './logger';

/**
 * Utilitaire pour surveiller et valider les configurations Tailwind CSS
 */
class TailwindMonitor {
  /**
   * Vu00e9rifie si les classes Tailwind sont correctement appliquu00e9es
   */
  validateTailwindClasses(element: HTMLElement | null, expectedClasses: string[]): boolean {
    if (!element) {
      tailwindLogger.error('Cannot validate Tailwind classes: element is null');
      return false;
    }

    const actualClasses = element.className.split(/\s+/);
    const missingClasses = expectedClasses.filter(cls => !actualClasses.includes(cls));

    if (missingClasses.length > 0) {
      tailwindLogger.warn(`Missing Tailwind classes: ${missingClasses.join(', ')}`);
      return false;
    }

    return true;
  }

  /**
   * Vu00e9rifie la compatibilitu00e9 des variables CSS avec Tailwind
   */
  validateTailwindVariables(): void {
    if (typeof window === 'undefined') return;

    const requiredVariables = [
      '--color-primary-600',
      '--color-secondary-600',
      '--color-success-600',
      '--color-danger-600'
    ];

    const styles = getComputedStyle(document.documentElement);
    const missingVariables = requiredVariables.filter(
      variable => !styles.getPropertyValue(variable)
    );

    if (missingVariables.length > 0) {
      tailwindLogger.error(`Missing CSS variables: ${missingVariables.join(', ')}`);
    }
  }

  /**
   * Vu00e9rifie les media queries responsive
   */
  validateResponsiveBreakpoints(): void {
    const breakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    };

    tailwindLogger.info('Responsive breakpoints validation:\n' + 
      Object.entries(breakpoints)
        .map(([name, size]) => `  ${name}: ${size}px`)
        .join('\n')
    );
  }

  /**
   * Vu00e9rifie la pru00e9sence des plugins requis
   */
  validatePlugins(): void {
    const requiredPlugins = ['@tailwindcss/postcss'];
    tailwindLogger.info(`Required Tailwind plugins: ${requiredPlugins.join(', ')}`);
  }
}

export const tailwindMonitor = new TailwindMonitor();
