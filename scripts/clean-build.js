// Script pour nettoyer l'environnement de build et reconstruire l'application
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const util = require('util');

// Chemin vers le dossier .next
const nextDir = path.join(__dirname, '..', '.next');

// Fonction pour logger les messages
function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m', // Cyan
    success: '\x1b[32m', // Vert
    warning: '\x1b[33m', // Jaune
    error: '\x1b[31m', // Rouge
    reset: '\x1b[0m' // Reset
  };

  console.log(`${colors[type]}[${type.toUpperCase()}]${colors.reset} ${message}`);
}

// Fonction pour supprimer un dossier de façon récursive et sécurisée
function removeDirSafe(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      log(`Tentative de suppression du dossier: ${dirPath}`);
      
      try {
        // Sur Windows, essayer de nettoyer avec rimraf (s'il est installé)
        execSync(`npx rimraf ${dirPath}`, { stdio: 'inherit' });
        log(`Dossier supprimé avec rimraf: ${dirPath}`, 'success');
        return true;
      } catch (err) {
        log(`Échec de suppression avec rimraf, tentative avec fs.rmdirSync...`, 'warning');
        
        // Essayer avec l'API fs standard
        fs.rmdirSync(dirPath, { recursive: true, force: true });
        log(`Dossier supprimé avec fs.rmdirSync: ${dirPath}`, 'success');
        return true;
      }
    } else {
      log(`Le dossier ${dirPath} n'existe pas, aucune action nécessaire`, 'info');
      return true;
    }
  } catch (err) {
    log(`Erreur lors de la suppression du dossier ${dirPath}: ${err.message}`, 'error');
    return false;
  }
}

// Fonction principale
async function cleanAndBuild() {
  log('=== Démarrage du processus de nettoyage et de construction ===', 'info');
  
  // 1. Nettoyage du cache
  try {
    log('Nettoyage du cache Next.js...');
    execSync('npx next telemetry disable', { stdio: 'inherit' });
    execSync('npx next clean', { stdio: 'inherit' });
    log('Cache Next.js nettoyé avec succès', 'success');
  } catch (err) {
    log(`Erreur lors du nettoyage du cache: ${err.message}`, 'error');
    // Continuer malgré l'erreur
  }

  // 2. Supprimer le dossier .next s'il existe
  const nextDirCleaned = removeDirSafe(nextDir);
  if (!nextDirCleaned) {
    log('Impossible de nettoyer complètement le dossier .next, mais on continue...', 'warning');
  }

  // 3. Lancer le build
  try {
    log('Démarrage du build...');
    execSync('npm run build', { stdio: 'inherit' });
    log('Build terminé avec succès!', 'success');
    return true;
  } catch (err) {
    log(`Erreur lors du build: ${err.message}`, 'error');
    return false;
  }
}

// Exécuter la fonction principale
cleanAndBuild()
  .then(success => {
    if (success) {
      log('Processus de build terminé avec succès!', 'success');
      process.exit(0);
    } else {
      log('Le processus de build a échoué, voir les erreurs ci-dessus.', 'error');
      process.exit(1);
    }
  })
  .catch(err => {
    log(`Erreur inattendue: ${err.message}`, 'error');
    process.exit(1);
  });
