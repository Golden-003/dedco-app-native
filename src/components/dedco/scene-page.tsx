"use client";

import { useState } from "react";
import { Bookmark, Share2, ShoppingBag, X, ChevronRight } from "lucide-react";
import {
  getScene,
  getProduct,
  getDesigner,
  SCENES,
  formatFCFA,
} from "@/lib/dedco-data";
import type { Route, CartItem } from "@/lib/dedco-types";
import { BackButton } from "./layout";
import { ProductCard } from "./cards";

export function ScenePage({
  slug,
  onNavigate,
  onBack,
  favorites,
  toggleFav,
  onAddToCart,
}: {
  slug: string;
  onNavigate: (route: Route) => void;
  onBack: () => void;
  favorites: Set<number>;
  toggleFav: (id: number) => void;
  onAddToCart: (item: CartItem) => void;
}) {
  const scene = getScene(slug);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  if (!scene) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="font-display text-xl mb-4">Scène introuvable</p>
        <button onClick={onBack} className="dedco-btn dedco-btn-primary">
          Retour
        </button>
      </div>
    );
  }

  const designer = getDesigner(scene.designerId);
  const otherScenes = SCENES.filter((s) => s.slug !== scene.slug).slice(0, 4);

  return (
    <div className="dedco-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BackButton onBack={onBack} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 mb-12">
        {/* Scene with hotspots */}
        <div className="lg:col-span-3">
          <div className="relative rounded-xl overflow-hidden bg-warm" style={{ aspectRatio: "4 / 3" }}>
            <img
              src={scene.image}
              alt={scene.title}
              className="w-full h-full object-cover"
            />
            {/* Hotspots */}
            {scene.hotspots.map((h, idx) => {
              const product = getProduct(h.productId);
              if (!product) return null;
              const isActive = activeHotspot === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveHotspot(isActive ? null : idx)}
                  className="absolute z-10 group"
                  style={{
                    left: `${h.x}%`,
                    top: `${h.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  aria-label={`Voir le produit ${product.name}`}
                >
                  <span
                    className={`block rounded-full bg-white shadow-lg hotspot-dot ${
                      isActive ? "ring-4 ring-amber/40" : ""
                    }`}
                    style={{
                      width: 28,
                      height: 28,
                      border: "2px solid var(--amber)",
                    }}
                  />
                  <span
                    className="absolute left-1/2 top-full mt-1 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-semibold bg-ink text-white whitespace-nowrap pointer-events-none"
                  >
                    {formatFCFA(product.price)}
                  </span>
                </button>
              );
            })}
            {/* Save & share */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                type="button"
                onClick={() => setIsSaved((s) => !s)}
                className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur transition-all ${
                  isSaved
                    ? "bg-white text-amber"
                    : "bg-white/60 text-ink hover:bg-white"
                }`}
                aria-label={isSaved ? "Retirer des favoris" : "Sauvegarder"}
              >
                <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/60 text-ink hover:bg-white backdrop-blur"
                aria-label="Partager"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
          <p className="text-xs text-ink-mute mt-2 text-center">
            Cliquez sur les points pour découvrir les produits de cette scène
          </p>
        </div>

        {/* Sidebar info */}
        <div className="lg:col-span-2">
          <div className="dedco-card p-5 sm:p-6">
            <span className="dedco-badge dedco-badge-amber mb-3">
              {scene.room}
            </span>
            <h1 className="display-md mb-2">{scene.title}</h1>
            <p className="text-sm text-ink-soft mb-4">Style : {scene.style}</p>

            <div className="flex flex-wrap gap-2 mb-5">
              {scene.tags.map((tag) => (
                <span key={tag} className="dedco-badge dedco-badge-gray">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-border mb-4">
              <div>
                <p className="text-xs text-ink-mute uppercase tracking-wide mb-1">
                  Saves
                </p>
                <p className="font-display font-bold text-lg">
                  {scene.saves}
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-mute uppercase tracking-wide mb-1">
                  Produits
                </p>
                <p className="font-display font-bold text-lg">
                  {scene.hotspots.length}
                </p>
              </div>
            </div>

            {designer && (
              <div className="py-4 border-t border-border">
                <p className="text-xs text-ink-mute uppercase tracking-wide mb-2">
                  Scène imaginée par
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate({ name: "designer", id: designer.id })
                  }
                  className="flex items-center gap-3 w-full text-left hover:bg-warm -mx-2 px-2 py-2 rounded-md transition-colors"
                >
                  <img
                    src={designer.avatar}
                    alt={designer.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{designer.name}</p>
                    <p className="text-xs text-ink-mute">{designer.style}</p>
                  </div>
                  <ChevronRight size={16} className="text-ink-mute" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => onNavigate({ name: "brief" })}
              className="dedco-btn dedco-btn-primary w-full mt-2"
            >
              <ShoppingBag size={18} /> Commander cette scène
            </button>
          </div>
        </div>
      </div>

      {/* Products in this scene */}
      <section className="mb-12">
        <h2 className="display-md mb-4">
          Shop the Look — {scene.hotspots.length} produits
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {scene.hotspots.map((h, idx) => {
            const product = getProduct(h.productId);
            if (!product) return null;
            return (
              <ProductCard
                key={idx}
                product={product}
                isFav={favorites.has(product.id)}
                onToggleFav={toggleFav}
                onOpen={(id) => onNavigate({ name: "product", id })}
              />
            );
          })}
        </div>
      </section>

      {/* Other scenes */}
      <section>
        <h2 className="display-md mb-4">Autres scènes à explorer</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {otherScenes.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onNavigate({ name: "scene", slug: s.slug })}
              className="dedco-card overflow-hidden cursor-pointer group text-left"
            >
              <div
                className="aspect-[4/5] overflow-hidden bg-warm relative"
              >
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(30,24,19,0.75) 0%, transparent 55%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <h3 className="font-display text-sm font-semibold leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-[10px] text-white/70">{s.style}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Active hotspot modal */}
      {activeHotspot !== null &&
        (() => {
          const h = scene.hotspots[activeHotspot];
          const product = getProduct(h.productId);
          if (!product) return null;
          return (
            <div
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
              onClick={() => setActiveHotspot(null)}
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
              <div
                className="relative bg-cream rounded-t-2xl sm:rounded-xl w-full sm:max-w-md dedco-fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setActiveHotspot(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center z-10"
                  aria-label="Fermer"
                >
                  <X size={16} />
                </button>
                <div className="aspect-square overflow-hidden bg-warm rounded-t-2xl sm:rounded-t-xl">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  {product.badge && (
                    <span className="dedco-badge dedco-badge-amber-solid mb-2">
                      {product.badge}
                    </span>
                  )}
                  <h3 className="font-display font-bold text-lg mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-ink-soft mb-3 line-clamp-2">
                    {product.desc}
                  </p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-display font-bold text-xl text-amber">
                      {formatFCFA(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-ink-mute line-through">
                        {formatFCFA(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart({ ...product, qty: 1 });
                        setActiveHotspot(null);
                      }}
                      className="dedco-btn dedco-btn-primary flex-1"
                    >
                      <ShoppingBag size={16} /> Ajouter
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate({ name: "product", id: product.id });
                        setActiveHotspot(null);
                      }}
                      className="dedco-btn dedco-btn-ghost"
                    >
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
