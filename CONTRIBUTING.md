# Contribuer à Dedco

Merci de vouloir contribuer à Dedco ! Ce guide explique comment participer proprement au projet.

---

## Démarrage

```bash
git clone https://github.com/Golden-003/Dedco.git
cd Dedco
npm install
cp .env.example .env
npm run dev
```

L'app tourne sur http://localhost:3000.

---

## Workflow Git

### 1. Créer une branche

Toujours partir de `main` à jour :

```bash
git checkout main
git pull origin main
git checkout -b feature/ma-feature
```

**Conventions de nommage** :
- `feature/...` — nouvelle fonctionnalité
- `fix/...` — correction de bug
- `chore/...` — tâche technique
- `docs/...` — documentation
- `refactor/...` — refactoring

### 2. Coder

- Suivre le **design system Dedco** (palette ambre/terracotta/forest, police Quache)
- 0 emoji dans le code — uniquement icônes [Lucide](https://lucide.dev)
- Chiffres en classe `.font-numeric` (Plus Jakarta Sans)
- Composants avec classes utilitaires Dedco : `.dedco-btn`, `.dedco-card`, `.dedco-badge`
- TypeScript strict — pas de `any` sans justification

### 3. Commiter

Convention [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: ajoute la comparaison de propositions artisan
fix: corrige le routing des projets designer
chore: met à jour Next.js 16.1.3
docs: ajoute le guide de contribution
refactor: simplifie le store Zustand
style: uniformise les paddings des cartes
```

### 4. Pousser

```bash
git push -u origin feature/ma-feature
```

### 5. Ouvrir une Pull Request

- Sur GitHub, ouvrir une PR vers `main`
- Remplir le [template de PR](./.github/PULL_REQUEST_TEMPLATE.md)
- Demander une review
- **Ne pas merger soi-même** sans review

---

## Règles de code

### TypeScript

- `strict: true` activé
- Pas de `any` sans commentaire justificatif
- Types dans `src/lib/dedco-types.ts` ou `dedco-status.tsx`
- Préférer `type` pour les unions, `interface` pour les objets extensibles

### Composants React

```tsx
// ✅ Bon
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="dedco-card p-4">
      <h3 className="font-display font-semibold">{product.name}</h3>
      <p className="font-numeric text-sm">{formatFCFA(product.price)}</p>
    </div>
  );
}

// ❌ À éviter
function ProductCard(props: any) {
  return <div style={{padding: 16}}>{props.product.name}</div>;
}
```

### Routing SPA

Le routing est géré par Zustand (`src/lib/store.ts`). Pour ajouter une page :

1. Ajouter le type de route dans `AppRoute`
2. Ajouter le `case` correspondant dans `dedco-router.tsx`
3. Créer le composant de page dans `src/components/dedco/pages/`
4. Si dashboard (artisan/designer/admin), ajouter au set correspondant

### Boutons

**Règle d'or** : aucun bouton sans `onClick`. Si une action n'est pas encore implémentée, désactiver le bouton (`disabled`) ou afficher un toast "Bientôt disponible" — jamais un bouton muet.

### Statuts métier

Les machines d'états sont dans `src/lib/dedco-status.tsx`. Ne jamais modifier un statut sans :
1. Vérifier les transitions autorisées
2. Mettre à jour les mocks correspondants
3. Tester les pages qui utilisent ce statut

---

## Design system

### Palette (variables CSS)

```css
--amber: #BF793B;
--amber-dark: #A05F2A;
--amber-pale: #FEF5E9;
--terracotta: #A6442E;
--terracotta-pale: #FAEAE6;
--forest: #548C45;
--forest-pale: #E6F2E3;
--cream: #F7F3ED;
--ink: #1E1813;
```

### Classes utilitaires Dedco

- `.dedco-btn` + `.dedco-btn-primary` / `.dedco-btn-secondary` / `.dedco-btn-ghost` / `.dedco-btn-terracotta`
- `.dedco-btn-sm` / `.dedco-btn-lg`
- `.dedco-card`
- `.dedco-badge` + `.dedco-badge-amber` / `.dedco-badge-terra` / `.dedco-badge-forest` / `.dedco-badge-ghost`
- `.display-lg` / `.display-xl`
- `.font-numeric`
- `.dedco-hide-scroll`

---

## Tests

Pour l'instant, pas de tests automatisés. Avant chaque PR :

- [ ] `npm run build` passe sans erreur
- [ ] `npm run lint` passe sans warning nouveau
- [ ] Test manuel des parcours critiques :
  - Accueil → Marketplace → Produit → Panier → Checkout
  - Brief artisan → Soumission
  - Mes projets → tous les onglets
  - Dashboard artisan → toutes les sections
  - Dashboard designer → toutes les sections

---

## Signaler un bug

Ouvre une [issue bug report](https://github.com/Golden-003/Dedco/issues/new?template=bug_report.md) avec :
- Description claire
- Étapes pour reproduire
- Screenshots si possible
- Logs console

---

## Proposer une feature

Ouvre une [issue feature request](https://github.com/Golden-003/Dedco/issues/new?template=feature_request.md) avec :
- Problème à résoudre
- Solution proposée
- Alternatives envisagées
- Impact (quels utilisateurs)

---

## Code of conduct

- Respect mutuel dans les issues et PR
- Pas de spam, pas de pub
- Contributions bienveillantes et constructives
- En cas de conflit technique, le owner tranche en dernier recours

---

Merci de contribuer à Dedco ! 🥋
