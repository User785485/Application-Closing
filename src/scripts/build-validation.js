#!/usr/bin/env node

/**
 * Script de pru00e9-validation du build Next.js
 * 
 * Ce script effectue une su00e9rie de vu00e9rifications avant le build pour u00e9viter
 * des problu00e8mes courants de compilation, particuliu00e8rement sur Vercel.
 */

const fs = require('fs');
const path = require('path');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Log stylu00e9s
const log = {
  success: (msg) => console.log(`${colors.green}[SUCCu00c8S] ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}[AVERTISSEMENT] ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}[ERREUR] ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}[INFO] ${msg}${colors.reset}`),
  heading: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`)
};

// Compteurs pour le ru00e9sumu00e9
let successCount = 0;
let warningCount = 0;
let errorCount = 0;

// Fonction pour vu00e9rifier si un fichier contient 'use client'
function checkUseClientDirective(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.trim().startsWith('"use client"') || content.trim().startsWith('\'use client\'')) {
      log.success(`Directive "use client" trouvu00e9e dans: ${path.relative('', filePath)}`);
      successCount++;
      return true;
    } else {
      return false;
    }
  } catch (error) {
    log.error(`Erreur lors de la lecture du fichier ${filePath}: ${error.message}`);
    errorCount++;
    return false;
  }
}

// Fonction pour trouver tous les fichiers dans un du00e9partement
function findFiles(dir, extension) {
  if (!fs.existsSync(dir)) return [];
  
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findFiles(fullPath, extension));
    } else if (entry.isFile() && (extension ? entry.name.endsWith(extension) : true)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Vu00e9rifier les imports dans un fichier
function checkImports(filePath, importName, importPath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Vu00e9rification simpliu00e9e avec des expressions ru00e9guliu00e8res
    const importRegex = new RegExp(`import[\s\n]*{[\s\n]*${importName}[\s\n]*}[\s\n]*from[\s\n]*['"](${importPath})`, 'i');
    if (importRegex.test(content)) {
      log.success(`Import du00e9tectu00e9 pour: ${importName} from ${importPath}`);
      successCount++;
      return true;
    } else {
      return false;
    }
  } catch (error) {
    log.error(`Erreur lors de la vu00e9rification des imports dans ${filePath}: ${error.message}`);
    errorCount++;
    return false;
  }
}

// Vu00e9rifier l'existence d'un fichier de configuration
function checkConfigFile(filePath) {
  if (fs.existsSync(filePath)) {
    log.success(`${path.basename(filePath)} trouvu00e9`);
    successCount++;
    
    // Vu00e9rifier les configurations expu00e9rimentales pour next.config.js
    if (path.basename(filePath) === 'next.config.js') {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('experimental') && content.includes('optimizeCss')) {
          log.warning('Configuration expu00e9rimentale du00e9tectu00e9e dans next.config.js');
          warningCount++;
        }
      } catch (error) {
        log.error(`Erreur lors de la lecture de ${filePath}: ${error.message}`);
        errorCount++;
      }
    }
    
    return true;
  } else {
    log.error(`${path.basename(filePath)} non trouvu00e9`);
    errorCount++;
    return false;
  }
}

// Vu00e9rifier les directives 'use client' dans tous les fichiers .tsx du ru00e9pertoire app qui rendent des composants clients
function checkAllClientComponentFiles() {
  log.info('Vu00e9rification des directives "use client" dans toutes les pages...');
  const appDir = path.join(process.cwd(), 'src', 'app');
  
  // Trouver tous les fichiers page.tsx dans le du00e9partement app
  const pageFiles = findFiles(appDir, 'page.tsx');
  
  for (const file of pageFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      // Vu00e9rifier si le fichier importe des composants clients connus
      const hasClientImports = [
        /import[\s\n]*{[\s\n]*[^}]*Button[^}]*}[\s\n]*from/,
        /import[\s\n]*{[\s\n]*[^}]*Card[^}]*}[\s\n]*from/,
        /import[\s\n]*{[\s\n]*[^}]*Dialog[^}]*}[\s\n]*from/,
        /import[\s\n]*{[\s\n]*[^}]*Form[^}]*}[\s\n]*from/
      ].some(regex => regex.test(content));
      
      // Si le fichier importe des composants clients, il doit avoir la directive 'use client'
      if (hasClientImports) {
        if (!checkUseClientDirective(file)) {
          log.error(`Directive "use client" manquante dans: ${path.relative('', file)} - requis pour les composants clients`);
          errorCount++;
        }
      }
    } catch (error) {
      log.error(`Erreur lors de l'analyse du fichier ${file}: ${error.message}`);
      errorCount++;
    }
  }
}

// Fonction principale de validation
function runValidation() {
  log.heading('=== Du00e9marrage de la validation du build ====');
  
  // 1. Vu00e9rifier les directives 'use client' dans certains fichiers spu00e9cifiques
  log.info('Vu00e9rification des directives "use client"...');
  const clientFiles = [
    path.join(process.cwd(), 'src', 'components', 'ui', 'button.tsx'),
    path.join(process.cwd(), 'src', 'components', 'ui', 'card.tsx'),
    path.join(process.cwd(), 'src', 'app', 'appointments', 'page.tsx'),
    path.join(process.cwd(), 'src', 'utils', 'logger.ts'),
    path.join(process.cwd(), 'src', 'utils', 'build-logger.ts'),
    path.join(process.cwd(), 'src', 'utils', 'component-validator.ts'),
    path.join(process.cwd(), 'src', 'hooks', 'useComponentLogger.ts')
  ];
  
  clientFiles.forEach(checkUseClientDirective);
  
  // 2. Vu00e9rifier toutes les pages pour la directive 'use client' si elles utilisent des composants clients
  checkAllClientComponentFiles();
  
  // 3. Vu00e9rifier les imports dans un fichier spu00e9cifique
  log.info('Vu00e9rification des imports dans appointments/page.tsx...');
  const appointmentsFile = path.join(process.cwd(), 'src', 'app', 'appointments', 'page.tsx');
  checkImports(appointmentsFile, 'Card', '../../components/ui/card');
  checkImports(appointmentsFile, 'Button', '../../components/ui/button');
  
  // 4. Vu00e9rifier les fichiers de configuration essentiels
  log.info('Vu00e9rification des configurations critiques...');
  checkConfigFile(path.join(process.cwd(), 'next.config.js'));
  checkConfigFile(path.join(process.cwd(), 'tsconfig.json'));
  
  // Afficher le ru00e9sumu00e9
  console.log();
  log.heading('=== Ru00e9sumu00e9 de la validation ====');
  console.log(`${colors.green}${successCount} succu00e8s${colors.reset}`);
  console.log(`${colors.yellow}${warningCount} avertissements${colors.reset}`);
  console.log(`${colors.red}${errorCount} erreurs${colors.reset}`);
  
  if (errorCount > 0) {
    log.error('Des erreurs ont u00e9tu00e9 du00e9tectu00e9es. Le build ne peut pas continuer.');
    process.exit(1);
  } else if (warningCount > 0) {
    log.warning('Des avertissements ont u00e9tu00e9 trouvu00e9s, mais le build peut continuer');
  }
}

// Exu00e9cuter la validation
runValidation();
