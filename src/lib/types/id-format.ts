// ============================================================
// DEDCO — Identifiants métiers standardisés
//
// Format : PREFIX-XXXXXX (6 chiffres zéro-padded)
//
// Préfixes :
//   ART-XXXXXX  → Artisan
//   DES-XXXXXX  → Designer
//   BRA-XXXXXX  → Brief Artisan
//   BRD-XXXXXX  → Brief Designer
//   PRA-XXXXXX  → Projet Artisan
//   PRD-XXXXXX  → Projet Designer
//   PROP-XXXXXX → Proposition (artisan)
//   PRES-XXXXXX → Prestation (designer)
//   CMD-XXXXXX  → Commande marketplace
//   PAY-XXXXXX  → Paiement
//   REC-XXXXXX  → Réclamation / Litige
//   NOT-XXXXXX  → Notification
//   MOD-XXXXXX  → Modification de projet
//   TX-XXXXXX   → Transaction wallet
// ============================================================

export type IdPrefix =
  | 'ART'
  | 'DES'
  | 'BRA'
  | 'BRD'
  | 'PRA'
  | 'PRD'
  | 'PROP'
  | 'PRES'
  | 'CMD'
  | 'PAY'
  | 'REC'
  | 'NOT'
  | 'MOD'
  | 'TX';

/**
 * Génère un identifiant métier standardisé.
 * @example generateId('BRA') → 'BRA-000042'
 */
export function generateId(prefix: IdPrefix): string {
  const num = Math.floor(Math.random() * 999999) + 1;
  return `${prefix}-${String(num).padStart(6, '0')}`;
}

/**
 * Extrait le préfixe d'un identifiant.
 * @example getIdPrefix('PRA-000031') → 'PRA'
 */
export function getIdPrefix(id: string): IdPrefix | null {
  const match = id.match(/^([A-Z]+)-/);
  return match ? match[1] as IdPrefix : null;
}

/**
 * Vérifie si un identifiant correspond à un projet artisan.
 */
export function isArtisanProject(id: string): boolean {
  return id.startsWith('PRA-') || id.startsWith('PA-');
}

/**
 * Vérifie si un identifiant correspond à un projet designer.
 */
export function isDesignerProject(id: string): boolean {
  return id.startsWith('PRD-') || id.startsWith('PD-');
}

/**
 * Vérifie si un identifiant correspond à un brief artisan.
 */
export function isArtisanBrief(id: string): boolean {
  return id.startsWith('BRA-') || id.startsWith('BA-');
}

/**
 * Vérifie si un identifiant correspond à un brief designer.
 */
export function isDesignerBrief(id: string): boolean {
  return id.startsWith('BRD-') || id.startsWith('BD-');
}
