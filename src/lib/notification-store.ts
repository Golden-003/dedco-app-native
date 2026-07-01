// ============================================================
// DEDCO — Store Notifications
// Centre de notifications pour client / artisan / designer
// ============================================================

import { create } from 'zustand';

export type NotificationType =
  | 'brief_artisan'      // Proposition reçue, brief publié, etc.
  | 'brief_designer'     // Designer a accepté, prestation reçue, etc.
  | 'project'            // Statut projet changé, modification proposée
  | 'message'            // Nouveau message
  | 'payment'            // Paiement effectué, paiement reçu
  | 'delivery'           // Livraison, réception à confirmer
  | 'review'             // Avis demandé
  | 'system'             // Système, promo, admin
  | 'litige';            // Litige ouvert, résolu

export interface DedcoNotification {
  id: string;
  type: NotificationType;
  title: string;
  desc: string;
  time: string;          // ex: "Il y a 2h", "Hier", "Il y a 3j"
  read: boolean;
  // Route de navigation au clic (optionnel)
  route?: { page: string; id?: string; briefId?: string; projectId?: string; orderId?: string; designerId?: number };
  // ID du projet/brief lié (pour le linking)
  linkedId?: string;
}

// ── Mocks initiaux ──

const MOCK_NOTIFICATIONS: DedcoNotification[] = [
  {
    id: 'NOT-001',
    type: 'brief_artisan',
    title: '3 propositions reçues — Dressing sur mesure',
    desc: 'Kofi Akindélé, Brice Gogan et Emile Agossou ont répondu à votre brief BA-001.',
    time: 'Il y a 2h',
    read: false,
    route: { page: 'brief-artisan-detail', briefId: 'BA-001' },
    linkedId: 'BA-001',
  },
  {
    id: 'NOT-002',
    type: 'payment',
    title: 'Paiement à effectuer — Fauteuil Sahel Tressé',
    desc: 'Proposition d\'Atelier Kossi sélectionnée. Payez 248 675 FCFA pour démarrer la fabrication.',
    time: 'Il y a 5h',
    read: false,
    route: { page: 'projet-paiement-artisan', projectId: 'BA-003' },
    linkedId: 'BA-003',
  },
  {
    id: 'NOT-003',
    type: 'brief_designer',
    title: 'Aminata Design a accepté votre demande',
    desc: 'Prestation Standard — 350 000 FCFA. Payez pour confirmer la mission.',
    time: 'Hier',
    read: false,
    route: { page: 'brief-designer-detail', briefId: 'BD-001' },
    linkedId: 'BD-001',
  },
  {
    id: 'NOT-004',
    type: 'project',
    title: 'Modification proposée — Fauteuil Sahel Tressé',
    desc: 'Amara Dossou propose un changement de matériau. Impact : +15 000 FCFA, +4 jours.',
    time: 'Hier',
    read: false,
    route: { page: 'projet-artisan-detail', projectId: 'PA-001' },
    linkedId: 'PA-001',
  },
  {
    id: 'NOT-005',
    type: 'delivery',
    title: 'Livraison à confirmer — Lampe Abat-jour Bogolan',
    desc: 'Votre lampe a été livrée. Confirmez la réception pour libérer le paiement à l\'artisan.',
    time: 'Il y a 1j',
    read: false,
    route: { page: 'projet-artisan-detail', projectId: 'PA-002' },
    linkedId: 'PA-002',
  },
  {
    id: 'NOT-006',
    type: 'message',
    title: 'Nouveau message de Rachelle Interior',
    desc: '« Votre livrable est prêt. Vous pouvez le consulter dans votre espace projet. »',
    time: 'Il y a 2j',
    read: true,
    route: { page: 'messages' },
  },
  {
    id: 'NOT-007',
    type: 'review',
    title: 'Avis demandé — Canapé personnalisé Cotonou',
    desc: 'Votre avis sur votre dernière commande serait précieux pour la communauté.',
    time: 'Il y a 3j',
    read: true,
    route: { page: 'avis-livraison', orderId: 'PA-010' },
    linkedId: 'PA-010',
  },
  {
    id: 'NOT-008',
    type: 'system',
    title: '3 nouveaux artisans vérifiés',
    desc: 'Brice Gogan (N2), Fatou Loko (N1) et Atelier Kossi (N3) ont rejoint Dedco.',
    time: 'Il y a 5j',
    read: true,
    route: { page: 'artisans' },
  },
  {
    id: 'NOT-009',
    type: 'litige',
    title: 'Litige résolu — Étagère murale',
    desc: 'Dedco a rendu sa décision. Remboursement partiel de 60 000 FCFA accordé.',
    time: 'Il y a 1 sem',
    read: true,
    route: { page: 'litige', id: 'REC-001' },
    linkedId: 'REC-001',
  },
  {
    id: 'NOT-010',
    type: 'payment',
    title: 'Paiement confirmé — Plan d\'aménagement salon',
    desc: 'Votre paiement de 253 750 FCFA a été reçu. Le designer démarre votre prestation.',
    time: 'Il y a 1 sem',
    read: true,
    route: { page: 'projet-designer-detail', projectId: 'PD-010' },
    linkedId: 'PD-010',
  },
];

// ── Store ──

interface NotificationState {
  notifications: DedcoNotification[];
  unreadCount: number;

  getNotifications: () => DedcoNotification[];
  addNotification: (notif: Omit<DedcoNotification, 'id' | 'read' | 'time'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

function generateId(): string {
  return `NOT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function timeAgo(): string {
  return "À l'instant";
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length,

  getNotifications: () => get().notifications,

  addNotification: (notif) => {
    const newNotif: DedcoNotification = {
      ...notif,
      id: generateId(),
      read: false,
      time: timeAgo(),
    };
    set(state => ({
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) => {
    set(state => {
      const notifications = state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter(n => !n.read).length,
      };
    });
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  deleteNotification: (id) => {
    set(state => {
      const notif = state.notifications.find(n => n.id === id);
      const notifications = state.notifications.filter(n => n.id !== id);
      return {
        notifications,
        unreadCount: notif && !notif.read ? state.unreadCount - 1 : state.unreadCount,
      };
    });
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
