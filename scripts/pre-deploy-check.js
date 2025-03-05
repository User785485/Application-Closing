/**
 * Script de vu00e9rification pru00e9-du00e9ploiement
 * Exu00e9cute toutes les vu00e9rifications nu00e9cessaires avant le du00e9ploiement
 * Usage: node scripts/pre-deploy-check.js
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
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const rootDir = path.resolve(__dirname, '..');
let hasErrors = false;
let hasWarnings = false;

// Afficher un titre de section
function printSection(title) {
  console.log(`\n${colors.blue}=== ${title} ===${colors.reset}`);
}

// Vu00e9rifier les erreurs TypeScript
function checkTypeScript() {
  printSection('Vu00e9rification TypeScript');
  
  try {
    console.log('Exu00e9cution de TypeScript en mode vu00e9rification...');
    execSync('npx tsc --noEmit', { cwd: rootDir, stdio: 'pipe' });
    console.log(`${colors.green}u2713 Aucune erreur TypeScript${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}u2717 Erreurs TypeScript du00e9tectu00e9es${colors.reset}`);
    console.log(error.stdout?.toString() || error.message);
    hasErrors = true;
    return false;
  }
}

// Vu00e9rifier la qualitu00e9 du code avec ESLint
function checkLinting() {
  printSection('Vu00e9rification ESLint');
  
  try {
    console.log('Exu00e9cution d\'ESLint...');
    execSync('npx eslint . --ext .js,.jsx,.ts,.tsx', { cwd: rootDir, stdio: 'pipe' });
    console.log(`${colors.green}u2713 Aucune erreur de linting${colors.reset}`);
    return true;
  } catch (error) {
    const output = error.stdout?.toString() || error.message;
    const hasFixableErrors = output.includes('potentially fixable with the `--fix` option');
    
    console.log(`${colors.red}u2717 Erreurs de linting du00e9tectu00e9es${colors.reset}`);
    console.log(output);
    
    if (hasFixableErrors) {
      console.log(`${colors.yellow}Certaines erreurs sont corrigeables automatiquement. Exu00e9cutez: npx eslint . --ext .js,.jsx,.ts,.tsx --fix${colors.reset}`);
    }
    
    hasErrors = true;
    return false;
  }
}

// Vu00e9rifier la configuration Tailwind
function checkTailwindConfig() {
  printSection('Vu00e9rification de la configuration Tailwind');
  
  const tailwindConfigPath = path.join(rootDir, 'tailwind.config.js');
  
  if (!fs.existsSync(tailwindConfigPath)) {
    console.log(`${colors.red}u2717 Fichier tailwind.config.js manquant${colors.reset}`);
    hasErrors = true;
    return false;
  }
  
  const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
  let configOk = true;
  
  // Vu00e9rification des plugins
  if (!tailwindConfig.includes('@tailwindcss/postcss')) {
    console.log(`${colors.red}u2717 Plugin @tailwindcss/postcss manquant dans tailwind.config.js${colors.reset}`);
    configOk = false;
  }
  
  // Vu00e9rification des u00e9crans
  if (!tailwindConfig.includes('screens:')) {
    console.log(`${colors.yellow}u26a0 Du00e9finition des u00e9crans (screens) manquante dans tailwind.config.js${colors.reset}`);
    hasWarnings = true;
    configOk = false;
  }
  
  // Vu00e9rification des tailles de police
  if (!tailwindConfig.includes('fontSize:')) {
    console.log(`${colors.yellow}u26a0 Du00e9finition des tailles de police (fontSize) manquante dans tailwind.config.js${colors.reset}`);
    hasWarnings = true;
    configOk = false;
  }
  
  if (configOk) {
    console.log(`${colors.green}u2713 Configuration Tailwind valide${colors.reset}`);
  } else {
    hasErrors = true;
  }
  
  return configOk;
}

// Vu00e9rifier la configuration PostCSS
function checkPostCSSConfig() {
  printSection('Vu00e9rification de la configuration PostCSS');
  
  const postcssConfigPath = path.join(rootDir, 'postcss.config.js');
  
  if (!fs.existsSync(postcssConfigPath)) {
    console.log(`${colors.red}u2717 Fichier postcss.config.js manquant${colors.reset}`);
    hasErrors = true;
    return false;
  }
  
  const postcssConfig = fs.readFileSync(postcssConfigPath, 'utf8');
  let configOk = true;
  
  // Vu00e9rification du plugin Tailwind
  if (!postcssConfig.includes('@tailwindcss/postcss') && !postcssConfig.includes('tailwindcss')) {
    console.log(`${colors.red}u2717 Plugin Tailwind manquant dans postcss.config.js${colors.reset}`);
    configOk = false;
  }
  
  // Vu00e9rification du plugin autoprefixer
  if (!postcssConfig.includes('autoprefixer')) {
    console.log(`${colors.yellow}u26a0 Plugin autoprefixer manquant dans postcss.config.js${colors.reset}`);
    hasWarnings = true;
    configOk = false;
  }
  
  if (configOk) {
    console.log(`${colors.green}u2713 Configuration PostCSS valide${colors.reset}`);
  } else {
    hasErrors = true;
  }
  
  return configOk;
}

// Vu00e9rifier les composants UI pour les problu00e8mes courants
function checkUIComponents() {
  printSection('Vu00e9rification des composants UI');
  
  const uiDir = path.join(rootDir, 'src', 'components', 'ui');
  
  if (!fs.existsSync(uiDir)) {
    console.log(`${colors.yellow}u26a0 Ru00e9pertoire des composants UI introuvable${colors.reset}`);
    hasWarnings = true;
    return false;
  }
  
  const buttonPath = path.join(uiDir, 'button.tsx');
  const cardPath = path.join(uiDir, 'card.tsx');
  
  let uiComponentsOk = true;
  
  // Vu00e9rification du composant Button
  if (fs.existsSync(buttonPath)) {
    const buttonContent = fs.readFileSync(buttonPath, 'utf8');
    
    if (!buttonContent.includes('"xs" | "sm" | "md" | "lg"')) {
      console.log(`${colors.red}u2717 Le composant Button ne du00e9finit pas la taille 'xs'${colors.reset}`);
      uiComponentsOk = false;
    }
    
    if (!buttonContent.includes('case "xs"')) {
      console.log(`${colors.red}u2717 Le composant Button n'implu00e9mente pas la taille 'xs'${colors.reset}`);
      uiComponentsOk = false;
    }
  } else {
    console.log(`${colors.yellow}u26a0 Composant Button introuvable${colors.reset}`);
    hasWarnings = true;
  }
  
  // Vu00e9rification du composant Card
  if (fs.existsSync(cardPath)) {
    const cardContent = fs.readFileSync(cardPath, 'utf8');
    
    if (!cardContent.includes('interface CardComponent') && !cardContent.includes('type CardComponent')) {
      console.log(`${colors.yellow}u26a0 Le composant Card ne semble pas avoir une interface CardComponent${colors.reset}`);
      hasWarnings = true;
      uiComponentsOk = false;
    }
  } else {
    console.log(`${colors.yellow}u26a0 Composant Card introuvable${colors.reset}`);
    hasWarnings = true;
  }
  
  if (uiComponentsOk) {
    console.log(`${colors.green}u2713 Composants UI vu00e9rifiu00e9s sans erreur critique${colors.reset}`);
  } else {
    hasErrors = true;
  }
  
  return uiComponentsOk;
}

// Construction de l'application en mode production
function testBuild() {
  printSection('Test de build en mode production');
  
  try {
    console.log('Exu00e9cution d\'un build de test...');
    execSync('npm run build', { cwd: rootDir, stdio: 'pipe' });
    console.log(`${colors.green}u2713 Build ru00e9ussi${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}u2717 u00c9chec du build${colors.reset}`);
    console.log(error.stdout?.toString() || error.message);
    hasErrors = true;
    return false;
  }
}

// Exu00e9cuter toutes les vu00e9rifications
async function runAllChecks() {
  console.log(`${colors.cyan}=== Vu00c9RIFICATION PRu00c9-Du00c9PLOIEMENT ===${colors.reset}`);
  console.log(`Du00e9marrage des vu00e9rifications pour: ${rootDir}`);
  console.log(`Date: ${new Date().toISOString()}\n`);
  
  const tsOk = checkTypeScript();
  const lintOk = checkLinting();
  const tailwindOk = checkTailwindConfig();
  const postcssOk = checkPostCSSConfig();
  const uiOk = checkUIComponents();
  const buildOk = testBuild();
  
  printSection('Ru00c9SUMu00c9 DES Vu00c9RIFICATIONS');
  
  console.log(`TypeScript: ${tsOk ? colors.green + 'u2713' : colors.red + 'u2717'}${colors.reset}`);
  console.log(`ESLint: ${lintOk ? colors.green + 'u2713' : colors.red + 'u2717'}${colors.reset}`);
  console.log(`Tailwind: ${tailwindOk ? colors.green + 'u2713' : colors.red + 'u2717'}${colors.reset}`);
  console.log(`PostCSS: ${postcssOk ? colors.green + 'u2713' : colors.red + 'u2717'}${colors.reset}`);
  console.log(`Composants UI: ${uiOk ? colors.green + 'u2713' : colors.red + 'u2717'}${colors.reset}`);
  console.log(`Build: ${buildOk ? colors.green + 'u2713' : colors.red + 'u2717'}${colors.reset}`);
  
  if (hasErrors) {
    console.log(`\n${colors.red}u274c ERREURS PRu00c9-Du00c9PLOIEMENT Du00c9TECTu00c9ES${colors.reset}`);
    console.log(`${colors.red}Corrigez les erreurs ci-dessus avant de du00e9ployer.${colors.reset}`);
    process.exit(1);
  } else if (hasWarnings) {
    console.log(`\n${colors.yellow}u26a0 AVERTISSEMENTS PRu00c9-Du00c9PLOIEMENT Du00c9TECTu00c9S${colors.reset}`);
    console.log(`${colors.yellow}Le du00e9ploiement peut se poursuivre, mais vu00e9rifiez les avertissements.${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${colors.green}u2705 TOUTES LES Vu00c9RIFICATIONS SONT PASSu00c9ES${colors.reset}`);
    console.log(`${colors.green}Le projet est pru00eat pour le du00e9ploiement.${colors.reset}`);
    process.exit(0);
  }
}

runAllChecks().catch(error => {
  console.error(`${colors.red}Erreur lors de l'exu00e9cution des vu00e9rifications:${colors.reset}`, error);
  process.exit(1);
});
