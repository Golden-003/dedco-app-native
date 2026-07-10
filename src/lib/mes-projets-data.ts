// ============================================================
// DEDCO — Mock data "Mes Projets" (v3 — conforme audit pilotage)
//
// RÈGLES DE FRONTIÈRE :
//   "En cours"  → briefs publiés sans proposition, projets en fabrication, RDV planifiés, livraison à confirmer
//   "À choisir" → propositions reçues, artisan sélectionné + paiement à effectuer, prestation designer à réserver
//   "Terminés"  → projets livrés, prestations réussies, commandes reçues (+ filtre annulés/expirés)
//   "Réclamations" → dossiers ouverts
//
// LIAISON MÉTIER :
//   sourceType / sourceId / parentBriefId / linkedProjectId
//   Permet de reconstituer la chaîne :
//   Brief BA-001 → Proposition PROP-A1 → Projet PRA-001 → Réclamation REC-001
// ============================================================

import type {
  MesProjetsItem,
  ArtisanBriefWithProposals,
  ArtisanProposal,
  DesignerPrestation,
  PendingPayment,
  Reclamation,
} from "./dedco-types";

// ────────────────────────────────────────────────────────────
// ONGLET "EN COURS" — projets actifs (pas d'engagement à confirmer)
// ────────────────────────────────────────────────────────────

export const MOCK_EN_COURS: MesProjetsItem[] = [
  // 1. Modification de matériau à valider (priorité 2)
  {
    id: "PA-001",
    type: "ARTISAN_PROJECT",
    title: "Fauteuil Sahel Tressé",
    image: "https://images.unsplash.com/photo-1617364852223-75f57e78dc96?auto=format&fit=crop&w=300&q=80",
    status: "CHANGE_REQUEST_PENDING",
    statusLabel: "Modification à valider",
    statusColor: "var(--terracotta)",
    statusBgColor: "var(--terracotta-pale)",
    partnerName: "Amara Dossou",
    partnerAvatar: "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&w=80&q=80",
    partnerType: "artisan",
    amount: 245000,
    securedAmount: 245000,
    estimatedDate: "10 juil. 2026",
    lastUpdate: "22 juin 2026",
    nextAction: "Valider la modification",
    nextActionRoute: { page: "projet-detail", projectId: "PA-001" },
    priority: "CHANGE_REQUEST_PENDING",
    priorityDeadline: "26 juin 2026",
    priorityConsequence: "Le délai passe de 14 à 18 jours. Le prix augmente de 15 000 FCFA.",
    progress: 60,
    category: "Sièges",
    zone: "Parakou",
    sourceType: "ARTISAN_PROJECT",
    sourceId: "PA-001",
    parentBriefId: "BA-001",
  },
  // 2. Livraison à confirmer (priorité 3)
  {
    id: "PA-002",
    type: "ARTISAN_PROJECT",
    title: "Lampe Abat-jour Bogolan",
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=300&q=80",
    status: "DELIVERED_PENDING_CONFIRMATION",
    statusLabel: "Réception à confirmer",
    statusColor: "var(--terracotta)",
    statusBgColor: "var(--terracotta-pale)",
    partnerName: "Fatou Loko",
    partnerAvatar: "https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&w=80&q=80",
    partnerType: "artisan",
    amount: 68000,
    securedAmount: 68000,
    lastUpdate: "21 juin 2026",
    nextAction: "Confirmer la réception",
    nextActionRoute: { page: "projet-detail", projectId: "PA-002" },
    priority: "DELIVERY_CONFIRMATION_REQUIRED",
    priorityDeadline: "25 juin 2026",
    priorityConsequence: "Sans confirmation, le paiement reste bloqué 48 h supplémentaires.",
    progress: 95,
    category: "Luminaires",
    zone: "Ouidah",
    sourceType: "ARTISAN_PROJECT",
    sourceId: "PA-002",
    parentBriefId: "BA-002",
  },
  // 3. Projet artisan en fabrication (priorité 7)
  {
    id: "PA-004",
    type: "ARTISAN_PROJECT",
    title: "Miroir Encadré Raffia",
    image: "https://images.unsplash.com/photo-1510828561531-05a3388f6d3d?auto=format&fit=crop&w=300&q=80",
    status: "IN_PRODUCTION",
    statusLabel: "En fabrication",
    statusColor: "var(--amber-dark)",
    statusBgColor: "var(--amber-pale)",
    partnerName: "Brice Gogan",
    partnerAvatar: "https://images.unsplash.com/photo-1620932934088-fbdb2920e484?auto=format&fit=crop&w=80&q=80",
    partnerType: "artisan",
    amount: 95000,
    securedAmount: 47500,
    estimatedDate: "5 juil. 2026",
    lastUpdate: "20 juin 2026",
    nextAction: "Voir l'avancement",
    nextActionRoute: { page: "projet-detail", projectId: "PA-004" },
    priority: "PROGRESS_UPDATE_AVAILABLE",
    progress: 35,
    category: "Décoration murale",
    zone: "Cotonou",
    sourceType: "ARTISAN_PROJECT",
    sourceId: "PA-004",
    parentBriefId: "BA-004",
  },
  // 4. Projet artisan avec mise à jour récente (priorité 7)
  {
    id: "PA-005",
    type: "ARTISAN_PROJECT",
    title: "Tabouret Tamtam x2",
    image: "https://images.unsplash.com/photo-1566921895456-1cee6-8cee6f646-1cee6-8cee6f646-1cee6-8cee6f646?auto=format&fit=crop&w=300&q=80",
    status: "IN_PRODUCTION",
    statusLabel: "En fabrication",
    statusColor: "var(--amber-dark)",
    statusBgColor: "var(--amber-pale)",
    partnerName: "Brice Gogan",
    partnerAvatar: "https://images.unsplash.com/photo-1620932934088-fbdb2920e484?auto=format&fit=crop&w=80&q=80",
    partnerType: "artisan",
    amount: 76000,
    securedAmount: 38000,
    estimatedDate: "12 juil. 2026",
    lastUpdate: "21 juin 2026",
    nextAction: "Voir l'avancement",
    nextActionRoute: { page: "projet-detail", projectId: "PA-005" },
    priority: "PROGRESS_UPDATE_AVAILABLE",
    progress: 50,
    category: "Sièges",
    zone: "Cotonou",
    sourceType: "ARTISAN_PROJECT",
    sourceId: "PA-005",
    parentBriefId: "BA-005",
  },
  // 5. Rendez-vous designer planifié (priorité 5) — designer PAYÉ, RDV planifié → EN COURS
  {
    id: "PD-001",
    type: "DESIGNER_PROJECT",
    title: "Aménagement salon moderne",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=300&q=80",
    status: "KICKOFF_SCHEDULED",
    statusLabel: "Rendez-vous de cadrage planifié",
    statusColor: "var(--forest)",
    statusBgColor: "var(--forest-pale)",
    partnerName: "Aminata Design",
    partnerAvatar: "https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&w=80&q=80",
    partnerType: "designer",
    amount: 350000,
    securedAmount: 350000,
    estimatedDate: "15 août 2026",
    lastUpdate: "20 juin 2026",
    nextAction: "Préparer mon projet",
    nextActionRoute: { page: "projet-detail", projectId: "PD-001" },
    priority: "DESIGNER_MEETING_OR_DELIVERABLE",
    priorityDeadline: "28 juin 2026",
    priorityConsequence: "Le rendez-vous est le 28 juin à 10 h.",
    progress: 10,
    category: "Aménagement",
    sourceType: "DESIGNER_PROJECT",
    sourceId: "PD-001",
    parentBriefId: "BD-001",
  },
  // 6. Livrable designer disponible (priorité 5)
  {
    id: "PD-002",
    type: "DESIGNER_PROJECT",
    title: "Réaménagement bureau domicile",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=300&q=80",
    status: "DELIVERABLE_READY",
    statusLabel: "Livrable disponible",
    statusColor: "var(--amber-dark)",
    statusBgColor: "var(--amber-pale)",
    partnerName: "Rachelle Interior",
    partnerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80",
    partnerType: "designer",
    amount: 250000,
    securedAmount: 250000,
    lastUpdate: "19 juin 2026",
    nextAction: "Consulter le livrable",
    nextActionRoute: { page: "projet-detail", projectId: "PD-002" },
    priority: "DESIGNER_MEETING_OR_DELIVERABLE",
    progress: 80,
    category: "Aménagement",
    sourceType: "DESIGNER_PROJECT",
    sourceId: "PD-002",
    parentBriefId: "BD-002",
  },
];

// ────────────────────────────────────────────────────────────
// ONGLET "A CHOISIR" — décisions et paiements à effectuer
// ────────────────────────────────────────────────────────────

/** 3 propositions regroupées sous 1 brief artisan — affiché comme 1 seule carte */
export const MOCK_BRIEF_WITH_PROPOSALS: ArtisanBriefWithProposals = {
  briefId: "BA-001",
  briefTitle: "Dressing sur mesure chambre",
  briefImage: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=300&q=80",
  category: "Rangements",
  zone: "Cotonou",
  budgetMin: 150000,
  budgetMax: 300000,
  lastUpdate: "19 juin 2026",
  proposals: [
    {
      id: "PROP-A1",
      briefId: "BA-001",
      artisanId: 1,
      artisanName: "Kofi Akindélé",
      artisanAvatar: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&w=80&q=80",
      artisanLevel: "N3",
      artisanVerified: true,
      price: 220000,
      deliveryTime: "18 jours",
      materials: "Bois massif iroko, vernis naturel",
      images: ["https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=200&q=80"],
      paymentConditions: "Paiement sécurisé Mobile Money",
    },
    {
      id: "PROP-A2",
      briefId: "BA-001",
      artisanId: 4,
      artisanName: "Brice Gogan",
      artisanAvatar: "https://images.unsplash.com/photo-1620932934088-fbdb2920e484?auto=format&fit=crop&w=80&q=80",
      artisanLevel: "N2",
      artisanVerified: true,
      price: 195000,
      deliveryTime: "21 jours",
      materials: "Contreplaqué bouleau, peinture éco-responsable",
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80"],
      paymentConditions: "Paiement sécurisé Mobile Money",
    },
    {
      id: "PROP-A3",
      briefId: "BA-001",
      artisanId: 5,
      artisanName: "Emile Agossou",
      artisanAvatar: "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&w=80&q=80",
      artisanLevel: "N1",
      artisanVerified: false,
      price: 165000,
      deliveryTime: "25 jours",
      materials: "Médjin (bois local), finition cire d'abeille",
      images: ["https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=200&q=80"],
      paymentConditions: "Paiement sécurisé Mobile Money",
    },
  ],
  sourceType: "ARTISAN_BRIEF",
  sourceId: "BA-001",
};

/** Prestations designer acceptées mais non réservées — statut AWAITING_PAYMENT explicite */
export const MOCK_PRESTATIONS_DESIGNER: DesignerPrestation[] = [
  {
    id: "PRES-D1",
    designerName: "Rachelle Interior",
    designerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80",
    prestation: "Standard — Plan d'aménagement complet",
    price: 180000,
    livrables: ["Plan d'aménagement 2D/3D", "Palette couleurs", "Liste de sourcing"],
    revisions: 2,
    deliveryTime: "10 jours ouvrables",
    availability: "Disponible à partir du 28 juin",
    nextActionRoute: { page: "client-proposition-recue", proposalId: "PRES-D1" },
    sourceType: "DESIGNER_BRIEF",
    sourceId: "PRES-D1",
    parentBriefId: "BD-003",
  },
];

/** Paiements Paiement en attente — inclut l'paiement artisan (BA-003 sélectionné, paiement à effectuer) */
export const MOCK_PAIEMENTS_EN_ATTENTE: PendingPayment[] = [
  // Paiement artisan — Proposition PROP-K1 sélectionnée pour BA-003
  {
    id: "PAY-A-003",
    projectTitle: "Table basse sur mesure",
    projectImage: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=200&q=80",
    amount: 92500, // 100% payé
    dueDate: "28 juin 2026",
    paymentMethod: "MTN MoMo / Moov Money / Carte",
    nextActionRoute: { page: "projet-paiement-artisan", proposalId: "PROP-K1" },
    sourceType: "ARTISAN_BRIEF",
    sourceId: "PAY-A-003",
    parentBriefId: "BA-003",
  },
  // Paiement designer — prestation PRES-D1
  {
    id: "PAY-D1",
    projectTitle: "Décoration chambre enfant",
    projectImage: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=200&q=80",
    amount: 120000,
    dueDate: "30 juin 2026",
    paymentMethod: "MTN MoMo / Moov Money / Carte",
    nextActionRoute: { page: "payment", orderId: "PAY-D1" },
    sourceType: "DESIGNER_BRIEF",
    sourceId: "PAY-D1",
    parentBriefId: "BD-003",
  },
];

// ────────────────────────────────────────────────────────────
// ONGLET "TERMINÉS" — 2 réussis + 1 annulé
// ────────────────────────────────────────────────────────────

export const MOCK_TERMINES: MesProjetsItem[] = [
  // Projet artisan livré et clôturé
  {
    id: "PA-010",
    type: "ARTISAN_PROJECT",
    title: "Canapé personnalisé Cotonou",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80",
    status: "COMPLETED",
    statusLabel: "Projet terminé",
    statusColor: "var(--forest)",
    statusBgColor: "var(--forest-pale)",
    partnerName: "Atelier Kossi",
    partnerAvatar: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&w=80&q=80",
    partnerType: "artisan",
    amount: 420000,
    lastUpdate: "10 juin 2026",
    nextAction: "Voir le projet",
    nextActionRoute: { page: "projet-detail", projectId: "PA-010" },
    priority: "NO_ACTION_REQUIRED",
    progress: 100,
    category: "Sièges",
    zone: "Cotonou",
    isCancelled: false,
    sourceType: "ARTISAN_PROJECT",
    sourceId: "PA-010",
    parentBriefId: "BA-010",
  },
  // Prestation designer terminée
  {
    id: "PD-010",
    type: "DESIGNER_PROJECT",
    title: "Plan d'aménagement salon",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=300&q=80",
    status: "COMPLETED",
    statusLabel: "Prestation terminée",
    statusColor: "var(--forest)",
    statusBgColor: "var(--forest-pale)",
    partnerName: "Aminata Design",
    partnerAvatar: "https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&w=80&q=80",
    partnerType: "designer",
    amount: 250000,
    lastUpdate: "1 juin 2026",
    nextAction: "Voir le projet",
    nextActionRoute: { page: "projet-detail", projectId: "PD-010" },
    priority: "NO_ACTION_REQUIRED",
    progress: 100,
    category: "Aménagement",
    isCancelled: false,
    sourceType: "DESIGNER_PROJECT",
    sourceId: "PD-010",
    parentBriefId: "BD-010",
  },
  // Commande catalogue annulée — isolée dans le filtre "Annulés / expirés"
  {
    id: "CMD-ANN-01",
    type: "CATALOG_ORDER",
    title: "Tapis Bénin Wax 200x300",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=300&q=80",
    status: "CANCELLED",
    statusLabel: "Annulé",
    statusColor: "var(--text-3)",
    statusBgColor: "var(--bg-warm)",
    partnerName: "Maison Afrika",
    partnerAvatar: "https://images.unsplash.com/photo-1620932934088-fbdb2920e484?auto=format&fit=crop&w=80&q=80",
    partnerType: "maison",
    amount: 85000,
    lastUpdate: "28 mai 2026",
    nextAction: "Dupliquer la commande",
    nextActionRoute: { page: "marketplace" },
    priority: "NO_ACTION_REQUIRED",
    isCancelled: true,
    sourceType: "CATALOG_ORDER",
    sourceId: "CMD-ANN-01",
  },
];

// ────────────────────────────────────────────────────────────
// ONGLET "RÉCLAMATIONS" — 2 éléments
// ────────────────────────────────────────────────────────────

export const MOCK_RECLAMATIONS: Reclamation[] = [
  {
    id: "REC-001",
    projectTitle: "Étagère murale bois de rose",
    projectImage: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=300&q=80",
    partnerName: "Emile Agossou",
    motif: "Produit non conforme aux dimensions convenues",
    openedDate: "15 juin 2026",
    status: "UNDER_REVIEW",
    statusLabel: "Analyse Dedco en cours",
    statusColor: "var(--amber-dark)",
    statusBgColor: "var(--amber-pale)",
    lastAction: "Pièces justificatives transmises par le client",
    amount: 120000,
    attachments: 3,
    nextActionRoute: { page: "litige", id: "REC-001" },
    sourceType: "COMPLAINT",
    sourceId: "REC-001",
    linkedProjectId: "PA-011",
  },
  {
    id: "REC-002",
    projectTitle: "Tête de lit sculpté",
    projectImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=300&q=80",
    partnerName: "Fatou Loko",
    motif: "Retard de livraison de 12 jours sans justification",
    openedDate: "10 juin 2026",
    status: "WAITING_ARTISAN",
    statusLabel: "En attente de réponse artisan",
    statusColor: "var(--terracotta)",
    statusBgColor: "var(--terracotta-pale)",
    lastAction: "Relance envoyée à l'artisan",
    amount: 85000,
    attachments: 1,
    nextActionRoute: { page: "litige", id: "REC-002" },
    sourceType: "COMPLAINT",
    sourceId: "REC-002",
    linkedProjectId: "PA-012",
  },
];

// ────────────────────────────────────────────────────────────
// HELPERS — configuration visuelle par priorité
// ────────────────────────────────────────────────────────────

export const PRIORITY_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  PAYMENT_REQUIRED: { label: "Paiement requis", color: "var(--terracotta)", bgColor: "var(--terracotta-pale)" },
  CHANGE_REQUEST_PENDING: { label: "Modification à valider", color: "var(--terracotta)", bgColor: "var(--terracotta-pale)" },
  DELIVERY_CONFIRMATION_REQUIRED: { label: "Confirmation livraison", color: "var(--terracotta)", bgColor: "var(--terracotta-pale)" },
  RESPONSE_REQUIRED: { label: "Réponse demandée", color: "var(--amber-dark)", bgColor: "var(--amber-pale)" },
  DESIGNER_MEETING_OR_DELIVERABLE: { label: "Designer", color: "var(--amber-dark)", bgColor: "var(--amber-pale)" },
  PROPOSAL_DECISION_REQUIRED: { label: "Décision requise", color: "var(--amber-dark)", bgColor: "var(--amber-pale)" },
  PROGRESS_UPDATE_AVAILABLE: { label: "Mise à jour", color: "var(--text-2)", bgColor: "var(--bg-warm)" },
  NO_ACTION_REQUIRED: { label: "", color: "", bgColor: "" },
};

/** Vocabulaire : libellé du type d'objet */
export const TYPE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  ARTISAN_BRIEF: { label: "Brief artisan", color: "var(--amber-dark)", bg: "var(--amber-pale)" },
  ARTISAN_PROJECT: { label: "Projet artisan", color: "var(--amber-dark)", bg: "var(--amber-pale)" },
  DESIGNER_BRIEF: { label: "Brief designer", color: "var(--forest)", bg: "var(--forest-pale)" },
  DESIGNER_PROJECT: { label: "Projet designer", color: "var(--forest)", bg: "var(--forest-pale)" },
  CATALOG_ORDER: { label: "Commande", color: "var(--text-2)", bg: "var(--bg-warm)" },
  COMPLAINT: { label: "Réclamation", color: "var(--terracotta)", bg: "var(--terracotta-pale)" },
};

// ────────────────────────────────────────────────────────────
// HELPER — conversion date FR → timestamp pour le tri secondaire
// ────────────────────────────────────────────────────────────

/** Convertit "26 juin 2026" en timestamp pour départager les priorités égales */
export function parseFrDate(dateStr: string): number {
  const months: Record<string, number> = {
    "janv": 0, "févr": 1, "mars": 2, "avr": 3, "mai": 4, "juin": 5,
    "juil": 6, "août": 7, "sept": 8, "oct": 9, "nov": 10, "déc": 11,
  };
  // Format attendu : "26 juin 2026" ou "28 juin 2026"
  const match = dateStr.match(/^(\d{1,2})\s+([a-zéû]+)\s+(\d{4})$/i);
  if (!match) return Number.MAX_SAFE_INTEGER;
  const day = parseInt(match[1], 10);
  const monthKey = match[2].toLowerCase().slice(0, 4);
  const month = months[monthKey] ?? 0;
  const year = parseInt(match[3], 10);
  return new Date(year, month, day).getTime();
}
