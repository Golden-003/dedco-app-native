// ============================================================
// DEDCO — Types Brief Artisan
// Machine d'états complète : DRAFT → SUBMITTED → PUBLISHED
//   → PROPOSALS_RECEIVED → IN_DISCUSSION → ARTISAN_SELECTED
//   → AWAITING_DEPOSIT → CONVERTED_TO_PROJECT
// ============================================================

import type { BriefArtisanStatus } from './dedco-status';

// ── Brief Artisan (entité complète) ──

export interface ArtisanBriefProposal {
  id: string;
  briefId: string;
  artisanId: number;
  artisanName: string;
  artisanAvatar: string;
  artisanLevel: 'N1' | 'N2' | 'N3' | 'N4';
  artisanVerified: boolean;
  price: number;
  deliveryTime: string; // ex: "18 jours"
  materials: string;
  images: string[];
  paymentConditions: string; // ex: "Paiement sécurisé Mobile Money"
  message?: string;
  submittedAt: string; // date FR
}

export interface ArtisanBrief {
  // Identité
  id: string; // ex: "BA-001"
  title: string;
  description: string;

  // Catégorie & zone
  category: string; // ex: "Rangements"
  zone: string; // ex: "Cotonou"

  // Brief (formulaire 5 étapes)
  piece: string; // ex: "Chambre"
  style: string; // ex: "Moderne épuré"
  dimensions?: string;
  materials: string[]; // ex: ["Bois iroko", "Vernis naturel"]
  budgetMin: number;
  budgetMax: number;
  inspirations: string[]; // URLs images
  constraints?: string;

  // État
  status: BriefArtisanStatus;
  createdAt: string; // date FR
  updatedAt: string; // date FR
  expiresAt?: string; // date FR (pour PUBLISHED sans proposition)

  // Propositions reçues (à partir de PROPOSALS_RECEIVED)
  proposals: ArtisanBriefProposal[];

  // Proposition sélectionnée (à partir de ARTISAN_SELECTED)
  selectedProposalId?: string;

  // Projet créé (à partir de CONVERTED_TO_PROJECT)
  linkedProjectId?: string;

  // Client
  clientId: string;
  clientName: string;
}

// ── Actions possibles sur un brief (selon statut) ──

export type BriefArtisanAction =
  | { type: 'CONTINUE_DRAFT' }                    // DRAFT → édition
  | { type: 'SUBMIT' }                            // DRAFT → SUBMITTED
  | { type: 'PUBLISH' }                           // SUBMITTED → PUBLISHED
  | { type: 'COMPARE_PROPOSALS' }                 // PROPOSALS_RECEIVED → vue comparaison
  | { type: 'OPEN_DISCUSSION', proposalId: string } // PROPOSALS_RECEIVED → IN_DISCUSSION
  | { type: 'SELECT_PROPOSAL', proposalId: string }  // IN_DISCUSSION → ARTISAN_SELECTED
  | { type: 'VIEW_RECAP' }                        // ARTISAN_SELECTED → récapitulatif
  | { type: 'PAY_DEPOSIT' }                       // AWAITING_DEPOSIT → paiement sécurisé
  | { type: 'FOLLOW_PROJECT' }                    // CONVERTED_TO_PROJECT → projet
  | { type: 'CANCEL' }                            // * → CANCELLED
  | { type: 'DUPLICATE' }                         // EXPIRED/CANCELLED → nouveau brief
  | { type: 'RELANCE' };                          // EXPIRED → relance (PUBLISHED)

// ── Helper : actions disponibles selon le statut ──

export function getAvailableActions(status: BriefArtisanStatus): BriefArtisanAction[] {
  switch (status) {
    case 'DRAFT':
      return [{ type: 'CONTINUE_DRAFT' }, { type: 'SUBMIT' }, { type: 'CANCEL' }];
    case 'SUBMITTED':
      return [{ type: 'PUBLISH' }, { type: 'CANCEL' }];
    case 'PUBLISHED':
      return [{ type: 'CANCEL' }]; // attente passive de propositions
    case 'PROPOSALS_RECEIVED':
      return [{ type: 'COMPARE_PROPOSALS' }, { type: 'CANCEL' }];
    case 'IN_DISCUSSION':
      return [{ type: 'SELECT_PROPOSAL', proposalId: '' }, { type: 'CANCEL' }];
    case 'ARTISAN_SELECTED':
      return [{ type: 'VIEW_RECAP' }, { type: 'CANCEL' }];
    case 'AWAITING_DEPOSIT':
      return [{ type: 'PAY_DEPOSIT' }];
    case 'CONVERTED_TO_PROJECT':
      return [{ type: 'FOLLOW_PROJECT' }];
    case 'EXPIRED':
      return [{ type: 'RELANCE' }, { type: 'DUPLICATE' }];
    case 'CANCELLED':
      return [{ type: 'DUPLICATE' }];
    default:
      return [];
  }
}

// ── Helper : peut-on transitionner vers un statut ? ──

export function canTransition(from: BriefArtisanStatus, to: BriefArtisanStatus): boolean {
  // Import dynamique pour éviter cycle
  const { BRIEF_ARTISAN_TRANSITIONS } = require('./dedco-status');
  const allowed = BRIEF_ARTISAN_TRANSITIONS[from] || [];
  return allowed.includes(to);
}
