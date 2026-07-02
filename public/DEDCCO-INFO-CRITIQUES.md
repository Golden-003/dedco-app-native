# Dedcco — Informations critiques à conserver

## Repos & URLs
- **Code source (GitHub)** : https://github.com/Golden-003/Dedco
- **App en ligne (Vercel)** : https://dedco-h8zw-ljwtwbv0i-vitaldohou31-6974s-projects.vercel.app/
- **Dashboard Vercel** : https://vercel.com (connecte-toi avec GitHub)

## Comptes
- **GitHub** : utilisateur `Golden-003`, email `vitaldohou31@gmail.com`
- **Vercel** : lié au compte GitHub ci-dessus

## Comment continuer le travail dans un nouveau chat Z.ai
Dis à l'assistant :
> "Clone le repo GitHub Golden-003/Dedco. C'est une marketplace Dedcco (Next.js 16 + Tailwind 4 + shadcn/ui). L'app est déployée sur Vercel. Fais `git pull` pour récupérer les dernières corrections, puis fais tes modifs et `git push origin main`. Vercel redéploie automatiquement."

## Pour travailler sur ton PC
```bash
git clone https://github.com/Golden-003/Dedco.git
cd Dedco
bun install
bun dev
```

## Configuration git (si besoin)
```bash
git config user.email "vitaldohou31@gmail.com"
git config user.name "Golden-003"
```

## Stack technique
- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS 4
- shadcn/ui (51 composants)
- Zustand (state management, persist middleware)
- Prisma (ORM, schema dans prisma/schema.prisma)
- lucide-react (icônes)
- framer-motion (animations)

## Design System
- Palette : Amber #BF793B / Terracotta #A6442E / Forest #548C45
- Typo : Quache (display, mots) + Plus Jakarta Sans (corps, chiffres)
- Pattern unicode-range : chiffres exclus de Quache → fallback Jakarta
- Classes custom : .dedco-btn-*, .dedco-badge-*, .dedco-card, .dedco-btn-icon-*
- Dark mode : .dark class + ThemeToggle dans navbar

## Module brief-artisan (cœur métier)
- 11 statuts (DRAFT → CONVERTED_TO_PROJECT + 4 terminaux)
- 23 transitions (src/lib/brief-artisan/transitions.ts)
- 13 fonctions de permission (src/lib/brief-artisan/permissions.ts)
- Engine : transitionBrief() + applyTransition() (src/lib/brief-artisan/engine.ts)
- Notifications wirées au notification-store

## Règles importantes
- Toujours `git pull` avant de commencer à travailler
- Toujours `git push` après chaque modification importante
- Ne jamais introduire de 4e couleur (palette fermée : Amber/Terracotta/Forest)
- Les chiffres ne doivent JAMAIS être en Quache (unicode-range gère ça)
- Vercel redéploie automatiquement à chaque push sur main
