// ============================================================
// DEDCO — Types
// ============================================================

export type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  artisanId: number;
  material: string;
  colors: string[];
  rating: number;
  reviews: number;
  stock: number;
  badge?: string;
  images: string[];
  desc: string;
  tags: string[];
  dimensions?: string;
};

export type Artisan = {
  id: number;
  name: string;
  specialty: string;
  city: string;
  avatar: string;
  rating: number;
  reviews: number;
  level: "N1" | "N2" | "N3" | "N4";
  verified: boolean;
  experience: string;
  bio: string;
  portfolio: string[];
  trust: number;
  wallet_solde?: number;
  nb_livraisons?: number;
  abonnement?: "gratuit" | "pro" | "boutique";
};

export type Designer = {
  id: number;
  name: string;
  specialty: string;
  city: string;
  avatar: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  projects: number;
  bio: string;
  style: string;
  cover: string;
};

export type Scene = {
  id: number;
  slug: string;
  title: string;
  style: string;
  room: string;
  image: string;
  hotspots: { x: number; y: number; productId: number }[];
  tags: string[];
  saves: number;
  designerId: number;
};

export type Category = {
  slug: string;
  name: string;
  count: number;
  icon: string;
};

export type Magazine = {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
  excerpt: string;
};

export type Route =
  | { name: "home" }
  | { name: "inspirations" }
  | { name: "marketplace" }
  | { name: "designers" }
  | { name: "magazine" }
  | { name: "product"; id: number }
  | { name: "scene"; slug: string }
  | { name: "artisan"; id: number }
  | { name: "designer"; id: number }
  | { name: "favorites" }
  | { name: "brief" }
  | { name: "artisans" }
  | { name: "article"; id: number };

export type CartItem = Product & { qty: number; selectedColor?: string };

// ============================================================
// Brief & Project types (for designer brief system)
// ============================================================

export type Brief = {
  id: number;
  title: string;
  description: string;
  clientName: string;
  budget: { min: number; max: number };
  room: string;
  style: string;
  status: 'open' | 'matched' | 'closed';
  createdAt: string;
  responses: number;
  urgency: 'normal' | 'urgent' | 'flexible';
  requirements: string[];
};

export type Project = {
  id: number;
  title: string;
  clientName: string;
  designerName: string;
  designerId: number;
  status: 'en_cours' | 'terminé' | 'en_attente';
  progress: number;
  budget: number;
  paid: number;
  startDate: string;
  endDate?: string;
  images: string[];
  room: string;
  style: string;
};

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

// ============================================================
// Page "Mes Projets" — Types unifiés (étape 1, lecture seule)
// ============================================================

export type ClientProjectType =
  | 'ARTISAN_BRIEF'
  | 'ARTISAN_PROJECT'
  | 'DESIGNER_BRIEF'
  | 'DESIGNER_PROJECT'
  | 'CATALOG_ORDER'
  | 'COMPLAINT';

export type ProjectActionPriority =
  | 'PAYMENT_REQUIRED'
  | 'CHANGE_REQUEST_PENDING'
  | 'DELIVERY_CONFIRMATION_REQUIRED'
  | 'RESPONSE_REQUIRED'
  | 'DESIGNER_MEETING_OR_DELIVERABLE'
  | 'PROPOSAL_DECISION_REQUIRED'
  | 'PROGRESS_UPDATE_AVAILABLE'
  | 'NO_ACTION_REQUIRED';

export const ACTION_PRIORITY_ORDER: Record<ProjectActionPriority, number> = {
  PAYMENT_REQUIRED: 1,
  CHANGE_REQUEST_PENDING: 2,
  DELIVERY_CONFIRMATION_REQUIRED: 3,
  RESPONSE_REQUIRED: 4,
  DESIGNER_MEETING_OR_DELIVERABLE: 5,
  PROPOSAL_DECISION_REQUIRED: 6,
  PROGRESS_UPDATE_AVAILABLE: 7,
  NO_ACTION_REQUIRED: 8,
};

/** Route dédiée par type d'élément (SPA — page Zuistand) */
export type MesProjetsRoute = {
  page: string;
  id?: string;
  briefId?: string;
  projectId?: string;
  proposalId?: string;
  orderId?: string;
  designerId?: number;
};

export type MesProjetsItem = {
  id: string;
  type: ClientProjectType;
  title: string;
  image: string;
  status: string;
  statusLabel: string;
  statusColor: string;
  statusBgColor: string;
  partnerName: string;
  partnerAvatar: string;
  partnerType: 'artisan' | 'designer' | 'maison';
  amount: number;
  securedAmount?: number;
  estimatedDate?: string;
  lastUpdate: string;
  /** Action principale affichée sur le bouton */
  nextAction: string;
  /** Route de navigation dédiée au type */
  nextActionRoute: MesProjetsRoute;
  priority: ProjectActionPriority;
  priorityDeadline?: string;
  /** Conséquence si aucune action (affiché sous le badge) */
  priorityConsequence?: string;
  progress?: number;
  category?: string;
  zone?: string;
  proposalsCount?: number;
  budgetMin?: number;
  budgetMax?: number;
  /** Pour les éléments terminés/annulés */
  isCancelled?: boolean;

  // ── Liaison métier (chaîne brief → proposition → projet → réclamation) ──
  /** Type de l'objet source affiché (redondant avec `type` mais explicite pour la future machine d'états) */
  sourceType: ClientProjectType;
  /** ID de l'objet source affiché */
  sourceId: string;
  /** ID du brief parent si l'objet vient d'un brief (artisan ou designer) */
  parentBriefId?: string;
  /** ID du projet lié si l'objet est une réclamation ou un projet converti */
  linkedProjectId?: string;
};

// ── Propositions artisan (regroupées sous un brief) ──

export type ArtisanProposal = {
  id: string;
  briefId: string;
  artisanName: string;
  artisanAvatar: string;
  artisanLevel: string;
  artisanVerified: boolean;
  price: number;
  deliveryTime: string;
  materials: string;
  images: string[];
  paymentConditions: string;
};

export type ArtisanBriefWithProposals = {
  briefId: string;
  briefTitle: string;
  briefImage: string;
  category: string;
  zone: string;
  budgetMin: number;
  budgetMax: number;
  proposals: ArtisanProposal[];
  lastUpdate: string;
  /** Liaison métier — l'objet affiché est un brief artisan */
  sourceType: ClientProjectType;
  sourceId: string;
};

// ── Prestations designer à réserver ──

export type DesignerPrestation = {
  id: string;
  designerName: string;
  designerAvatar: string;
  prestation: string;
  price: number;
  livrables: string[];
  revisions: number;
  deliveryTime: string;
  availability: string;
  nextActionRoute: MesProjetsRoute;
  /** Liaison métier — l'objet affiché est un brief designer en attente de paiement */
  sourceType: ClientProjectType;
  sourceId: string;
  parentBriefId?: string;
};

// ── Paiements en attente ──

export type PendingPayment = {
  id: string;
  projectTitle: string;
  projectImage: string;
  amount: number;
  dueDate: string;
  paymentMethod: string;
  nextActionRoute: MesProjetsRoute;
  /** Liaison métier — paiement artisan ou prestation designer */
  sourceType: ClientProjectType;
  sourceId: string;
  parentBriefId?: string;
};

// ── Réclamations ──

export type ReclamationStatus =
  | 'OPEN'
  | 'WAITING_ARTISAN'
  | 'WAITING_CLIENT'
  | 'UNDER_REVIEW'
  | 'RESOLVED'
  | 'CLOSED';

export type Reclamation = {
  id: string;
  projectTitle: string;
  projectImage: string;
  partnerName: string;
  motif: string;
  openedDate: string;
  status: ReclamationStatus;
  statusLabel: string;
  statusColor: string;
  statusBgColor: string;
  lastAction: string;
  dedcoDecision?: string;
  amount: number;
  attachments: number;
  nextActionRoute: MesProjetsRoute;
  /** Liaison métier — projet artisan ou designer concerné */
  sourceType: ClientProjectType;
  sourceId: string;
  linkedProjectId?: string;
};
