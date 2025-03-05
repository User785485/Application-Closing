import fs from 'fs';
import path from 'path';
import { appLogger } from './logger';

/**
 * Utilitaire pour valider les configurations critiques
 */
export class ConfigValidator {
  /**
   * Valide la configuration Tailwind
   */
  validateTailwindConfig(configPath: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    try {
      // Vu00e9rifie si le fichier existe
      if (!fs.existsSync(configPath)) {
        issues.push(`Le fichier de configuration Tailwind est manquant : ${configPath}`);
        return { valid: false, issues };
      }

      // Analyse le contenu du fichier
      const configContent = fs.readFileSync(configPath, 'utf8');
      
      // Vu00e9rifie la pru00e9sence des u00e9lu00e9ments essentiels
      if (!configContent.includes('@tailwindcss/postcss') && !configContent.includes('tailwindcss/postcss')) {
        issues.push("La ru00e9fu00e9rence au plugin @tailwindcss/postcss est manquante");
      }
      
      // Vu00e9rifie les tailles d'u00e9cran
      if (!configContent.includes('screens:') || !configContent.match(/(sm|md|lg|xl):/g)) {
        issues.push("Les du00e9finitions de tailles d'u00e9cran (screens) semblent manquantes ou incomplu00e8tes");
      }
      
      // Vu00e9rifie les tailles de police
      if (!configContent.includes('fontSize:')) {
        issues.push("Les du00e9finitions de tailles de police (fontSize) semblent manquantes");
      }

      // Vu00e9rifie si darkMode est du00e9fini
      if (!configContent.includes('darkMode:')) {
        issues.push("La configuration du mode sombre (darkMode) est manquante");
      }

      return {
        valid: issues.length === 0,
        issues
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      issues.push(`Erreur lors de la validation de la configuration Tailwind: ${errorMessage}`);
      return { valid: false, issues };
    }
  }

  /**
   * Valide la configuration PostCSS
   */
  validatePostCSSConfig(configPath: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    try {
      // Vu00e9rifie si le fichier existe
      if (!fs.existsSync(configPath)) {
        issues.push(`Le fichier de configuration PostCSS est manquant : ${configPath}`);
        return { valid: false, issues };
      }

      // Analyse le contenu du fichier
      const configContent = fs.readFileSync(configPath, 'utf8');
      
      // Vu00e9rifie la pru00e9sence des plugins essentiels
      if (!configContent.includes('@tailwindcss/postcss') && !configContent.includes('tailwindcss')) {
        issues.push("Le plugin Tailwind est manquant dans la configuration PostCSS");
      }
      
      if (!configContent.includes('autoprefixer')) {
        issues.push("Le plugin autoprefixer est manquant");
      }

      return {
        valid: issues.length === 0,
        issues
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      issues.push(`Erreur lors de la validation de la configuration PostCSS: ${errorMessage}`);
      return { valid: false, issues };
    }
  }

  /**
   * Vu00e9rifie les du00e9pendances dans le package.json
   */
  validatePackageDependencies(packagePath: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    try {
      // Vu00e9rifie si le fichier existe
      if (!fs.existsSync(packagePath)) {
        issues.push(`Le fichier package.json est manquant : ${packagePath}`);
        return { valid: false, issues };
      }

      // Analyse le contenu du fichier
      const packageContent = fs.readFileSync(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      // Vu00e9rifie les du00e9pendances Tailwind
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (!deps.tailwindcss) {
        issues.push("tailwindcss n'est pas listu00e9 comme du00e9pendance");
      } else if (!deps.tailwindcss.startsWith('4.')) {
        issues.push(`La version de tailwindcss (${deps.tailwindcss}) n'est pas 4.x");
      }
      
      if (!deps.postcss) {
        issues.push("postcss n'est pas listu00e9 comme du00e9pendance");
      }
      
      if (!deps.autoprefixer) {
        issues.push("autoprefixer n'est pas listu00e9 comme du00e9pendance");
      }

      // Vu00e9rifie la compatibilitu00e9 Next.js
      if (deps.next && !deps.next.startsWith('15.')) {
        issues.push(`La version de Next.js (${deps.next}) n'est pas 15.x");
      }

      return {
        valid: issues.length === 0,
        issues
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      issues.push(`Erreur lors de la validation du package.json: ${errorMessage}`);
      return { valid: false, issues };
    }
  }

  /**
   * Valide toutes les configurations critiques
   */
  async validateAllConfigs(projectRoot: string): Promise<{ valid: boolean; report: string }> {
    const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.js');
    const postcssConfigPath = path.join(projectRoot, 'postcss.config.js');
    const packageJsonPath = path.join(projectRoot, 'package.json');
    
    const tailwindResult = this.validateTailwindConfig(tailwindConfigPath);
    const postcssResult = this.validatePostCSSConfig(postcssConfigPath);
    const dependenciesResult = this.validatePackageDependencies(packageJsonPath);
    
    const allIssues = [
      ...tailwindResult.issues.map(issue => `[Tailwind] ${issue}`),
      ...postcssResult.issues.map(issue => `[PostCSS] ${issue}`),
      ...dependenciesResult.issues.map(issue => `[Dependencies] ${issue}`)
    ];
    
    const valid = tailwindResult.valid && postcssResult.valid && dependenciesResult.valid;
    
    const report = `
=== Rapport de validation de configuration ===

${valid ? '✅ Toutes les configurations sont valides' : '❌ Des problèmes ont été détectés'}

${allIssues.length > 0 ? 'Problèmes détectés:\n' + allIssues.map(issue => `- ${issue}`).join('\n') : 'Aucun problème détecté.'}

=== Fin du rapport ===
`;
    
    appLogger.info(report);
    
    return {
      valid,
      report
    };
  }
}

export const configValidator = new ConfigValidator();
