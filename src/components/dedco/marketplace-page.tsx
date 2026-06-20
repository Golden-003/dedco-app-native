"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { PRODUCTS, CATEGORIES, ARTISANS } from "@/lib/dedco-data";
import type { Route } from "@/lib/dedco-types";
import { ProductCard } from "./cards";

type SortKey =
  | "pertinence"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest";

export function MarketplacePage({
  onNavigate,
  favorites,
  toggleFav,
}: {
  onNavigate: (route: Route) => void;
  favorites: Set<number>;
  toggleFav: (id: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(800000);
  const [selectedArtisan, setSelectedArtisan] = useState<number | null>(null);
  const [onlyFav, setOnlyFav] = useState(false);
  const [sort, setSort] = useState<SortKey>("pertinence");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const filtered = useMemo(() => {
    let list = PRODUCTS.slice();
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (selectedCats.size > 0) {
      list = list.filter((p) => selectedCats.has(p.category));
    }
    list = list.filter((p) => p.price >= priceMin && p.price <= priceMax);
    if (selectedArtisan !== null) {
      list = list.filter((p) => p.artisanId === selectedArtisan);
    }
    if (onlyFav) {
      list = list.filter((p) => favorites.has(p.id));
    }
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
      case "newest":
        list.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }
    return list;
  }, [search, selectedCats, priceMin, priceMax, selectedArtisan, onlyFav, sort, favorites]);

  const toggleCat = (slug: string) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCats(new Set());
    setPriceMin(0);
    setPriceMax(800000);
    setSelectedArtisan(null);
    setOnlyFav(false);
  };

  const activeFilterCount =
    selectedCats.size +
    (selectedArtisan !== null ? 1 : 0) +
    (onlyFav ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const FilterPanel = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-display font-semibold text-sm mb-3">Catégories</h3>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <label
              key={cat.slug}
              className="flex items-center gap-2 cursor-pointer text-sm py-1"
            >
              <input
                type="checkbox"
                checked={selectedCats.has(cat.slug)}
                onChange={() => toggleCat(cat.slug)}
                className="w-4 h-4 rounded accent-amber"
                style={{ accentColor: "var(--amber)" }}
              />
              <span className="flex-1">{cat.name}</span>
              <span className="text-xs text-ink-mute">{cat.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-display font-semibold text-sm mb-3">Prix (FCFA)</h3>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(Number(e.target.value) || 0)}
            className="w-full px-2 py-1.5 text-sm border border-border rounded-md bg-white"
            aria-label="Prix minimum"
            min={0}
            step={1000}
          />
          <span className="text-ink-mute">—</span>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value) || 0)}
            className="w-full px-2 py-1.5 text-sm border border-border rounded-md bg-white"
            aria-label="Prix maximum"
            min={0}
            step={1000}
          />
        </div>
        <input
          type="range"
          min={0}
          max={800000}
          step={10000}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: "var(--amber)" }}
          aria-label="Prix maximum"
        />
        <p className="text-xs text-ink-mute mt-1">
          Jusqu'à {priceMax.toLocaleString("fr-FR")} FCFA
        </p>
      </div>

      {/* Artisan */}
      <div>
        <h3 className="font-display font-semibold text-sm mb-3">Artisan</h3>
        <select
          value={selectedArtisan ?? ""}
          onChange={(e) =>
            setSelectedArtisan(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-white"
          aria-label="Filtrer par artisan"
        >
          <option value="">Tous les artisans</option>
          {ARTISANS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} — {a.city}
            </option>
          ))}
        </select>
      </div>

      {/* Favorites */}
      <label className="flex items-center gap-2 cursor-pointer text-sm py-1">
        <input
          type="checkbox"
          checked={onlyFav}
          onChange={(e) => setOnlyFav(e.target.checked)}
          className="w-4 h-4"
          style={{ accentColor: "var(--amber)" }}
        />
        <span>Mes favoris uniquement ({favorites.size})</span>
      </label>

      {/* Reset */}
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={resetFilters}
          className="dedco-btn dedco-btn-ghost dedco-btn-sm w-full"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );

  return (
    <div className="dedco-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="display-lg mb-2">Marketplace Dedco</h1>
        <p className="text-sm text-ink-soft">
          {filtered.length} produit{filtered.length > 1 ? "s" : ""} ·
          Fabrication artisanale béninoise · Paiement sécurisé
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit, une matière, un style..."
          className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-amber"
          aria-label="Rechercher dans la marketplace"
        />
      </div>

      <div className="flex gap-6">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="dedco-card p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold">Filtres</h2>
              {activeFilterCount > 0 && (
                <span className="dedco-badge dedco-badge-amber">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {FilterPanel}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <button
              type="button"
              onClick={() => setShowFiltersMobile(true)}
              className="lg:hidden dedco-btn dedco-btn-ghost dedco-btn-sm"
            >
              <SlidersHorizontal size={16} />
              Filtres
              {activeFilterCount > 0 && (
                <span className="dedco-badge dedco-badge-amber">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <label htmlFor="sort-select" className="text-sm text-ink-soft">
                Trier :
              </label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="px-3 py-1.5 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-amber"
              >
                <option value="pertinence">Pertinence</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="rating">Mieux notés</option>
                <option value="newest">Nouveautés</option>
              </select>
            </div>
          </div>

          {/* Products grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFav={favorites.has(product.id)}
                  onToggleFav={toggleFav}
                  onOpen={(id) => onNavigate({ name: "product", id })}
                />
              ))}
            </div>
          ) : (
            <div className="dedco-card p-12 text-center">
              <p className="font-display font-semibold text-lg mb-2">
                Aucun produit trouvé
              </p>
              <p className="text-sm text-ink-soft mb-4">
                Essayez de modifier vos filtres ou votre recherche.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="dedco-btn dedco-btn-primary"
              >
                Réinitialiser
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {showFiltersMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFiltersMobile(false)}
            aria-hidden
          />
          <div className="relative bg-cream h-[85vh] mt-auto rounded-t-2xl flex flex-col dedco-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-display font-bold text-lg">Filtres</h2>
              <button
                type="button"
                onClick={() => setShowFiltersMobile(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-warm"
                aria-label="Fermer les filtres"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 dedco-scroll">
              {FilterPanel}
            </div>
            <div className="p-4 border-t border-border bg-white">
              <button
                type="button"
                onClick={() => setShowFiltersMobile(false)}
                className="dedco-btn dedco-btn-primary w-full"
              >
                Voir {filtered.length} produit{filtered.length > 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
