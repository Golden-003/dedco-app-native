"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Search,
  Filter,
  ChevronDown,
  ImageOff,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { PRODUCTS, formatFCFA } from "@/lib/dedco-data-expanded";

// ── Enhanced product list for Kofi (artisanId 1) with statuses ──
type ProductStatus = "en_ligne" | "en_attente" | "epuise";

interface MyProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: ProductStatus;
  image: string;
  category: string;
  reviews: number;
}

const MY_PRODUCTS: MyProduct[] = [
  // Products from mock data with artisanId 1
  {
    id: 1,
    name: "Table basse Bénin Wax",
    price: 185000,
    stock: 3,
    status: "en_ligne",
    image: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=400&q=75",
    category: "Tables",
    reviews: 23,
  },
  {
    id: 5,
    name: "Commode Porto-Novo",
    price: 385000,
    stock: 2,
    status: "en_ligne",
    image: "https://images.unsplash.com/photo-1517467139951-f5a925c9f9de?auto=format&fit=crop&w=400&q=75",
    category: "Rangements",
    reviews: 8,
  },
  {
    id: 9,
    name: "Bibliothèque Yoruba",
    price: 295000,
    stock: 3,
    status: "en_ligne",
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=400&q=75",
    category: "Rangements",
    reviews: 14,
  },
  // Additional mock products for Kofi
  {
    id: 101,
    name: "Étagère Adja",
    price: 125000,
    stock: 5,
    status: "en_ligne",
    image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=400&q=75",
    category: "Rangements",
    reviews: 6,
  },
  {
    id: 102,
    name: "Bureau Mahi",
    price: 210000,
    stock: 4,
    status: "en_ligne",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=75",
    category: "Tables",
    reviews: 11,
  },
  {
    id: 103,
    name: "Cadre Sculpté Dan",
    price: 35000,
    stock: 8,
    status: "en_ligne",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=400&q=75",
    category: "Décoration",
    reviews: 19,
  },
  {
    id: 104,
    name: "Tablette Agossou",
    price: 75000,
    stock: 0,
    status: "en_attente",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=75",
    category: "Tables",
    reviews: 3,
  },
  {
    id: 105,
    name: "Tabouret Djembe",
    price: 45000,
    stock: 0,
    status: "epuise",
    image: "https://images.unsplash.com/photo-1503602642458-232111411651?auto=format&fit=crop&w=400&q=75",
    category: "Tables",
    reviews: 7,
  },
];

const STATUS_MAP: Record<ProductStatus, { label: string; badge: string }> = {
  en_ligne: { label: "En ligne", badge: "dedco-badge dedco-badge-forest" },
  en_attente: { label: "En attente", badge: "dedco-badge dedco-badge-amber" },
  epuise: { label: "Épuisé", badge: "dedco-badge dedco-badge-terra" },
};

const FILTER_TABS: { key: "all" | ProductStatus; label: string; count: number }[] = [
  { key: "all", label: "Tous", count: MY_PRODUCTS.length },
  { key: "en_ligne", label: "En ligne", count: 6 },
  { key: "en_attente", label: "En attente", count: 1 },
  { key: "epuise", label: "Épuisé", count: 1 },
];

const container = {
  animate: { transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function ArtisanProductsPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const [filter, setFilter] = useState<"all" | ProductStatus>("all");
  const [search, setSearch] = useState("");

  const filtered = MY_PRODUCTS.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.section
      variants={container}
      initial="initial"
      animate="animate"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10"
    >
      {/* ── Header ── */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div>
          <button
            type="button"
            onClick={() => navigate({ page: "artisan-dashboard" })}
            className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] transition-colors mb-1 inline-flex items-center gap-1"
          >
            ← Tableau de bord
          </button>
          <h1 className="display-lg font-bold text-[var(--text-1)]">
            Mes Produits
          </h1>
          <p className="text-sm text-[var(--text-3)] mt-1">
            {MY_PRODUCTS.length} produits au total
          </p>
        </div>
        <button
          type="button"
          className="dedco-btn dedco-btn-primary flex-shrink-0"
        >
          <Plus size={18} />
          Ajouter un produit
        </button>
      </motion.div>

      {/* ── Filters ── */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6"
      >
        <div className="flex gap-1.5 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors ${
                filter === tab.key
                  ? "bg-[var(--amber)] text-white font-semibold"
                  : "bg-[var(--bg-warm)] text-[var(--text-2)] hover:text-[var(--text-1)]"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filter === tab.key
                    ? "bg-card/20 text-white"
                    : "bg-[var(--bg-cream)] text-[var(--text-3)]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]"
          />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-56 pl-9 pr-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-card focus:outline-none focus:border-[var(--amber)]"
          />
        </div>
      </motion.div>

      {/* ── Product Grid (mobile: cards) ── */}
      {filtered.length === 0 ? (
        <div className="dedco-card p-12 text-center">
          <Package className="mx-auto mb-3 text-[var(--text-3)]" size={40} />
          <p className="text-[var(--text-2)] font-medium">Aucun produit trouvé</p>
          <p className="text-sm text-[var(--text-3)] mt-1">
            Essayez de modifier vos filtres
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {filtered.map((product) => {
              const status = STATUS_MAP[product.status];
              return (
                <motion.div
                  key={product.id}
                  variants={fadeUp}
                  className="dedco-card overflow-hidden"
                >
                  <div className="flex gap-3 p-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--bg-warm)]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--text-1)] truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-[var(--text-3)] mt-0.5">
                            {product.category}
                          </p>
                        </div>
                        <span className={status.badge}>{status.label}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-numeric text-sm font-bold text-[var(--amber)]">
                          {formatFCFA(product.price)}
                        </p>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            className="w-8 h-8 rounded-md bg-[var(--bg-warm)] flex items-center justify-center hover:bg-[var(--amber-pale)] transition-colors"
                            title="Modifier"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-md bg-[var(--bg-warm)] flex items-center justify-center hover:bg-[var(--terracotta-pale)] transition-colors text-[var(--text-3)] hover:text-[var(--terracotta)]"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-3)] mt-1">
                        Stock : {product.stock > 0 ? product.stock : "Rupture"} · {product.reviews} avis
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block dedco-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-warm)]/40">
                  <th className="text-left text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider px-4 py-3">
                    Produit
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider px-4 py-3">
                    Catégorie
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider px-4 py-3">
                    Prix
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider px-4 py-3">
                    Stock
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider px-4 py-3">
                    Statut
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider px-4 py-3">
                    Avis
                  </th>
                  <th className="text-right text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((product) => {
                  const status = STATUS_MAP[product.status];
                  return (
                    <motion.tr
                      key={product.id}
                      variants={fadeUp}
                      className="hover:bg-[var(--bg-warm)]/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--bg-warm)]">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[var(--text-1)] truncate max-w-[200px]">
                              {product.name}
                            </p>
                            <p className="text-xs text-[var(--text-3)]">#{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-2)]">
                        {product.category}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-numeric text-sm font-bold text-[var(--text-1)]">
                          {formatFCFA(product.price)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-numeric text-sm ${
                            product.stock === 0
                              ? "text-[var(--terracotta)]"
                              : product.stock <= 2
                                ? "text-[var(--amber)]"
                                : "text-[var(--text-1)]"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={status.badge}>{status.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-numeric text-sm text-[var(--text-2)]">
                          {product.reviews}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            className="w-8 h-8 rounded-md hover:bg-[var(--amber-pale)] transition-colors flex items-center justify-center text-[var(--text-2)] hover:text-[var(--amber)]"
                            title="Modifier"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-md hover:bg-[var(--terracotta-pale)] transition-colors flex items-center justify-center text-[var(--text-3)] hover:text-[var(--terracotta)]"
                            title="Supprimer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </motion.section>
  );
}
