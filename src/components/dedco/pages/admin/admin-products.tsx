"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Check,
  X,
  Pencil,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PRODUCTS, ARTISANS, formatFCFA } from "@/lib/dedco-data";
import type { Product } from "@/lib/dedco-types";

type ProductStatus = "en_ligne" | "en_attente" | "rejete";

interface AdminProduct extends Product {
  status: ProductStatus;
  artisanName: string;
}

const STATUS_MAP: Record<ProductStatus, { label: string; badge: string }> = {
  en_ligne: { label: "En ligne", badge: "dedco-badge-forest" },
  en_attente: { label: "En attente", badge: "dedco-badge-amber" },
  rejete: { label: "Rejeté", badge: "dedco-badge-terra" },
};

function getArtisanName(id: number): string {
  const a = ARTISANS.find((a) => a.id === id);
  return a ? a.name : "Inconnu";
}

// Build admin products from mock data
const ADMIN_PRODUCTS: AdminProduct[] = PRODUCTS.slice(0, 10).map((p, i) => ({
  ...p,
  status: (["en_ligne", "en_ligne", "en_ligne", "en_attente", "en_ligne", "en_attente", "en_ligne", "rejete", "en_ligne", "en_ligne"] as ProductStatus[])[i] ?? "en_ligne",
  artisanName: getArtisanName(p.artisanId),
}));

const stagger = {
  animate: { transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const CATEGORIES = [
  { slug: "all", label: "Toutes catégories" },
  { slug: "mobilier", label: "Mobilier" },
  { slug: "luminaires", label: "Luminaires" },
  { slug: "decoration", label: "Décoration" },
  { slug: "textile", label: "Textile" },
  { slug: "art", label: "Art mural" },
];

export function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const [artisanFilter, setArtisanFilter] = useState("all");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);

  const artisans = useMemo(
    () => [...new Set(ADMIN_PRODUCTS.map((p) => p.artisanName))],
    []
  );

  const filtered = useMemo(() => {
    return ADMIN_PRODUCTS.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (catFilter !== "all" && p.category !== catFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (artisanFilter !== "all" && p.artisanName !== artisanFilter) return false;
      return true;
    });
  }, [search, catFilter, statusFilter, artisanFilter]);

  const toggleSelect = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  };

  return (
          <motion.div variants={stagger} initial="initial" animate="animate">
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-1)]">
              Produits
            </h1>
            <p className="text-sm text-[var(--text-3)] mt-1">
              {filtered.length} produit{filtered.length > 1 ? "s" : ""}
            </p>
          </div>
          {selected.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-3)] font-numeric">
                {selected.size} sélectionné{selected.size > 1 ? "s" : ""}
              </span>
              <button className="dedco-btn dedco-btn-sm dedco-btn-forest gap-1">
                <Check size={14} /> Approuver
              </button>
              <button className="dedco-btn dedco-btn-sm dedco-btn-terracotta gap-1">
                <X size={14} /> Rejeter
              </button>
            </div>
          )}
        </motion.div>

        {/* Search + Filters */}
        <motion.div variants={fadeUp} className="dedco-card p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]"
              />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--bg-cream)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]/30 focus:border-[var(--amber)] transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                className="px-3 py-2.5 text-sm bg-[var(--bg-cream)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]/30 cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ProductStatus | "all")
                }
                className="px-3 py-2.5 text-sm bg-[var(--bg-cream)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]/30 cursor-pointer"
              >
                <option value="all">Tous les statuts</option>
                <option value="en_ligne">En ligne</option>
                <option value="en_attente">En attente</option>
                <option value="rejete">Rejeté</option>
              </select>
              <select
                value={artisanFilter}
                onChange={(e) => setArtisanFilter(e.target.value)}
                className="px-3 py-2.5 text-sm bg-[var(--bg-cream)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]/30 cursor-pointer"
              >
                <option value="all">Tous les artisans</option>
                {artisans.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products Table */}
        <motion.div variants={fadeUp} className="dedco-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-cream)]">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={
                        filtered.length > 0 && selected.size === filtered.length
                      }
                      onChange={toggleAll}
                      className="rounded border-[var(--border-dark)] accent-[var(--amber)] cursor-pointer"
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider hidden md:table-cell">
                    Artisan
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider hidden sm:table-cell">
                    Prix
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider hidden lg:table-cell">
                    Stock
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const st = STATUS_MAP[product.status];
                  return (
                    <motion.tr
                      key={product.id}
                      variants={fadeUp}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-warm)]/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="rounded border-[var(--border-dark)] accent-[var(--amber)] cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-[var(--border)]"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-[var(--text-1)] text-sm truncate max-w-[180px]">
                              {product.name}
                            </p>
                            <p className="text-xs text-[var(--text-3)] md:hidden">
                              {product.artisanName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-2)] hidden md:table-cell">
                        {product.artisanName}
                      </td>
                      <td className="px-4 py-3 font-numeric font-medium text-[var(--text-1)] hidden sm:table-cell">
                        {formatFCFA(product.price)}
                      </td>
                      <td className="px-4 py-3 font-numeric text-[var(--text-2)] hidden lg:table-cell">
                        {product.stock}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`dedco-badge ${st.badge}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {product.status === "en_attente" && (
                            <>
                              <button
                                title="Approuver"
                                className="p-1.5 rounded-md hover:bg-[var(--forest-pale)] text-[var(--text-3)] hover:text-[var(--forest)] transition-colors cursor-pointer"
                              >
                                <Check size={15} />
                              </button>
                              <button
                                title="Rejeter"
                                className="p-1.5 rounded-md hover:bg-[var(--terracotta-pale)] text-[var(--text-3)] hover:text-[var(--terracotta)] transition-colors cursor-pointer"
                              >
                                <X size={15} />
                              </button>
                            </>
                          )}
                          <button
                            title="Modifier"
                            className="p-1.5 rounded-md hover:bg-[var(--bg-warm)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors cursor-pointer"
                          >
                            <Pencil size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-[var(--text-3)]">
                      Aucun produit trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
      );
}