"use client";

import { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  X,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";
import { PRODUCTS, CATEGORIES, ARTISANS } from "@/lib/dedco-data";
import type { Route } from "@/lib/dedco-types";
import { ProductCard } from "./cards";

type SortKey =
  | "pertinence"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest";

const PRICE_PRESETS = [
  { label: "< 50k", min: 0, max: 50000 },
  { label: "50k-150k", min: 50000, max: 150000 },
  { label: "150k-400k", min: 150000, max: 400000 },
  { label: "> 400k", min: 400000, max: 1500000 },
];

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
  const [priceMax, setPriceMax] = useState(1500000);
  const [selectedArtisan, setSelectedArtisan] = useState<number | null>(null);
  const [onlyFav, setOnlyFav] = useState(false);
  const [sort, setSort] = useState<SortKey>("pertinence");
  const [showAdvanced, setShowAdvanced] = useState(false);
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
  }, [
    search,
    selectedCats,
    priceMin,
    priceMax,
    selectedArtisan,
    onlyFav,
    sort,
    favorites,
  ]);

  const toggleCat = (slug: string) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const applyPreset = (preset: { min: number; max: number }) => {
    setPriceMin(preset.min);
    setPriceMax(preset.max);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCats(new Set());
    setPriceMin(0);
    setPriceMax(1500000);
    setSelectedArtisan(null);
    setOnlyFav(false);
  };

  const activeFilterCount =
    selectedCats.size +
    (selectedArtisan !== null ? 1 : 0) +
    (onlyFav ? 1 : 0) +
    (search.trim() ? 1 : 0) +
    (priceMin > 0 || priceMax < 1500000 ? 1 : 0);

  const AdvancedPanel = (
    <div className="space-y-5">
      {/* Price presets */}
      <div>
        <h3 className="text-xs text-ink-mute uppercase tracking-wide font-semibold mb-2.5">
          Prix
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRICE_PRESETS.map((preset) => {
            const active = priceMin === preset.min && priceMax === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`px-3 py-1.5 text-xs rounded-md border transition-all font-numeric ${
                  active
                    ? "border-terracotta bg-terracotta-pale text-terracotta font-semibold"
                    : "border-border text-ink-soft hover:border-ink-mute"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <input
            type="number"
            value={priceMin || ""}
            placeholder="Min"
            onChange={(e) => setPriceMin(Number(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 text-xs border border-border rounded-md bg-white font-numeric"
            aria-label="Prix minimum"
            min={0}
            step={5000}
          />
          <span className="text-ink-mute text-xs">—</span>
          <input
            type="number"
            value={priceMax === 1500000 ? "" : priceMax}
            placeholder="Max"
            onChange={(e) =>
              setPriceMax(Number(e.target.value) || 1500000)
            }
            className="w-full px-2.5 py-1.5 text-xs border border-border rounded-md bg-white font-numeric"
            aria-label="Prix maximum"
            min={0}
            step={5000}
          />
        </div>
      </div>

      {/* Artisan */}
      <div>
        <h3 className="text-xs text-ink-mute uppercase tracking-wide font-semibold mb-2.5">
          Artisan
        </h3>
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

      {/* Favorites toggle */}
      <label className="flex items-center gap-2 cursor-pointer text-sm py-1">
        <input
          type="checkbox"
          checked={onlyFav}
          onChange={(e) => setOnlyFav(e.target.checked)}
          className="w-4 h-4"
          style={{ accentColor: "var(--terracotta)" }}
        />
        <span>
          Mes favoris uniquement{" "}
          <span className="text-ink-mute font-numeric">({favorites.size})</span>
        </span>
      </label>

      {/* Reset */}
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={resetFilters}
          className="dedco-btn dedco-btn-ghost dedco-btn-sm w-full"
        >
          Réinitialiser tout
        </button>
      )}
    </div>
  );

  return (
    <div className="dedco-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      {/* Header */}
      <div className="mb-5">
        <h1 className="display-lg mb-1">Marketplace Dedco</h1>
        <p className="text-sm text-ink-soft">
          <span className="font-numeric font-semibold text-ink">
            {filtered.length}
          </span>{" "}
          produit{filtered.length > 1 ? "s" : ""} · Fabrication artisanale
          béninoise · Paiement sécurisé
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit, une matière, un style..."
          className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-terracotta"
          aria-label="Rechercher dans la marketplace"
        />
      </div>

      {/* Category chips (always visible, scrollable) */}
      <div className="flex gap-2 overflow-x-auto dedco-hide-scroll pb-2 mb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          type="button"
          onClick={() => setSelectedCats(new Set())}
          className={`px-3.5 py-1.5 text-xs font-medium whitespace-nowrap rounded-full border transition-all flex-shrink-0 ${
            selectedCats.size === 0
              ? "bg-ink text-white border-ink"
              : "bg-white text-ink-soft border-border hover:border-ink-mute"
          }`}
        >
          Tout
        </button>
        {CATEGORIES.map((cat) => {
          const active = selectedCats.has(cat.slug);
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => toggleCat(cat.slug)}
              className={`px-3.5 py-1.5 text-xs font-medium whitespace-nowrap rounded-full border transition-all flex-shrink-0 flex items-center gap-1.5 ${
                active
                  ? "bg-terracotta text-white border-terracotta"
                  : "bg-white text-ink-soft border-border hover:border-ink-mute"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className={`font-numeric ${active ? "opacity-80" : "text-ink-mute"}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar: advanced toggle + sort */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-border">
        <button
          type="button"
          onClick={() => setShowAdvanced((s) => !s)}
          className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md border transition-all ${
            showAdvanced || activeFilterCount > 0
              ? "border-terracotta bg-terracotta-pale text-terracotta"
              : "border-border text-ink-soft hover:border-ink-mute"
          }`}
        >
          <SlidersHorizontal size={14} />
          Filtres avancés
          {activeFilterCount > 0 && (
            <span className="font-numeric bg-terracotta text-white rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px]">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}
          />
        </button>

        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs text-ink-mute hidden sm:inline">
            Trier :
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="px-3 py-2 text-xs border border-border rounded-md bg-white focus:outline-none focus:border-terracotta"
          >
            <option value="pertinence">Pertinence</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Mieux notés</option>
            <option value="newest">Nouveautés</option>
          </select>
        </div>
      </div>

      {/* Advanced panel — collapsible */}
      {showAdvanced && (
        <div className="dedco-card p-4 sm:p-5 mb-5 dedco-fade-in">
          {AdvancedPanel}
        </div>
      )}

      {/* Active filter chips (visible when filters set, even if panel closed) */}
      {activeFilterCount > 0 && !showAdvanced && (
        <div className="flex flex-wrap gap-2 mb-4">
          {search.trim() && (
            <ActiveChip
              label={`« ${search} »`}
              onClear={() => setSearch("")}
            />
          )}
          {Array.from(selectedCats).map((slug) => {
            const cat = CATEGORIES.find((c) => c.slug === slug);
            return (
              <ActiveChip
                key={slug}
                label={cat?.name || slug}
                onClear={() => toggleCat(slug)}
              />
            );
          })}
          {selectedArtisan !== null && (
            <ActiveChip
              label={ARTISANS.find((a) => a.id === selectedArtisan)?.name || ""}
              onClear={() => setSelectedArtisan(null)}
            />
          )}
          {onlyFav && (
            <ActiveChip
              label="Favoris"
              onClear={() => setOnlyFav(false)}
            />
          )}
          {(priceMin > 0 || priceMax < 1500000) && (
            <ActiveChip
              label={`${priceMin.toLocaleString("fr-FR")} — ${priceMax.toLocaleString("fr-FR")} F`}
              onClear={() => {
                setPriceMin(0);
                setPriceMax(1500000);
              }}
            />
          )}
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-terracotta hover:underline font-semibold ml-1"
          >
            Tout effacer
          </button>
        </div>
      )}

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
          <div className="w-16 h-16 rounded-full bg-warm mx-auto flex items-center justify-center mb-4">
            <Search size={24} className="text-ink-mute" />
          </div>
          <p className="font-display font-semibold text-lg mb-2">
            Aucun produit trouvé
          </p>
          <p className="text-sm text-ink-soft mb-4 max-w-md mx-auto">
            Essayez de modifier vos filtres ou votre recherche. Nous avons
            peut-être ce qu'il vous faut dans une autre catégorie.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="dedco-btn dedco-btn-primary"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Reassurance footer */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            title: "Paiement séquestré",
            desc: "Votre argent est bloqué jusqu'à validation livraison",
          },
          {
            title: "Artisans vérifiés",
            desc: "KYC + niveaux N1-N4, 87 avis en moyenne",
          },
          {
            title: "Livraison 3 temps",
            desc: "Photo à chaque étape, traçabilité totale",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="dedco-card p-4 text-center"
            style={{ background: "var(--bg-warm)" }}
          >
            <p className="font-display font-semibold text-sm mb-1">
              {item.title}
            </p>
            <p className="text-xs text-ink-soft">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActiveChip({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 text-xs font-medium rounded-full bg-terracotta-pale text-terracotta border border-terracotta/30">
      {label}
      <button
        type="button"
        onClick={onClear}
        className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-terracotta hover:text-white transition-colors"
        aria-label={`Retirer le filtre ${label}`}
      >
        <X size={10} />
      </button>
    </span>
  );
}
