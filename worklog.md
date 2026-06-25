# Worklog Dedco

---
Task ID: audit-mes-projets
Agent: main
Task: Audit des incohérences "Mes projets" - confusion artisan/designer

Work Log:
- Lecture mes-projets-page.tsx, mes-projets-data.ts, projet-artisan-detail.tsx, dedco-router.tsx, dedco-types.ts, dedco-status.tsx, designer-workflow-pages.tsx, store.ts
- 7 incohérences identifiées :
  1. Route "projet-detail" redirigeait vers ProjetArtisanDetailPage même pour les projets designer (PD-)
  2. ProjetArtisanDetailPage avait un MOCK_PROJECT hardcoded (toujours PA-001)
  3. Route "projet-paiement" (page designer) était utilisée pour les acomptes artisan (PROP-*)
  4. Route "brief" (artisan) était utilisée pour "Refaire une demande similaire" sur projets designer terminés
  5. Statut PD-002 était "IN_PRODUCTION" (statut artisan) au lieu d'un statut designer
  6. Aucune séparation visuelle claire artisan/designer dans onglet "À choisir"
  7. Route "brief-list" manquait dans type AppRoute (bug pré-existant)
- Création projet-designer-detail.tsx (mocks PD-001, PD-002, PD-010, onglets Livrables/Détails/Révisions/Messages)
- Création projet-paiement-artisan.tsx (mocks PROP-K1, PROP-A1/A2/A3, acompte % + solde %, garantie Dedco)
- Refonte projet-artisan-detail.tsx avec mocks distincts (PA-001, PA-002, PA-004, PA-005, PA-010)
- store.ts : ajout routes projet-designer-detail + projet-paiement-artisan
- dedco-router.tsx : routing intelligent PD- vs PA- pour projet-detail, nouveaux cases
- mes-projets-data.ts : statut PD-002 corrigé (DELIVERABLE_READY), route BA-003 acompte corrigée
- mes-projets-page.tsx : navigateTo détecte PD-/PA-, boutons contextuels, SectionHeader avec accentColor, séparation visuelle Artisan/Designer
- Imports Hammer + Palette ajoutés
- Fix bug pré-existant brief-list manquant dans AppRoute
- Build Next.js réussi (0 erreur bloquante)
- Zip sécurisé dedco-v6-mes-projets.zip créé dans download/ (783K) ET upload/ (783K)

Stage Summary:
- Workflow artisan et designer totalement séparés dans "Mes projets"
- Chaque projectId (PA-xxx ou PD-xxx) a son propre mock
- Routes dédiées : projet-artisan-detail, projet-designer-detail, projet-paiement, projet-paiement-artisan
- Onglet "À choisir" scindé visuellement : section "Artisan" (ambre) + section "Designer" (forest)
- Build propre, zip sécurisé disponible
