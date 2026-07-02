"use client";

import { useEffect, useCallback } from "react";
import { useDedcoStore, type AppRoute } from "@/lib/store";
import type { Route } from "@/lib/dedco-types";
import {
  Navbar,
  BottomNav,
  Footer,
} from "@/components/dedco/layout";
import { DedcoRouter, isDashboardPage } from "@/components/dedco/dedco-router";
import { CartSidebar, SearchOverlay } from "@/components/dedco/cart-search";
import { WelcomePopup } from "@/components/dedco/welcome-popup";

// ============================================================
// Bridge helpers: AppRoute ↔ Route
// ============================================================

function appRouteToRoute(ar: AppRoute): Route {
  const map: Record<string, Route> = {
    home: { name: "home" },
    marketplace: { name: "marketplace" },
    "marketplace-category": { name: "marketplace" },
    inspirations: { name: "inspirations" },
    artisans: { name: "marketplace" },
    designers: { name: "designers" },
    magazine: { name: "magazine" },
    favorites: { name: "favorites" },
    brief: { name: "brief" },
    "brief-create": { name: "brief" },
    "brief-detail": { name: "brief" },
  };

  if (ar.page === "product") return { name: "product", id: ar.id };
  if (ar.page === "scene") return { name: "scene", slug: ar.slug };
  if (ar.page === "artisan") return { name: "artisan", id: ar.id };
  if (ar.page === "designer") return { name: "designer", id: ar.id };

  return map[ar.page] ?? { name: "home" };
}

function routeToAppRoute(r: Route): AppRoute {
  switch (r.name) {
    case "home": return { page: "home" };
    case "marketplace": return { page: "marketplace" };
    case "product": return { page: "product", id: r.id };
    case "inspirations": return { page: "inspirations" };
    case "scene": return { page: "scene", slug: r.slug };
    case "artisan": return { page: "artisan", id: r.id };
    case "designers": return { page: "designers" };
    case "designer": return { page: "designer", id: r.id };
    case "magazine": return { page: "magazine" };
    case "favorites": return { page: "favorites" };
    case "brief": return { page: "brief" };
    default: return { page: "home" };
  }
}

// ============================================================
// Root Page — single route, internal SPA routing via Zustand
// ============================================================

export default function Home() {
  const route = useDedcoStore((s) => s.route);
  const navigate = useDedcoStore((s) => s.navigate);
  const goBack = useDedcoStore((s) => s.goBack);
  const cart = useDedcoStore((s) => s.cart);
  const favorites = useDedcoStore((s) => s.favorites);
  const cartOpen = useDedcoStore((s) => s.cartOpen);
  const searchOpen = useDedcoStore((s) => s.searchOpen);
  const setCartOpen = useDedcoStore((s) => s.setCartOpen);
  const setSearchOpen = useDedcoStore((s) => s.setSearchOpen);
  const incrementCart = useDedcoStore((s) => s.incrementCart);
  const decrementCart = useDedcoStore((s) => s.decrementCart);
  const removeFromCart = useDedcoStore((s) => s.removeFromCart);
  const currentUser = useDedcoStore((s) => s.currentUser);

  const navigateBridge = useCallback(
    (r: Route) => navigate(routeToAppRoute(r)),
    [navigate],
  );

  const legacyRoute = appRouteToRoute(route);
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  // ── Pages qui s'affichent DANS un dashboard (sidebar + header mobile) ──
  // Pour ces pages, on masque la navbar publique + bottom-nav + footer :
  // ils créeraient un double header et un chevauchement sur mobile.
  const SHARED_DASHBOARD_PAGES = new Set(["messages", "notifications"]);
  const isWrappedInDashboard =
    isDashboardPage(route.page) ||
    (SHARED_DASHBOARD_PAGES.has(route.page) && !!currentUser);
  const showPublicNav = !isWrappedInDashboard;

  useEffect(() => {
    // Ne scrolle pas en haut quand on est dans un dashboard : la sidebar
    // est sticky et le scroll interne des pages doit être préservé.
    if (isWrappedInDashboard) return;
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [route, isWrappedInDashboard]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-cream)" }}>
      {showPublicNav && (
        <Navbar
          currentRoute={legacyRoute}
          onNavigate={navigateBridge}
          cartCount={cartCount}
          favCount={favorites.length}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenCart={() => setCartOpen(true)}
          onOpenFavorites={() => navigate({ page: "favorites" })}
        />
      )}

      {/* Plus de pb-16 sur main quand on est en dashboard : la sidebar gère
          son propre scroll et le bottom-nav public est masqué. */}
      <main className={`flex-1 ${showPublicNav ? "pb-16 lg:pb-0" : ""}`}>
        <DedcoRouter />
      </main>

      {showPublicNav && <Footer onNavigate={navigateBridge} />}
      {showPublicNav && <BottomNav currentRoute={legacyRoute} onNavigate={navigateBridge} />}

      {/* Welcome popup + Cookie banner */}
      <WelcomePopup onNavigate={(page) => navigate({ page: page as any })} />

      {showPublicNav && (
        <CartSidebar
          open={cartOpen}
          items={cart}
          onClose={() => setCartOpen(false)}
          onIncrement={incrementCart}
          onDecrement={decrementCart}
          onRemove={removeFromCart}
        />
      )}

      {showPublicNav && (
        <SearchOverlay
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSearch={(query) => {
            setSearchOpen(false);
            navigate({ page: "search", query });
          }}
          onOpenProduct={() => {}}
          onNavigateMarketplace={() => navigate({ page: "marketplace" })}
        />
      )}
    </div>
  );
}
