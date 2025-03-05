// scripts/update-types.js
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PROJECT_ID = SUPABASE_URL ? SUPABASE_URL.match(/https:\/\/([^.]+)/)?.[1] : null;

if (!SUPABASE_PROJECT_ID) {
  console.error('❌ Impossible de déterminer l\'ID du projet Supabase. Vérifiez NEXT_PUBLIC_SUPABASE_URL dans .env.local');
  process.exit(1);
}

const TYPES_DIR = path.resolve(__dirname, '../src/types');
const TYPES_FILE = path.join(TYPES_DIR, 'supabase.ts');

// S'assurer que le répertoire des types existe
if (!fs.existsSync(TYPES_DIR)) {
  fs.mkdirSync(TYPES_DIR, { recursive: true });
}

console.log('🔄 Mise à jour des types Supabase...');
console.log(`📋 ID du projet: ${SUPABASE_PROJECT_ID}`);

try {
  // Générer les types avec l'outil CLI de Supabase
  execSync(`npx supabase gen types typescript --project-id ${SUPABASE_PROJECT_ID} --schema public > ${TYPES_FILE}`, {
    stdio: 'inherit',
  });

  // Ajouter un en-tête au fichier
  const generatedContent = fs.readFileSync(TYPES_FILE, 'utf8');
  const headerContent = `/**
 * Types générés automatiquement pour Supabase
 * NE PAS MODIFIER MANUELLEMENT
 * Généré le: ${new Date().toISOString()}
 */
\n`;

  fs.writeFileSync(TYPES_FILE, headerContent + generatedContent);

  console.log('✅ Types Supabase mis à jour avec succès');
  console.log(`📂 Fichier de types: ${TYPES_FILE}`);
} catch (error) {
  console.error('❌ Erreur lors de la mise à jour des types Supabase:', error);
  process.exit(1);
}
