"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Shield,
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { ARTISANS, levelLabel } from "@/lib/dedco-data";

// ============================================================
// Level badge color mapping per spec: N1→gray, N2→amber, N3→amber-solid, N4→forest
// ============================================================

const LEVEL_BADGE: Record<string, string> = {
  N1: "dedco-badge dedco-badge-gray",
  N2: "dedco-badge dedco-badge-amber",
  N3: "dedco-badge dedco-badge-amber-solid",
  N4: "dedco-badge dedco-badge-forest",
};

// ============================================================
// Unique filter values
// ============================================================

const SPECIALTIES = Array.from(new Set(ARTISANS.map((a) => a.specialty))).sort();
const CITIES = Array.from(new Set(ARTISANS.map((a) => a.city))).sort();
const LEVELS = ["N1", "N2", "N3", "N4"];

// ============================================================
// Stagger animation
// ============================================================

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// ============================================================
// ArtisansListingPage
// ============================================================

export function ArtisansListingPage() {
  const navigate = useDedcoStore((s) => s.navigate);

  // ── Filter state ──
  const [search, setSearch] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // ── Filtering ──
  const filtered = useMemo(() => {
    let list = ARTISANS.slice();
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.specialty.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q)
      );
    }
    if (activeSpecialty) list = list.filter((a) => a.specialty === activeSpecialty);
    if (activeCity) list = list.filter((a) => a.city === activeCity);
    if (activeLevel) list = list.filter((a) => a.level === activeLevel);
    return list;
  }, [search, activeSpecialty, activeCity, activeLevel]);

  const clearFilters = () => {
    setSearch("");
    setActiveSpecialty(null);
    setActiveCity(null);
    setActiveLevel(null);
  };

  const hasFilters = search.trim() || activeSpecialty || activeCity || activeLevel;

  // ── Chip helper ──
  const FilterChip = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
        active
          ? "bg-amber text-white"
          : "bg-[var(--bg-warm)] text-[var(--text-2)] hover:bg-[var(--border)]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-cream)]">
      {/* ── Header ── */}
      <section className="pt-10 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-1)]">
            Nos Artisans
          </h1>
          <p className="mt-2 text-[var(--text-2)] text-base sm:text-lg max-w-xl">
            Découvrez les créateurs béninois qui transforment votre intérieur
          </p>
        </motion.div>
      </section>

      {/* ── Filter bar ── */}
      <section className="sticky top-16 z-20 bg-[var(--bg-cream)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Search + toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un artisan..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-[var(--border)] text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-amber/30 focus:border-amber transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-1)]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="dedco-btn-ghost flex items-center gap-1.5 text-sm lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Filtres
            </button>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-[var(--text-3)] hover:text-[var(--text-1)] underline transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div
            className={`mt-3 flex flex-wrap gap-2 overflow-x-auto dedco-hide-scroll pb-1 transition-all ${
              showFilters ? "max-h-40" : "max-h-0 lg:max-h-40 overflow-hidden lg:overflow-visible"
            }`}
          >
            {/* Specialty chips — always visible on lg */}
            <div className="flex items-center gap-1.5 mr-2">
              <span className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider shrink-0 hidden lg:inline">
                Spécialité
              </span>
              {SPECIALTIES.map((s) => (
                <FilterChip
                  key={s}
                  label={s}
                  active={activeSpecialty === s}
                  onClick={() => setActiveSpecialty(activeSpecialty === s ? null : s)}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5 mr-2">
              <span className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider shrink-0 hidden lg:inline">
                Ville
              </span>
              {CITIES.map((c) => (
                <FilterChip
                  key={c}
                  label={c}
                  active={activeCity === c}
                  onClick={() => setActiveCity(activeCity === c ? null : c)}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider shrink-0 hidden lg:inline">
                Niveau
              </span>
              {LEVELS.map((l) => (
                <FilterChip
                  key={l}
                  label={`${l} — ${levelLabel(l)}`}
                  active={activeLevel === l}
                  onClick={() => setActiveLevel(activeLevel === l ? null : l)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Results count ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <p className="text-sm text-[var(--text-3)]">
          {filtered.length} artisan{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Artisan grid ── */}
      {filtered.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-warm)] flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-[var(--text-3)]" />
          </div>
          <h3 className="font-display font-semibold text-lg text-[var(--text-1)] mb-1">
            Aucun artisan trouvé
          </h3>
          <p className="text-sm text-[var(--text-3)] mb-4">
            Essayez de modifier vos critères de recherche
          </p>
          <button type="button" onClick={clearFilters} className="dedco-btn dedco-btn-primary text-sm">
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filtered.map((artisan) => (
              <motion.article
                key={artisan.id}
                variants={item}
                className="dedco-card flex flex-col p-5"
              >
                {/* Top row: avatar + name + badges */}
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                    className="w-14 h-14 rounded-full object-cover shrink-0 ring-2 ring-[var(--border)]"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-semibold text-[var(--text-1)] text-base leading-tight truncate">
                        {artisan.name}
                      </h3>
                      {artisan.verified && (
                        <Shield
                          size={14}
                          className="text-forest shrink-0"
                          fill="var(--forest-pale)"
                        />
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-2)] mt-0.5 truncate">
                      {artisan.specialty}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-[var(--text-3)] mt-1">
                      <MapPin size={12} />
                      {artisan.city}
                    </div>
                  </div>
                </div>

                {/* Level badge */}
                <div className="mb-3">
                  <span className={LEVEL_BADGE[artisan.level] || "dedco-badge dedco-badge-gray"}>
                    {artisan.level} — {levelLabel(artisan.level)}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < Math.round(artisan.rating)
                            ? "star"
                            : "star empty"
                        }
                        fill={i < Math.round(artisan.rating) ? "currentColor" : "none"}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-numeric text-[var(--text-2)]">
                    {artisan.rating} ({artisan.reviews})
                  </span>
                </div>

                {/* Trust score bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-[var(--text-3)] mb-1">
                    <span>Score de confiance</span>
                    <span className="font-numeric">{artisan.trust}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--bg-warm)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background:
                          artisan.trust >= 80
                            ? "var(--forest)"
                            : artisan.trust >= 60
                              ? "var(--amber)"
                              : "var(--text-3)",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${artisan.trust}%` }}
                      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Spacer pushes button down */}
                <div className="mt-auto">
                  <button
                    type="button"
                    onClick={() => navigate({ page: "artisan", id: artisan.id })}
                    className="dedco-btn dedco-btn-secondary w-full text-sm"
                  >
                    Voir le profil
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}