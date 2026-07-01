// ============================================================
// DEDCO — Store Brief Artisan
// CONNECTÉ AU MOTEUR — toutes les transitions passent par applyTransition()
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BriefArtisanStatus } from './dedco-status';
import type { ArtisanBrief, ArtisanBriefProposal } from './artisan-brief-types';
import { applyTransition } from './brief-artisan/engine';
import type { BriefAction, UserRole } from './brief-artisan/types';

// ── Mocks initiaux (inchangés) ──
// [Les mocks restent identiques — voir plus bas pour le contenu complet]

import { MOCK_BRIEFS as _MOCK } from './artisan-brief-mocks';

// ── Store ──

interface BriefArtisanState {
  briefs: ArtisanBrief[];

  // Lecture
  getBrief: (id: string) => ArtisanBrief | undefined;
  getBriefsByStatus: (status: BriefArtisanStatus) => ArtisanBrief[];
  getBriefsByClient: (clientId: string) => ArtisanBrief[];

  // Mutations (passent par le moteur)
  createBrief: (partial: Partial<ArtisanBrief>) => string;
  updateBriefField: (id: string, field: keyof ArtisanBrief, value: any) => void;
  submitBrief: (id: string) => void;
  publishBrief: (id: string) => void;
  addProposal: (briefId: string, proposal: ArtisanBriefProposal) => void;
  startDiscussion: (briefId: string, proposalId: string) => void;
  selectProposal: (briefId: string, proposalId: string) => void;
  confirmSelection: (briefId: string) => void;
  payDeposit: (briefId: string, projectId: string) => void;
  cancelBrief: (id: string) => void;
  expireBrief: (id: string) => void;
  duplicateBrief: (id: string) => string;
  relanceBrief: (id: string) => void;
}

// ── Helper : exécuter une transition via le moteur ──

function executeTransition(
  briefs: ArtisanBrief[],
  briefId: string,
  action: BriefAction,
  user: { id: string; role: UserRole }
): { briefs: ArtisanBrief[]; success: boolean; error?: string } {
  const brief = briefs.find(b => b.id === briefId);
  if (!brief) {
    return { briefs, success: false, error: 'Brief introuvable.' };
  }

  // Cast vers le type du moteur (structurellement compatible)
  const { brief: updatedBrief, result } = applyTransition(brief as any, action, user);

  if (!result.success) {
    console.warn(`[BriefArtisan] Transition refusée: ${action} — ${result.error}`);
    return { briefs, success: false, error: result.error };
  }

  // Mettre à jour le brief dans la liste
  const newBriefs = briefs.map(b => b.id === briefId ? updatedBrief as ArtisanBrief : b);

  // Logger les notifications déclenchées ET les dispatcher au notification-store
  if (result.notifications && result.notifications.length > 0) {
    console.log(`[BriefArtisan] Notifications déclenchées pour ${briefId}:`, result.notifications);
    // Dispatcher les notifications au store global
    try {
      // Import dynamique pour éviter la dépendance circulaire
      const { useNotificationStore } = require('./notification-store');
      const addNotification = useNotificationStore.getState().addNotification;
      const NOTIF_LABELS: Record<string, { type: any; title: string; desc: string }> = {
        brief_submitted: { type: 'brief_artisan', title: 'Brief prêt à publier', desc: 'Votre brief est complet. Publiez-le pour recevoir des propositions.' },
        brief_published: { type: 'brief_artisan', title: 'Brief publié', desc: 'Votre brief est maintenant visible par les artisans vérifiés.' },
        proposal_received: { type: 'brief_artisan', title: 'Nouvelle proposition reçue', desc: 'Un artisan a répondu à votre brief.' },
        discussion_started: { type: 'brief_artisan', title: 'Discussion démarrée', desc: 'Une discussion est ouverte avec un artisan.' },
        artisan_selected: { type: 'brief_artisan', title: 'Artisan sélectionné', desc: 'Vous avez été sélectionné pour un brief.' },
        payment_requested: { type: 'brief_artisan', title: 'Paiement requis', desc: 'Veuillez payer l\'acompte pour démarrer la fabrication.' },
        payment_confirmed: { type: 'brief_artisan', title: 'Paiement confirmé', desc: 'Le paiement a été reçu, la fabrication démarre.' },
        project_created: { type: 'brief_artisan', title: 'Projet créé', desc: 'Votre brief a été converti en projet de fabrication.' },
        brief_expired: { type: 'brief_artisan', title: 'Brief expiré', desc: 'Aucune proposition reçue dans les 14 jours.' },
        brief_cancelled: { type: 'brief_artisan', title: 'Brief annulé', desc: 'Le brief a été annulé.' },
      };
      for (const trigger of result.notifications) {
        const label = NOTIF_LABELS[trigger];
        if (label) {
          addNotification({
            type: label.type,
            title: label.title,
            desc: label.desc,
            linkedId: briefId,
            route: { page: 'brief-artisan-detail', briefId },
          });
        }
      }
    } catch (e) {
      console.warn('[BriefArtisan] Impossible de dispatcher les notifications:', e);
    }
  }

  return { briefs: newBriefs, success: true };
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

// ── Utilisateur par défaut (client) ──

const CLIENT_USER = { id: 'CL-001', role: 'client' as UserRole };
const ARTISAN_USER = { id: 'ART-001', role: 'artisan' as UserRole };
const SYSTEM_USER = { id: 'system', role: 'system' as UserRole };

export const useBriefArtisanStore = create<BriefArtisanState>()(
  persist(
    (set, get) => ({
  briefs: _MOCK,

  // ── Lecture ──
  getBrief: (id) => get().briefs.find(b => b.id === id),
  getBriefsByStatus: (status) => get().briefs.filter(b => b.status === status),
  getBriefsByClient: (clientId) => get().briefs.filter(b => b.clientId === clientId),

  // ── Mutations — toutes passent par le moteur ──

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

  // ── Transitions via le moteur ──

  submitBrief: (id) => {
    set(state => {
      const result = executeTransition(state.briefs, id, 'submit', CLIENT_USER);
      return { briefs: result.briefs };
    });
  },

  publishBrief: (id) => {
    set(state => {
      const result = executeTransition(state.briefs, id, 'publish', CLIENT_USER);
      return { briefs: result.briefs };
    });
  },

  addProposal: (briefId, proposal) => {
    // 1. Ajouter la proposition au brief
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === briefId
          ? { ...b, proposals: [...b.proposals, proposal] }
          : b
      ),
    }));
    // 2. Déclencher la transition receiveProposal via le moteur (rôle artisan)
    set(state => {
      const result = executeTransition(state.briefs, briefId, 'receiveProposal', ARTISAN_USER);
      return { briefs: result.briefs };
    });
  },

  startDiscussion: (briefId, proposalId) => {
    // 1. Sélectionner la proposition
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === briefId ? { ...b, selectedProposalId: proposalId } : b
      ),
    }));
    // 2. Transition via le moteur
    set(state => {
      const result = executeTransition(state.briefs, briefId, 'startDiscussion', CLIENT_USER);
      return { briefs: result.briefs };
    });
  },

  selectProposal: (briefId, proposalId) => {
    // 1. Sélectionner la proposition
    set(state => ({
      briefs: state.briefs.map(b =>
        b.id === briefId ? { ...b, selectedProposalId: proposalId } : b
      ),
    }));
    // 2. Transition via le moteur
    set(state => {
      const result = executeTransition(state.briefs, briefId, 'selectProposal', CLIENT_USER);
      return { briefs: result.briefs };
    });
  },

  confirmSelection: (briefId) => {
    set(state => {
      const result = executeTransition(state.briefs, briefId, 'confirmSelection', CLIENT_USER);
      return { briefs: result.briefs };
    });
  },

  payDeposit: (briefId, projectId) => {
    // 1. Transition via le moteur (génère linkedProjectId)
    set(state => {
      const result = executeTransition(state.briefs, briefId, 'payDeposit', CLIENT_USER);
      // 2. Surcharger avec le projectId fourni (si le moteur en a généré un différent)
      const briefs = result.briefs.map(b =>
        b.id === briefId && result.success
          ? { ...b, linkedProjectId: projectId }
          : b
      );
      return { briefs };
    });
  },

  cancelBrief: (id) => {
    set(state => {
      const result = executeTransition(state.briefs, id, 'cancel', CLIENT_USER);
      return { briefs: result.briefs };
    });
  },

  expireBrief: (id) => {
    set(state => {
      const result = executeTransition(state.briefs, id, 'expire', SYSTEM_USER);
      return { briefs: result.briefs };
    });
  },

  duplicateBrief: (id) => {
    const source = get().briefs.find(b => b.id === id);
    if (!source) return id;

    // La transition 'duplicate' valide que le brief est CANCELLED ou EXPIRED
    const { result } = applyTransition(source as any, 'duplicate', CLIENT_USER);
    if (!result.success) {
      console.warn(`[BriefArtisan] Duplication refusée: ${result.error}`);
      return id;
    }

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
    set(state => {
      const result = executeTransition(state.briefs, id, 'relance', CLIENT_USER);
      return { briefs: result.briefs };
    });
  },
    }),
    {
      name: 'dedco-briefs-artisan',
    }
  )
);
