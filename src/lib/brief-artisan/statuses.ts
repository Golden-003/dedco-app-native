// ============================================================
// BRIEF ARTISAN — Statuts
// 10 statuts MVP + 1 CLOSED = 11 statuts
// Chaque statut a : label, couleur, description, icône
// ============================================================

import type { BriefArtisanStatus } from './types';

export interface StatusConfig {
  code: BriefArtisanStatus;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  isTerminal: boolean;
  isUrgent: boolean;
}

export const BRIEF_ARTISAN_STATUSES: Record<BriefArtisanStatus, StatusConfig> = {
  DRAFT: {
    code: 'DRAFT',
    label: 'Brouillon',
    description: 'Brief en cours de rédaction, non visible par les artisans',
    color: '#7A6E65',
    bgColor: '#F2EDE4',
    isTerminal: false,
    isUrgent: false,
  },
  SUBMITTED: {
    code: 'SUBMITTED',
    label: 'Prêt à publier',
    description: 'Brief complet, en attente de publication',
    color: '#B8702F',
    bgColor: '#FEF5E9',
    isTerminal: false,
    isUrgent: false,
  },
  PUBLISHED: {
    code: 'PUBLISHED',
    label: 'En recherche d\'artisan',
    description: 'Brief visible par les artisans vérifiés',
    color: '#B8702F',
    bgColor: '#FEF5E9',
    isTerminal: false,
    isUrgent: false,
  },
  PROPOSALS_RECEIVED: {
    code: 'PROPOSALS_RECEIVED',
    label: 'Propositions reçues',
    description: 'Un ou plusieurs artisans ont répondu au brief',
    color: '#4A7A3C',
    bgColor: '#E8F1FA',
    isTerminal: false,
    isUrgent: false,
  },
  IN_DISCUSSION: {
    code: 'IN_DISCUSSION',
    label: 'En discussion',
    description: 'Discussion en cours avec un artisan',
    color: '#3B6EA5',
    bgColor: '#E8F1FA',
    isTerminal: false,
    isUrgent: false,
  },
  ARTISAN_SELECTED: {
    code: 'ARTISAN_SELECTED',
    label: 'Artisan sélectionné',
    description: 'Proposition choisie, en attente de confirmation',
    color: '#A6442E',
    bgColor: '#FAEAE6',
    isTerminal: false,
    isUrgent: false,
  },
  AWAITING_DEPOSIT: {
    code: 'AWAITING_DEPOSIT',
    label: 'Paiement à effectuer',
    description: 'Paiement sécurisé en attente pour démarrer le projet',
    color: '#A6442E',
    bgColor: '#FAEAE6',
    isTerminal: false,
    isUrgent: true,
  },
  CONVERTED_TO_PROJECT: {
    code: 'CONVERTED_TO_PROJECT',
    label: 'Projet créé',
    description: 'Brief converti en projet artisan, fabrication en cours',
    color: '#4A7A3C',
    bgColor: '#E6F2E3',
    isTerminal: true,
    isUrgent: false,
  },
  EXPIRED: {
    code: 'EXPIRED',
    label: 'Brief expiré',
    description: 'Aucune proposition reçue dans les 14 jours',
    color: '#7A6E65',
    bgColor: '#F2EDE4',
    isTerminal: true,
    isUrgent: false,
  },
  CANCELLED: {
    code: 'CANCELLED',
    label: 'Brief annulé',
    description: 'Brief annulé par le client',
    color: '#7A6E65',
    bgColor: '#F2EDE4',
    isTerminal: true,
    isUrgent: false,
  },
  CLOSED: {
    code: 'CLOSED',
    label: 'Brief clôturé',
    description: 'Brief clôturé après conversion en projet',
    color: '#7A6E65',
    bgColor: '#F2EDE4',
    isTerminal: true,
    isUrgent: false,
  },
};

// ── Helper : liste des statuts non-terminaux ──

export function getActiveStatuses(): BriefArtisanStatus[] {
  return (Object.keys(BRIEF_ARTISAN_STATUSES) as BriefArtisanStatus[])
    .filter(s => !BRIEF_ARTISAN_STATUSES[s].isTerminal);
}

// ── Helper : liste des statuts terminaux ──

export function getTerminalStatuses(): BriefArtisanStatus[] {
  return (Object.keys(BRIEF_ARTISAN_STATUSES) as BriefArtisanStatus[])
    .filter(s => BRIEF_ARTISAN_STATUSES[s].isTerminal);
}
