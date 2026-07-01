# Audit Dedcco — Plan d'action priorisé

**Date :** 1er juillet 2026
**Basé sur :** Rapport d'audit complet (5 agents parallèles) + vérification contre le code restauré (zip 30 juin 23:32)

---

## Résumé exécutif

Le rapport d'audit a identifié 34 actions réparties en P0/P1/P2/P3. Après vérification contre le code restauré, **plusieurs findings P0 sont déjà résolus** dans la version actuelle. Voici l'état réel et le plan d'action.

---

## ✅ Findings P0 déjà résolus dans la version actuelle

| Finding du rapport | État réel | Détail |
|---|---|---|
| **P0-1 : Zip incomplet** (`src/lib/` manquant) | ✅ Résolu | `src/lib/` complet : `store.ts`, `dedco-types.ts`, `dedco-data.ts`, `utils.ts`, `package.json`, `tsconfig.json`, `next.config.ts`, fonts Quache — **le projet build** |
| **P0-2 : Inscription cassée** (`fullName` undefined) | ✅ Résolu | Code corrigé : `firstName` + `name` concaténés correctement (ligne 74) |
| **P0-3 : Checkout hardcodé `ORD-001`** | ✅ Résolu | Génère maintenant `CMD-2026-${random}` (ligne 93) |
| **P0-4 : Prisma configuré** | ✅ Présent | `src/lib/db.ts` configure PrismaClient |

---

## 🔴 Findings P0 encore valables — à corriger en priorité

### P0-A : Persistance Zustand absente
**Problème :** `store.ts` n'utilise pas `persist` middleware → panier, favoris, `currentUser` effacés au refresh.
**Solution :** Ajouter `persist` middleware sur le store Zustand.

### P0-B : Zéro route guarding
**Problème :** Aucun middleware ne vérifie le rôle utilisateur. N'importe qui peut `navigate({page:"admin-dashboard"})`.
**Solution :** Ajouter un guard dans `dedco-router.tsx` qui vérifie `currentUser.role` avant de rendre les pages dashboard.

### P0-C : Workflow brief — cul-de-sac côté client
**Problème :** `client-proposition-recue`, `projet-paiement`, `projet-detail`, `projet-livraison` existent dans le router mais ont 0 navigation entrante depuis le workflow designer/artisan.
**Solution :** Connecter `designer-proposition-mission` → `client-proposition-recue` → `projet-paiement` → `projet-detail` → `projet-livraison`.

### P0-D : Accessibilité modales
**Problème :** Seul `cart-search.tsx` a `role="dialog"`. Pas de focus trap, pas d'Échap, pas de `aria-modal`.
**Solution :** Utiliser `@radix-ui/react-dialog` (déjà dependency) pour CartSidebar, SearchOverlay, modales admin.

### P0-E : Tokens contraste WCAG AA
**Problème :**
- `--text-3: #a89e95` → ratio 2.39:1 sur cream (échec AA, 729 occurrences)
- `--amber: #bf793b` → ratio 3.23:1 sur cream (échec AA texte normal, 208 occurrences)

**Solution :**
- Assombrir `--text-3` vers `#7a7068` (ratio ~4.6:1)
- Réserver `--amber` aux grandes tailles ; utiliser `--amber-dark` pour le texte coloré

### P0-F : Pas d'error.tsx / loading.tsx
**Problème :** 0 fichier `error.tsx`, `loading.tsx`, `not-found.tsx` dans `src/app/`.
**Solution :** Ajouter ces 3 fichiers à la racine de `src/app/`.

---

## 🟠 Findings P1 — Architecture & conformité

### P1-1 : Dérive des neutres (à décider)
Les tokens `globals.css` diffèrent du spec HTML :
| Token | Spec HTML | Implémentation |
|---|---|---|
| `--bg-cream` | `#FFFFFF` | `#f7f3ed` (plus chaud) |
| `--bg-warm` | `#FAF8F5` | `#ede8e1` |
| `--border` | `#F0EEEC` | `#eae3d9` |

**Décision :** Aligner le code sur le spec OU amender le spec pour acter la palette plus chaude.

### P1-2 : 168 `bg-white` à remplacer par `bg-card`
Bypass de la couche sémantique. Migration mécanique.

### P1-3 : 543 boutons raw vs 5 imports shadcn Button
87 % des boutons bypassent le design system. Créer une variante `dedco-btn-icon` et migrer.

### P1-4 : Migration vers vraies routes App Router
Le pattern SPA mono-route tue SEO, code-splitting, SSR, deep-link. Migration vers `(public)/`, `(auth)/`, `(account)/`, `(artisan)/dashboard/`, etc.

### P1-5 : Double système de types routes
`AppRoute` (store, 72 variantes) vs `Route` (legacy, 13 variantes) avec bridge dupliqué. Unifier.

### P1-6 : Double module data
`dedco-data` (PRODUCTS) vs `dedco-data-expanded` (ALL_PRODUCTS) → risque mismatch IDs. Consolider.

---

## 🟡 Findings P2 — Polish & cohérence

- 9 routes orphelines (onboarding, moodboard, order-history, client-proposition-recue, projet-paiement, projet-detail, projet-livraison, admin-products/orders/content)
- ~15 boutons morts sans `onClick` (litige, déconnexion, marquer-lu, etc.)
- Active-link cassé sur 47/60 routes (mapper legacy incomplet)
- 3 routes admin sans entrée sidebar
- Code mort : `brief-page.tsx` (648 lignes jamais importé), `FavoritesPage` dupliquée
- 17 primitives shadcn mortes sur 18
- Dark mode déclaré mais jamais activé
- Animations CSS spécifiées mais non implémentées (Framer Motion utilisé à la place)

---

## 🟢 Findings P3 — Nettoyage

- 0 `React.memo`, `new Set(favorites)` alloué par rendu
- 0 `next/image` (36 raw `<img>`)
- 309 handlers inline + 270 objets `style` inline
- 212 `style={{color:'var(--text-*)'}}` à migrer vers classes sémantiques
- 3 unions `Role` dérivées à unifier

---

## Plan d'action recommandé

### Phase 1 — Stabilisation (P0, 1-2 jours)
1. **Persistance Zustand** (`persist` middleware)
2. **Route guarding** par rôle
3. **Fermer workflow brief** (connecter les 4 pages orphelines)
4. **Accessibilité modales** (Radix Dialog)
5. **Tokens contraste** (`--text-3`, `--amber`)
6. **error.tsx / loading.tsx / not-found.tsx**

### Phase 2 — Architecture (P1, 3-5 jours)
7. **Décider dérive neutres** (aligner ou amender spec)
8. **Migrer `bg-white` → `bg-card`** (168 occurrences)
9. **Migration routes App Router** (changement d'épine dorsale)
10. **Unifier types routes** (`AppRoute` partout)
11. **Consolider modules data**

### Phase 3 — Polish (P2, 2-3 jours)
12. **Wiring routes orphelines** (onboarding, moodboard, admin pages)
13. **Corriger boutons morts** (~15)
14. **Activer/désactiver dark mode**
15. **Supprimer code mort**

### Phase 4 — Nettoyage (P3, ongoing)
16. **`React.memo`** sur cards
17. **`next/image`** migration
18. **Extraire handlers inline**
19. **Unifier unions `Role`**

---

## Conclusion

Le rapport d'audit était **partiellement obsolète** — il s'appliquait à un backup incomplet. La version restaurée (30 juin 23:32) a déjà corrigé :
- L'incomplétude du zip (`src/lib/` est présent)
- Le bug `fullName` (corrigé en `firstName + name`)
- Le checkout hardcodé (génère `CMD-2026-XXXX`)
- La config Prisma

**Les P0 encore valables** sont : persistance, route guarding, workflow brief, accessibilité modales, contraste tokens, error/loading states. Ce sont les actions à mener en premier.

**L'effort le plus structurant** reste P1-4 (migration routes App Router) qui débloque SEO, code-splitting, SSR et deep-linking.
