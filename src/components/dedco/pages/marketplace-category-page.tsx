"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Search,
  PackageOpen,
  Star,
  ArrowUpDown,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { ALL_PRODUCTS, ARTISANS, CATEGORIES } from "@/lib/dedco-data-expanded";
import { ProductCard } from "@/components/dedco/cards";
import type { Artisan } from "@/lib/dedco-types";

// ============================================================
// Sort options
// ============================================================

type SortKey = "pertinence" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "pertinence", label: "Pertinence" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "rating", label: "Note" },
];

const PRICE_PRESETS = [
  { label: "< 50k", min: 0, max: 50000 },
  { label: "50k–150k", min: 50000, max: 150000 },
  { label: "150k–400k", min: 150000, max: 400000 },
  { label: "> 400k", min: 400000, max: 1500000 },
];

// ============================================================
// Animation
// ============================================================

const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// ============================================================
// FilterSidebar — extracted as proper component
// ============================================================

function FilterSidebar({
  materials,
  artisansInCat,
  priceMin,
  priceMax,
  selectedMaterial,
  selectedArtisanId,
  minRating,
  hasFilters,
  onApplyPreset,
  onSetMaterial,
  onSetArtisanId,
  onSetMinRating,
  onReset,
}: {
  materials: string[];
  artisansInCat: Artisan[];
  priceMin: number;
  priceMax: number;
  selectedMaterial: string | null;
  selectedArtisanId: number | null;
  minRating: number | null;
  hasFilters: boolean;
  onApplyPreset: (preset: { min: number; max: number }) => void;
  onSetMaterial: (m: string | null) => void;
  onSetArtisanId: (id: number | null) => void;
  onSetMinRating: (r: number | null) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Price range */}
      <div>
        <h3 className="text-xs text-[var(--text-3)] uppercase tracking-wide font-semibold mb-2.5">
          Prix
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRICE_PRESETS.map((preset) => {
            const active = priceMin === preset.min && priceMax === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className={`px-3 py-1.5 text-xs rounded-md border transition-all font-numeric ${
                  active
                    ? "border-amber bg-[var(--amber-pale)] text-[var(--amber-dark)] font-semibold"
                    : "border-[var(--border)] text-[var(--text-2)] hover:border-[var(--text-3)]"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Material */}
      {materials.length > 1 && (
        <div>
          <h3 className="text-xs text-[var(--text-3)] uppercase tracking-wide font-semibold mb-2.5">
            Matériau
          </h3>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {materials.map((m) => (
              <label
                key={m}
                className="flex items-center gap-2 text-sm text-[var(--text-2)] cursor-pointer hover:text-[var(--text-1)] transition-colors"
              >
                <input
                  type="radio"
                  name="material"
                  checked={selectedMaterial === m}
                  onChange={() => onSetMaterial(selectedMaterial === m ? null : m)}
                  className="accent-amber w-3.5 h-3.5"
                />
                <span className="truncate">{m}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Artisan */}
      {artisansInCat.length > 1 && (
        <div>
          <h3 className="text-xs text-[var(--text-3)] uppercase tracking-wide font-semibold mb-2.5">
            Artisan
          </h3>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {artisansInCat.map((a) => (
              <label
                key={a.id}
                className="flex items-center gap-2 text-sm text-[var(--text-2)] cursor-pointer hover:text-[var(--text-1)] transition-colors"
              >
                <input
                  type="radio"
                  name="artisan"
                  checked={selectedArtisanId === a.id}
                  onChange={() => onSetArtisanId(selectedArtisanId === a.id ? null : a.id)}
                  className="accent-amber w-3.5 h-3.5"
                />
                <span className="truncate">{a.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div>
        <h3 className="text-xs text-[var(--text-3)] uppercase tracking-wide font-semibold mb-2.5">
          Note minimale
        </h3>
        <div className="flex gap-2">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onSetMinRating(minRating === r ? null : r)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md border transition-all ${
                minRating === r
                  ? "border-amber bg-[var(--amber-pale)] text-[var(--amber-dark)] font-semibold"
                  : "border-[var(--border)] text-[var(--text-2)] hover:border-[var(--text-3)]"
              }`}
            >
              {r}+
              <Star size={11} fill="currentColor" />
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="dedco-btn-ghost text-sm w-full"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}

// ============================================================
// MarketplaceCategoryPage
// ============================================================

export function MarketplaceCategoryPage({ category }: { category: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const favorites = useDedcoStore((s) => s.favorites);
  const toggleFavorite = useDedcoStore((s) => s.toggleFavorite);
  const favSet = new Set(favorites);

  // ── Category info ──
  const catInfo = CATEGORIES.find((c) => c.slug === category);
  const catName = catInfo?.name ?? category;

  // ── Base products for this category ──
  const categoryProducts = useMemo(
    () => ALL_PRODUCTS.filter((p) => p.category === category),
    [category]
  );

  // ── Filter & sort state ──
  const [sort, setSort] = useState<SortKey>("pertinence");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1500000);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedArtisanId, setSelectedArtisanId] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // ── Derive unique materials & artisans from category ──
  const materials = useMemo(
    () => Array.from(new Set(categoryProducts.map((p) => p.material))).sort(),
    [categoryProducts]
  );

  const artisansInCat = useMemo(() => {
    const ids = new Set(categoryProducts.map((p) => p.artisanId));
    return ARTISANS.filter((a) => ids.has(a.id));
  }, [categoryProducts]);

  // ── Filtered + sorted ──
  const filtered = useMemo(() => {
    let list = categoryProducts.slice();
    list = list.filter((p) => p.price >= priceMin && p.price <= priceMax);
    if (selectedMaterial) list = list.filter((p) => p.material === selectedMaterial);
    if (selectedArtisanId !== null) list = list.filter((p) => p.artisanId === selectedArtisanId);
    if (minRating !== null) list = list.filter((p) => p.rating >= minRating);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return list;
  }, [categoryProducts, priceMin, priceMax, selectedMaterial, selectedArtisanId, minRating, sort]);

  // ── Helpers ──
  const applyPreset = (preset: { min: number; max: number }) => {
    setPriceMin(preset.min);
    setPriceMax(preset.max);
  };

  const resetFilters = () => {
    setPriceMin(0);
    setPriceMax(1500000);
    setSelectedMaterial(null);
    setSelectedArtisanId(null);
    setMinRating(null);
    setSort("pertinence");
  };

  const hasFilters =
    priceMin > 0 ||
    priceMax < 1500000 ||
    selectedMaterial !== null ||
    selectedArtisanId !== null ||
    minRating !== null;

  const activeFilterCount = [
    priceMin > 0 || priceMax < 1500000,
    selectedMaterial !== null,
    selectedArtisanId !== null,
    minRating !== null,
  ].filter(Boolean).length;

  // ── Shared filter sidebar props ──
  const filterSidebarProps = {
    materials,
    artisansInCat,
    priceMin,
    priceMax,
    selectedMaterial,
    selectedArtisanId,
    minRating,
    hasFilters,
    onApplyPreset: applyPreset,
    onSetMaterial: setSelectedMaterial,
    onSetArtisanId: setSelectedArtisanId,
    onSetMinRating: setMinRating,
    onReset: resetFilters,
  };

  // ── Empty state ──
  if (categoryProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-1)]">
              {catName}
            </h1>
            <p className="mt-1 text-[var(--text-2)]">Aucun produit dans cette catégorie</p>
          </motion.div>
        </div>
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="w-20 h-20 rounded-full bg-[var(--bg-warm)] flex items-center justify-center mb-5">
            <PackageOpen size={32} className="text-[var(--text-3)]" />
          </div>
          <h3 className="font-display font-semibold text-lg text-[var(--text-1)] mb-1">
            Catégorie vide
          </h3>
          <p className="text-sm text-[var(--text-3)] mb-5 max-w-sm">
            Il n&apos;y a pas encore de produits dans la catégorie{" "}
            <span className="font-semibold text-[var(--text-2)]">{catName}</span>.
          </p>
          <button
            type="button"
            onClick={() => navigate({ page: "marketplace" })}
            className="dedco-btn dedco-btn-primary text-sm"
          >
            Voir tout le marketplace
          </button>
        </div>
      </div>
    );
  }

  // ── Main layout ──
  return (
    <div className="min-h-screen bg-[var(--bg-cream)]">
      {/* ── Header ── */}
      <section className="pt-10 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            type="button"
            onClick={() => navigate({ page: "marketplace" })}
            className="dedco-btn-ghost text-sm mb-3 inline-flex items-center gap-1"
          >
            ← Marketplace
          </button>
          <div className="flex items-end gap-3 flex-wrap">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-1)]">
              {catName}
            </h1>
            <span className="text-sm text-[var(--text-3)] pb-1">
              {filtered.length} produit{filtered.length !== 1 ? "s" : ""}
              {filtered.length !== categoryProducts.length && ` sur ${categoryProducts.length}`}
            </span>
          </div>
        </motion.div>
      </section>

      {/* ── Toolbar: sort + mobile filter toggle ── */}
      <section className="sticky top-16 z-20 bg-[var(--bg-cream)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="appearance-none pl-3 pr-8 py-2 text-sm bg-white border border-[var(--border)] rounded-lg text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-amber/30 focus:border-amber cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ArrowUpDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none"
            />
          </div>

          {/* Active filter badges (mobile) + toggle */}
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <span className="lg:hidden text-xs text-[var(--text-3)]">
                {activeFilterCount} filtre{activeFilterCount > 1 ? "s" : ""}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="dedco-btn-ghost text-sm flex items-center gap-1.5 lg:hidden"
            >
              <SlidersHorizontal size={15} />
              Filtres
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile filter panel */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="px-4 sm:px-6 pb-5 pt-1">
                <FilterSidebar {...filterSidebarProps} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Body: sidebar (desktop) + grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-36">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[var(--text-1)]">Filtres</h2>
              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-[var(--text-3)] hover:text-[var(--text-1)] underline"
                >
                  Effacer
                </button>
              )}
            </div>
            <FilterSidebar {...filterSidebarProps} />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-warm)] flex items-center justify-center mb-4">
                <Search size={24} className="text-[var(--text-3)]" />
              </div>
              <h3 className="font-display font-semibold text-lg text-[var(--text-1)] mb-1">
                Aucun résultat
              </h3>
              <p className="text-sm text-[var(--text-3)] mb-4">
                Ajustez vos filtres pour trouver ce que vous cherchez
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="dedco-btn dedco-btn-primary text-sm"
              >
                Réinitialiser
              </button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
              variants={gridContainer}
              initial="hidden"
              animate="show"
              key={`${sort}-${priceMin}-${priceMax}-${selectedMaterial}-${selectedArtisanId}-${minRating}`}
            >
              {filtered.map((product) => (
                <motion.div key={product.id} variants={gridItem}>
                  <ProductCard
                    product={product}
                    isFav={favSet.has(product.id)}
                    onToggleFav={toggleFavorite}
                    onOpen={(id) => navigate({ page: "product", id })}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}