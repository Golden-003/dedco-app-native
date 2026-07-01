// ============================================================
// DEDCO — Types: Brief Artisan
// ============================================================

// ============================================================
// Machine d'états — Brief Artisan (12 statuts)
// ============================================================

export type BriefArtisanStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'NEEDS_INFO'
  | 'UNDER_REVIEW'
  | 'PUBLISHED'
  | 'PROPOSALS_RECEIVED'
  | 'IN_DISCUSSION'
  | 'ARTISAN_SELECTED'
  | 'AWAITING_DEPOSIT'
  | 'CONVERTED_TO_PROJECT'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'CLOSED';

export type BriefArtisanStatusInfo = {
  code: BriefArtisanStatus;
  label: string;
  color: string;
  bgColor: string;
};
