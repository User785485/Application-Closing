/**
 * Script de vu00e9rification des composants UI
 * Cet outil vu00e9rifie que les composants UI critiques sont correctement typus et implu00e9mentUs.
 */

const fs = require('fs');
const path = require('path');

// Couleurs pour les messages
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

const rootDir = path.resolve(__dirname, '..');
const uiDir = path.join(rootDir, 'src', 'components', 'ui');

// Liste des composants u00e0 vu00e9rifier
const requiredComponents = [
  {
    name: 'Button',
    file: 'button.tsx',
    requiredProps: ['variant', 'size', 'isLoading', 'fullWidth'],
    requiredFunctions: ['getVariantClasses', 'getSizeClasses'],
    sizeValues: ['xs', 'sm', 'md', 'lg']
  },
  {
    name: 'Card',
    file: 'card.tsx',
    requiredSubComponents: ['Header', 'Body', 'Footer']
  }
];

// Vu00e9rifie si un fichier contient une expression spucifique
function fileContains(filePath, expression) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes(expression);
  } catch (error) {
    return false;
  }
}

// Vu00e9rifie l'existance du fichier
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Fonction principale de vu00e9rification
function checkUIComponents() {
  console.log(`${colors.blue}[INFO] Vu00e9rification des composants UI critiques...${colors.reset}`);
  
  if (!fileExists(uiDir)) {
    console.error(`${colors.red}[ERREUR] Ru00e9pertoire UI introuvable: ${uiDir}${colors.reset}`);
    return false;
  }
  
  let allComponentsValid = true;
  
  for (const component of requiredComponents) {
    const componentPath = path.join(uiDir, component.file);
    console.log(`${colors.blue}[INFO] Vu00e9rification du composant ${component.name}...${colors.reset}`);
    
    if (!fileExists(componentPath)) {
      console.error(`${colors.red}[ERREUR] Composant ${component.name} introuvable: ${componentPath}${colors.reset}`);
      allComponentsValid = false;
      continue;
    }
    
    // Vu00e9rification des propriu00e9tu00e9s
    if (component.requiredProps) {
      for (const prop of component.requiredProps) {
        if (!fileContains(componentPath, prop)) {
          console.error(`${colors.red}[ERREUR] Propriu00e9tu00e9 '${prop}' manquante dans ${component.name}${colors.reset}`);
          allComponentsValid = false;
        }
      }
    }
    
    // Vu00e9rification des fonctions
    if (component.requiredFunctions) {
      for (const func of component.requiredFunctions) {
        if (!fileContains(componentPath, `const ${func} = () =>`)) {
          console.error(`${colors.red}[ERREUR] Fonction '${func}' manquante dans ${component.name}${colors.reset}`);
          allComponentsValid = false;
        }
      }
    }
    
    // Vu00e9rification des sous-composants
    if (component.requiredSubComponents) {
      for (const subComponent of component.requiredSubComponents) {
        if (!fileContains(componentPath, `${component.name}.${subComponent}`)) {
          console.error(`${colors.red}[ERREUR] Sous-composant '${subComponent}' manquant dans ${component.name}${colors.reset}`);
          allComponentsValid = false;
        }
      }
    }
    
    // Vu00e9rifications spu00e9cifiques au composant Button
    if (component.name === 'Button' && component.sizeValues) {
      const hasXsSize = fileContains(componentPath, '"xs" | "sm" | "md" | "lg"') && 
                       fileContains(componentPath, 'case "xs"');
      
      if (!hasXsSize) {
        console.error(`${colors.red}[ERREUR] Taille 'xs' manquante ou mal implu00e9mentu00e9e dans Button${colors.reset}`);
        allComponentsValid = false;
      }
    }
  }
  
  if (allComponentsValid) {
    console.log(`${colors.green}[SUCCu00c8S] Tous les composants UI sont valides !${colors.reset}`);
  }
  
  return allComponentsValid;
}

// Exu00e9cution du script
const result = checkUIComponents();
process.exit(result ? 0 : 1);
