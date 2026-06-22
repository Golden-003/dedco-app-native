import { create } from 'zustand';
import type { CartItem } from './dedco-types';

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
  | { page: 'brief-create' }
  | { page: 'brief-detail'; id: number }
  | { page: 'order-history' }
  | { page: 'settings' }
  | { page: 'notifications' }
  | { page: 'help-center' }
  | { page: 'about' }
  | { page: 'become-artisan' };

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

  // Navigation
  navigate: (route: AppRoute) => void;
  goBack: () => void;

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
}

// ============================================================
// Zustand Store
// ============================================================

export const useDedcoStore = create<DedcoState>((set, get) => ({
  // ── Initial State ──
  route: { page: 'home' },
  history: [],
  cart: [],
  favorites: [2, 10, 16], // pre-populated for demo
  savedScenes: [],
  cartOpen: false,
  searchOpen: false,

  // ── Navigation ──
  navigate: (route) => {
    const { route: currentRoute, history } = get();
    set({
      history: [...history, currentRoute],
      route,
    });
  },

  goBack: () => {
    const { history } = get();
    if (history.length === 0) {
      set({ route: { page: 'home' } });
      return;
    }
    const prev = history[history.length - 1];
    set({
      route: prev,
      history: history.slice(0, -1),
    });
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
}));