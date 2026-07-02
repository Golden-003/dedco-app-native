// ============================================================
// DEDCO — Types Brief Designer
// Machine d'états : DRAFT → SUBMITTED → PENDING_DESIGNER_RESPONSE
//   → ACCEPTED → AWAITING_PAYMENT → BOOKING_CONFIRMED
//   → KICKOFF_SCHEDULED → CONVERTED_TO_DESIGN_PROJECT
//   + NEEDS_INFO, DECLINED, CANCELLED, EXPIRED
// ============================================================

import type { BriefDesignerStatus } from './dedco-status';

export type ProjectScope = 'prototype' | 'standard' | 'premium';

export interface DesignerPrestation {
  id: string;
  briefId: string;
  designerId: number;
  designerName: string;
  designerAvatar: string;
  prestationLabel: string; // ex: "Standard — Plan d'aménagement complet"
  scope: ProjectScope;
  price: number;
  livrables: string[];
  revisions: number;
  deliveryTime: string; // ex: "10 jours ouvrables"
  availability: string;
  message?: string;
  submittedAt: string;
}

export interface DesignerBrief {
  id: string;
  title: string;
  description: string;

  // Brief
  piece: string;
  style: string;
  superficie: string;
  budgetConseil: { min: number; max: number };

  // État
  status: BriefDesignerStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;

  // Designer ciblé (le brief est envoyé à un designer spécifique)
  designerId: number;
  designerName: string;
  designerAvatar: string;
  designerCity: string;

  // Prestation proposée par le designer (à partir de ACCEPTED)
  prestation?: DesignerPrestation;

  // Projet créé (à partir de CONVERTED_TO_DESIGN_PROJECT)
  linkedProjectId?: string;

  // Client
  clientId: string;
  clientName: string;
}

// ── Actions possibles selon le statut ──

export type BriefDesignerAction =
  | { type: 'CONTINUE_DRAFT' }          // DRAFT → édition
  | { type: 'SUBMIT' }                  // DRAFT → SUBMITTED
  | { type: 'VIEW_DESIGNER' }           // PENDING_DESIGNER_RESPONSE → profil designer
  | { type: 'RESPOND_INFO' }            // NEEDS_INFO → répondre
  | { type: 'VIEW_PRESTATION' }         // ACCEPTED → voir prestation
  | { type: 'PAY' }                     // AWAITING_PAYMENT → paiement
  | { type: 'VIEW_BOOKING' }            // BOOKING_CONFIRMED → rendez-vous
  | { type: 'FOLLOW_PROJECT' }          // CONVERTED_TO_DESIGN_PROJECT → projet
  | { type: 'CANCEL' }                  // * → CANCELLED
  | { type: 'RELANCE' }                 // EXPIRED → relance
  | { type: 'DUPLICATE' };              // CANCELLED/EXPIRED → dupliquer

export function getDesignerBriefActions(status: BriefDesignerStatus): BriefDesignerAction[] {
  switch (status) {
    case 'DRAFT':
      return [{ type: 'CONTINUE_DRAFT' }, { type: 'SUBMIT' }, { type: 'CANCEL' }];
    case 'SUBMITTED':
      return [{ type: 'CANCEL' }];
    case 'PENDING_DESIGNER_RESPONSE':
      return [{ type: 'VIEW_DESIGNER' }, { type: 'CANCEL' }];
    case 'NEEDS_INFO':
      return [{ type: 'RESPOND_INFO' }, { type: 'CANCEL' }];
    case 'ACCEPTED':
      return [{ type: 'VIEW_PRESTATION' }];
    case 'DECLINED':
      return [{ type: 'DUPLICATE' }];
    case 'AWAITING_PAYMENT':
      return [{ type: 'PAY' }];
    case 'BOOKING_CONFIRMED':
      return [{ type: 'VIEW_BOOKING' }];
    case 'CONVERTED_TO_DESIGN_PROJECT':
      return [{ type: 'FOLLOW_PROJECT' }];
    case 'EXPIRED':
      return [{ type: 'RELANCE' }, { type: 'DUPLICATE' }];
    case 'CANCELLED':
      return [{ type: 'DUPLICATE' }];
    default:
      return [];
  }
}
