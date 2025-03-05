/**
 * Script de gu00e9nu00e9ration de documentation pour les composants UI
 * Cet outil analyse les composants UI et gu00e9nu00e8re un fichier markdown de documentation.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const uiDir = path.join(rootDir, 'src', 'components', 'ui');
const docsDir = path.join(rootDir, 'docs');
const outputFile = path.join(docsDir, 'ui-components.md');

// Cru00e9er le ru00e9pertoire docs s'il n'existe pas
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

/**
 * Extrait les informations d'un fichier de composant UI
 */
function parseComponentFile(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const name = fileName.replace(/\.tsx$/, '');
  
  // Extraire l'interface de propriu00e9tu00e9s
  const interfaceMatch = content.match(/interface\s+([\w]+Props)\s+(?:extends\s+[\w.]+\s*)?{([^}]+)}/s);
  let propsInterface = 'Aucune interface de propriu00e9tu00e9s trouvu00e9e';
  let props = [];
  
  if (interfaceMatch) {
    propsInterface = interfaceMatch[0];
    
    // Extraire chaque propriu00e9tu00e9
    const propRegex = /([\w]+)\??:\s*([^;]+);(?:\s*\/\/\s*(.+))?/g;
    let propMatch;
    
    while ((propMatch = propRegex.exec(interfaceMatch[2])) !== null) {
      props.push({
        name: propMatch[1],
        type: propMatch[2].trim(),
        description: propMatch[3] ? propMatch[3].trim() : 'Aucune description'
      });
    }
  }
  
  // Du00e9tecter les sous-composants
  const subComponentRegex = new RegExp(`${name}\.([\w]+)\s*=`, 'g');
  const subComponents = [];
  let subComponentMatch;
  
  while ((subComponentMatch = subComponentRegex.exec(content)) !== null) {
    subComponents.push(subComponentMatch[1]);
  }
  
  // Extraire la description du composant (premier commentaire multiligne)
  let description = 'Aucune description disponible';
  const descriptionMatch = content.match(/\/\*\*([^*]|\*[^/])*\*\//); 
  if (descriptionMatch) {
    description = descriptionMatch[0]
      .replace(/\/\*\*|\*\/|\s*\*\s*/g, ' ')
      .trim();
  }
  
  return {
    name,
    description,
    props,
    subComponents,
    filePath
  };
}

/**
 * Gu00e9nu00e8re la documentation pour un composant
 */
function generateComponentDoc(component) {
  let md = `## ${component.name}\n\n`;
  md += `${component.description}\n\n`;
  
  // Tableau des propriu00e9tu00e9s
  if (component.props.length > 0) {
    md += `### Props\n\n`;
    md += `| Propriu00e9tu00e9 | Type | Description |\n`;
    md += `| ---------- | ---- | ----------- |\n`;
    
    component.props.forEach(prop => {
      md += `| ${prop.name} | ${prop.type} | ${prop.description} |\n`;
    });
    
    md += `\n`;
  }
  
  // Sous-composants
  if (component.subComponents.length > 0) {
    md += `### Sous-composants\n\n`;
    md += `- ${component.subComponents.join('\n- ')}\n\n`;
  }
  
  // Exemples d'utilisation
  md += `### Exemple d'utilisation\n\n`;
  
  if (component.name === 'Button') {
    md += '```tsx\n';
    md += '<Button variant="primary" size="md">Bouton Standard</Button>\n';
    md += '<Button variant="outline" size="sm">Petit Bouton</Button>\n';
    md += '<Button variant="success" isLoading>Chargement</Button>\n';
    md += '<Button variant="danger" size="xs" fullWidth>Bouton Large</Button>\n';
    md += '```\n';
  } else if (component.name === 'Card') {
    md += '```tsx\n';
    md += '<Card>\n';
    md += '  <Card.Header>\n';
    md += '    <h3>Titre de la Carte</h3>\n';
    md += '  </Card.Header>\n';
    md += '  <Card.Body>\n';
    md += '    Contenu de la carte\n';
    md += '  </Card.Body>\n';
    md += '  <Card.Footer>\n';
    md += '    Pied de carte\n';
    md += '  </Card.Footer>\n';
    md += '</Card>\n';
    md += '```\n';
  } else {
    md += '```tsx\n';
    md += `<${component.name}></${component.name}>\n`;
    md += '```\n';
  }
  
  return md;
}

/**
 * Fonction principale pour gu00e9nu00e9rer la documentation
 */
function generateDocs() {
  console.log('Gu00e9nu00e9ration de la documentation des composants UI...');
  
  // Vu00e9rifier si le ru00e9pertoire ui existe
  if (!fs.existsSync(uiDir)) {
    console.error(`Ru00e9pertoire des composants UI introuvable: ${uiDir}`);
    return false;
  }
  
  // Obtenir tous les fichiers .tsx du ru00e9pertoire ui
  const files = fs.readdirSync(uiDir).filter(file => file.endsWith('.tsx'));
  
  if (files.length === 0) {
    console.warn('Aucun composant UI trouvu00e9');
    return false;
  }
  
  // Du00e9marrer le document markdown
  let markdown = '# Documentation des Composants UI\n\n';
  markdown += 'Cette documentation est gu00e9nu00e9ru00e9e automatiquement u00e0 partir des composants dans `src/components/ui`.\n\n';
  
  // Table des matiu00e8res
  markdown += '## Table des matiu00e8res\n\n';
  files.forEach(file => {
    const name = file.replace(/\.tsx$/, '');
    markdown += `- [${name}](#${name.toLowerCase()})\n`;
  });
  markdown += '\n';
  
  // Analyser et documenter chaque composant
  files.forEach(file => {
    const filePath = path.join(uiDir, file);
    const component = parseComponentFile(filePath, file);
    markdown += generateComponentDoc(component);
    markdown += '---\n\n';
  });
  
  // Ajouter des informations sur le systnu00e8me de confu00e9rence
  markdown += '## Informations de du00e9veloppement\n\n';
  markdown += '### Directives de style\n\n';
  markdown += '- Utiliser les noms de propriu00e9tu00e9s Tailwind-compatible\n';
  markdown += '- Chaque composant devrait supporter au moins les tailles: xs, sm, md, lg\n';
  markdown += '- Toujours implu00e9menter la gestion des u00e9tats disabled et loading lorsque pertinent\n';
  markdown += '- Assurer que les composants fonctionnent correctement en mode sombre et clair\n\n';
  
  markdown += '### Tests\n\n';
  markdown += 'Exu00e9cuter `npm run validate-config` pour vu00e9rifier la validitu00e9 de votre configuration.\n';
  markdown += 'Exu00e9cuter `npm run pre-deploy` avant chaque du00e9ploiement pour vu00e9rifier la compatibilitu00e9.\n';
  
  // u00c9crire le fichier de documentation
  fs.writeFileSync(outputFile, markdown);
  console.log(`Documentation gu00e9nu00e9ru00e9e avec succu00e8s dans: ${outputFile}`);
  return true;
}

// Exu00e9cuter la gu00e9nu00e9ration
generateDocs();
