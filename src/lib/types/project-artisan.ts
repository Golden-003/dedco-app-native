// ============================================================
// DEDCO — Types: Project Artisan
// ============================================================

// ============================================================
// Machine d'états — Projet Artisan (16 statuts)
// ============================================================

export type ProjetArtisanStatus =
  | 'AWAITING_DEPOSIT'
  | 'CONFIRMED'
  | 'PREPARATION'
  | 'IN_PRODUCTION'
  | 'UPDATE_REQUIRED'
  | 'CHANGE_REQUEST_PENDING'
  | 'READY_FOR_DELIVERY'
  | 'DELIVERY_SCHEDULED'
  | 'IN_TRANSIT'
  | 'DELIVERED_PENDING_CONFIRMATION'
  | 'DELIVERED_CONFIRMED'
  | 'PAYMENT_RELEASED'
  | 'COMPLAINT_OPENED'
  | 'DISPUTE'
  | 'COMPLETED'
  | 'CANCELLED';

// ============================================================
// Machine d'états — Modification projet artisan
// ============================================================

export type ChangeRequestStatus =
  | 'CHANGE_REQUESTED'
  | 'CHANGE_PENDING_CLIENT'
  | 'CHANGE_ACCEPTED'
  | 'CHANGE_REJECTED'
  | 'CHANGE_CANCELLED';
