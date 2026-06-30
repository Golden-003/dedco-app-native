// ============================================================
// BRIEF ARTISAN — Permissions
// Toutes les vérifications de droits passent par ici
// Les pages n'implémentent jamais de logique de permission
// ============================================================

import type { BriefArtisan, BriefAction, UserRole } from './types';
import { canTransition } from './transitions';
import { BRIEF_ARTISAN_STATUSES } from './statuses';

// ── Permissions par action ──

export function canEditBrief(brief: BriefArtisan, role: UserRole): boolean {
  return brief.status === 'DRAFT' && role === 'client';
}

export function canSubmitBrief(brief: BriefArtisan, role: UserRole): boolean {
  return canTransition(brief.status, 'submit', role);
}

export function canPublishBrief(brief: BriefArtisan, role: UserRole): boolean {
  return canTransition(brief.status, 'publish', role);
}

export function canCancelBrief(brief: BriefArtisan, role: UserRole): boolean {
  return canTransition(brief.status, 'cancel', role) && !BRIEF_ARTISAN_STATUSES[brief.status].isTerminal;
}

export function canStartDiscussion(brief: BriefArtisan, role: UserRole): boolean {
  return canTransition(brief.status, 'startDiscussion', role);
}

export function canSelectProposal(brief: BriefArtisan, role: UserRole): boolean {
  return canTransition(brief.status, 'selectProposal', role) && brief.proposals.length > 0;
}

export function canConfirmSelection(brief: BriefArtisan, role: UserRole): boolean {
  return canTransition(brief.status, 'confirmSelection', role) && !!brief.selectedProposalId;
}

export function canPayDeposit(brief: BriefArtisan, role: UserRole): boolean {
  return canTransition(brief.status, 'payDeposit', role);
}

export function canDuplicateBrief(brief: BriefArtisan, role: UserRole): boolean {
  return canTransition(brief.status, 'duplicate', role);
}

export function canRelanceBrief(brief: BriefArtisan, role: UserRole): boolean {
  return canTransition(brief.status, 'relance', role);
}

// ── Permission générique ──

export function canPerformAction(
  brief: BriefArtisan,
  action: BriefAction,
  role: UserRole
): boolean {
  return canTransition(brief.status, action, role);
}

// ── Le brief est-il actif (non terminal) ? ──

export function isBriefActive(brief: BriefArtisan): boolean {
  return !BRIEF_ARTISAN_STATUSES[brief.status].isTerminal;
}

// ── Le brief peut-il recevoir des propositions ? ──

export function canReceiveProposals(brief: BriefArtisan): boolean {
  return brief.status === 'PUBLISHED';
}

// ── Le brief peut-il être annulé ? ──

export function canBeCancelled(brief: BriefArtisan, role: UserRole): boolean {
  return canCancelBrief(brief, role);
}
