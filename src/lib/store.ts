import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from './dedco-types';

// ============================================================
// Logical back route — défini ici (pas dans back-to-projets.ts) pour
// éviter une dépendance circulaire (back-to-projets.ts importe AppRoute
// depuis ce fichier).
// ============================================================

/**
 * Retourne le PARENT LOGIQUE d'une page — utilisé quand l'historique est vide
 * (refresh, arrivée directe par URL) pour que le bouton "Retour" aille à un
 * endroit qui fait sens plutôt qu'à home par défaut.
 */
function getLogicalBackRoute(currentRoute: AppRoute): AppRoute {
  const page = currentRoute.page;

  // Détails catalogue → listings
  if (page === "product") return { page: "marketplace" };
  if (page === "scene") return { page: "inspirations" };
  if (page === "artisan") return { page: "marketplace" };
  if (page === "designer") return { page: "designers" };
  if (page === "article") return { page: "magazine" };

  // Briefs & projets → mes projets
  if (page === "brief-detail" || page === "brief-create" || page === "brief-list")
    return { page: "brief-list" };
  if (page === "brief-artisan-detail" || page === "brief-designer-detail")
    return { page: "client-projets" };
  if (page === "artisan-brief-recu" || page === "artisan-devis-create")
    return { page: "artisan-demandes" };
  if (page === "designer-brief-recu" || page === "designer-proposition-mission")
    return { page: "designer-briefs" };

  // Projets → mes projets
  if (
    page === "projet-detail" ||
    page === "projet-livraison" ||
    page === "projet-paiement" ||
    page === "projet-paiement-artisan" ||
    page === "projet-artisan-detail" ||
    page === "projet-designer-detail" ||
    page === "client-proposition-recue" ||
    page === "designer-projet-attente"
  )
    return { page: "client-projets" };

  // Commandes → historique
  if (page === "order-tracking" || page === "order-confirmation" || page === "invoice")
    return { page: "order-history" };
  if (page === "payment") return { page: "checkout" };

  // Pages compte client → home
  if (
    page === "profile" ||
    page === "wallet" ||
    page === "kyc" ||
    page === "settings" ||
    page === "notifications" ||
    page === "messages" ||
    page === "moodboard" ||
    page === "favorites" ||
    page === "search" ||
    page === "litige"
  )
    return { page: "home" };

  // Pages auth → home
  if (page === "login" || page === "register" || page === "forgot-password" || page === "onboarding")
    return { page: "home" };

  // Pages statiques → home
  if (page === "about" || page === "become-artisan" || page === "help-center" || page === "plans-tarifs")
    return { page: "home" };

  // Défaut : home
  return { page: "home" };
}

// ============================================================
// Order System — vraies commandes persistées
// ============================================================

export type OrderStatus = 'payé' | 'en_fabrication' | 'expédié' | 'livré' | 'litige';

export type OrderType = 'marketplace' | 'custom';

export interface OrderItem {
  productId: number;
  name: string;
  artisanId: number;
  artisanName: string;
  price: number;
  qty: number;
  color?: string;
  image: string;
  dimensions?: string;
}

export interface OrderDelivery {
  firstName: string;
  lastName: string;
  phone: string;
  ville: string;
  quartier: string;
  indication?: string;
}

export interface Order {
  id: string;
  invoiceId: string;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  garantie: number;
  total: number;
  paymentMethod: string;
  paymentRef: string;
  delivery: OrderDelivery;
  createdAt: string;       // ISO
  deliveredAt?: string;    // ISO — set when status becomes 'livré'
  timeline: { label: string; date: string; done: boolean }[];
}

// ============================================================
// AppRoute — internal SPA routing (72+ pages on single / route)
// ============================================================

export type AppRoute =
  | { page: 'home' }
  | { page: 'marketplace' }
  | { page: 'marketplace-category'; category: string }
  | { page: 'product'; id: number }
  | { page: 'inspirations' }
  | { page: 'scene'; slug: string }
  | { page: 'artisans' }
  | { page: 'artisan'; id: number }
  | { page: 'designers' }
  | { page: 'designer'; id: number }
  | { page: 'magazine' }
  | { page: 'article'; id: number }
  | { page: 'login' }
  | { page: 'register' }
  | { page: 'forgot-password' }
  | { page: 'cart' }
  | { page: 'checkout' }
  | { page: 'payment'; orderId: string }
  | { page: 'order-tracking'; id: string }
  | { page: 'favorites' }
  | { page: 'profile' }
  | { page: 'wallet' }
  | { page: 'kyc' }
  | { page: 'artisan-dashboard' }
  | { page: 'artisan-products' }
  | { page: 'artisan-orders' }
  | { page: 'artisan-profile' }
  | { page: 'artisan-stats' }
  | { page: 'designer-dashboard' }
  | { page: 'designer-projects' }
  | { page: 'designer-briefs' }
  | { page: 'designer-profile' }
  | { page: 'designer-settings' }
  | { page: 'admin-dashboard' }
  | { page: 'admin-users' }
  | { page: 'admin-products' }
  | { page: 'admin-orders' }
  | { page: 'admin-analytics' }
  | { page: 'admin-content' }
  | { page: 'maison-dashboard' }
  | { page: 'messages'; conversationId?: string }
  | { page: 'litige'; id: string }
  | { page: 'moodboard' }
  | { page: 'search'; query?: string }
  | { page: 'onboarding'; step?: number }
  | { page: 'brief' }
  | { page: 'brief-list' }
  | { page: 'brief-create' }
  | { page: 'brief-detail'; id: number }
  | { page: 'order-history' }
  | { page: 'settings' }
  | { page: 'notifications' }
  | { page: 'help-center' }
  | { page: 'about' }
  | { page: 'become-artisan' }
  // ── ARTISAN extended (BLOC 4)
  | { page: 'artisan-demandes' }
  | { page: 'artisan-projets' }
  | { page: 'artisan-wallet' }
  | { page: 'artisan-avis' }
  | { page: 'artisan-certification' }
  | { page: 'artisan-abonnement' }
  | { page: 'artisan-parametres' }
  // ── ADMIN extended (BLOC 4)
  | { page: 'admin-kyc' }
  | { page: 'admin-messages' }
  | { page: 'admin-litiges'; id?: string }
  | { page: 'admin-scenes' }
  | { page: 'admin-collections' }
  | { page: 'admin-certification' }
  | { page: 'admin-parametres' }
  // ── DESIGNER extended (BLOC 4)
  | { page: 'designer-wallet' }
  | { page: 'designer-portfolio' }
  | { page: 'designer-abonnement' }
  // ── CLIENT (BLOC 4)
  | { page: 'client-projets' }
  | { page: 'brief-designer'; designerId: number }
  | { page: 'plans-tarifs' }
  // ── DESIGNER WORKFLOW (version simplifiée)
  | { page: 'designer-projet-attente'; projectId: string }
  | { page: 'designer-brief-recu'; briefId: string }
  | { page: 'designer-proposition-mission'; briefId: string }
  | { page: 'client-proposition-recue'; proposalId: string }
  | { page: 'projet-paiement'; proposalId: string }
  | { page: 'projet-detail'; projectId: string }
  | { page: 'projet-livraison'; projectId: string }
  // ── ORDER SYSTEM (commande, facture, suivi)
  | { page: 'order-confirmation'; orderId: string }
  | { page: 'invoice'; orderId: string }
  // ── ARTISAN BRIEF WORKFLOW
  | { page: 'artisan-brief-recu'; briefId: string }
  | { page: 'artisan-devis-create'; briefId: string }
  | { page: 'projet-artisan-detail'; projectId: string }
  // ── PROJET DESIGNER DETAIL (séparé de l'artisan)
  | { page: 'projet-designer-detail'; projectId: string }
  // ── PAIEMENT ARTISAN (séparé du paiement designer)
  | { page: 'projet-paiement-artisan'; proposalId: string }
  // ── BRIEF ARTISAN DÉTAIL (machine d'états)
  | { page: 'brief-artisan-detail'; briefId: string }
  // ── BRIEF DESIGNER DÉTAIL (machine d'états)
  | { page: 'brief-designer-detail'; briefId: string };

// ============================================================
// ProjectScope — niveau de projet (pivot économique simplifié)
// ============================================================

export type ProjectScope = "prototype" | "standard" | "premium";

// ============================================================
// CurrentUser — distinguishes visitor vs logged-in (client/artisan/designer/admin/maison)
// ============================================================

export type UserRole = "client" | "artisan" | "designer" | "admin" | "maison";

export interface CurrentUser {
  role: UserRole;
  name: string;
  email: string;
  avatar: string;
}

// ============================================================
// Store State & Actions
// ============================================================

interface DedcoState {
  route: AppRoute;
  history: AppRoute[];
  cart: CartItem[];
  favorites: number[];
  savedScenes: string[];
  cartOpen: boolean;
  searchOpen: boolean;
  currentUser: CurrentUser | null;
  orders: Order[];

  // ── UI state persisté (survit aux navigations) ──
  // Mes Projets : onglet actif + briefs dépliés
  mesProjetsActiveTab: string;
  mesProjetsExpandedBriefs: string[];  // briefIds
  setMesProjetsActiveTab: (tab: string) => void;
  toggleMesProjetsBrief: (briefId: string) => void;

  // Navigation
  navigate: (route: AppRoute) => void;
  goBack: () => void;

  // Auth
  login: (user: CurrentUser) => void;
  logout: () => void;

  // Cart
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  incrementCart: (id: number) => void;
  decrementCart: (id: number) => void;
  clearCart: () => void;

  // Favorites
  toggleFavorite: (productId: number) => void;

  // Scenes
  toggleSceneSave: (slug: string) => void;

  // Overlay toggles
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;

  // Orders
  placeOrder: (input: {
    items: OrderItem[];
    delivery: OrderDelivery;
    paymentMethod: string;
    type: OrderType;
  }) => string; // returns orderId
  getOrder: (orderId: string) => Order | undefined;
  markOrderDelivered: (orderId: string) => void;
}

// ============================================================
// Zustand Store
// ============================================================

export const useDedcoStore = create<DedcoState>()(
  persist(
    (set, get) => ({
  // ── Initial State ──
  route: { page: 'home' },
  history: [],
  cart: [],
  favorites: [2, 10, 16], // pre-populated for demo
  savedScenes: [],
  cartOpen: false,
  searchOpen: false,
  currentUser: null,
  orders: [],

  // ── UI state persisté ──
  mesProjetsActiveTab: "en_cours",
  mesProjetsExpandedBriefs: [],
  setMesProjetsActiveTab: (tab) => set({ mesProjetsActiveTab: tab }),
  toggleMesProjetsBrief: (briefId) => set((state) => {
    const expanded = state.mesProjetsExpandedBriefs.includes(briefId);
    return {
      mesProjetsExpandedBriefs: expanded
        ? state.mesProjetsExpandedBriefs.filter(id => id !== briefId)
        : [...state.mesProjetsExpandedBriefs, briefId],
    };
  }),

  // ── Navigation ──
  // navigate : pousse la route actuelle dans l'historique AVANT de changer.
  // Garde les 15 dernières entrées seulement (sinon la pile grossit indéfiniment
  // et goBack peut remonter trop loin).
  // Ignore les navigations vers la même page (ex: double-clic sur un lien).
  navigate: (route) => {
    const { route: currentRoute, history } = get();
    // Ne rien faire si on navigue vers la page actuelle
    if (JSON.stringify(currentRoute) === JSON.stringify(route)) return;
    const newHistory = [...history, currentRoute].slice(-15);
    set({
      history: newHistory,
      route,
    });
  },

  // goBack : remonte d'une entrée dans l'historique.
  // Si l'historique est vide, utilise le parent logique de la page actuelle
  // (ex: product → marketplace, brief-detail → brief-list) ou home en dernier recours.
  goBack: () => {
    const { history, route } = get();
    if (history.length === 0) {
      // Pas d'historique → aller au parent logique
      const parent = getLogicalBackRoute(route);
      set({ route: parent });
      return;
    }
    const prev = history[history.length - 1];
    set({
      route: prev,
      history: history.slice(0, -1),
    });
  },

  // ── Auth ──
  login: (user) => set({ currentUser: user }),
  logout: () => {
    set({ currentUser: null, route: { page: 'home' } });
  },

  // ── Cart ──
  addToCart: (item) => {
    set((state) => {
      const existing = state.cart.find(
        (x) => x.id === item.id && x.selectedColor === item.selectedColor,
      );
      if (existing) {
        return {
          cart: state.cart.map((x) =>
            x.id === item.id && x.selectedColor === item.selectedColor
              ? { ...x, qty: x.qty + item.qty }
              : x,
          ),
          cartOpen: true,
        };
      }
      return { cart: [...state.cart, item], cartOpen: true };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((x) => x.id !== productId),
    }));
  },

  incrementCart: (id) => {
    set((state) => ({
      cart: state.cart.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)),
    }));
  },

  decrementCart: (id) => {
    set((state) => ({
      cart: state.cart
        .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0),
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  },

  // ── Favorites ──
  toggleFavorite: (productId) => {
    set((state) => {
      const set_ = new Set(state.favorites);
      if (set_.has(productId)) {
        set_.delete(productId);
      } else {
        set_.add(productId);
      }
      return { favorites: [...set_] };
    });
  },

  // ── Scene Saves ──
  toggleSceneSave: (slug) => {
    set((state) => {
      const set_ = new Set(state.savedScenes);
      if (set_.has(slug)) {
        set_.delete(slug);
      } else {
        set_.add(slug);
      }
      return { savedScenes: [...set_] };
    });
  },

  // ── Overlay Toggles ──
  setCartOpen: (open) => set({ cartOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),

  // ── Orders ──
  placeOrder: ({ items, delivery, paymentMethod, type }) => {
    // Génère un ID de commande unique
    const seq = Math.floor(1000 + Math.random() * 9000);
    const orderId = `CMD-2026-${seq}`;
    const invoiceId = `FAC-2026${String(new Date().getMonth() + 1).padStart(2, '0')}-${seq}`;
    const paymentRef = `FEDAPAY-TX-${Date.now().toString().slice(-9)}`;
    const now = new Date();
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const shipping = items.length > 0 ? 5000 : 0;
    const garantie = Math.round(subtotal * 0.015);
    const total = subtotal + shipping + garantie;

    // Pour les commandes marketplace, on simule une expédition immédiate :
    // le statut démarre à 'payé' et la timeline s'étale sur 3 jours.
    // (Pour custom, on démarre en 'en_fabrication'.)
    const initialStatus: OrderStatus = type === 'custom' ? 'en_fabrication' : 'payé';

    // Pour la démo, on pré-remplit une timeline complète (toutes étapes
    // marquées done: false sauf la 1ère). Le statut « livré » ne sera
    // déclenché que via markOrderDelivered (manuel pour l'instant).
    const timeline = type === 'custom'
      ? [
          { label: 'Paiement confirmé', date: now.toLocaleString('fr-FR'), done: true },
          { label: 'Fabrication en atelier', date: 'En cours', done: false },
          { label: 'T1 — Produit prêt', date: 'À venir', done: false },
          { label: 'T2 — En transit', date: 'À venir', done: false },
          { label: 'T3 — Remis au client', date: 'À venir', done: false },
        ]
      : [
          { label: 'Paiement confirmé', date: now.toLocaleString('fr-FR'), done: true },
          { label: 'Préparation de l\'expédition', date: 'À venir', done: false },
          { label: 'Expédié', date: 'À venir', done: false },
          { label: 'Livré', date: 'À venir', done: false },
        ];

    const newOrder: Order = {
      id: orderId,
      invoiceId,
      type,
      status: initialStatus,
      items,
      subtotal,
      shipping,
      garantie,
      total,
      paymentMethod,
      paymentRef,
      delivery,
      createdAt: now.toISOString(),
      timeline,
    };

    set((state) => ({ orders: [newOrder, ...state.orders] }));
    return orderId;
  },

  getOrder: (orderId) => {
    return get().orders.find((o) => o.id === orderId);
  },

  markOrderDelivered: (orderId) => {
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== orderId) return o;
        const deliveredAt = new Date().toISOString();
        // Toutes les étapes de la timeline deviennent done: true
        return {
          ...o,
          status: 'livré' as OrderStatus,
          deliveredAt,
          timeline: o.timeline.map((t) => ({
            ...t,
            done: true,
            date: t.date === 'À venir' || t.date === 'En cours'
              ? new Date().toLocaleString('fr-FR')
              : t.date,
          })),
        };
      }),
    }));
  },
    }),
    {
      name: 'dedco-storage',
      // Persist uniquement les données utilisateur, pas l'état UI éphémère
      partialize: (state) => ({
        cart: state.cart,
        favorites: state.favorites,
        savedScenes: state.savedScenes,
        currentUser: state.currentUser,
        orders: state.orders,
      }),
    }
  )
);