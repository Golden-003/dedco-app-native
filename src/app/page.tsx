"use client";

import { useState, useEffect, useCallback } from "react";
import type { Route, CartItem } from "@/lib/dedco-types";
import {
  Navbar,
  BottomNav,
  Footer,
} from "@/components/dedco/layout";
import { HomePage } from "@/components/dedco/home-page";
import { MarketplacePage } from "@/components/dedco/marketplace-page";
import { ProductPage } from "@/components/dedco/product-page";
import { ScenePage } from "@/components/dedco/scene-page";
import {
  InspirationsPage,
  DesignersPage,
  DesignerDetailPage,
  ArtisanDetailPage,
  MagazinePage,
  FavoritesPage,
} from "@/components/dedco/other-pages";
import { BriefPage } from "@/components/dedco/brief-page";
import { CartSidebar, SearchOverlay } from "@/components/dedco/cart-search";

export default function Home() {
  const [route, setRoute] = useState<Route>({ name: "home" });
  const [history, setHistory] = useState<Route[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(
    new Set([2, 10, 16]),
  );
  const [savedScenes, setSavedScenes] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [route]);

  const navigate = useCallback(
    (next: Route) => {
      setHistory((h) => [...h, route]);
      setRoute(next);
    },
    [route],
  );

  const back = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) {
        setRoute({ name: "home" });
        return h;
      }
      const prev = h[h.length - 1];
      setRoute(prev);
      return h.slice(0, -1);
    });
  }, []);

  const toggleFav = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSaveScene = useCallback((slug: string) => {
    setSavedScenes((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (x) => x.id === item.id && x.selectedColor === item.selectedColor,
      );
      if (existing) {
        return prev.map((x) =>
          x.id === item.id && x.selectedColor === item.selectedColor
            ? { ...x, qty: x.qty + item.qty }
            : x,
        );
      }
      return [...prev, item];
    });
    setCartOpen(true);
  }, []);

  const incrementCart = useCallback((id: number) => {
    setCart((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)),
    );
  }, []);

  const decrementCart = useCallback((id: number) => {
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0),
    );
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  const renderRoute = () => {
    switch (route.name) {
      case "home":
        return (
          <HomePage
            onNavigate={navigate}
            favorites={favorites}
            toggleFav={toggleFav}
            savedScenes={savedScenes}
            toggleSaveScene={toggleSaveScene}
          />
        );
      case "marketplace":
        return (
          <MarketplacePage
            onNavigate={navigate}
            favorites={favorites}
            toggleFav={toggleFav}
          />
        );
      case "product":
        return (
          <ProductPage
            productId={route.id}
            onNavigate={navigate}
            onBack={back}
            favorites={favorites}
            toggleFav={toggleFav}
            onAddToCart={addToCart}
          />
        );
      case "scene":
        return (
          <ScenePage
            slug={route.slug}
            onNavigate={navigate}
            onBack={back}
            favorites={favorites}
            toggleFav={toggleFav}
            onAddToCart={addToCart}
          />
        );
      case "inspirations":
        return (
          <InspirationsPage
            onNavigate={navigate}
            savedScenes={savedScenes}
            toggleSaveScene={toggleSaveScene}
          />
        );
      case "designers":
        return <DesignersPage onNavigate={navigate} />;
      case "designer":
        return (
          <DesignerDetailPage
            designerId={route.id}
            onNavigate={navigate}
            onBack={back}
          />
        );
      case "artisan":
        return (
          <ArtisanDetailPage
            artisanId={route.id}
            onNavigate={navigate}
            onBack={back}
            favorites={favorites}
            toggleFav={toggleFav}
          />
        );
      case "magazine":
        return <MagazinePage />;
      case "brief":
        return <BriefPage onNavigate={navigate} onBack={back} />;
      case "favorites":
        return (
          <FavoritesPage
            onNavigate={navigate}
            favorites={favorites}
            toggleFav={toggleFav}
          />
        );
      default:
        return (
          <HomePage
            onNavigate={navigate}
            favorites={favorites}
            toggleFav={toggleFav}
            savedScenes={savedScenes}
            toggleSaveScene={toggleSaveScene}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-cream)" }}>
      <Navbar
        currentRoute={route}
        onNavigate={navigate}
        cartCount={cartCount}
        favCount={favorites.size}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onOpenFavorites={() => navigate({ name: "favorites" })}
      />

      <main className="flex-1 pb-16 lg:pb-0">{renderRoute()}</main>

      <Footer onNavigate={navigate} />
      <BottomNav currentRoute={route} onNavigate={navigate} />

      <CartSidebar
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onIncrement={incrementCart}
        onDecrement={decrementCart}
        onRemove={removeFromCart}
      />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={() => {
          navigate({ name: "marketplace" });
        }}
        onOpenProduct={() => {}}
        onNavigateMarketplace={() => navigate({ name: "marketplace" })}
      />
    </div>
  );
}
