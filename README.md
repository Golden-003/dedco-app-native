# Dedco

**Marketplace béninoise d'aménagement intérieur** — connecte clients, artisans, designers et maisons de décoration.

Projet Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui. Application monopage (SPA) avec routing Zustand, design system Dedco (police Quache, palette ambre/terracotta/forest), workflows séparés pour artisan et designer.

---

## Stack technique

| Domaine | Technologie |
|---------|-------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Langage | TypeScript 5 |
| Style | Tailwind CSS 4 + CSS variables |
| UI primitives | shadcn/ui (Radix UI) |
| State | Zustand (store global + routing SPA) |
| Animations | Framer Motion |
| Icônes | Lucide React |
| Polices | Quache (display) + Plus Jakarta Sans (numeric) |
| Base de données | Prisma + SQLite (dev), PostgreSQL (prod) |
| Package manager | npm / bun |

---

## Prérequis

- Node.js 18+ (recommandé 20+)
- npm 9+ ou bun
- Git

---

## Installation

```bash
# Cloner le repo
git clone https://github.com/Golden-003/Dedco.git
cd Dedco

# Installer les dépendances
npm install
# ou: bun install

# Copier les variables d'environnement
cp .env.example .env

# Lancer le serveur de développement
npm run dev
# ou: bun dev
```

L'application est accessible sur **http://localhost:3000**.

---

## Commandes disponibles

```bash
npm run dev        # Serveur dev (Turbopack)
npm run build      # Build production
npm run start      # Lance le build en production
npm run lint       # Vérification ESLint
```

---

## Structure du projet

```
Dedco/
├── src/
│   ├── app/                      # App Router Next.js
│   │   ├── layout.tsx            # Layout racine + fonts
│   │   ├── page.tsx              # Page unique (SPA)
│   │   ├── globals.css           # Design system complet
│   │   └── api/route.ts          # API routes
│   │
│   ├── components/
│   │   ├── dedco/                # Composants Dedco
│   │   │   ├── dedco-router.tsx  # Routeur SPA central (~95 pages)
│   │   │   ├── layout.tsx        # Navbar + BottomNav + Footer
│   │   │   ├── home-page.tsx     # Accueil
│   │   │   ├── marketplace-page.tsx
│   │   │   ├── product-page.tsx
│   │   │   ├── brief-page.tsx    # Brief artisan 5 étapes
│   │   │   ├── cards.tsx         # ProductCard, ArtisanCard, etc.
│   │   │   └── pages/            # Toutes les pages métier
│   │   │       ├── mes-projets-page.tsx        # Pilotage client
│   │   │       ├── projet-artisan-detail.tsx   # Suivi projet artisan (jalons)
│   │   │       ├── projet-designer-detail.tsx  # Suivi projet designer (livrables)
│   │   │       ├── projet-paiement-artisan.tsx # Paiement acompte artisan
│   │   │       ├── checkout-page.tsx
│   │   │       ├── order-pages.tsx             # Commandes marketplace
│   │   │       ├── artisan/                    # Dashboard artisan
│   │   │       ├── designer/                   # Dashboard designer
│   │   │       ├── admin/                      # Dashboard admin
│   │   │       └── ...
│   │   └── ui/                   # shadcn/ui primitives
│   │
│   ├── lib/
│   │   ├── store.ts              # Store Zustand (routing + auth + cart)
│   │   ├── dedco-types.ts        # Types TypeScript
│   │   ├── dedco-data.ts         # Données mock (produits, artisans, designers)
│   │   ├── dedco-status.tsx      # Machines d'états (statuts + transitions)
│   │   ├── mes-projets-data.ts   # Mocks "Mes projets" + helpers
│   │   ├── db.ts                 # Prisma client
│   │   └── utils.ts              # Utilitaires (cn, formatFCFA, etc.)
│   │
│   └── hooks/                    # Hooks React (use-mobile, use-toast)
│
├── public/
│   ├── fonts/                    # Police Quache (5 weights)
│   ├── logo.svg
│   └── robots.txt
│
├── prisma/
│   └── schema.prisma             # Schéma base de données
│
├── scripts/                      # Scripts utilitaires
├── .env.example                  # Variables d'environnement (modèle)
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Design system

### Palette

| Couleur | Hex | Usage |
|---------|-----|-------|
| Amber | `#BF793B` | Primaire, accents |
| Amber dark | `#A05F2A` | Hover, liens |
| Terracotta | `#A6442E` | Logo, favoris, alertes |
| Forest | `#548C45` | Validation, designer |
| Cream | `#F7F3ED` | Fond principal |
| Ink | `#1E1813` | Texte principal |

### Police

- **Quache** : police d'affichage (titres, logo)
- **Plus Jakarta Sans** : chiffres via classe `.font-numeric` (Quache exclut les chiffres via `unicode-range`)

### Règles

- 0 emoji dans le code — uniquement icônes Lucide
- Logo deux-tons : "Dedco" terracotta + "." ambre
- Classes utilitaires Dedco : `.dedco-btn`, `.dedco-card`, `.dedco-badge`, `.display-lg`, etc.

---

## Workflow de contribution

1. **Créer une branche** depuis `main` :
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/ma-feature
   ```

2. **Coder** avec des commits propres :
   ```bash
   git commit -m "feat: ajoute page de comparaison propositions"
   git commit -m "fix: corrige routing projet designer"
   ```

3. **Pousser** la branche :
   ```bash
   git push -u origin feature/ma-feature
   ```

4. **Ouvrir une Pull Request** sur GitHub avec le template fourni

5. **Review** par au moins 1 personne avant merge dans `main`

### Convention de commits

| Préfixe | Usage |
|---------|-------|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction de bug |
| `chore:` | Tâche technique (deps, config) |
| `docs:` | Documentation |
| `refactor:` | Refactoring sans changement fonctionnel |
| `style:` | Formatage, CSS |
| `test:` | Tests |

---

## Workflows métier Dedco

### Artisan (production sur commande)

```
Brief client → Publication → Propositions artisan → Discussion → Sélection → Acompte → Projet
                                                                                          ↓
                                            Préparation → Fabrication → Produit terminé → Livraison
```

### Designer (prestation de design)

```
Brief client → Designer répond → Acceptation → Paiement → Réservation → RDV cadrage → Livrables → Validation
```

### Marketplace (produits en stock)

```
Panier → Checkout → Paiement → Préparation → Livraison → Avis
```

---

## Routes principales (SPA Zustand)

Le routing est géré par Zustand (`src/lib/store.ts`). Routes clés :

- `home`, `marketplace`, `product/:id`, `scene/:slug`
- `brief` (création brief artisan), `brief-designer`
- `client-projets` (Mes projets), `projet-artisan-detail/:id`, `projet-designer-detail/:id`
- `artisan-brief-recu`, `artisan-devis-create`
- `designer-brief-recu`, `designer-proposition-mission`
- `checkout`, `payment`, `order-confirmation`, `invoice`
- `litige/:id`, `messages`, `notifications`
- Dashboards : `artisan-dashboard`, `designer-dashboard`, `admin-dashboard`

---

## Licence

MIT — voir [LICENSE](./LICENSE).

---

## Contact

- Repo : https://github.com/Golden-003/Dedco
- Owner : [@Golden-003](https://github.com/Golden-003)

Pour toute question technique, ouvrir une [issue](https://github.com/Golden-003/Dedco/issues/new/choose).
