"use client";

import { useState } from "react";
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  MapPin,
  Star,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";
import {
  getProduct,
  getArtisan,
  PRODUCTS,
  formatFCFA,
  levelLabel,
} from "@/lib/dedco-data";
import type { Route, CartItem } from "@/lib/dedco-types";
import { BackButton } from "./layout";
import { ProductCard, Stars, LevelBadge } from "./cards";

export function ProductPage({
  productId,
  onNavigate,
  onBack,
  favorites,
  toggleFav,
  onAddToCart,
}: {
  productId: number;
  onNavigate: (route: Route) => void;
  onBack: () => void;
  favorites: Set<number>;
  toggleFav: (id: number) => void;
  onAddToCart: (item: CartItem) => void;
}) {
  const product = getProduct(productId);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="font-display text-xl mb-4">Produit introuvable</p>
        <button onClick={onBack} className="dedco-btn dedco-btn-primary">
          Retour
        </button>
      </div>
    );
  }

  const artisan = getArtisan(product.artisanId);
  const isFav = favorites.has(product.id);
  const similar = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      qty,
      selectedColor: selectedColor ?? product.colors[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="dedco-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BackButton onBack={onBack} />

      {/* Breadcrumb */}
      <nav
        aria-label="Fil d'Ariane"
        className="flex items-center gap-1 text-xs text-ink-mute mb-6 flex-wrap"
      >
        <button
          onClick={() => onNavigate({ name: "home" })}
          className="hover:text-amber"
        >
          Accueil
        </button>
        <ChevronRight size={12} />
        <button
          onClick={() => onNavigate({ name: "marketplace" })}
          className="hover:text-amber"
        >
          Marketplace
        </button>
        <ChevronRight size={12} />
        <span className="text-ink-soft capitalize">{product.category}</span>
        <ChevronRight size={12} />
        <span className="text-ink truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Gallery */}
        <div>
          <div className="dedco-card overflow-hidden mb-3 bg-warm aspect-square">
            <img
              src={product.images[selectedImageIdx]}
              alt={`${product.name} — vue ${selectedImageIdx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto dedco-hide-scroll">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImageIdx(i)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
                    i === selectedImageIdx
                      ? "border-amber"
                      : "border-border opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Voir l'image ${i + 1}`}
                  aria-pressed={i === selectedImageIdx}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.badge && (
            <span className="dedco-badge dedco-badge-amber-solid mb-3">
              {product.badge}
            </span>
          )}
          <h1 className="display-lg mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <Stars rating={product.rating} size={16} />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-ink-mute">·</span>
            <span className="text-ink-soft">{product.reviews} avis</span>
            <span className="text-ink-mute">·</span>
            {product.stock > 0 ? (
              <span className="text-forest font-medium flex items-center gap-1">
                <BadgeCheck size={14} /> En stock ({product.stock})
              </span>
            ) : (
              <span className="text-terracotta font-medium">Sur commande</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-border">
            <span className="font-display font-bold text-3xl text-amber">
              {formatFCFA(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-base text-ink-mute line-through">
                {formatFCFA(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && (
              <span className="dedco-badge dedco-badge-terra">
                -
                {Math.round(
                  (1 - product.price / product.originalPrice) * 100,
                )}
                %
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-ink-soft leading-relaxed mb-6">
            {product.desc}
          </p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-xs text-ink-mute uppercase tracking-wide mb-1">
                Matériaux
              </p>
              <p className="font-medium">{product.material}</p>
            </div>
            {product.dimensions && (
              <div>
                <p className="text-xs text-ink-mute uppercase tracking-wide mb-1">
                  Dimensions
                </p>
                <p className="font-medium">{product.dimensions}</p>
              </div>
            )}
          </div>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-ink-mute uppercase tracking-wide mb-2">
                Variante
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-xs rounded-md border-2 transition-all ${
                      selectedColor === color ||
                      (selectedColor === null && color === product.colors[0])
                        ? "border-amber bg-amber-pale text-amber-dark font-semibold"
                        : "border-border text-ink-soft hover:border-ink-mute"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to cart */}
          <div className="flex gap-3 mb-4">
            <div className="flex items-center border border-border rounded-md bg-white">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-11 flex items-center justify-center text-lg text-ink-soft hover:text-ink"
                aria-label="Diminuer la quantité"
              >
                −
              </button>
              <input
                type="number"
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, Number(e.target.value) || 1))
                }
                className="w-12 text-center text-sm bg-transparent focus:outline-none"
                aria-label="Quantité"
                min={1}
              />
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-11 flex items-center justify-center text-lg text-ink-soft hover:text-ink"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className={`dedco-btn dedco-btn-primary flex-1 ${
                added ? "dedco-btn-forest" : ""
              }`}
            >
              {added ? (
                <>
                  <BadgeCheck size={18} /> Ajouté !
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Ajouter au panier
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => toggleFav(product.id)}
              className={`dedco-btn dedco-btn-ghost w-12 ${
                isFav ? "text-terracotta border-terracotta" : ""
              }`}
              aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart size={18} fill={isFav ? "currentColor" : "none"} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate({ name: "marketplace" })}
            className="dedco-btn dedco-btn-secondary w-full mb-6"
          >
            Demander un brief personnalisé
          </button>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
            {[
              { icon: ShieldCheck, label: "Paiement séquestré", sub: "Fedapay" },
              { icon: Truck, label: "Livraison 3 temps", sub: "Tracée photo" },
              { icon: RotateCcw, label: "Litige 7 jours", sub: "Médiation" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <item.icon
                  size={20}
                  className="mx-auto mb-1.5"
                  style={{ color: "var(--amber)" }}
                />
                <p className="text-xs font-semibold leading-tight">
                  {item.label}
                </p>
                <p className="text-[10px] text-ink-mute">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Artisan block */}
      {artisan && (
        <section className="mb-12">
          <h2 className="display-md mb-4">L'artisan derrière cette pièce</h2>
          <div className="dedco-card p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
            <img
              src={artisan.avatar}
              alt={artisan.name}
              className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-display font-bold text-lg">
                  {artisan.name}
                </h3>
                {artisan.verified && <BadgeCheck size={16} className="text-forest" />}
                <LevelBadge level={artisan.level} />
              </div>
              <p className="text-sm text-ink-soft mb-1">{artisan.specialty}</p>
              <p className="text-xs text-ink-mute flex items-center gap-1 mb-3">
                <MapPin size={12} /> {artisan.city} · {artisan.experience}{" "}
                d'expérience
              </p>
              <p className="text-sm text-ink-soft leading-relaxed mb-3">
                {artisan.bio}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Stars rating={artisan.rating} size={14} />
                  <span className="font-semibold">{artisan.rating}</span>
                  <span className="text-ink-mute">
                    ({artisan.reviews} avis)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate({ name: "artisan", id: artisan.id })}
                  className="text-amber font-semibold text-sm hover:underline ml-auto"
                >
                  Voir le profil →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Similar products */}
      {similar.length > 0 && (
        <section>
          <h2 className="display-md mb-4">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {similar.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isFav={favorites.has(p.id)}
                onToggleFav={toggleFav}
                onOpen={(id) => onNavigate({ name: "product", id })}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
