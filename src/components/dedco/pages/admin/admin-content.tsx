"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Eye,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  Layers,
  Layout,
  Newspaper,
} from "lucide-react";
import { AdminLayout } from "./admin-layout";
import { MAGAZINE } from "@/lib/dedco-data";

type ContentTab = "magazine" | "moodboards" | "scenes" | "banners";

const TABS: { key: ContentTab; label: string; icon: React.ReactNode }[] = [
  { key: "magazine", label: "Magazine", icon: <Newspaper size={16} /> },
  { key: "moodboards", label: "Moodboards", icon: <Layers size={16} /> },
  { key: "scenes", label: "Scènes", icon: <Layout size={16} /> },
  { key: "banners", label: "Bannières", icon: <ImageIcon size={16} /> },
];

// Magazine article statuses
const ARTICLE_STATUSES: Record<number, { label: string; badge: string }> = {
  1: { label: "Publié", badge: "dedco-badge-forest" },
  2: { label: "Brouillon", badge: "dedco-badge-gray" },
  3: { label: "Publié", badge: "dedco-badge-forest" },
  4: { label: "En revue", badge: "dedco-badge-amber" },
  5: { label: "Publié", badge: "dedco-badge-forest" },
  6: { label: "Publié", badge: "dedco-badge-forest" },
};

// Mock moodboards
const MOODBOARDS = [
  { id: 1, title: "Salon Afro-Luxe", pins: 12, cover: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=400&q=80" },
  { id: 2, title: "Chambre Zen Tropical", pins: 8, cover: "https://images.unsplash.com/photo-1656403002413-2ac6137237d6?auto=format&fit=crop&w=400&q=80" },
  { id: 3, title: "Bureau Minimaliste", pins: 6, cover: "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?auto=format&fit=crop&w=400&q=80" },
  { id: 4, title: "Entrée Sculpturale", pins: 15, cover: "https://images.unsplash.com/photo-1617364852223-75f57e78dc96?auto=format&fit=crop&w=400&q=80" },
  { id: 5, title: "Terrasse Bohème", pins: 9, cover: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=400&q=80" },
  { id: 6, title: "Salle à Manger Royale", pins: 11, cover: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80" },
];

// Mock scenes for admin
const ADMIN_SCENES = [
  { id: 1, title: "Salon Afro-Contemporain", style: "Afro-contemporain", room: "Salon", saves: 234, products: 5 },
  { id: 2, title: "Chambre Zen Tropical", style: "Zen / Tropical", room: "Chambre", saves: 189, products: 4 },
  { id: 3, title: "Bureau Minimaliste", style: "Minimaliste", room: "Bureau", saves: 156, products: 3 },
  { id: 4, title: "Salle à Manger Kente", style: "Afro-luxe", room: "Salle à manger", saves: 312, products: 5 },
  { id: 5, title: "Terrasse Bohème", style: "Bohème", room: "Terrasse", saves: 98, products: 3 },
];

// Mock banners
const BANNERS = [
  { id: 1, title: "Collection Printemps 2024", position: "Hero principal", active: true, image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80" },
  { id: 2, title: "Nouveaux Artisans", position: "Carrousel", active: true, image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=600&q=80" },
  { id: 3, title: "Promo Livraison Gratuite", position: "Bannière top", active: false, image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=600&q=80" },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function AdminContentPage() {
  const [tab, setTab] = useState<ContentTab>("magazine");

  return (
    <AdminLayout>
      <motion.div variants={stagger} initial="initial" animate="animate">
        <motion.div variants={fadeUp} className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-1)]">
            Contenu
          </h1>
          <p className="text-sm text-[var(--text-3)] mt-1">
            Gérer le contenu éditorial et les médias
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={fadeUp} className="flex gap-1 mb-6 overflow-x-auto dedco-hide-scroll pb-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                tab === t.key
                  ? "bg-[var(--amber)] text-white"
                  : "bg-[var(--bg-card)] text-[var(--text-2)] border border-[var(--border)] hover:bg-[var(--bg-warm)]"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ── MAGAZINE TAB ── */}
          {tab === "magazine" && (
            <motion.div
              key="magazine"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-end mb-4">
                <button className="dedco-btn dedco-btn-primary dedco-btn-sm gap-1.5">
                  <Plus size={15} />
                  Créer un article
                </button>
              </div>
              <div className="dedco-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-[var(--bg-cream)]">
                        <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider">
                          Article
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider hidden md:table-cell">
                          Auteur
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider hidden sm:table-cell">
                          Date
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
                      {MAGAZINE.map((article) => {
                        const st = ARTICLE_STATUSES[article.id] ?? {
                          label: "Publié",
                          badge: "dedco-badge-forest",
                        };
                        return (
                          <tr
                            key={article.id}
                            className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-warm)]/50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={article.image}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover border border-[var(--border)]"
                                />
                                <div className="min-w-0">
                                  <p className="font-medium text-[var(--text-1)] text-sm truncate max-w-[200px]">
                                    {article.title}
                                  </p>
                                  <p className="text-xs text-[var(--text-3)]">
                                    {article.category}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[var(--text-2)] hidden md:table-cell">
                              {article.author}
                            </td>
                            <td className="px-4 py-3 font-numeric text-[var(--text-3)] text-xs hidden sm:table-cell">
                              {new Date(article.date).toLocaleDateString("fr-FR")}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`dedco-badge ${st.badge}`}>
                                {st.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  title="Voir"
                                  className="p-1.5 rounded-md hover:bg-[var(--bg-warm)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors cursor-pointer"
                                >
                                  <Eye size={15} />
                                </button>
                                <button
                                  title="Modifier"
                                  className="p-1.5 rounded-md hover:bg-[var(--bg-warm)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors cursor-pointer"
                                >
                                  <Pencil size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── MOODBOARDS TAB ── */}
          {tab === "moodboards" && (
            <motion.div
              key="moodboards"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-end mb-4">
                <button className="dedco-btn dedco-btn-primary dedco-btn-sm gap-1.5">
                  <Plus size={15} />
                  Nouveau moodboard
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {MOODBOARDS.map((mb) => (
                  <motion.div
                    key={mb.id}
                    variants={fadeUp}
                    className="dedco-card overflow-hidden group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={mb.cover}
                        alt={mb.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-[var(--text-1)] text-sm truncate">
                        {mb.title}
                      </p>
                      <p className="text-xs text-[var(--text-3)] mt-0.5 font-numeric">
                        {mb.pins} pins
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── SCENES TAB ── */}
          {tab === "scenes" && (
            <motion.div
              key="scenes"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-3">
                {ADMIN_SCENES.map((scene) => (
                  <motion.div
                    key={scene.id}
                    variants={fadeUp}
                    className="dedco-card p-4 flex items-center gap-4"
                  >
                    <div className="flex items-center text-[var(--text-3)] cursor-grab">
                      <GripVertical size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[var(--text-1)] text-sm">
                        {scene.title}
                      </p>
                      <p className="text-xs text-[var(--text-3)]">
                        {scene.style} — {scene.room}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-xs text-[var(--text-3)]">
                      <span className="font-numeric">{scene.products} produits</span>
                      <span className="font-numeric">{scene.saves} sauvegardes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        title="Modifier"
                        className="p-1.5 rounded-md hover:bg-[var(--bg-warm)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors cursor-pointer"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        title="Supprimer"
                        className="p-1.5 rounded-md hover:bg-[var(--terracotta-pale)] text-[var(--text-3)] hover:text-[var(--terracotta)] transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── BANNERS TAB ── */}
          {tab === "banners" && (
            <motion.div
              key="banners"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-end mb-4">
                <button className="dedco-btn dedco-btn-primary dedco-btn-sm gap-1.5">
                  <Plus size={15} />
                  Ajouter une bannière
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {BANNERS.map((banner) => (
                  <motion.div
                    key={banner.id}
                    variants={fadeUp}
                    className="dedco-card overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-56 aspect-video sm:aspect-auto relative shrink-0">
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="font-medium text-[var(--text-1)] text-sm">
                            {banner.title}
                          </p>
                          <p className="text-xs text-[var(--text-3)] mt-0.5">
                            Position : {banner.position}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`dedco-badge ${
                              banner.active
                                ? "dedco-badge-forest"
                                : "dedco-badge-gray"
                            }`}
                          >
                            {banner.active ? "Active" : "Inactive"}
                          </span>
                          <button
                            title="Modifier"
                            className="p-1.5 rounded-md hover:bg-[var(--bg-warm)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors cursor-pointer"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            title="Supprimer"
                            className="p-1.5 rounded-md hover:bg-[var(--terracotta-pale)] text-[var(--text-3)] hover:text-[var(--terracotta)] transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AdminLayout>
  );
}