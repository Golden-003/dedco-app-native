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

---
Task ID: audit-achoisir-routes-v8
Agent: main
Task: Améliorer section "À choisir" + finaliser toutes les routes (zéro bouton non fonctionnel)

Work Log:
- Audit BriefProposalsCard : layout vertical encombrant, pas de comparaison synthétique
- Audit boutons : 13 boutons sans onClick dans projet-artisan-detail.tsx et projet-designer-detail.tsx (Contacter, Refuser, Accepter, Confirmer, Payer acompte, Télécharger, Demander révision, Préparer RDV, Ouvrir litige, Voir facture, Messages)
- Amélioration BriefProposalsCard : grille 3 colonnes en desktop + mini-cartes par proposition avec prix/délai/matériaux/paiement/image + bouton "Choisir" + tableau comparatif synthétique (Artisan | Prix | Délai | Acompte | Vérifié | Action)
- Restructuration TabAChoisir : sections Artisan/Designer clairement séparées, paiements acompte artisan isolés dans leur propre sous-section, empty state global si rien à choisir
- Finalisation projet-artisan-detail.tsx : ajout states locaux (modStatuses, deliveryConfirmed, messages, newMessage, toast), tous les boutons ont un onClick — Contacter → messages, Refuser/Accepter mod → toast + update state, Confirmer réception → toast + update state, Payer acompte → projet-paiement-artisan, Ouvrir litige → litige, Voir facture → invoice, Messagerie avec state local (envoi + Enter key)
- Finalisation projet-designer-detail.tsx : ajout states locaux (revisions, messages, newMessage, showRevisionForm, revisionMotif, toast), tous les boutons ont un onClick — Contacter → messages, Télécharger → toast factice, Demander révision → formulaire inline + ajout à la liste, Préparer RDV → switch onglet "details", Ouvrir litige → litige, Voir facture → invoice, Messagerie avec state local
- Vérification : 0 bouton sans onClick dans les 4 fichiers critiques (projet-artisan-detail, projet-designer-detail, projet-paiement-artisan, mes-projets-page)
- Build Next.js réussi
- Zip sécurisé dedco-v8-achoisir-routes.zip créé dans download/ (787K) ET upload/ (787K)

Stage Summary:
- Section "À choisir" visuellement structurée : grille 3 colonnes + tableau comparatif
- 0 bouton non fonctionnel sur les 41 boutons audités des 4 fichiers
- Toasts inline pour retours utilisateurs (acceptation mod, confirmation réception, révision demandée, téléchargement démarré)
- Messagerie projet fonctionnelle avec state local (envoi + Enter)
- Routes cibles vérifiées : messages, litige, invoice, projet-paiement-artisan, projet-livraison existent toutes
- Prêt pour étape 2 : machine d'états brief artisan

