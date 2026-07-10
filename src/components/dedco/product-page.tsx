"use client";

import { useState, useMemo } from "react";
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
import { useReviewStore } from "@/lib/review-store";
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

  return (
    <ProductPageContent
      product={product}
      onNavigate={onNavigate}
      onBack={onBack}
      favorites={favorites}
      toggleFav={toggleFav}
      onAddToCart={onAddToCart}
    />
  );
}

function ProductPageContent({
  product,
  onNavigate,
  onBack,
  favorites,
  toggleFav,
  onAddToCart,
}: {
  product: NonNullable<ReturnType<typeof getProduct>>;
  onNavigate: (route: Route) => void;
  onBack: () => void;
  favorites: Set<number>;
  toggleFav: (id: number) => void;
  onAddToCart: (item: CartItem) => void;
}) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // ── Notes depuis review-store (référence stable via useMemo) ──
  const allReviews = useReviewStore((s) => s.reviews);
  const productStats = useMemo(() => {
    const rs = allReviews.filter((r) => r.productId === product.id);
    if (rs.length === 0) return { rating: 0, count: 0 };
    const sum = rs.reduce((acc, r) => acc + r.rating, 0);
    return {
      rating: Math.round((sum / rs.length) * 10) / 10,
      count: rs.length,
    };
  }, [allReviews, product.id]);

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
          <div className="dedco-card overflow-hidden mb-3 bg-warm aspect-square relative group">
            <img
              src={product.images[selectedImageIdx]}
              alt={`${product.name} — vue ${selectedImageIdx + 1}`}
              className="w-full h-full object-cover"
            loading="lazy" />
            {/* Flèches de navigation */}
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIdx((prev) =>
                      prev === 0 ? product.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-ink-soft hover:bg-white hover:scale-110 transition-all shadow-md opacity-0 group-hover:opacity-100"
                  aria-label="Image précédente"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIdx((prev) =>
                      prev === product.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-ink-soft hover:bg-white hover:scale-110 transition-all shadow-md opacity-0 group-hover:opacity-100"
                  aria-label="Image suivante"
                >
                  <ChevronRight size={20} />
                </button>
                {/* Compteur de photos */}
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-numeric backdrop-blur-sm">
                  {selectedImageIdx + 1} / {product.images.length}
                </span>
              </>
            )}
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
                  loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.badge && (
            <span className="dedco-badge dedco-badge-terra-solid mb-3">
              {product.badge}
            </span>
          )}
          <h1 className="display-lg mb-3">{product.name}</h1>

          {/* Rating — depuis review-store, cliquable pour scroller aux avis */}
          {productStats.count > 0 && (
            <button
              type="button"
              onClick={() => {
                document.getElementById("avis-verifies")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="flex items-center gap-2 mb-4 text-sm hover:opacity-80 transition-opacity"
              aria-label="Voir les avis"
            >
              <Stars rating={productStats.rating} size={16} />
              <span className="font-semibold font-numeric">{productStats.rating}</span>
              <span className="text-ink-mute">·</span>
              <span className="text-ink-soft font-numeric underline decoration-dotted">{productStats.count} avis vérifié{productStats.count > 1 ? "s" : ""}</span>
              <span className="text-ink-mute">·</span>
            </button>
          )}
          {/* Stock status */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            {product.stock > 0 ? (
              <span className="text-forest font-medium flex items-center gap-1">
                <BadgeCheck size={14} /> En stock (<span className="font-numeric">{product.stock}</span>)
              </span>
            ) : (
              <span className="text-terracotta font-medium">Sur commande</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 sm:gap-3 mb-6 pb-6 border-b border-border flex-wrap">
            <span className="font-numeric font-bold text-2xl sm:text-3xl text-amber break-words">
              {formatFCFA(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm sm:text-base text-ink-mute line-through font-numeric">
                {formatFCFA(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && (
              <span className="dedco-badge dedco-badge-terra font-numeric">
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
            <div className="flex items-center border border-border rounded-md bg-card">
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
                className="w-12 text-center text-sm bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
            onClick={() => onNavigate({ name: "brief" })}
            className="dedco-btn dedco-btn-secondary w-full mb-6"
          >
            Demander un brief personnalisé
          </button>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
            {[
              { icon: ShieldCheck, label: "Paiement sécurisé", sub: "Mobile Money" },
              { icon: Truck, label: "Livraison sécurisée", sub: "Tracée photo" },
              { icon: RotateCcw, label: "Litige 7 jours", sub: "Médiation" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <item.icon
                  size={20}
                  className="mx-auto mb-1.5"
                  style={{ color: "var(--terracotta)" }}
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
            loading="lazy" />
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

      {/* Avis vérifiés — section Amazon/Etsy-style */}
      <VerifiedReviews productId={product.id} />
    </div>
  );
}

// ============================================================
// VERIFIED REVIEWS — Section avis sur fiche produit
// Style marketplace : summary compact + filtres + liste fluide
// ============================================================

type SortKey = "recent" | "highest" | "lowest";

function VerifiedReviews({ productId }: { productId: number }) {
  const allReviews = useReviewStore((s) => s.reviews);

  const productReviews = useMemo(
    () => allReviews.filter((r) => r.productId === productId),
    [allReviews, productId],
  );

  const { rating, count } = useMemo(() => {
    if (productReviews.length === 0) return { rating: 0, count: 0 };
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      rating: Math.round((sum / productReviews.length) * 10) / 10,
      count: productReviews.length,
    };
  }, [productReviews]);

  const distribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => {
      const c = productReviews.filter((r) => r.rating === star).length;
      return { star, count: c, pct: count > 0 ? (c / count) * 100 : 0 };
    });
  }, [productReviews, count]);

  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [sort, setSort] = useState<SortKey>("recent");
  const [visibleCount, setVisibleCount] = useState(5);

  const filteredReviews = useMemo(() => {
    let list = productReviews;
    if (starFilter !== null) list = list.filter((r) => r.rating === starFilter);
    list = [...list];
    if (sort === "recent") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === "highest") {
      list.sort((a, b) => b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      list.sort((a, b) => a.rating - b.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [productReviews, starFilter, sort]);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (count === 0) {
    return (
      <section id="avis-verifies" className="mt-12 scroll-mt-20">
        <h2 className="display-md mb-4">Avis vérifiés</h2>
        <div className="dedco-card p-8 text-center">
          <Star size={32} className="mx-auto text-[var(--border-dark)] mb-3" strokeWidth={1.5} />
          <p className="text-sm text-[var(--text-2)] font-medium mb-1">Aucun avis pour le moment</p>
          <p className="text-xs text-[var(--text-3)] max-w-md mx-auto">
            Les avis sont collectés après livraison de la commande. Soyez le premier à partager votre expérience.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="avis-verifies" className="mt-12 scroll-mt-20">
      <div className="flex items-baseline gap-3 mb-4 flex-wrap">
        <h2 className="display-md">Avis vérifiés</h2>
        <span className="text-sm text-[var(--text-3)]">
          <span className="font-numeric font-semibold text-[var(--text-1)]">{count}</span> avis · 100% vérifiés (liés à une commande livrée)
        </span>
      </div>

      {/* Summary compact */}
      <div className="dedco-card p-4 sm:p-5 mb-4">
        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-stretch">
          <div className="text-center sm:text-left flex-shrink-0 sm:border-r sm:border-[var(--border)] sm:pr-5 flex sm:block items-center gap-3">
            <div className="font-display font-bold text-3xl sm:text-4xl text-[var(--amber)] font-numeric leading-none">
              {rating.toFixed(1)}
            </div>
            <div className="sm:mt-1">
              <Stars rating={rating} size={14} className="sm:justify-center" />
              <p className="text-xs text-[var(--text-3)] mt-0.5 hidden sm:block">{count} avis</p>
            </div>
          </div>
          <div className="flex-1 w-full space-y-1">
            {distribution.map((d) => {
              const active = starFilter === d.star;
              return (
                <button
                  key={d.star}
                  type="button"
                  onClick={() => setStarFilter(active ? null : d.star)}
                  className={`w-full flex items-center gap-2 text-xs px-2 py-1 rounded-md transition-colors ${active ? "bg-[var(--amber-pale)]" : "hover:bg-[var(--bg-warm)]"}`}
                  aria-pressed={active}
                  aria-label={`Filtrer par ${d.star} étoiles`}
                >
                  <span className="font-numeric w-6 text-right text-[var(--text-2)]">{d.star}★</span>
                  <div className="flex-1 h-2 bg-[var(--bg-warm)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--amber)] rounded-full transition-all" style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="font-numeric text-[var(--text-3)] w-8 text-right">{d.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-[var(--text-3)] mr-1">Filtrer :</span>
          <FilterChip active={starFilter === null} onClick={() => setStarFilter(null)}>Tous</FilterChip>
          {[5, 4, 3, 2, 1].map((s) => {
            const hasReviews = productReviews.some((r) => r.rating === s);
            if (!hasReviews) return null;
            return (
              <FilterChip key={s} active={starFilter === s} onClick={() => setStarFilter(s)}>{s}★</FilterChip>
            );
          })}
        </div>
        <label className="flex items-center gap-1.5 text-xs">
          <span className="text-[var(--text-3)]">Trier :</span>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as SortKey); setVisibleCount(5); }}
            className="px-2.5 py-1.5 text-xs border border-[var(--border)] rounded-md bg-card focus:outline-none focus:border-[var(--amber)]"
            aria-label="Trier les avis"
          >
            <option value="recent">Plus récents</option>
            <option value="highest">Meilleures notes</option>
            <option value="lowest">Plus critiques</option>
          </select>
        </label>
      </div>

      {starFilter !== null && (
        <p className="text-xs text-[var(--text-3)] mb-3 font-numeric">
          {filteredReviews.length} avis {starFilter}★ ·{" "}
          <button type="button" onClick={() => setStarFilter(null)} className="text-[var(--amber)] font-semibold hover:underline">
            Réinitialiser le filtre
          </button>
        </p>
      )}

      {/* Liste fluide */}
      {filteredReviews.length === 0 ? (
        <div className="dedco-card p-6 text-center text-sm text-[var(--text-3)]">
          Aucun avis ne correspond à ce filtre.
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {filteredReviews.slice(0, visibleCount).map((review) => (
            <ReviewRow key={review.id} review={review} formatDate={formatDate} />
          ))}
        </div>
      )}

      {visibleCount < filteredReviews.length && (
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + 5)}
            className="dedco-btn dedco-btn-ghost"
          >
            Voir plus d'avis{" "}
            <span className="font-numeric text-[var(--text-3)]">
              ({filteredReviews.length - visibleCount} restants)
            </span>
          </button>
        </div>
      )}
    </section>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
        active
          ? "bg-[var(--amber)] text-white border-[var(--amber)]"
          : "bg-card text-[var(--text-2)] border-[var(--border)] hover:border-[var(--ink-mute)]"
      }`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function ReviewRow({ review, formatDate }: { review: import("@/lib/review-store").Review; formatDate: (iso: string) => string }) {
  const hasSubRatings = review.subRatings.qualite > 0 || review.subRatings.delais > 0 || review.subRatings.communication > 0;
  return (
    <article className="py-4 first:pt-0 last:pb-0">
      <header className="flex items-center gap-2 mb-2 flex-wrap">
        <img src={review.authorAvatar} alt={review.authorName} className="w-7 h-7 rounded-full object-cover flex-shrink-0" loading="lazy" />
        <p className="font-semibold text-sm text-[var(--text-1)]">{review.authorName}</p>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--forest)] bg-[var(--forest-pale)] px-1.5 py-0.5 rounded-full">
          <BadgeCheck size={10} /> Achat vérifié
        </span>
        <span className="text-[11px] text-[var(--text-3)] ml-auto font-numeric">{formatDate(review.createdAt)}</span>
      </header>
      <div className="flex items-center gap-2 mb-2">
        <Stars rating={review.rating} size={12} />
      </div>
      {review.comment && (
        <p className="text-sm text-[var(--text-2)] leading-relaxed mb-2">{review.comment}</p>
      )}
      {hasSubRatings && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--text-3)]">
          {review.subRatings.qualite > 0 && (
            <span>Qualité <strong className="font-numeric text-[var(--text-1)]">{review.subRatings.qualite}/5</strong></span>
          )}
          {review.subRatings.delais > 0 && (
            <span>Délais <strong className="font-numeric text-[var(--text-1)]">{review.subRatings.delais}/5</strong></span>
          )}
          {review.subRatings.communication > 0 && (
            <span>Communication <strong className="font-numeric text-[var(--text-1)]">{review.subRatings.communication}/5</strong></span>
          )}
        </div>
      )}
    </article>
  );
}
