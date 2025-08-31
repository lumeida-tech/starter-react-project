# Wayhost Panel

Panel d'administration pour Wayhost, construit avec React 19 et la stack moderne JavaScript/TypeScript.

## 🚀 Stack Technique

### Frontend
- **Framework**: React 19
- **Langage**: TypeScript
- **Routing**: TanStack Router
- **Styling**: TailwindCSS avec animations
- **Gestion d'état**: Jotai
- **Requêtes API**: TanStack Query avec Ky
- **Formulaires**: React Hook Form avec validation Zod
- **UI**: Composants personnalisés avec Radix UI
- **Internationalisation**: LinguiJS
- **Notifications**: Sonner
- **Animations**: Framer Motion
- **Images**: @unpic/react pour l'optimisation avancée des images

### Optimisation des images avec @unpic/react

Le projet utilise `@unpic/react` pour une optimisation avancée des images. Ce composant permet de :
- Charger des images adaptées à chaque appareil (responsive)
- Optimiser automatiquement le format et la qualité
- Supporter le lazy loading natif
- Maintenir un bon score Core Web Vitals

#### Utilisation de base :

```tsx
import { Image } from '@unpic/react';

// Image responsive avec optimisation automatique
<Image
  src="/image.jpg"
  layout="constrained"
  width={800}
  height={600}
  alt="Description de l'image"
  className="rounded-lg"
/>


### Outils de Développement
- **Bundler**: Vite
- **Tests**: Vitest + Testing Library
- **Linting**: ESLint
- **Formatage**: Prettier
- **Conteneurisation**: Docker

## 🛠 Installation

### Prérequis
- Node.js 20+
- pnpm 9+
- Docker (optionnel pour le déploiement)

### Configuration
1. Cloner le dépôt
2. Installer les dépendances :
   ```bash
   pnpm install
   ```
3. Créer un fichier `.env` à la racine avec les variables d'environnement nécessaires :
   ```
   VITE_API_URL=http://localhost:3000
   VITE_APP_TITLE=Wayhost Panel
   ```

## 🚀 Démarrage

### Développement
```bash
pnpm dev
```
Le serveur de développement sera disponible sur http://localhost:5173

### Production
#### Avec Docker
```bash
docker build -t wayhost-panel .
docker run -p 3000:80 wayhost-panel
```

#### Sans Docker
```bash
pnpm build
pnpm serve
```

## 🔧 Commandes utiles
- `pnpm dev` - Lancer le serveur de développement
- `pnpm build` - Construire pour la production
- `pnpm test` - Lancer les tests
- `pnpm extract` - Extraire les messages pour l'i18n
- `pnpm compile` - Compiler les fichiers de traduction

## 📁 Structure du projet

Le projet suit une architecture par fonctionnalités organisée dans le dossier `src/modules/` :

```
src/
├── modules/                    # Fonctionnalités de l'application
│   └── $lang/                 # Support multilingue
│       ├── _auth/             # Module d'authentification
│       │   ├── (pages)/       # Pages liées à l'authentification
│       │   ├── -components/   # Composants spécifiques à l'authentification
│       │   ├── hooks/         # Hooks personnalisés
│       │   ├── requests/      # Appels API
│       │   ├── schemas/       # Schémas de validation
│       │   ├── stores/        # Gestion d'état local
│       │   └── tests/         # Tests unitaires
│       │
│       └── _panel/            # Panneau d'administration
│           ├── (pages)/       # Routes et pages
│           │   ├── admin/     # Interface administrateur
│           │   │   ├── os/    # Gestion des OS
│           │   │   └── servers/ # Gestion des serveurs
│           │   └── customer/  # Interface client
│           │       ├── profile/ # Profil utilisateur
│           │       └── servers/ # Serveurs du client
│           ├── -components/   # Composants spécifiques au panel
│           ├── hooks/         # Hooks personnalisés
│           └── requests/      # Appels API
│
├── shared/                    # Code partagé entre les fonctionnalités
│   ├── components/           # Composants réutilisables
│   │   ├── magicui/         # Composants UI magiques
│   │   └── ui/              # Composants UI de base
│   └── providers/           # Fournisseurs de contexte globaux
│
├── locales/                  # Fichiers de traduction
│   ├── en/                  # Textes en anglais
│   └── fr/                  # Textes en français
│
├── lib/                     # Utilitaires et configurations
└── App.tsx                  # Point d'entrée de l'application
```

### Organisation par fonctionnalité
Chaque fonctionnalité est auto-contenue dans son propre dossier avec :
- Ses propres composants
- Sa logique métier
- Ses appels API
- Ses tests
- Sa documentation
