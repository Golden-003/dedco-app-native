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
- 1A. Statut AWAITING_PAYMENT explicite ajouté aux prestations designer (badge "Paiement à effectuer" sur PrestationDesignerCard)
- 1A. KICKOFF_SCHEDULED (PD-001) confirmé avec bouton "Préparer mon projet" (pas de paiement)
- 1B. BA-001 (3 propositions) déjà regroupé sous 1 carte dans MOCK_BRIEF_WITH_PROPOSALS (vérifié, pas de modification)
- 2. Aucune carte mes-projets ne pointe vers order-tracking (vérifié par grep) — routes projet-detail intelligentes (PD-→designer, PA-→artisan), projet-paiement-artisan pour acomptes
- 3. Tri secondaire par deadline ajouté dans TabEnCours : `parseFrDate()` convertit "26 juin 2026" → timestamp, départage les priorités égales
- 4. BA-003 (AWAITING_DEPOSIT) déplacé de MOCK_EN_COURS vers MOCK_PAIEMENTS_EN_ATTENTE (PAY-A-003, acompte 92500 FCFA) — frontière "À choisir" respectée
- 5. Filtre secondaire "Tous / Réalisés / Annulés" déjà en place (vérifié)
- 6. Champs sourceType/sourceId/parentBriefId/linkedProjectId ajoutés à MesProjetsItem + ArtisanBriefWithProposals + DesignerPrestation + PendingPayment + Reclamation dans dedco-types.ts
- 6. Tous les mocks remplis avec leurs liaisons (BA-001 → PROP-A1/A2/A3, PA-001 → BA-001, REC-001 → PA-011, etc.)
- 7. Publication auto brief artisan inchangée (DRAFT → SUBMITTED → PUBLISHED → PROPOSALS_RECEIVED → IN_DISCUSSION → ARTISAN_SELECTED → AWAITING_DEPOSIT → CONVERTED_TO_PROJECT)
- Helper parseFrDate ajouté dans mes-projets-data.ts (mois FR → timestamp)
- Build Next.js réussi (0 erreur bloquante)
- Zip sécurisé dedco-v7-pilotage.zip créé dans download/ (784K) ET upload/ (784K)

Stage Summary:
- "Mes projets" devient la vraie couche de pilotage client
- Frontières onglets claires : En cours (actifs) / À choisir (décisions+acomptes) / Terminés (réalisés vs annulés séparés) / Réclamations
- Tri priorité + deadline, statuts cohérents, routes dédiées par type d'objet
- Liaison métier complète : brief → proposition → projet → réclamation
- Prêt pour étape 2 : machine d'états du brief artisan
