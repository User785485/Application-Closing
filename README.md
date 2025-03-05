# My Muqabala 3.0

Application CRM et coaching pour relations et du00e9veloppement personnel.

## Pru00e9requis

- Node.js 18.x ou supu00e9rieur
- npm 9.x ou supu00e9rieur

## Installation

```bash
# Installer les du00e9pendances
npm install
```

## Du00e9veloppement

```bash
# Lancer le serveur de du00e9veloppement
npm run dev
```

## Commandes disponibles

- `npm run dev` - Du00e9marrer le serveur de du00e9veloppement
- `npm run build` - Construire l'application pour la production
- `npm run start` - Du00e9marrer le serveur de production
- `npm run lint` - Vu00e9rifier le code avec ESLint
- `npm run clean` - Nettoyer le projet
- `npm run validate-config` - Valider la configuration du projet
- `npm run pre-deploy` - Exu00e9cuter les vu00e9rifications pru00e9-du00e9ploiement
- `npm run type-check` - Vu00e9rifier les types TypeScript

## Architecture du projet

```
my-muqabala-3.0/
u251cu2500u2500 .husky/             # Hooks Git
u251cu2500u2500 docs/               # Documentation
u251cu2500u2500 public/             # Fichiers statiques
u251cu2500u2500 scripts/            # Scripts utilitaires
u251cu2500u2500 src/
u2502   u251cu2500u2500 components/      # Composants React
u2502   u2502   u251cu2500u2500 ui/          # Composants UI ru00e9utilisables
u2502   u251cu2500u2500 hooks/           # Hooks React personnalisu00e9s
u2502   u251cu2500u2500 integrations/     # Intu00e9grations externes (Supabase, etc.)
u2502   u251cu2500u2500 pages/            # Pages de l'application
u2502   u251cu2500u2500 styles/           # Styles et thu00e8mes
u2502   u251cu2500u2500 tests/            # Tests unitaires
u2502   u251cu2500u2500 utils/            # Utilitaires
u251cu2500u2500 tailwind.config.js  # Configuration Tailwind CSS
u251cu2500u2500 postcss.config.js   # Configuration PostCSS
u251cu2500u2500 tsconfig.json       # Configuration TypeScript
u251cu2500u2500 package.json        # Du00e9pendances et scripts
```

## Du00e9ploiement

L'application est du00e9ployu00e9e sur Vercel. Avant de du00e9ployer, exu00e9cutez :

```bash
npm run pre-deploy
```

Cette commande vu00e9rifiera la configuration, les types TypeScript, et effectuera un build de test pour s'assurer que tout est pru00eat pour le du00e9ploiement.

## Systu00e8me de composants UI

L'application utilise un systu00e8me de composants UI personnalisu00e9 basu00e9 sur Tailwind CSS 4.0.9.

Pour gu00e9nu00e9rer la documentation des composants UI :

```bash
node scripts/generate-ui-docs.js
```

Consultez le fichier `docs/ui-components.md` pour plus d'informations sur les composants disponibles.

## Techniques de du00e9bogage

Le projet inclut un systu00e8me de journalisation avancu00e9 pour faciliter le du00e9bogage :

```typescript
import { appLogger, uiLogger } from '../utils/logger';

// Exemple d'utilisation
appLogger.debug('Du00e9bogage gu00e9nu00e9ral');
uiLogger.warn('Avertissement UI');
```

## Validation de la configuration

Util du project :

```bash
# Vu00e9rifier la configuration de Tailwind, PostCSS, etc.
npm run validate-config
```

Cela exu00e9cute un script qui vu00e9rifie les configurations critiques pour s'assurer que tout est configuru00e9 correctement.

## Pru00e9vention des ru00e9cidives

Pour u00e9viter les problu00e8mes de du00e9ploiement ru00e9currents :

1. Exu00e9cutez toujours `npm run pre-deploy` avant de du00e9ployer
2. Utilisez les hooks Git `.husky/pre-commit` pour vu00e9rifier le code avant de commit
3. Profitez du systu00e8me de journalisation pour identifier et ru00e9soudre les problu00e8mes rapidement
4. Gu00e9nu00e9rez ru00e9guliu00e8rement la documentation des composants UI

## Licence

ISC
