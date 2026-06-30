// ============================================================
// DEDCO — Système de statuts
// Brief artisan, Projet artisan, Brief designer, Réclamations
// Labels, couleurs, transitions autorisées, boutons contextuels
// ============================================================

// ── BRIEF ARTISAN ──

export type BriefArtisanStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PUBLISHED"
  | "PROPOSALS_RECEIVED"
  | "IN_DISCUSSION"
  | "ARTISAN_SELECTED"
  | "AWAITING_DEPOSIT"
  | "CONVERTED_TO_PROJECT"
  | "EXPIRED"
  | "CANCELLED";

export const BRIEF_ARTISAN_STATUS: Record<BriefArtisanStatus, {
  label: string;
  color: string;
  bgColor: string;
  button: string;
  nextStatus?: BriefArtisanStatus;
}> = {
  DRAFT: { label: "Brouillon", color: "#7A6E65", bgColor: "#F2EDE4", button: "Continuer le brief" },
  SUBMITTED: { label: "En attente de publication", color: "#B8702F", bgColor: "#FEF5E9", button: "Voir le brief", nextStatus: "PUBLISHED" },
  PUBLISHED: { label: "Recherche d'artisan", color: "#B8702F", bgColor: "#FEF5E9", button: "Voir les artisans intéressés", nextStatus: "PROPOSALS_RECEIVED" },
  PROPOSALS_RECEIVED: { label: "Propositions reçues", color: "#4A7A3C", bgColor: "#E8F1FA", button: "Comparer les propositions", nextStatus: "IN_DISCUSSION" },
  IN_DISCUSSION: { label: "En discussion", color: "#3B6EA5", bgColor: "#E8F1FA", button: "Ouvrir la conversation", nextStatus: "ARTISAN_SELECTED" },
  ARTISAN_SELECTED: { label: "Proposition sélectionnée", color: "#A6442E", bgColor: "#FAEAE6", button: "Voir le récapitulatif", nextStatus: "AWAITING_DEPOSIT" },
  AWAITING_DEPOSIT: { label: "Paiement à effectuer", color: "#A6442E", bgColor: "#FAEAE6", button: "Payer maintenant", nextStatus: "CONVERTED_TO_PROJECT" },
  CONVERTED_TO_PROJECT: { label: "Projet créé", color: "#4A7A3C", bgColor: "#E6F2E3", button: "Suivre le projet" },
  EXPIRED: { label: "Brief expiré", color: "#7A6E65", bgColor: "#F2EDE4", button: "Relancer le brief" },
  CANCELLED: { label: "Brief annulé", color: "#7A6E65", bgColor: "#F2EDE4", button: "Dupliquer le brief" },
};

// Transitions autorisées
export const BRIEF_ARTISAN_TRANSITIONS: Record<BriefArtisanStatus, BriefArtisanStatus[]> = {
  DRAFT: ["SUBMITTED", "CANCELLED"],
  SUBMITTED: ["PUBLISHED", "CANCELLED"],
  PUBLISHED: ["PROPOSALS_RECEIVED", "EXPIRED", "CANCELLED"],
  PROPOSALS_RECEIVED: ["IN_DISCUSSION", "ARTISAN_SELECTED", "EXPIRED", "CANCELLED"],
  IN_DISCUSSION: ["ARTISAN_SELECTED", "PROPOSALS_RECEIVED", "EXPIRED", "CANCELLED"],
  ARTISAN_SELECTED: ["AWAITING_DEPOSIT", "PROPOSALS_RECEIVED", "CANCELLED"],
  AWAITING_DEPOSIT: ["CONVERTED_TO_PROJECT", "ARTISAN_SELECTED", "CANCELLED"],
  CONVERTED_TO_PROJECT: [],
  EXPIRED: [],
  CANCELLED: [],
};

// ── PROJET ARTISAN ──

export type ProjetArtisanStatus =
  | "AWAITING_DEPOSIT"
  | "CONFIRMED"
  | "PREPARATION"
  | "IN_PRODUCTION"
  | "UPDATE_REQUIRED"
  | "CHANGE_REQUEST_PENDING"
  | "READY_FOR_DELIVERY"
  | "DELIVERY_SCHEDULED"
  | "IN_TRANSIT"
  | "DELIVERED_PENDING_CONFIRMATION"
  | "DELIVERED_CONFIRMED"
  | "PAYMENT_RELEASED"
  | "COMPLAINT_OPENED"
  | "DISPUTE"
  | "COMPLETED"
  | "CANCELLED";

export const PROJET_ARTISAN_STATUS: Record<ProjetArtisanStatus, {
  label: string;
  color: string;
  bgColor: string;
  button: string;
  isUrgent?: boolean;
}> = {
  AWAITING_DEPOSIT: { label: "Paiement à effectuer", color: "#A6442E", bgColor: "#FAEAE6", button: "Payer maintenant", isUrgent: true },
  CONFIRMED: { label: "Projet confirmé", color: "#4A7A3C", bgColor: "#E6F2E3", button: "Voir le projet" },
  PREPARATION: { label: "Préparation", color: "#B8702F", bgColor: "#FEF5E9", button: "Voir l'avancement" },
  IN_PRODUCTION: { label: "En fabrication", color: "#B8702F", bgColor: "#FEF5E9", button: "Voir l'avancement" },
  UPDATE_REQUIRED: { label: "Mise à jour attendue", color: "#A6442E", bgColor: "#FAEAE6", button: "Voir l'avancement", isUrgent: true },
  CHANGE_REQUEST_PENDING: { label: "Modification à valider", color: "#A6442E", bgColor: "#FAEAE6", button: "Valider la modification", isUrgent: true },
  READY_FOR_DELIVERY: { label: "Prêt pour livraison", color: "#4A7A3C", bgColor: "#E6F2E3", button: "Planifier la livraison" },
  DELIVERY_SCHEDULED: { label: "Livraison planifiée", color: "#3B6EA5", bgColor: "#E8F1FA", button: "Voir les détails" },
  IN_TRANSIT: { label: "En cours de livraison", color: "#3B6EA5", bgColor: "#E8F1FA", button: "Suivre la livraison" },
  DELIVERED_PENDING_CONFIRMATION: { label: "Réception à confirmer", color: "#A6442E", bgColor: "#FAEAE6", button: "Confirmer la réception", isUrgent: true },
  DELIVERED_CONFIRMED: { label: "Livraison confirmée", color: "#4A7A3C", bgColor: "#E6F2E3", button: "Voir le projet" },
  PAYMENT_RELEASED: { label: "Paiement versé", color: "#4A7A3C", bgColor: "#E6F2E3", button: "Voir le projet" },
  COMPLAINT_OPENED: { label: "Réclamation ouverte", color: "#A6442E", bgColor: "#FAEAE6", button: "Voir le dossier", isUrgent: true },
  DISPUTE: { label: "Litige en cours", color: "#A6442E", bgColor: "#FAEAE6", button: "Voir le dossier", isUrgent: true },
  COMPLETED: { label: "Projet terminé", color: "#4A7A3C", bgColor: "#E6F2E3", button: "Voir le projet" },
  CANCELLED: { label: "Projet interrompu", color: "#7A6E65", bgColor: "#F2EDE4", button: "Voir le projet" },
};

// ── JALONS DE FABRICATION ──

export type JalonType = "PREPARATION" | "IN_PRODUCTION" | "READY_FOR_DELIVERY" | "DELIVERY";

export const JALON_LABELS: Record<JalonType, { label: string; description: string }> = {
  PREPARATION: { label: "Jalon 1 — Préparation", description: "Confirmation dimensions, matériaux, planning" },
  IN_PRODUCTION: { label: "Jalon 2 — Fabrication", description: "Photo d'avancement + pourcentage + commentaire" },
  READY_FOR_DELIVERY: { label: "Jalon 3 — Produit terminé", description: "Photos finales + confirmation finition" },
  DELIVERY: { label: "Jalon 4 — Livraison", description: "Date, adresse, transporteur, preuve de remise" },
};

// ── DEMANDE DE MODIFICATION ──

export type ChangeRequestStatus =
  | "CHANGE_REQUESTED"
  | "CHANGE_PENDING_CLIENT"
  | "CHANGE_ACCEPTED"
  | "CHANGE_REJECTED"
  | "CHANGE_CANCELLED";

export const CHANGE_REQUEST_STATUS: Record<ChangeRequestStatus, { label: string; color: string }> = {
  CHANGE_REQUESTED: { label: "Modification proposée", color: "#B8702F" },
  CHANGE_PENDING_CLIENT: { label: "En attente de validation", color: "#A6442E" },
  CHANGE_ACCEPTED: { label: "Modification acceptée", color: "#4A7A3C" },
  CHANGE_REJECTED: { label: "Modification refusée", color: "#A6442E" },
  CHANGE_CANCELLED: { label: "Modification retirée", color: "#7A6E65" },
};

export type ChangeType =
  | "prix"
  | "materiaux"
  | "dimensions"
  | "couleur"
  | "quantite"
  | "delai"
  | "livraison_adresse"
  | "livraison_mode"
  | "installation";

export const CHANGE_TYPE_LABELS: Record<ChangeType, string> = {
  prix: "Prix",
  materiaux: "Matériaux",
  dimensions: "Dimensions",
  couleur: "Couleur / Finition",
  quantite: "Quantité",
  delai: "Délai",
  livraison_adresse: "Adresse de livraison",
  livraison_mode: "Mode de livraison",
  installation: "Installation / Montage",
};

// ── RÉCLAMATIONS ──

export type ReclamationStatus =
  | "OPEN"
  | "WAITING_ARTISAN"
  | "WAITING_CLIENT"
  | "UNDER_REVIEW"
  | "RESOLVED"
  | "CLOSED";

export const RECLAMATION_STATUS: Record<ReclamationStatus, { label: string; color: string; bgColor: string }> = {
  OPEN: { label: "Réclamation ouverte", color: "#A6442E", bgColor: "#FAEAE6" },
  WAITING_ARTISAN: { label: "En attente artisan", color: "#B8702F", bgColor: "#FEF5E9" },
  WAITING_CLIENT: { label: "Infos complémentaires demandées", color: "#B8702F", bgColor: "#FEF5E9" },
  UNDER_REVIEW: { label: "Analyse Dedco en cours", color: "#3B6EA5", bgColor: "#E8F1FA" },
  RESOLVED: { label: "Décision rendue", color: "#4A7A3C", bgColor: "#E6F2E3" },
  CLOSED: { label: "Dossier clôturé", color: "#7A6E65", bgColor: "#F2EDE4" },
};

// ── BRIEF DESIGNER ──

export type BriefDesignerStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_DESIGNER_RESPONSE"
  | "NEEDS_INFO"
  | "ACCEPTED"
  | "DECLINED"
  | "AWAITING_PAYMENT"
  | "BOOKING_CONFIRMED"
  | "CONVERTED_TO_DESIGN_PROJECT"
  | "CANCELLED"
  | "EXPIRED";

export const BRIEF_DESIGNER_STATUS: Record<BriefDesignerStatus, {
  label: string;
  color: string;
  bgColor: string;
  button: string;
}> = {
  DRAFT: { label: "Brouillon", color: "#7A6E65", bgColor: "#F2EDE4", button: "Continuer la demande" },
  SUBMITTED: { label: "Demande envoyée", color: "#B8702F", bgColor: "#FEF5E9", button: "Voir la demande" },
  PENDING_DESIGNER_RESPONSE: { label: "En attente de réponse", color: "#B8702F", bgColor: "#FEF5E9", button: "Voir le profil designer" },
  NEEDS_INFO: { label: "Informations à compléter", color: "#A6442E", bgColor: "#FAEAE6", button: "Répondre au designer" },
  ACCEPTED: { label: "Mission acceptée", color: "#4A7A3C", bgColor: "#E6F2E3", button: "Voir la prestation" },
  DECLINED: { label: "Mission refusée", color: "#A6442E", bgColor: "#FAEAE6", button: "Trouver un autre designer" },
  AWAITING_PAYMENT: { label: "Paiement à effectuer", color: "#A6442E", bgColor: "#FAEAE6", button: "Réserver la prestation" },
  BOOKING_CONFIRMED: { label: "Réservation confirmée", color: "#4A7A3C", bgColor: "#E6F2E3", button: "Voir le rendez-vous" },
  CONVERTED_TO_DESIGN_PROJECT: { label: "Projet créé", color: "#4A7A3C", bgColor: "#E6F2E3", button: "Suivre le projet" },
  CANCELLED: { label: "Demande annulée", color: "#7A6E65", bgColor: "#F2EDE4", button: "Relancer la demande" },
  EXPIRED: { label: "Demande expirée", color: "#7A6E65", bgColor: "#F2EDE4", button: "Relancer la demande" },
};

// ── HELPER : badge de statut ──

export function StatusBadge({ status, type }: { status: string; type: "brief-artisan" | "projet-artisan" | "brief-designer" | "reclamation" }) {
  let config: { label: string; color: string; bgColor: string } | undefined;

  if (type === "brief-artisan") {
    config = BRIEF_ARTISAN_STATUS[status as BriefArtisanStatus];
  } else if (type === "projet-artisan") {
    config = PROJET_ARTISAN_STATUS[status as ProjetArtisanStatus];
  } else if (type === "brief-designer") {
    config = BRIEF_DESIGNER_STATUS[status as BriefDesignerStatus];
  } else if (type === "reclamation") {
    config = RECLAMATION_STATUS[status as ReclamationStatus];
  }

  if (!config) return null;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full"
      style={{ color: config.color, backgroundColor: config.bgColor }}
    >
      {config.label}
    </span>
  );
}
