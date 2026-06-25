# Worklog Dedco

---
Task ID: audit-mes-projets
Agent: main
Task: Audit des incohérences "Mes projets" - confusion artisan/designer

Work Log:
- 7 incohérences corrigées (séparation artisan/designer, mocks distincts par projectId, routes dédiées)
- Création projet-designer-detail.tsx, projet-paiement-artisan.tsx, refonte projet-artisan-detail.tsx
- Build propre, zip dedco-v6-mes-projets.zip

---
Task ID: audit-pilotage-v7
Agent: main
Task: 7 ajustements de pilotage "Mes projets" avant étape 2 (machine d'états)

Work Log:
- 1A. Statut AWAITING_PAYMENT explicite ajouté aux prestations designer
- 1B. BA-001 (3 propositions) déjà regroupé sous 1 carte (vérifié)
- 2. Aucune carte mes-projets ne pointe vers order-tracking
- 3. Tri secondaire par deadline ajouté dans TabEnCours (parseFrDate helper)
- 4. BA-003 (AWAITING_DEPOSIT) déplacé vers MOCK_PAIEMENTS_EN_ATTENTE (À choisir)
- 5. Filtre secondaire "Tous / Réalisés / Annulés" déjà en place
- 6. Champs sourceType/sourceId/parentBriefId/linkedProjectId ajoutés à tous les types
- 7. Publication auto brief artisan inchangée
- Build OK, zip dedco-v7-pilotage.zip

---
Task ID: audit-achoisir-routes-v8
Agent: main
Task: Améliorer section "À choisir" + finaliser toutes les routes (zéro bouton non fonctionnel)

Work Log:
- BriefProposalsCard refondue : grille 3 colonnes + tableau comparatif
- Restructuration TabAChoisir : sections Artisan/Designer séparées
- Finalisation projet-artisan-detail.tsx : tous les boutons ont un onClick (Contacter, Refuser, Accepter, Confirmer, Payer acompte, Litige, Facture, Messages)
- Finalisation projet-designer-detail.tsx : tous les boutons ont un onClick (Contacter, Télécharger, Révision, Préparer RDV, Litige, Facture, Messages)
- Vérification : 0 bouton sans onClick dans les 4 fichiers (41 boutons audités)
- Build OK, zip dedco-v8-achoisir-routes.zip

---
Task ID: github-setup-v9
Agent: main
Task: Setup complet du repo GitHub (push initial + doc + branch protection)

Work Log:
- Push initial réussi sur https://github.com/Golden-003/Dedco (339 fichiers, branche main)
- .env retiré du tracking, .env.example ajouté
- Création README.md complet (stack, install, structure, commandes, design system, workflows, routes)
- Création LICENSE MIT (Golden-003, 2026)
- Création CONTRIBUTING.md (workflow Git, conventions de commits, règles de code, design system)
- Création .github/PULL_REQUEST_TEMPLATE.md (template complet avec checklist Dedco)
- Création .github/ISSUE_TEMPLATE/bug_report.md (template bug avec sévérité)
- Création .github/ISSUE_TEMPLATE/feature_request.md (template feature avec impact)
- Création scripts/setup-branch-protection.py (script Python pour activer la protection de branche via API GitHub)
- Commit local réussi : 77c70af docs: ajoute README, LICENSE MIT, CONTRIBUTING, templates PR/issue, script branch protection
- ⚠️ PAT révoqué automatiquement par GitHub (détecté dans le chat) — push final des fichiers doc échoué
- Tentative API GitHub pour branch protection : 401 Bad credentials (PAT révoqué)
- Fichiers prêts localement, en attente de push par le user avec un nouveau PAT

Stage Summary:
- Repo initial en ligne avec 339 fichiers (commit 1e1a084)
- 7 fichiers doc prêts localement (commit 77c70af) à pousser
- 1 script Python prêt pour activer branch protection
- Le user doit : générer un nouveau PAT, exécuter le push, exécuter le script branch protection, révoquer le PAT
- Zip dedco-github-final.zip créé pour sauvegarde
