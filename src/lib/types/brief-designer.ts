// ============================================================
// DEDCO — Types: Brief Designer
// ============================================================

// ============================================================
// Machine d'états — Brief Designer (11 statuts)
// ============================================================

export type BriefDesignerStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'NEEDS_INFO'
  | 'PENDING_DESIGNER_RESPONSE'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'AWAITING_PAYMENT'
  | 'BOOKING_CONFIRMED'
  | 'KICKOFF_SCHEDULED'
  | 'CONVERTED_TO_DESIGN_PROJECT'
  | 'CANCELLED'
  | 'EXPIRED';
