// ============================================================
// DEDCO — Store Brief Artisan
// Machine d'états : DRAFT → SUBMITTED → PUBLISHED
//   → PROPOSALS_RECEIVED → IN_DISCUSSION → ARTISAN_SELECTED
//   → AWAITING_DEPOSIT → CONVERTED_TO_PROJECT
// ============================================================

import { create } from 'zustand';
import type { BriefArtisanStatus } from './dedco-status';
import type { ArtisanBrief, ArtisanBriefProposal } from './artisan-brief-types';

// ── Mocks initiaux — briefs à différents statuts pour démo ──

const MOCK_BRIEFS: ArtisanBrief[] = [
  {
    id: 'BA-001',
    title: 'Dressing sur mesure chambre',
    description: 'Dressing en bois massif, 3 portes coulissantes, finition vernis naturel. Intérieur modulable avec étagères et tiroirs.',
    category: 'Rangements',
    zone: 'Cotonou',
    piece: 'Chambre',
    style: 'Moderne épuré',
    dimensions: 'L 300 x H 240 x P 60 cm',
    materials: ['Bois iroko', 'Vernis naturel'],
    budgetMin: 150000,
    budgetMax: 300000,
    inspirations: [
      'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=400&q=80',
    ],
    status: 'PROPOSALS_RECEIVED',
    createdAt: '15 juin 2026',
    updatedAt: '19 juin 2026',
    expiresAt: '3 juillet 2026',
    proposals: [
      {
        id: 'PROP-A1',
        briefId: 'BA-001',
        artisanId: 1,
        artisanName: 'Kofi Akindélé',
        artisanAvatar: 'https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&w=80&q=80',
        artisanLevel: 'N3',
        artisanVerified: true,
        price: 220000,
        deliveryTime: '18 jours',
        materials: 'Bois massif iroko, vernis naturel',
        images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=400&q=80'],
        paymentConditions: 'Paiement sécurisé Mobile Money',
        message: 'Bois iroko de qualité supérieure, vernis écologique. Délai garanti.',
        submittedAt: '17 juin 2026',
      },
      {
        id: 'PROP-A2',
        briefId: 'BA-001',
        artisanId: 2,
        artisanName: 'Brice Gogan',
        artisanAvatar: 'https://images.unsplash.com/photo-1620932934088-fbdb2920e484?auto=format&fit=crop&w=80&q=80',
        artisanLevel: 'N2',
        artisanVerified: true,
        price: 195000,
        deliveryTime: '21 jours',
        materials: 'Contreplaqué bouleau, peinture éco-responsable',
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80'],
        paymentConditions: 'Paiement sécurisé Mobile Money',
        message: 'Solution économique avec contreplaqué bouleau, finition peinture au choix.',
        submittedAt: '18 juin 2026',
      },
      {
        id: 'PROP-A3',
        briefId: 'BA-001',
        artisanId: 3,
        artisanName: 'Emile Agossou',
        artisanAvatar: 'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&w=80&q=80',
        artisanLevel: 'N1',
        artisanVerified: false,
        price: 165000,
        deliveryTime: '25 jours',
        materials: 'Médjin (bois local), finition cire d\'abeille',
        images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=400&q=80'],
        paymentConditions: 'Paiement sécurisé Mobile Money',
        message: 'Bois local médjin, finition traditionnelle cire d\'abeille. Artisanat authentique.',
        submittedAt: '19 juin 2026',
      },
    ],
    clientId: 'CL-001',
    clientName: 'Sophie Kossou',
  },
  {
    id: 'BA-002',
    title: 'Table basse ronde en rotin',
    description: 'Table basse ronde, plateau en rotin tressé, structure en bois. Diamètre 80 cm, hauteur 40 cm.',
    category: 'Tables',
    zone: 'Cotonou',
    piece: 'Salon',
    style: 'Naturel bohème',
    dimensions: 'Ø 80 x H 40 cm',
    materials: ['Rotin', 'Bois local'],
    budgetMin: 60000,
    budgetMax: 120000,
    inspirations: [],
    status: 'PUBLISHED',
    createdAt: '20 juin 2026',
    updatedAt: '20 juin 2026',
    expiresAt: '4 juillet 2026',
    proposals: [],
    clientId: 'CL-001',
    clientName: 'Sophie Kossou',
  },
  {
    id: 'BA-003',
    title: 'Fauteuil Sahel Tressé',
    description: 'Fauteuil en rotin tressé, structure bois iroko, coussin en coton wax. Style Sahel contemporain.',
    category: 'Sièges',
    zone: 'Parakou',
    piece: 'Salon',
    style: 'Sahel contemporain',
    dimensions: '85 x 90 x 75 cm',
    materials: ['Rotin naturel', 'Bois iroko', 'Coton wax'],
    budgetMin: 200000,
    budgetMax: 280000,
    inspirations: [
      'https://images.unsplash.com/photo-1617364852223-75f57e78dc96?auto=format&fit=crop&w=400&q=80',
    ],
    status: 'AWAITING_DEPOSIT',
    createdAt: '10 juin 2026',
    updatedAt: '22 juin 2026',
    proposals: [
      {
        id: 'PROP-K1',
        briefId: 'BA-003',
        artisanId: 4,
        artisanName: 'Atelier Kossi',
        artisanAvatar: 'https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&w=80&q=80',
        artisanLevel: 'N3',
        artisanVerified: true,
        price: 245000,
        deliveryTime: '18 jours',
        materials: 'Rotin naturel, bois iroko, coton wax',
        images: [],
        paymentConditions: 'Paiement sécurisé Mobile Money',
        submittedAt: '12 juin 2026',
      },
    ],
    selectedProposalId: 'PROP-K1',
    clientId: 'CL-001',
    clientName: 'Sophie Kossou',
  },
  {
    id: 'BA-004',
    title: 'Lampe Abat-jour Bogolan',
    description: 'Lampe sur pied avec abat-jour en tissu bogolan teint main. Structure métal noir, douille porcelaine.',
    category: 'Luminaires',
    zone: 'Ouidah',
    piece: 'Salon',
    style: 'Ethnique chic',
    dimensions: 'Ø 35 x H 45 cm',
    materials: ['Tissu bogolan', 'Métal', 'Porcelaine'],
    budgetMin: 40000,
    budgetMax: 80000,
    inspirations: [],
    status: 'DRAFT',
    createdAt: '25 juin 2026',
    updatedAt: '25 juin 2026',
    proposals: [],
    clientId: 'CL-001',
    clientName: 'Sophie Kossou',
  },
  {
    id: 'BA-005',
    title: 'Étagère murale bois de rose',
    description: 'Étagère murale en bois de rose, 5 niveaux, fixation invisible. Style minimaliste.',
    category: 'Rangements',
    zone: 'Cotonou',
    piece: 'Bureau',
    style: 'Minimaliste',
    dimensions: 'L 120 x H 180 x P 25 cm',
    materials: ['Bois de rose'],
    budgetMin: 80000,
    budgetMax: 150000,
    inspirations: [],
    status: 'CONVERTED_TO_PROJECT',
    createdAt: '5 mai 2026',
    updatedAt: '15 juin 2026',
    proposals: [
      {
        id: 'PROP-E1',
        briefId: 'BA-005',
        artisanId: 3,
        artisanName: 'Emile Agossou',
        artisanAvatar: 'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&w=80&q=80',
        artisanLevel: 'N1',
        artisanVerified: false,
        price: 120000,
        deliveryTime: '15 jours',
        materials: 'Bois de rose local, huile naturelle',
        images: [],
        paymentConditions: 'Paiement sécurisé Mobile Money',
        submittedAt: '7 mai 2026',
      },
    ],
    selectedProposalId: 'PROP-E1',
    linkedProjectId: 'PA-011',
    clientId: 'CL-001',
    clientName: 'Sophie Kossou',
  },
];

// ── Store ──

interface BriefArtisanState {
  briefs: ArtisanBrief[];

  // Lecture
  getBrief: (id: string) => ArtisanBrief | undefined;
  getBriefsByStatus: (status: BriefArtisanStatus) => ArtisanBrief[];
  getBriefsByClient: (clientId: string) => ArtisanBrief[];

  // Mutations (transitions d'état)
  createBrief: (partial: Partial<ArtisanBrief>) => string; // retourne le nouvel ID
  updateBriefField: (id: string, field: keyof ArtisanBrief, value: any) => void;
  submitBrief: (id: string) => void;      // DRAFT → SUBMITTED
  publishBrief: (id: string) => void;     // SUBMITTED → PUBLISHED
  addProposal: (briefId: string, proposal: ArtisanBriefProposal) => void; // PUBLISHED → PROPOSALS_RECEIVED
  startDiscussion: (briefId: string, proposalId: string) => void; // PROPOSALS_RECEIVED → IN_DISCUSSION
  selectProposal: (briefId: string, proposalId: string) => void;  // IN_DISCUSSION → ARTISAN_SELECTED
  confirmSelection: (briefId: string) => void; // ARTISAN_SELECTED → AWAITING_DEPOSIT
  payDeposit: (briefId: string, projectId: string) => void; // AWAITING_DEPOSIT → CONVERTED_TO_PROJECT
  cancelBrief: (id: string) => void;     // * → CANCELLED
  expireBrief: (id: string) => void;     // PUBLISHED → EXPIRED
  duplicateBrief: (id: string) => string; // retourne le nouvel ID (statut DRAFT)
  relanceBrief: (id: string) => void;    // EXPIRED → PUBLISHED
}

// ── Helper : génère un nouvel ID ──

function generateBriefId(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `BA-${num}`;
}

function todayFr(): string {
  const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const d = new Date();
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export const useBriefArtisanStore = create<BriefArtisanState>((set, get) => ({
  briefs: MOCK_BRIEFS,

  // ── Lecture ──
  getBrief: (id) => get().briefs.find(b => b.id === id),
  getBriefsByStatus: (status) => get().briefs.filter(b => b.status === status),
  getBriefsByClient: (clientId) => get().briefs.filter(b => b.clientId === clientId),

  // ── Mutations ──
  createBrief: (partial) => {
    const id = generateBriefId();
    const now = todayFr();
    const newBrief: ArtisanBrief = {
      id,
      title: partial.title || 'Nouveau brief',
      description: partial.description || '',
      category: partial.category || 'Mobilier',
      zone: partial.zone || 'Cotonou',
      piece: partial.piece || '',
      style: partial.style || '',
      dimensions: partial.dimensions,
      materials: partial.materials || [],
      budgetMin: partial.budgetMin || 0,
      budgetMax: partial.budgetMax || 0,
      inspirations: partial.inspirations || [],
      constraints: partial.constraints,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
      proposals: [],
      clientId: partial.clientId || 'CL-001',
      clientName: partial.clientName || 'Sophie Kossou',
    };
    set(state => ({ briefs: [...state.briefs, newBrief] }));
    return id;
  },

  updateBriefField: (id, field, value) => {
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === id ? { ...b, [field]: value, updatedAt: todayFr() } : b
      ),
    }));
  },

  submitBrief: (id) => {
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === id && b.status === 'DRAFT'
          ? { ...b, status: 'SUBMITTED', updatedAt: todayFr() }
          : b
      ),
    }));
  },

  publishBrief: (id) => {
    const expiresAt = (() => {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    })();
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === id && b.status === 'SUBMITTED'
          ? { ...b, status: 'PUBLISHED', expiresAt, updatedAt: todayFr() }
          : b
      ),
    }));
  },

  addProposal: (briefId, proposal) => {
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === briefId && b.status === 'PUBLISHED'
          ? {
              ...b,
              status: 'PROPOSALS_RECEIVED',
              proposals: [...b.proposals, proposal],
              updatedAt: todayFr(),
            }
          : b
      ),
    }));
  },

  startDiscussion: (briefId, proposalId) => {
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === briefId && b.status === 'PROPOSALS_RECEIVED'
          ? { ...b, status: 'IN_DISCUSSION', selectedProposalId: proposalId, updatedAt: todayFr() }
          : b
      ),
    }));
  },

  selectProposal: (briefId, proposalId) => {
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === briefId && (b.status === 'IN_DISCUSSION' || b.status === 'PROPOSALS_RECEIVED')
          ? { ...b, status: 'ARTISAN_SELECTED', selectedProposalId: proposalId, updatedAt: todayFr() }
          : b
      ),
    }));
  },

  confirmSelection: (briefId) => {
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === briefId && b.status === 'ARTISAN_SELECTED'
          ? { ...b, status: 'AWAITING_DEPOSIT', updatedAt: todayFr() }
          : b
      ),
    }));
  },

  payDeposit: (briefId, projectId) => {
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === briefId && b.status === 'AWAITING_DEPOSIT'
          ? { ...b, status: 'CONVERTED_TO_PROJECT', linkedProjectId: projectId, updatedAt: todayFr() }
          : b
      ),
    }));
  },

  cancelBrief: (id) => {
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === id && b.status !== 'CONVERTED_TO_PROJECT' && b.status !== 'CANCELLED'
          ? { ...b, status: 'CANCELLED', updatedAt: todayFr() }
          : b
      ),
    }));
  },

  expireBrief: (id) => {
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === id && b.status === 'PUBLISHED'
          ? { ...b, status: 'EXPIRED', updatedAt: todayFr() }
          : b
      ),
    }));
  },

  duplicateBrief: (id) => {
    const source = get().briefs.find(b => b.id === id);
    if (!source) return id;
    const newId = generateBriefId();
    const now = todayFr();
    const duplicated: ArtisanBrief = {
      ...source,
      id: newId,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
      expiresAt: undefined,
      proposals: [],
      selectedProposalId: undefined,
      linkedProjectId: undefined,
    };
    set(state => ({ briefs: [...state.briefs, duplicated] }));
    return newId;
  },

  relanceBrief: (id) => {
    const expiresAt = (() => {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    })();
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === id && b.status === 'EXPIRED'
          ? { ...b, status: 'PUBLISHED', expiresAt, proposals: [], updatedAt: todayFr() }
          : b
      ),
    }));
  },
}));
