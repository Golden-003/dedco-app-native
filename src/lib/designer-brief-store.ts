// ============================================================
// DEDCO — Store Brief Designer
// Machine d'états : DRAFT → SUBMITTED → PENDING_DESIGNER_RESPONSE
//   → ACCEPTED → AWAITING_PAYMENT → BOOKING_CONFIRMED
//   → CONVERTED_TO_DESIGN_PROJECT
// ============================================================

import { create } from 'zustand';
import type { BriefDesignerStatus } from './dedco-status';
import type { DesignerBrief, DesignerPrestation } from './designer-brief-types';

// ── Mocks initiaux — briefs designer à différents statuts ──

const MOCK_BRIEFS: DesignerBrief[] = [
  {
    id: 'BD-001',
    title: 'Aménagement salon moderne',
    description: 'Aménagement complet du salon, style moderne épuré avec touches africaines contemporaines.',
    piece: 'Salon',
    style: 'Moderne épuré',
    superficie: '32 m²',
    budgetConseil: { min: 800000, max: 1500000 },
    status: 'BOOKING_CONFIRMED',
    createdAt: '15 juin 2026',
    updatedAt: '20 juin 2026',
    designerId: 1,
    designerName: 'Aminata Design',
    designerAvatar: 'https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&w=80&q=80',
    designerCity: 'Cotonou',
    prestation: {
      id: 'PRES-D1',
      briefId: 'BD-001',
      designerId: 1,
      designerName: 'Aminata Design',
      designerAvatar: 'https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&w=80&q=80',
      prestationLabel: 'Standard — Plan d\'aménagement complet',
      scope: 'standard',
      price: 350000,
      livrables: ["Plan d'aménagement 2D/3D", 'Palette couleurs', 'Liste de sourcing', "Conseils d'installation"],
      revisions: 2,
      deliveryTime: '15 jours ouvrables',
      availability: 'Disponible immédiatement',
      submittedAt: '17 juin 2026',
    },
    clientId: 'CL-001',
    clientName: 'Sophie Kossou',
  },
  {
    id: 'BD-002',
    title: 'Réaménagement bureau domicile',
    description: 'Bureau à domicile, style naturel et chaleureux. Besoin d\'un plan optimisé pour productivité.',
    piece: 'Bureau',
    style: 'Naturel & chaleureux',
    superficie: '14 m²',
    budgetConseil: { min: 400000, max: 800000 },
    status: 'AWAITING_PAYMENT',
    createdAt: '18 juin 2026',
    updatedAt: '22 juin 2026',
    designerId: 2,
    designerName: 'Rachelle Interior',
    designerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
    designerCity: 'Porto-Novo',
    prestation: {
      id: 'PRES-D2',
      briefId: 'BD-002',
      designerId: 2,
      designerName: 'Rachelle Interior',
      designerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
      prestationLabel: 'Standard — Plan d\'aménagement complet',
      scope: 'standard',
      price: 250000,
      livrables: ['Plan 2D', 'Palette', 'Sourcing mobilier'],
      revisions: 2,
      deliveryTime: '10 jours ouvrables',
      availability: 'Disponible à partir du 28 juin',
      submittedAt: '20 juin 2026',
    },
    clientId: 'CL-001',
    clientName: 'Sophie Kossou',
  },
  {
    id: 'BD-003',
    title: 'Décoration chambre enfant',
    description: 'Chambre d\'enfant, style doux et playful. Couleurs pastel avec touches wax.',
    piece: 'Chambre',
    style: 'Doux & playful',
    superficie: '12 m²',
    budgetConseil: { min: 200000, max: 500000 },
    status: 'PENDING_DESIGNER_RESPONSE',
    createdAt: '24 juin 2026',
    updatedAt: '24 juin 2026',
    expiresAt: '8 juillet 2026',
    designerId: 1,
    designerName: 'Aminata Design',
    designerAvatar: 'https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&w=80&q=80',
    designerCity: 'Cotonou',
    clientId: 'CL-001',
    clientName: 'Sophie Kossou',
  },
  {
    id: 'BD-004',
    title: 'Plan d\'aménagement salon',
    description: 'Plan d\'aménagement pour salon de 30m², style moderne épuré.',
    piece: 'Salon',
    style: 'Moderne épuré',
    superficie: '30 m²',
    budgetConseil: { min: 700000, max: 1200000 },
    status: 'CONVERTED_TO_DESIGN_PROJECT',
    createdAt: '5 mai 2026',
    updatedAt: '1 juin 2026',
    designerId: 1,
    designerName: 'Aminata Design',
    designerAvatar: 'https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&w=80&q=80',
    designerCity: 'Cotonou',
    prestation: {
      id: 'PRES-D4',
      briefId: 'BD-004',
      designerId: 1,
      designerName: 'Aminata Design',
      designerAvatar: 'https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&w=80&q=80',
      prestationLabel: 'Standard — Plan d\'aménagement complet',
      scope: 'standard',
      price: 250000,
      livrables: ['Plan 2D', 'Palette', 'Sourcing'],
      revisions: 2,
      deliveryTime: '10 jours ouvrables',
      availability: 'Disponible',
      submittedAt: '7 mai 2026',
    },
    linkedProjectId: 'PD-010',
    clientId: 'CL-001',
    clientName: 'Sophie Kossou',
  },
];

// ── Store ──

interface BriefDesignerState {
  briefs: DesignerBrief[];

  getBrief: (id: string) => DesignerBrief | undefined;
  getBriefsByStatus: (status: BriefDesignerStatus) => DesignerBrief[];
  getBriefsByClient: (clientId: string) => DesignerBrief[];

  createBrief: (partial: Partial<DesignerBrief>) => string;
  updateBriefField: (id: string, field: keyof DesignerBrief, value: any) => void;
  submitBrief: (id: string) => void;
  designerAccepts: (briefId: string, prestation: DesignerPrestation) => void;
  designerDeclines: (briefId: string) => void;
  requestInfo: (briefId: string) => void;
  payPrestation: (briefId: string, projectId: string) => void;
  cancelBrief: (id: string) => void;
  expireBrief: (id: string) => void;
  duplicateBrief: (id: string) => string;
  relanceBrief: (id: string) => void;
}

function generateBriefId(): string {
  return `BD-${Math.floor(Math.random() * 9000) + 1000}`;
}

function todayFr(): string {
  const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const d = new Date();
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export const useBriefDesignerStore = create<BriefDesignerState>((set, get) => ({
  briefs: MOCK_BRIEFS,

  getBrief: (id) => get().briefs.find(b => b.id === id),
  getBriefsByStatus: (status) => get().briefs.filter(b => b.status === status),
  getBriefsByClient: (clientId) => get().briefs.filter(b => b.clientId === clientId),

  createBrief: (partial) => {
    const id = generateBriefId();
    const now = todayFr();
    const newBrief: DesignerBrief = {
      id,
      title: partial.title || 'Nouveau brief designer',
      description: partial.description || '',
      piece: partial.piece || '',
      style: partial.style || '',
      superficie: partial.superficie || '',
      budgetConseil: partial.budgetConseil || { min: 0, max: 0 },
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
      designerId: partial.designerId || 1,
      designerName: partial.designerName || 'Aminata Design',
      designerAvatar: partial.designerAvatar || '',
      designerCity: partial.designerCity || 'Cotonou',
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
    const expiresAt = (() => {
      const d = new Date(); d.setDate(d.getDate() + 14);
      const m = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
      return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
    })();
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === id && b.status === 'DRAFT'
          ? { ...b, status: 'SUBMITTED', expiresAt, updatedAt: todayFr() }
          : b
      ),
    }));
  },

  designerAccepts: (briefId, prestation) => {
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === briefId && (b.status === 'PENDING_DESIGNER_RESPONSE' || b.status === 'NEEDS_INFO')
          ? { ...b, status: 'ACCEPTED', prestation, updatedAt: todayFr() }
          : b
      ),
    }));
    // Auto-transition vers AWAITING_PAYMENT
    setTimeout(() => {
      set(state => ({
        briefs: state.briefs.map(b =>
          b.id === briefId && b.status === 'ACCEPTED'
            ? { ...b, status: 'AWAITING_PAYMENT', updatedAt: todayFr() }
            : b
        ),
      }));
    }, 100);
  },

  designerDeclines: (briefId) => {
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === briefId && b.status === 'PENDING_DESIGNER_RESPONSE'
          ? { ...b, status: 'DECLINED', updatedAt: todayFr() }
          : b
      ),
    }));
  },

  requestInfo: (briefId) => {
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === briefId && b.status === 'PENDING_DESIGNER_RESPONSE'
          ? { ...b, status: 'NEEDS_INFO', updatedAt: todayFr() }
          : b
      ),
    }));
  },

  payPrestation: (briefId, projectId) => {
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === briefId && b.status === 'AWAITING_PAYMENT'
          ? { ...b, status: 'BOOKING_CONFIRMED', linkedProjectId: projectId, updatedAt: todayFr() }
          : b
      ),
    }));
  },

  cancelBrief: (id) => {
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === id && !['CONVERTED_TO_DESIGN_PROJECT', 'CANCELLED'].includes(b.status)
          ? { ...b, status: 'CANCELLED', updatedAt: todayFr() }
          : b
      ),
    }));
  },

  expireBrief: (id) => {
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === id && b.status === 'PENDING_DESIGNER_RESPONSE'
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
    set(state => ({
      briefs: [...state.briefs, {
        ...source,
        id: newId,
        status: 'DRAFT',
        createdAt: now,
        updatedAt: now,
        expiresAt: undefined,
        prestation: undefined,
        linkedProjectId: undefined,
      }],
    }));
    return newId;
  },

  relanceBrief: (id) => {
    const expiresAt = (() => {
      const d = new Date(); d.setDate(d.getDate() + 14);
      const m = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
      return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
    })();
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === id && b.status === 'EXPIRED'
          ? { ...b, status: 'PENDING_DESIGNER_RESPONSE', expiresAt, updatedAt: todayFr() }
          : b
      ),
    }));
  },
}));
