#!/usr/bin/env node

/**
 * Script de pru00e9-validation du build Next.js
 * 
 * Ce script effectue une su00e9rie de vu00e9rifications avant le build pour u00e9viter
 * des problu00e8mes courants de compilation, particuliu00e8rement sur Vercel.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const APP_DIR = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.resolve(APP_DIR, 'components');
const PAGES_DIR = path.resolve(APP_DIR, 'app');

// Couleurs pour la console
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${COLORS.cyan}=== Du00e9marrage de la validation du build ====${COLORS.reset}`);

// Compteurs de validation
let errors = 0;
let warnings = 0;
let successes = 0;

/**
 * Journalisation avec couleurs
 */
function log(message, type = 'info') {
  switch (type) {
    case 'error':
      console.error(`${COLORS.red}[ERREUR] ${message}${COLORS.reset}`);
      errors++;
      break;
    case 'warning':
      console.warn(`${COLORS.yellow}[AVERTISSEMENT] ${message}${COLORS.reset}`);
      warnings++;
      break;
    case 'success':
      console.log(`${COLORS.green}[SUCCu00c8S] ${message}${COLORS.reset}`);
      successes++;
      break;
    default:
      console.log(`${COLORS.blue}[INFO] ${message}${COLORS.reset}`);
  }
}

/**
 * Vu00e9rifie la pru00e9sence de 'use client' dans les composants clients
 */
function checkClientDirectives() {
  log('Vu00e9rification des directives "use client"...');
  
  const clientComponents = [
    // UI Components
    path.resolve(COMPONENTS_DIR, 'ui/button.tsx'),
    path.resolve(COMPONENTS_DIR, 'ui/card.tsx'),
    // Page components
    path.resolve(PAGES_DIR, 'appointments/page.tsx'),
    // Utils
    path.resolve(APP_DIR, 'utils/logger.ts'),
    path.resolve(APP_DIR, 'utils/build-logger.ts'),
    path.resolve(APP_DIR, 'utils/component-validator.ts'),
    // Hooks
    path.resolve(APP_DIR, 'hooks/useComponentLogger.ts'),
  ];
  
  clientComponents.forEach(file => {
    try {
      if (!fs.existsSync(file)) {
        log(`Fichier non trouvu00e9: ${file}`, 'warning');
        return;
      }
      
      const content = fs.readFileSync(file, 'utf8');
      if (!content.includes('use client')) {
        log(`Directive "use client" manquante dans: ${path.relative(APP_DIR, file)}`, 'error');
      } else {
        log(`Directive "use client" trouvu00e9e dans: ${path.relative(APP_DIR, file)}`, 'success');
      }
    } catch (error) {
      log(`Erreur lors de la vu00e9rification de ${file}: ${error.message}`, 'error');
    }
  });
}

/**
 * Vu00e9rifie les imports de composants dans le fichier appointments/page.tsx
 */
function checkAppointmentsImports() {
  log('Vu00e9rification des imports dans appointments/page.tsx...');
  
  const appointmentsFile = path.resolve(PAGES_DIR, 'appointments/page.tsx');
  
  try {
    if (!fs.existsSync(appointmentsFile)) {
      log(`Fichier appointments/page.tsx non trouvu00e9!`, 'error');
      return;
    }
    
    const content = fs.readFileSync(appointmentsFile, 'utf8');
    
    // Vu00e9rifier les imports nu00e9cessaires - plus flexible pour matcher divers formats d'import
    const requiredImports = [
      { name: 'Card', from: '../../components/ui/card' },
      { name: 'Button', from: '../../components/ui/button' },
    ];
    
    requiredImports.forEach(imp => {
      // Cette regex est plus flexible et supporte divers formats d'import
      const importRegex = new RegExp(`import\s+(?:.+\s+)?(?:{\s*${imp.name}(?:\s*,.*?)?\s*}|${imp.name})\s+from\s+['"]${imp.from.replace(/\//g, '\\/')}['"]`);
      if (!content.includes(`import`) || !content.includes(imp.name) || !content.includes(imp.from)) {
        log(`Import manquant pour: ${imp.name} from ${imp.from}`, 'error');
      } else {
        log(`Import du00e9tectu00e9 pour: ${imp.name} from ${imp.from}`, 'success');
      }
    });
    
  } catch (error) {
    log(`Erreur lors de la vu00e9rification des imports: ${error.message}`, 'error');
  }
}

/**
 * Vu00e9rifie les configurations critiques
 */
function checkCriticalConfigs() {
  log('Vu00e9rification des configurations critiques...');
  
  // Vu00e9rifier next.config.js
  const nextConfigFile = path.resolve(APP_DIR, '..', 'next.config.js');
  if (fs.existsSync(nextConfigFile)) {
    log('next.config.js trouvu00e9', 'success');
    
    // Vu00e9rifier contenu
    const content = fs.readFileSync(nextConfigFile, 'utf8');
    if (content.includes('experimental')) {
      log('Configuration expu00e9rimentale du00e9tectu00e9e dans next.config.js', 'warning');
    }
  } else {
    log('next.config.js non trouvu00e9', 'warning');
  }
  
  // Vu00e9rifier tsconfig.json
  const tsconfigFile = path.resolve(APP_DIR, '..', 'tsconfig.json');
  if (fs.existsSync(tsconfigFile)) {
    log('tsconfig.json trouvu00e9', 'success');
    
    try {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigFile, 'utf8'));
      if (tsconfig.compilerOptions?.strict !== true) {
        log('Option "strict" non activu00e9e dans tsconfig.json', 'warning');
      }
    } catch (error) {
      log(`Erreur lors de l'analyse de tsconfig.json: ${error.message}`, 'error');
    }
  } else {
    log('tsconfig.json non trouvu00e9', 'error');
  }
}

/**
 * Exu00e9cute les vu00e9rifications
 */
function runChecks() {
  // Vu00e9rifications structurelles
  checkClientDirectives();
  checkAppointmentsImports();
  checkCriticalConfigs();
  
  // Afficher ru00e9sumu00e9
  console.log(`\n${COLORS.cyan}=== Ru00e9sumu00e9 de la validation ====${COLORS.reset}`);
  console.log(`${COLORS.green}${successes} succu00e8s${COLORS.reset}`);
  console.log(`${COLORS.yellow}${warnings} avertissements${COLORS.reset}`);
  console.log(`${COLORS.red}${errors} erreurs${COLORS.reset}`);
  
  if (errors > 0) {
    log('Des erreurs ont u00e9tu00e9 trouvu00e9es, veuillez les corriger avant de continuer', 'error');
    process.exit(1);
  } else if (warnings > 0) {
    log('Des avertissements ont u00e9tu00e9 trouvu00e9s, mais le build peut continuer', 'warning');
  } else {
    log('Tous les tests ont ru00e9ussi!', 'success');
  }
}

runChecks();
