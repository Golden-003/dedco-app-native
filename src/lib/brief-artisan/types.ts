// ============================================================
// BRIEF ARTISAN — Modèle métier
// Définit toutes les entités du domaine Brief Artisan
// Aucune dépendance React — pur TypeScript
// ============================================================

import type { IdPrefix } from '@/lib/types/id-format';

// ── Rôles utilisateurs ──

export type UserRole = 'client' | 'artisan' | 'designer' | 'admin';

// ── Scope de projet (niveau de prestation) ──

export type ProjectScope = 'prototype' | 'standard' | 'premium';

// ── Catégories d'artisanat ──

export type CraftCategory =
  | 'Mobilier'
  | 'Sièges'
  | 'Tables'
  | 'Rangements'
  | 'Luminaires'
  | 'Décoration murale'
  | 'Textile'
  | 'Céramique'
  | 'Métal'
  | 'Autre';

// ── Proposition d'artisan ──

export interface BriefArtisanProposal {
  id: string;                  // BAP-000001
  briefId: string;             // BRA-000001
  artisanId: string;           // ART-000001
  artisanName: string;
  artisanAvatar: string;
  artisanLevel: 'N1' | 'N2' | 'N3' | 'N4';
  artisanVerified: boolean;
  price: number;
  deliveryTime: string;        // ex: "18 jours"
  materials: string;
  images: string[];
  paymentConditions: string;   // ex: "Paiement sécurisé Mobile Money"
  message?: string;
  submittedAt: string;         // date FR
}

// ── Modification de projet ──

export interface BriefModification {
  id: string;                  // MOD-000001
  field: 'materiaux' | 'dimensions' | 'prix' | 'delai' | 'couleur' | 'quantite';
  label: string;
  oldValue: string;
  newValue: string;
  reason: string;
  priceImpact: number;         // +15000 ou -5000 ou 0
  delayImpact: string;         // "4 jours" ou "0 jour"
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// ── Entrée d'historique ──

export interface BriefHistoryEntry {
  id: string;
  action: string;              // ex: "submit", "publish", "receiveProposal"
  fromStatus: BriefArtisanStatus;
  toStatus: BriefArtisanStatus;
  actor: string;               // userId ou "system"
  actorRole: UserRole;
  timestamp: string;           // ISO
  metadata?: Record<string, unknown>;
}

// ── Déclencheur de notification ──

export type NotificationTrigger =
  | 'brief_submitted'
  | 'brief_published'
  | 'proposal_received'
  | 'discussion_started'
  | 'artisan_selected'
  | 'payment_requested'
  | 'payment_confirmed'
  | 'project_created'
  | 'brief_expired'
  | 'brief_cancelled'
  | 'modification_requested'
  | 'modification_accepted'
  | 'modification_rejected';

// ── Brief Artisan (entité principale) ──

export interface BriefArtisan {
  // Identité
  id: string;                  // BRA-000001
  title: string;
  description: string;

  // Catégorie & zone
  category: CraftCategory;
  zone: string;                // ex: "Cotonou"

  // Brief (formulaire)
  piece: string;               // ex: "Chambre"
  style: string;               // ex: "Moderne épuré"
  dimensions?: string;
  materials: string[];
  budgetMin: number;
  budgetMax: number;
  inspirations: string[];
  constraints?: string;

  // État
  status: BriefArtisanStatus;
  createdAt: string;           // ISO
  updatedAt: string;           // ISO
  expiresAt?: string;          // ISO (pour PUBLISHED)

  // Propositions reçues
  proposals: BriefArtisanProposal[];

  // Proposition sélectionnée
  selectedProposalId?: string;

  // Projet créé
  linkedProjectId?: string;    // PRA-000001

  // Client
  clientId: string;
  clientName: string;

  // Historique
  history: BriefHistoryEntry[];

  // Modifications (transmises au projet)
  modifications: BriefModification[];
}

// ── Actions possibles sur un brief ──

export type BriefAction =
  | 'edit'
  | 'submit'
  | 'publish'
  | 'receiveProposal'
  | 'startDiscussion'
  | 'selectProposal'
  | 'confirmSelection'
  | 'payDeposit'
  | 'cancel'
  | 'expire'
  | 'duplicate'
  | 'relance'
  | 'close';

// ── Résultat d'une transition ──

export interface TransitionResult {
  success: boolean;
  newStatus?: BriefArtisanStatus;
  error?: string;
  historyEntry?: BriefHistoryEntry;
  notifications?: NotificationTrigger[];
}

// ── Import cyclique : status sera défini dans statuses.ts ──
// On utilise un type forward

export type BriefArtisanStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PUBLISHED'
  | 'PROPOSALS_RECEIVED'
  | 'IN_DISCUSSION'
  | 'ARTISAN_SELECTED'
  | 'AWAITING_DEPOSIT'
  | 'CONVERTED_TO_PROJECT'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'CLOSED';
