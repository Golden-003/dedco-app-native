"use client";

import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  BadgeCheck,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import {
  ARTISANS,
  CATEGORIES,
  formatFCFA,
} from "@/lib/dedco-data";
import { ALL_PRODUCTS } from "@/lib/dedco-data-expanded";

// ============================================================
// SearchResultsPage
// ============================================================

type SortOption = "pertinence" | "prix_asc" | "prix_desc" | "note" | "recents";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "pertinence", label: "Pertinence" },
  { value: "prix_asc", label: "Prix croissant" },
  { value: "prix_desc", label: "Prix décroissant" },
  { value: "note", label: "Note" },
  { value: "recents", label: "Récents" },
];

const PRICE_RANGES = [
  { label: "Moins de 50 000 F", min: 0, max: 50000 },
  { label: "50 000 — 100 000 F", min: 50000, max: 100000 },
  { label: "100 000 — 200 000 F", min: 100000, max: 200000 },
  { label: "Plus de 200 000 F", min: 200000, max: Infinity },
];

const LEVELS = ["N1", "N2", "N3", "N4"];

export function SearchResultsPage() {
  const route = useDedcoStore((s) => s.route);
  const navigate = useDedcoStore((s) => s.navigate);
  const query =
    route.page === "search" ? (route.query ?? "") : "";

  const [searchInput, setSearchInput] = useState(query);
  const [sortBy, setSortBy] = useState<SortOption>("pertinence");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number>(0);

  // Search products and artisans
  const { matchedProducts, matchedArtisans } = useMemo(() => {
    const q = searchInput.toLowerCase().trim();

    if (!q) {
      return { matchedProducts: ALL_PRODUCTS, matchedArtisans: ARTISANS };
    }

    const products = ALL_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.material.toLowerCase().includes(q)
    );

    const artisans = ARTISANS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.specialty.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q)
    );

    return { matchedProducts: products, matchedArtisans: artisans };
  }, [searchInput]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let result = matchedProducts;

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter(
        (p) => p.price >= range.min && p.price <= range.max
      );
    }

    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    if (selectedLevel) {
      result = result.filter((p) => {
        const artisan = ARTISANS.find((a) => a.id === p.artisanId);
        return artisan?.level === selectedLevel;
      });
    }

    // Sort
    switch (sortBy) {
      case "prix_asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "prix_desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "note":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [
    matchedProducts,
    selectedCategory,
    selectedPriceRange,
    selectedLevel,
    minRating,
    sortBy,
  ]);

  const filteredArtisans = useMemo(() => {
    let result = matchedArtisans;
    if (selectedLevel) {
      result = result.filter((a) => a.level === selectedLevel);
    }
    if (minRating > 0) {
      result = result.filter((a) => a.rating >= minRating);
    }
    return result;
  }, [matchedArtisans, selectedLevel, minRating]);

  const totalResults = filteredProducts.length + filteredArtisans.length;

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedPriceRange !== null ||
    selectedLevel !== null ||
    minRating > 0;

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedPriceRange(null);
    setSelectedLevel(null);
    setMinRating(0);
  };

  return (
    <div className="dedco-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute"
          />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl bg-card border border-border focus:outline-none focus:border-amber transition-colors shadow-sm"
            autoFocus
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-mute hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`dedco-btn dedco-btn-ghost dedco-btn-sm flex-shrink-0 ${
            showFilters || hasActiveFilters
              ? "border-amber text-amber"
              : ""
          }`}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filtres</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-amber" />
          )}
        </button>
      </div>

      {/* Filter Chips (mobile) */}
      <AnimatePresence>
        {(showFilters || hasActiveFilters) && (
          <motion.div
            className="flex gap-2 flex-wrap mb-4 lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {selectedCategory && (
              <FilterChip
                label={CATEGORIES.find((c) => c.slug === selectedCategory)?.name ?? selectedCategory}
                onRemove={() => setSelectedCategory(null)}
              />
            )}
            {selectedPriceRange !== null && (
              <FilterChip
                label={PRICE_RANGES[selectedPriceRange].label}
                onRemove={() => setSelectedPriceRange(null)}
              />
            )}
            {selectedLevel && (
              <FilterChip
                label={`Niveau ${selectedLevel}`}
                onRemove={() => setSelectedLevel(null)}
              />
            )}
            {minRating > 0 && (
              <FilterChip
                label={`${minRating}+ étoiles`}
                onRemove={() => setMinRating(0)}
              />
            )}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-terracotta font-medium hover:underline"
              >
                Effacer tout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-6">
        {/* Sidebar Filters (desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="dedco-card p-5 sticky top-20 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Filtres</h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-terracotta font-medium hover:underline"
                >
                  Effacer
                </button>
              )}
            </div>

            {/* Category */}
            <FilterSection title="Catégorie">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategory === null}
                    onChange={() => setSelectedCategory(null)}
                    className="rounded border-border text-amber focus:ring-amber"
                  />
                  Toutes
                </label>
                {CATEGORIES.map((cat) => (
                  <label key={cat.slug} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategory === cat.slug}
                      onChange={() =>
                        setSelectedCategory(
                          selectedCategory === cat.slug ? null : cat.slug
                        )
                      }
                      className="rounded border-border text-amber focus:ring-amber"
                    />
                    <span>{cat.name}</span>
                    <span className="text-xs text-ink-mute ml-auto font-numeric">
                      ({cat.count})
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Price */}
            <FilterSection title="Prix">
              <div className="space-y-1.5">
                {PRICE_RANGES.map((range, i) => (
                  <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPriceRange === i}
                      onChange={() =>
                        setSelectedPriceRange(selectedPriceRange === i ? null : i)
                      }
                      className="rounded border-border text-amber focus:ring-amber"
                    />
                    <span className="font-numeric">{range.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Level */}
            <FilterSection title="Niveau artisan">
              <div className="flex gap-2">
                {LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setSelectedLevel(selectedLevel === level ? null : level)
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedLevel === level
                        ? "bg-amber text-white border-amber"
                        : "border-border text-ink-soft hover:border-amber"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Rating */}
            <FilterSection title="Note minimale">
              <div className="flex gap-1">
                {[0, 3, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setMinRating(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      minRating === r
                        ? "bg-amber text-white border-amber"
                        : "border-border text-ink-soft hover:border-amber"
                    }`}
                  >
                    {r === 0 ? "Toutes" : `${r}+`}
                  </button>
                ))}
              </div>
            </FilterSection>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-ink-soft">
              {searchInput ? (
                <>
                  <span className="font-numeric">{totalResults}</span>{" "}
                  résultat{totalResults !== 1 ? "s" : ""} pour{" "}
                  <span className="font-semibold text-ink">
                    &ldquo;{searchInput}&rdquo;
                  </span>
                </>
              ) : (
                <><span className="font-numeric">{totalResults}</span> résultats</>
              )}
            </p>

            {/* Sort */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors"
                onClick={() => {
                  const currentIdx = SORT_OPTIONS.findIndex((s) => s.value === sortBy);
                  const next = SORT_OPTIONS[(currentIdx + 1) % SORT_OPTIONS.length];
                  setSortBy(next.value);
                }}
              >
                <span className="hidden sm:inline">Trier:</span>{" "}
                {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Artisan Results */}
          {filteredArtisans.length > 0 && searchInput && (
            <section className="mb-8">
              <h2 className="font-display font-bold text-lg mb-4">
                Artisans ({filteredArtisans.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArtisans.map((artisan) => (
                  <motion.article
                    key={artisan.id}
                    className="dedco-card p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate({ page: "artisan", id: artisan.id })}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={artisan.avatar}
                        alt={artisan.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-display font-semibold text-sm truncate">
                            {artisan.name}
                          </h3>
                          {artisan.verified && (
                            <BadgeCheck size={14} className="text-forest flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-ink-soft truncate">
                          {artisan.specialty}
                        </p>
                      </div>
                      <span className="dedco-badge dedco-badge-terra text-[10px]">
                        {artisan.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-ink-soft">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber" fill="currentColor" />
                        <span className="font-numeric">{artisan.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        {artisan.city}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>
          )}

          {/* Product Results */}
          {filteredProducts.length > 0 ? (
            <section>
              <h2 className="font-display font-bold text-lg mb-4">
                Produits ({filteredProducts.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.map((product, i) => {
                  const artisan = ARTISANS.find((a) => a.id === product.artisanId);
                  return (
                    <motion.article
                      key={product.id}
                      className="dedco-card overflow-hidden cursor-pointer group"
                      onClick={() =>
                        navigate({ page: "product", id: product.id })
                      }
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                      whileHover={{ y: -3 }}
                    >
                      <div className="relative aspect-square overflow-hidden bg-warm">
                        {product.badge && (
                          <span className="absolute top-2 left-2 dedco-badge dedco-badge-terra-solid text-[10px]">
                            {product.badge}
                          </span>
                        )}
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3">
                        {artisan && (
                          <p className="text-xs text-ink-mute mb-0.5 truncate">
                            Par {artisan.name}
                          </p>
                        )}
                        <h3 className="font-display font-semibold text-[13px] leading-tight mb-1 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="font-numeric font-bold text-sm text-amber">
                          {formatFCFA(product.price)}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-ink-mute mt-1.5">
                          <Star size={11} className="text-amber" fill="currentColor" />
                          <span className="font-numeric">{product.rating}</span>
                          <span className="font-numeric">({product.reviews})</span>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </section>
          ) : (
            /* Empty state */
            <motion.div
              className="dedco-card p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 rounded-full bg-warm mx-auto mb-4 flex items-center justify-center">
                <Search size={24} className="text-ink-mute" />
              </div>
              <p className="font-display font-semibold text-lg mb-2">
                Aucun résultat
              </p>
              <p className="text-sm text-ink-mute mb-4 max-w-sm mx-auto">
                {searchInput
                  ? `Aucun produit ou artisan ne correspond à "${searchInput}". Essayez avec d'autres mots-clés.`
                  : "Effectuez une recherche pour trouver des produits et artisans."}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="dedco-btn dedco-btn-ghost dedco-btn-sm"
                >
                  Effacer les filtres
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Filter helpers
// ============================================================

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-ink-mute uppercase tracking-wide font-semibold mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <motion.span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-pale text-amber-dark text-xs font-medium"
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      {label}
      <button type="button" onClick={onRemove} aria-label="Retirer le filtre">
        <X size={12} />
      </button>
    </motion.span>
  );
}
