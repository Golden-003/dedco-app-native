// ============================================================
// DEDCO — Store Notifications
// Centre de notifications pour client / artisan / designer
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType =
  | 'brief_artisan'      // Proposition reçue, brief publié, etc.
  | 'brief_designer'     // Designer a accepté, prestation reçue, etc.
  | 'project'            // Statut projet changé, modification proposée
  | 'message'            // Nouveau message
  | 'payment'            // Paiement effectué, paiement reçu
  | 'delivery'           // Livraison, réception à confirmer
  | 'review'             // Avis demandé
  | 'system'             // Système, promo, admin
  | 'litige'             // Litige ouvert, résolu
  | 'order';             // Commande passée, confirmée, expédiée

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

// Notifications spécifiques par rôle
const ARTISAN_NOTIFICATIONS: DedcoNotification[] = [
  {
    id: 'ART-NOT-001',
    type: 'brief_artisan',
    title: 'Nouveau brief reçu — Dressing sur mesure',
    desc: 'Un client a publié un brief dans votre catégorie. Répondez avant 48h.',
    time: 'Il y a 1h',
    read: false,
    route: { page: 'artisan-brief-recu', briefId: 'BA-001' },
    linkedId: 'BA-001',
  },
  {
    id: 'ART-NOT-002',
    type: 'order',
    title: 'Nouvelle commande — Fauteuil Sahel',
    desc: 'Commande CMD-2026-4521 reçue. Montant : 125 000 FCFA. Délai : 18 jours.',
    time: 'Il y a 3h',
    read: false,
    route: { page: 'artisan-orders' },
  },
  {
    id: 'ART-NOT-003',
    type: 'payment',
    title: 'Paiement reçu — Table Iroko',
    desc: 'Acompte de 75 000 FCFA reçu pour la commande CMD-2026-4518. Démarrez la fabrication.',
    time: 'Hier',
    read: false,
    route: { page: 'artisan-orders' },
  },
  {
    id: 'ART-NOT-004',
    type: 'message',
    title: 'Message client — Sophie K.',
    desc: '« Pouvez-vous ajouter un tiroir ? »',
    time: 'Hier',
    read: true,
    route: { page: 'messages' },
  },
  {
    id: 'ART-NOT-005',
    type: 'system',
    title: 'Votre niveau a été mis à jour',
    desc: 'Félicitations ! Vous êtes passé au niveau N3. Plus de visibilité sur la marketplace.',
    time: 'Il y a 3j',
    read: true,
    route: { page: 'artisan-profile' },
  },
];

const DESIGNER_NOTIFICATIONS: DedcoNotification[] = [
  {
    id: 'DES-NOT-001',
    type: 'brief_designer',
    title: 'Nouveau brief designer reçu',
    desc: 'Un client demande un aménagement de salon. Budget : 300 000-500 000 FCFA.',
    time: 'Il y a 2h',
    read: false,
    route: { page: 'designer-briefs' },
  },
  {
    id: 'DES-NOT-002',
    type: 'payment',
    title: 'Paiement reçu — Plan salon',
    desc: 'Acompte de 150 000 FCFA reçu. Le projet peut démarrer.',
    time: 'Il y a 5h',
    read: false,
    route: { page: 'designer-projects' },
  },
  {
    id: 'DES-NOT-003',
    type: 'message',
    title: 'Message client — Marc A.',
    desc: '« Le moodboard me plaît beaucoup ! »',
    time: 'Hier',
    read: false,
    route: { page: 'messages' },
  },
  {
    id: 'DES-NOT-004',
    type: 'review',
    title: 'Avis 5 étoiles reçu',
    desc: 'Sophie K. a laissé un avis sur votre prestation. Excellent travail !',
    time: 'Il y a 2j',
    read: true,
    route: { page: 'designer-profile' },
  },
];

const ADMIN_NOTIFICATIONS: DedcoNotification[] = [
  {
    id: 'ADM-NOT-001',
    type: 'system',
    title: '3 KYC en attente de validation',
    desc: 'Brice Gogan, Fatou Loko et Atelier Kossi attendent validation.',
    time: 'Il y a 1h',
    read: false,
    route: { page: 'admin-kyc' },
  },
  {
    id: 'ADM-NOT-002',
    type: 'litige',
    title: 'Nouveau litige ouvert — CMD-2026-4520',
    desc: 'Client demande remboursement. Montant : 85 000 FCFA.',
    time: 'Il y a 4h',
    read: false,
    route: { page: 'admin-litiges' },
  },
  {
    id: 'ADM-NOT-003',
    type: 'system',
    title: 'Pic de trafic détecté',
    desc: '+47% de visiteurs aujourd\'hui. 1 247 utilisateurs actifs.',
    time: 'Hier',
    read: false,
    route: { page: 'admin-analytics' },
  },
  {
    id: 'ADM-NOT-004',
    type: 'system',
    title: '4 messages flaggés par modération',
    desc: 'Tentatives de contournement (numéros de téléphone détectés).',
    time: 'Il y a 2j',
    read: true,
    route: { page: 'admin-messages' },
  },
];

// Notifications spécifiques au CLIENT — parlent de SON expérience à lui,
// pas des internals plateforme (compte séquestre, libération de fonds,
// montant que l'artisan reçoit… → ça c'est pour l'artisan/admin).
const CLIENT_NOTIFICATIONS: DedcoNotification[] = [
  {
    id: 'CLI-NOT-001',
    type: 'delivery',
    title: 'Livraison en cours — Lampe Bogolan',
    desc: 'Votre commande est en route. Photos disponibles sur le suivi.',
    time: 'Il y a 1h',
    read: false,
    route: { page: 'projet-detail', projectId: 'PA-002' },
    linkedId: 'PA-002',
  },
  {
    id: 'CLI-NOT-002',
    type: 'delivery',
    title: 'Réception à confirmer — Lampe Bogolan',
    desc: 'Fatou Loko a livré votre commande. Confirmez la réception pour finaliser.',
    time: 'Il y a 3h',
    read: false,
    route: { page: 'projet-detail', projectId: 'PA-002' },
    linkedId: 'PA-002',
  },
  {
    id: 'CLI-NOT-003',
    type: 'message',
    title: 'Message de Fatou Loko',
    desc: '« Votre lampe est prête, je l\'apporte demain matin. »',
    time: 'Hier',
    read: false,
    route: { page: 'messages' },
  },
  {
    id: 'CLI-NOT-004',
    type: 'project',
    title: 'Mise à jour projet — Table basse Wax',
    desc: 'Kofi Akindélé a ajouté une photo de fabrication. Étape 2/4 complétée.',
    time: 'Hier',
    read: true,
    route: { page: 'projet-detail', projectId: 'PA-001' },
    linkedId: 'PA-001',
  },
  {
    id: 'CLI-NOT-005',
    type: 'payment',
    title: 'Acompte payé — Table basse Wax',
    desc: 'Votre acompte de 75 000 FCFA a bien été reçu. Le solde sera à payer à la livraison.',
    time: 'Il y a 3j',
    read: true,
    route: { page: 'order-history' },
  },
];

// ── Store ──

interface NotificationState {
  notifications: DedcoNotification[];
  unreadCount: number;

  getNotifications: () => DedcoNotification[];
  initForRole: (role: string) => void;
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

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
  notifications: [], // Sera peuplé dynamiquement selon le rôle
  unreadCount: 0,

  getNotifications: () => get().notifications,

  // Initialiser les notifications selon le rôle
  // IMPORTANT : on REMPLACE les notifs existantes à chaque appel, pas de guard.
  // Sinon : si l'utilisateur se connecte en artisan (démo) puis en client,
  // les notifs artisan restent affichées (persistées en localStorage).
  initForRole: (role: string) => {
    let notifs: DedcoNotification[] = [];
    if (role === 'artisan') notifs = ARTISAN_NOTIFICATIONS;
    else if (role === 'designer') notifs = DESIGNER_NOTIFICATIONS;
    else if (role === 'admin') notifs = ADMIN_NOTIFICATIONS;
    else if (role === 'client') notifs = CLIENT_NOTIFICATIONS;
    set({ notifications: notifs, unreadCount: notifs.filter(n => !n.read).length });
  },

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
    }),
    {
      name: 'dedco-notifications',
    }
  )
);
