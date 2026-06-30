// ============================================================
// BRIEF ARTISAN — Transitions
// Table unique des transitions autorisées
// Aucun if dispersé — tout est ici
// ============================================================

import type { BriefArtisanStatus, BriefAction, UserRole } from './types';
import type { NotificationTrigger } from './types';

export interface TransitionRule {
  from: BriefArtisanStatus;
  action: BriefAction;
  to: BriefArtisanStatus;
  roles: UserRole[];
  notifications: NotificationTrigger[];
}

// ── Table des transitions ──

export const BRIEF_TRANSITIONS: TransitionRule[] = [
  // DRAFT → SUBMITTED
  {
    from: 'DRAFT',
    action: 'submit',
    to: 'SUBMITTED',
    roles: ['client'],
    notifications: ['brief_submitted'],
  },
  // DRAFT → CANCELLED
  {
    from: 'DRAFT',
    action: 'cancel',
    to: 'CANCELLED',
    roles: ['client'],
    notifications: ['brief_cancelled'],
  },
  // SUBMITTED → PUBLISHED
  {
    from: 'SUBMITTED',
    action: 'publish',
    to: 'PUBLISHED',
    roles: ['client', 'system'],
    notifications: ['brief_published'],
  },
  // SUBMITTED → CANCELLED
  {
    from: 'SUBMITTED',
    action: 'cancel',
    to: 'CANCELLED',
    roles: ['client'],
    notifications: ['brief_cancelled'],
  },
  // PUBLISHED → PROPOSALS_RECEIVED
  {
    from: 'PUBLISHED',
    action: 'receiveProposal',
    to: 'PROPOSALS_RECEIVED',
    roles: ['artisan', 'system'],
    notifications: ['proposal_received'],
  },
  // PUBLISHED → EXPIRED
  {
    from: 'PUBLISHED',
    action: 'expire',
    to: 'EXPIRED',
    roles: ['system'],
    notifications: ['brief_expired'],
  },
  // PUBLISHED → CANCELLED
  {
    from: 'PUBLISHED',
    action: 'cancel',
    to: 'CANCELLED',
    roles: ['client'],
    notifications: ['brief_cancelled'],
  },
  // PROPOSALS_RECEIVED → IN_DISCUSSION
  {
    from: 'PROPOSALS_RECEIVED',
    action: 'startDiscussion',
    to: 'IN_DISCUSSION',
    roles: ['client'],
    notifications: ['discussion_started'],
  },
  // PROPOSALS_RECEIVED → ARTISAN_SELECTED
  {
    from: 'PROPOSALS_RECEIVED',
    action: 'selectProposal',
    to: 'ARTISAN_SELECTED',
    roles: ['client'],
    notifications: ['artisan_selected'],
  },
  // PROPOSALS_RECEIVED → EXPIRED
  {
    from: 'PROPOSALS_RECEIVED',
    action: 'expire',
    to: 'EXPIRED',
    roles: ['system'],
    notifications: ['brief_expired'],
  },
  // PROPOSALS_RECEIVED → CANCELLED
  {
    from: 'PROPOSALS_RECEIVED',
    action: 'cancel',
    to: 'CANCELLED',
    roles: ['client'],
    notifications: ['brief_cancelled'],
  },
  // IN_DISCUSSION → ARTISAN_SELECTED
  {
    from: 'IN_DISCUSSION',
    action: 'selectProposal',
    to: 'ARTISAN_SELECTED',
    roles: ['client'],
    notifications: ['artisan_selected'],
  },
  // IN_DISCUSSION → PROPOSALS_RECEIVED (retour)
  {
    from: 'IN_DISCUSSION',
    action: 'startDiscussion',
    to: 'PROPOSALS_RECEIVED',
    roles: ['client'],
    notifications: [],
  },
  // IN_DISCUSSION → CANCELLED
  {
    from: 'IN_DISCUSSION',
    action: 'cancel',
    to: 'CANCELLED',
    roles: ['client'],
    notifications: ['brief_cancelled'],
  },
  // ARTISAN_SELECTED → AWAITING_DEPOSIT
  {
    from: 'ARTISAN_SELECTED',
    action: 'confirmSelection',
    to: 'AWAITING_DEPOSIT',
    roles: ['client'],
    notifications: ['payment_requested'],
  },
  // ARTISAN_SELECTED → PROPOSALS_RECEIVED (changement d'avis)
  {
    from: 'ARTISAN_SELECTED',
    action: 'selectProposal',
    to: 'PROPOSALS_RECEIVED',
    roles: ['client'],
    notifications: [],
  },
  // ARTISAN_SELECTED → CANCELLED
  {
    from: 'ARTISAN_SELECTED',
    action: 'cancel',
    to: 'CANCELLED',
    roles: ['client'],
    notifications: ['brief_cancelled'],
  },
  // AWAITING_DEPOSIT → CONVERTED_TO_PROJECT
  {
    from: 'AWAITING_DEPOSIT',
    action: 'payDeposit',
    to: 'CONVERTED_TO_PROJECT',
    roles: ['client'],
    notifications: ['payment_confirmed', 'project_created'],
  },
  // AWAITING_DEPOSIT → ARTISAN_SELECTED (retour)
  {
    from: 'AWAITING_DEPOSIT',
    action: 'selectProposal',
    to: 'ARTISAN_SELECTED',
    roles: ['client'],
    notifications: [],
  },
  // AWAITING_DEPOSIT → CANCELLED
  {
    from: 'AWAITING_DEPOSIT',
    action: 'cancel',
    to: 'CANCELLED',
    roles: ['client'],
    notifications: ['brief_cancelled'],
  },
  // EXPIRED → PUBLISHED (relance)
  {
    from: 'EXPIRED',
    action: 'relance',
    to: 'PUBLISHED',
    roles: ['client'],
    notifications: ['brief_published'],
  },
  // CANCELLED → DRAFT (duplication)
  {
    from: 'CANCELLED',
    action: 'duplicate',
    to: 'DRAFT',
    roles: ['client'],
    notifications: [],
  },
  // EXPIRED → DRAFT (duplication)
  {
    from: 'EXPIRED',
    action: 'duplicate',
    to: 'DRAFT',
    roles: ['client'],
    notifications: [],
  },
  // CONVERTED_TO_PROJECT → CLOSED
  {
    from: 'CONVERTED_TO_PROJECT',
    action: 'close',
    to: 'CLOSED',
    roles: ['system'],
    notifications: [],
  },
];

// ── Helper : trouver une transition ──

export function findTransition(
  from: BriefArtisanStatus,
  action: BriefAction
): TransitionRule | undefined {
  return BRIEF_TRANSITIONS.find(t => t.from === from && t.action === action);
}

// ── Helper : actions possibles depuis un statut ──

export function getAvailableActions(status: BriefArtisanStatus): BriefAction[] {
  return BRIEF_TRANSITIONS
    .filter(t => t.from === status)
    .map(t => t.action);
}

// ── Helper : peut-on faire cette action depuis ce statut ? ──

export function canTransition(
  from: BriefArtisanStatus,
  action: BriefAction,
  role: UserRole
): boolean {
  const rule = findTransition(from, action);
  if (!rule) return false;
  return rule.roles.includes(role);
}
