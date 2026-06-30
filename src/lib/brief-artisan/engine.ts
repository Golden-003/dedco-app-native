// ============================================================
// BRIEF ARTISAN — Moteur de transition
// Fonction centrale : transitionBrief()
// Entrée : Brief + Action + Utilisateur
// Sortie : Nouveau statut + Historique + Notifications + Erreurs
//
// Aucune page ne modifie directement un statut.
// Tout passe par cette fonction.
// ============================================================

import type {
  BriefArtisan,
  BriefAction,
  UserRole,
  TransitionResult,
  BriefHistoryEntry,
  NotificationTrigger,
} from './types';
import { findTransition } from './transitions';
import { canTransition } from './transitions';
import { isBriefActive } from './permissions';
import { generateId } from '@/lib/types/id-format';

// ── Fonction centrale ──

export function transitionBrief(
  brief: BriefArtisan,
  action: BriefAction,
  user: { id: string; role: UserRole }
): TransitionResult {
  // 1. Vérifier que le brief est actif (non terminal)
  if (!isBriefActive(brief) && action !== 'duplicate' && action !== 'relance' && action !== 'close') {
    return {
      success: false,
      error: `Ce brief est dans un statut terminal (${brief.status}). Aucune action possible sauf duplication ou relance.`,
    };
  }

  // 2. Trouver la règle de transition
  const rule = findTransition(brief.status, action);
  if (!rule) {
    return {
      success: false,
      error: `Transition non autorisée : ${action} depuis ${brief.status}.`,
    };
  }

  // 3. Vérifier les permissions
  if (!rule.roles.includes(user.role)) {
    return {
      success: false,
      error: `Le rôle ${user.role} n'est pas autorisé à effectuer l'action ${action}.`,
    };
  }

  // 4. Vérifications spécifiques par action
  const validationError = validateAction(brief, action);
  if (validationError) {
    return { success: false, error: validationError };
  }

  // 5. Générer l'entrée d'historique
  const historyEntry: BriefHistoryEntry = {
    id: generateId('NOT'),
    action,
    fromStatus: brief.status,
    toStatus: rule.to,
    actor: user.id,
    actorRole: user.role,
    timestamp: new Date().toISOString(),
  };

  // 6. Retourner le résultat
  return {
    success: true,
    newStatus: rule.to,
    historyEntry,
    notifications: rule.notifications,
  };
}

// ── Validations spécifiques par action ──

function validateAction(brief: BriefArtisan, action: BriefAction): string | null {
  switch (action) {
    case 'submit':
      if (!brief.title || !brief.category || !brief.piece) {
        return 'Le brief doit avoir un titre, une catégorie et une pièce pour être soumis.';
      }
      if (brief.budgetMin <= 0 || brief.budgetMax <= 0) {
        return 'Le budget doit être défini.';
      }
      return null;

    case 'publish':
      if (brief.status !== 'SUBMITTED') {
        return 'Seul un brief soumis peut être publié.';
      }
      return null;

    case 'receiveProposal':
      if (brief.status !== 'PUBLISHED') {
        return 'Les propositions ne peuvent être reçues que sur un brief publié.';
      }
      return null;

    case 'selectProposal':
      if (brief.proposals.length === 0) {
        return 'Aucune proposition à sélectionner.';
      }
      return null;

    case 'confirmSelection':
      if (!brief.selectedProposalId) {
        return 'Aucune proposition sélectionnée à confirmer.';
      }
      return null;

    case 'payDeposit':
      if (!brief.selectedProposalId) {
        return 'Aucune proposition sélectionnée. Impossible de payer.';
      }
      const proposal = brief.proposals.find(p => p.id === brief.selectedProposalId);
      if (!proposal) {
        return 'Proposition sélectionnée introuvable.';
      }
      if (proposal.price <= 0) {
        return 'Le montant de la proposition est invalide.';
      }
      return null;

    case 'relance':
      if (brief.status !== 'EXPIRED') {
        return 'Seul un brief expiré peut être relancé.';
      }
      return null;

    case 'duplicate':
      if (brief.status !== 'CANCELLED' && brief.status !== 'EXPIRED') {
        return 'Seuls les briefs annulés ou expirés peuvent être dupliqués.';
      }
      return null;

    default:
      return null;
  }
}

// ── Appliquer une transition (retourne le brief mis à jour) ──

export function applyTransition(
  brief: BriefArtisan,
  action: BriefAction,
  user: { id: string; role: UserRole }
): { brief: BriefArtisan; result: TransitionResult } {
  const result = transitionBrief(brief, action, user);

  if (!result.success || !result.newStatus) {
    return { brief, result };
  }

  const updatedBrief: BriefArtisan = {
    ...brief,
    status: result.newStatus,
    updatedAt: new Date().toISOString(),
    history: [...brief.history, ...(result.historyEntry ? [result.historyEntry] : [])],
  };

  // Actions spécifiques post-transition
  switch (action) {
    case 'publish':
    case 'relance':
      // Définir la date d'expiration à +14 jours
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 14);
      updatedBrief.expiresAt = expiry.toISOString();
      // Vider les propositions (pour relance)
      if (action === 'relance') {
        updatedBrief.proposals = [];
        updatedBrief.selectedProposalId = undefined;
      }
      break;

    case 'payDeposit':
      // Générer l'ID du projet
      updatedBrief.linkedProjectId = generateId('PRA');
      break;

    case 'duplicate':
      // Le duplicat sera un nouveau brief avec un nouvel ID
      // (la logique de création est gérée par le store)
      break;
  }

  return { brief: updatedBrief, result };
}
