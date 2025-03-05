/**
 * Script de validation des configurations
 * Usage: node scripts/validate-config.js
 */

const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

// Couleurs pour les messages
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

const rootDir = path.resolve(__dirname, '..');

// Fichiers à vérifier
const configFiles = [
  'tailwind.config.js',
  'postcss.config.js',
  'tsconfig.json',
  'package.json'
];

// Vérifier l'existence des fichiers
function checkConfigFiles() {
  console.log(`${colors.blue}=== Vérification des fichiers de configuration ===${colors.reset}`);
  
  let allExist = true;
  configFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    const exists = fs.existsSync(filePath);
    
    if (exists) {
      console.log(`${colors.green}✓ ${file} existe${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ ${file} est manquant${colors.reset}`);
      allExist = false;
    }
  });
  
  return allExist;
}

// Valider les dépendances
function checkDependencies() {
  console.log(`\n${colors.blue}=== Vérification des dépendances ===${colors.reset}`);
  
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const criticalDependencies = [
    { name: 'tailwindcss', version: '4', type: 'dev' },
    { name: '@tailwindcss/postcss', version: '', type: 'any' },
    { name: 'next', version: '15', type: 'regular' },
    { name: 'postcss', version: '', type: 'any' },
    { name: 'typescript', version: '', type: 'any' }
  ];
  
  let dependenciesOk = true;
  
  criticalDependencies.forEach(dep => {
    const inDev = packageData.devDependencies && dep.name in packageData.devDependencies;
    const inRegular = packageData.dependencies && dep.name in packageData.dependencies;
    const version = inDev 
      ? packageData.devDependencies[dep.name]
      : inRegular 
        ? packageData.dependencies[dep.name] 
        : null;
    
    if (!version) {
      console.log(`${colors.red}✗ ${dep.name} est manquant${colors.reset}`);
      dependenciesOk = false;
      return;
    }
    
    if (dep.version && !version.startsWith(dep.version)) {
      console.log(`${colors.yellow}⚠ ${dep.name} version ${version} (attendu: ^${dep.version})${colors.reset}`);
      dependenciesOk = false;
      return;
    }
    
    if (dep.type === 'dev' && !inDev) {
      console.log(`${colors.yellow}⚠ ${dep.name} devrait être une devDependency${colors.reset}`);
    } else if (dep.type === 'regular' && !inRegular) {
      console.log(`${colors.yellow}⚠ ${dep.name} devrait être une dependency régulière${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ ${dep.name} ${version}${colors.reset}`);
    }
  });
  
  return dependenciesOk;
}

// Vérifier la configuration Tailwind
function checkTailwindConfig() {
  console.log(`\n${colors.blue}=== Vérification de la configuration Tailwind ===${colors.reset}`);
  
  const tailwindConfigPath = path.join(rootDir, 'tailwind.config.js');
  const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
  
  const checks = [
    { name: 'Plugin PostCSS', pattern: /@tailwindcss\/postcss/ },
    { name: 'Définition des écrans', pattern: /screens\s*:/ },
    { name: 'Tailles de police', pattern: /fontSize\s*:/ },
    { name: 'Configuration du thème sombre', pattern: /darkMode\s*:/ }
  ];
  
  let configOk = true;
  
  checks.forEach(check => {
    if (check.pattern.test(tailwindConfig)) {
      console.log(`${colors.green}✓ ${check.name} configuré${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ ${check.name} est manquant${colors.reset}`);
      configOk = false;
    }
  });
  
  return configOk;
}

// Vérifier la configuration PostCSS
function checkPostCSSConfig() {
  console.log(`\n${colors.blue}=== Vérification de la configuration PostCSS ===${colors.reset}`);
  
  const postcssConfigPath = path.join(rootDir, 'postcss.config.js');
  const postcssConfig = fs.readFileSync(postcssConfigPath, 'utf8');
  
  const checks = [
    { name: 'Plugin Tailwind', pattern: /@tailwindcss\/postcss|tailwindcss/ },
    { name: 'Plugin Autoprefixer', pattern: /autoprefixer/ }
  ];
  
  let configOk = true;
  
  checks.forEach(check => {
    if (check.pattern.test(postcssConfig)) {
      console.log(`${colors.green}✓ ${check.name} configuré${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ ${check.name} est manquant${colors.reset}`);
      configOk = false;
    }
  });
  
  return configOk;
}

// Vérifier la validité TypeScript
function checkTypeScript() {
  console.log(`\n${colors.blue}=== Vérification de la validité TypeScript ===${colors.reset}`);
  
  try {
    console.log('Exécution de la vérification des types...');
    execSync('npx tsc --noEmit', { cwd: rootDir, stdio: 'pipe' });
    console.log(`${colors.green}✓ Aucune erreur TypeScript${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ Erreurs TypeScript détectées${colors.reset}`);
    console.log(`${colors.yellow}Exécutez 'npx tsc --noEmit' pour voir les détails${colors.reset}`);
    return false;
  }
}

// Valider les composants UI
function checkUIComponents() {
  console.log(`\n${colors.blue}=== Vérification des composants UI ===${colors.reset}`);
  
  const uiComponentsDir = path.join(rootDir, 'src', 'components', 'ui');
  const componentFiles = fs.readdirSync(uiComponentsDir).filter(file => file.endsWith('.tsx'));
  
  console.log(`Composants UI trouvés: ${componentFiles.length}`);
  componentFiles.forEach(file => {
    console.log(`- ${file}`);
  });
  
  // Vérifier le composant Button
  if (componentFiles.includes('button.tsx')) {
    const buttonFile = fs.readFileSync(path.join(uiComponentsDir, 'button.tsx'), 'utf8');
    
    const sizeTypes = buttonFile.includes('size?: "xs" | "sm" | "md" | "lg"');
    if (sizeTypes) {
      console.log(`${colors.green}✓ Button inclut la taille 'xs'${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ Button n'inclut pas la taille 'xs'${colors.reset}`);
    }
    
    const xsSizeImplementation = buttonFile.includes('case "xs"');
    if (xsSizeImplementation) {
      console.log(`${colors.green}✓ Button implémente la taille 'xs'${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ Button n'implémente pas la taille 'xs'${colors.reset}`);
    }
  }
  
  return true;
}

// Exécuter toutes les vérifications
async function runAllChecks() {
  console.log(`${colors.magenta}=== VALIDATION DE LA CONFIGURATION DU PROJET ===${colors.reset}`);
  console.log(`Répertoire: ${rootDir}\n`);
  
  const filesOk = checkConfigFiles();
  if (!filesOk) {
    console.log(`${colors.red}\nErreur critique: Fichiers de configuration manquants${colors.reset}`);
    process.exit(1);
  }
  
  const dependenciesOk = checkDependencies();
  const tailwindOk = checkTailwindConfig();
  const postcssOk = checkPostCSSConfig();
  const typescriptOk = checkTypeScript();
  const componentsOk = checkUIComponents();
  
  console.log(`\n${colors.magenta}=== RÉSUMÉ DE LA VALIDATION ===${colors.reset}`);
  
  console.log(`Fichiers de configuration: ${filesOk ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  console.log(`Dépendances: ${dependenciesOk ? colors.green + '✓' : colors.yellow + '⚠'}${colors.reset}`);
  console.log(`Configuration Tailwind: ${tailwindOk ? colors.green + '✓' : colors.yellow + '⚠'}${colors.reset}`);
  console.log(`Configuration PostCSS: ${postcssOk ? colors.green + '✓' : colors.yellow + '⚠'}${colors.reset}`);
  console.log(`TypeScript: ${typescriptOk ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  console.log(`Composants UI: ${componentsOk ? colors.green + '✓' : colors.yellow + '⚠'}${colors.reset}`);
  
  const allOk = filesOk && dependenciesOk && tailwindOk && postcssOk && typescriptOk && componentsOk;
  
  if (allOk) {
    console.log(`\n${colors.green}✅ La configuration semble correcte et prête pour le déploiement${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}⚠ La configuration présente des problèmes qui pourraient affecter le déploiement${colors.reset}`);
  }
  
  return allOk;
}

runAllChecks();
