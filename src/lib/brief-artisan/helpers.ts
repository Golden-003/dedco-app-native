// ============================================================
// BRIEF ARTISAN — Helpers
// Fonctions utilitaires pour l'affichage et la logique
// Toutes les cartes/pages utilisent ces helpers
// ============================================================

import type { BriefArtisan, BriefArtisanStatus } from './types';
import { BRIEF_ARTISAN_STATUSES } from './statuses';
import { getAvailableActions } from './transitions';

// ── Couleur / label / description ──

export function getStatusColor(status: BriefArtisanStatus): string {
  return BRIEF_ARTISAN_STATUSES[status].color;
}

export function getStatusBgColor(status: BriefArtisanStatus): string {
  return BRIEF_ARTISAN_STATUSES[status].bgColor;
}

export function getStatusLabel(status: BriefArtisanStatus): string {
  return BRIEF_ARTISAN_STATUSES[status].label;
}

export function getStatusDescription(status: BriefArtisanStatus): string {
  return BRIEF_ARTISAN_STATUSES[status].description;
}

export function isStatusUrgent(status: BriefArtisanStatus): boolean {
  return BRIEF_ARTISAN_STATUSES[status].isUrgent;
}

export function isStatusTerminal(status: BriefArtisanStatus): boolean {
  return BRIEF_ARTISAN_STATUSES[status].isTerminal;
}

// ── Progression (0-100) ──

const STATUS_PROGRESS: Record<BriefArtisanStatus, number> = {
  DRAFT: 5,
  SUBMITTED: 15,
  PUBLISHED: 25,
  PROPOSALS_RECEIVED: 40,
  IN_DISCUSSION: 50,
  ARTISAN_SELECTED: 65,
  AWAITING_DEPOSIT: 80,
  CONVERTED_TO_PROJECT: 100,
  CLOSED: 100,
  EXPIRED: 0,
  CANCELLED: 0,
};

export function getProgress(brief: BriefArtisan): number {
  return STATUS_PROGRESS[brief.status] ?? 0;
}

// ── Action principale affichée sur la carte ──

export function getPrimaryAction(brief: BriefArtisan): { label: string; action: string } {
  switch (brief.status) {
    case 'DRAFT':
      return { label: 'Continuer le brief', action: 'edit' };
    case 'SUBMITTED':
      return { label: 'Publier le brief', action: 'publish' };
    case 'PUBLISHED':
      return { label: 'En attente de propositions', action: 'view' };
    case 'PROPOSALS_RECEIVED':
      return { label: `Comparer ${brief.proposals.length} propositions`, action: 'view' };
    case 'IN_DISCUSSION':
      return { label: 'Continuer la discussion', action: 'view' };
    case 'ARTISAN_SELECTED':
      return { label: 'Confirmer et payer', action: 'confirmSelection' };
    case 'AWAITING_DEPOSIT':
      return { label: 'Payer maintenant', action: 'payDeposit' };
    case 'CONVERTED_TO_PROJECT':
      return { label: 'Suivre le projet', action: 'view' };
    case 'EXPIRED':
      return { label: 'Relancer le brief', action: 'relance' };
    case 'CANCELLED':
      return { label: 'Dupliquer le brief', action: 'duplicate' };
    case 'CLOSED':
      return { label: 'Voir le projet', action: 'view' };
    default:
      return { label: 'Voir le brief', action: 'view' };
  }
}

// ── Jours restants avant expiration ──

export function getRemainingDays(brief: BriefArtisan): number | null {
  if (!brief.expiresAt) return null;
  const expiry = new Date(brief.expiresAt).getTime();
  const now = Date.now();
  const diff = expiry - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function isExpired(brief: BriefArtisan): boolean {
  const remaining = getRemainingDays(brief);
  return remaining !== null && remaining <= 0;
}

// ── Proposition sélectionnée ──

export function getSelectedProposal(brief: BriefArtisan) {
  return brief.proposals.find(p => p.id === brief.selectedProposalId);
}

// ── Montant à payer (100% + garantie 1.5%) ──

export function getPaymentAmount(brief: BriefArtisan): number | null {
  const proposal = getSelectedProposal(brief);
  if (!proposal) return null;
  const garantie = Math.round(proposal.price * 0.015);
  return proposal.price + garantie;
}

// ── Liste des actions disponibles ──

export function getAvailableActionsForBrief(brief: BriefArtisan): string[] {
  return getAvailableActions(brief.status);
}

// ── Résumé du brief pour cartes ──

export function getBriefSummary(brief: BriefArtisan): {
  statusLabel: string;
  statusColor: string;
  statusBgColor: string;
  progress: number;
  primaryAction: { label: string; action: string };
  proposalCount: number;
  paymentAmount: number | null;
  remainingDays: number | null;
  isUrgent: boolean;
} {
  return {
    statusLabel: getStatusLabel(brief.status),
    statusColor: getStatusColor(brief.status),
    statusBgColor: getStatusBgColor(brief.status),
    progress: getProgress(brief),
    primaryAction: getPrimaryAction(brief),
    proposalCount: brief.proposals.length,
    paymentAmount: getPaymentAmount(brief),
    remainingDays: getRemainingDays(brief),
    isUrgent: isStatusUrgent(brief.status),
  };
}
