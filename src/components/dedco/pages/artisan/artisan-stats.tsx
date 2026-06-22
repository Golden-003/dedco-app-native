"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingBag,
  Star,
  Users,
  ArrowUpRight,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { ARTISANS, formatFCFA } from "@/lib/dedco-data-expanded";

// ── Period selector ──
type Period = "7j" | "30j" | "3mo" | "1an";
const PERIODS: Period[] = ["7j", "30j", "3mo", "1an"];

// ── Revenue chart data ──
const CHART_DATA: Record<Period, { label: string; value: number }[]> = {
  "7j": [
    { label: "Lun", value: 85000 },
    { label: "Mar", value: 120000 },
    { label: "Mer", value: 65000 },
    { label: "Jeu", value: 180000 },
    { label: "Ven", value: 95000 },
    { label: "Sam", value: 150000 },
    { label: "Dim", value: 45000 },
  ],
  "30j": [
    { label: "Sep", value: 180000 },
    { label: "Oct", value: 250000 },
    { label: "Nov", value: 195000 },
    { label: "Déc", value: 320000 },
    { label: "Jan", value: 285000 },
    { label: "Fév", value: 220000 },
  ],
  "3mo": [
    { label: "Oct", value: 520000 },
    { label: "Nov", value: 610000 },
    { label: "Déc", value: 780000 },
    { label: "Jan", value: 695000 },
    { label: "Fév", value: 590000 },
    { label: "Mar", value: 720000 },
  ],
  "1an": [
    { label: "Mai", value: 350000 },
    { label: "Jun", value: 420000 },
    { label: "Jul", value: 380000 },
    { label: "Aoû", value: 510000 },
    { label: "Sep", value: 475000 },
    { label: "Oct", value: 620000 },
  ],
};

// ── Top products ──
const TOP_PRODUCTS = [
  { name: "Table basse Bénin Wax", units: 12, revenue: 2220000 },
  { name: "Commode Porto-Novo", units: 8, revenue: 3080000 },
  { name: "Bibliothèque Yoruba", units: 7, revenue: 2065000 },
  { name: "Bureau Mahi", units: 6, revenue: 1260000 },
];

// ── Reviews ──
const REVIEWS = [
  {
    id: 1,
    author: "Marie Houénou",
    date: "15 Jan 2024",
    rating: 5,
    text: "Travail exceptionnel ! La table basse est magnifique, le bois iroko est de très belle qualité. Kofi a été très réactif et professionnel du début à la fin.",
  },
  {
    id: 2,
    author: "Paul Dossou",
    date: "08 Jan 2024",
    rating: 5,
    text: "La bibliothèque Yoruba est exactement ce que je cherchais. La finition est parfaite et les couleurs sont fidèles aux photos. Livraison rapide et soignée.",
  },
  {
    id: 3,
    author: "Adèle Mensah",
    date: "02 Jan 2024",
    rating: 4,
    text: "Beau bureau Mahi, très stable et bien fini. Petit retard de livraison mais la qualité compense largement. Je recommande !",
  },
];

const container = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function ArtisanStatsPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const [period, setPeriod] = useState<Period>("30j");
  const artisan = ARTISANS.find((a) => a.id === 1)!;
  const chartData = CHART_DATA[period];
  const maxValue = Math.max(...chartData.map((d) => d.value));

  const stats = [
    {
      label: "Commandes",
      value: "23",
      icon: ShoppingBag,
      change: "+12%",
      color: "var(--amber)",
      bg: "var(--amber-pale)",
    },
    {
      label: "Chiffre d'affaires",
      value: formatFCFA(1250000),
      icon: TrendingUp,
      change: "+18%",
      color: "var(--forest)",
      bg: "var(--forest-pale)",
    },
    {
      label: "Note moyenne",
      value: `${artisan.rating}`,
      icon: Star,
      change: "+0.2",
      color: "var(--terracotta)",
      bg: "var(--terracotta-pale)",
    },
    {
      label: "Nouveaux clients",
      value: "12",
      icon: Users,
      change: "+30%",
      color: "var(--amber)",
      bg: "var(--amber-pale)",
    },
  ];

  return (
    <motion.section
      variants={container}
      initial="initial"
      animate="animate"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10"
    >
      {/* ── Header ── */}
      <motion.div variants={fadeUp}>
        <button
          type="button"
          onClick={() => navigate({ page: "artisan-dashboard" })}
          className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] transition-colors mb-1 inline-flex items-center gap-1"
        >
          ← Tableau de bord
        </button>
        <h1 className="display-lg font-bold text-[var(--text-1)]">
          Statistiques
        </h1>
        <p className="text-sm text-[var(--text-3)] mt-1">
          Performance de votre atelier
        </p>
      </motion.div>

      {/* ── Period Selector ── */}
      <motion.div variants={fadeUp} className="mt-6 flex gap-1.5">
        {PERIODS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              period === p
                ? "bg-[var(--amber)] text-white"
                : "bg-white border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--border-dark)]"
            }`}
          >
            {p}
          </button>
        ))}
      </motion.div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="dedco-card p-4 sm:p-5"
          >
            <div className="flex items-start justify-between mb-2">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                <stat.icon size={18} />
              </div>
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[var(--forest)] bg-[var(--forest-pale)] px-2 py-0.5 rounded-full">
                <ArrowUpRight size={12} />
                {stat.change}
              </span>
            </div>
            <p className="font-numeric text-xl sm:text-2xl font-bold text-[var(--text-1)]">
              {stat.value}
            </p>
            <p className="text-xs text-[var(--text-3)] mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Revenue Chart ── */}
      <motion.div variants={fadeUp} className="mt-6">
        <div className="dedco-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="display-sm font-semibold text-[var(--text-1)]">
                Chiffre d'affaires
              </h2>
              <p className="text-sm text-[var(--text-3)] mt-0.5">
                Revenus sur les {period === "7j" ? "7 derniers jours" : period === "30j" ? "6 derniers mois" : "6 derniers mois"}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--forest)]">
              <BarChart3 size={18} />
              <span className="font-numeric text-sm font-bold">
                {formatFCFA(chartData.reduce((s, d) => s + d.value, 0))}
              </span>
            </div>
          </div>

          {/* CSS Bar Chart */}
          <div className="flex items-end gap-2 sm:gap-3 h-48 sm:h-56">
            {chartData.map((d, i) => (
              <div
                key={`${period}-${i}`}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / maxValue) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                  className="w-full rounded-t-md min-h-[4px] cursor-pointer group relative"
                  style={{ backgroundColor: "var(--amber)" }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-[var(--text-1)] text-white text-[10px] font-numeric whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {formatFCFA(d.value)}
                  </div>
                </motion.div>
                <span className="text-[10px] sm:text-xs text-[var(--text-3)] font-medium">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Two-column layout: Top products + Reviews ── */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* Top Products */}
        <motion.div variants={fadeUp}>
          <div className="dedco-card p-5 sm:p-6">
            <h2 className="display-sm font-semibold text-[var(--text-1)] mb-4">
              Produits les plus vendus
            </h2>
            <div className="space-y-3">
              {TOP_PRODUCTS.map((p, i) => (
                <div
                  key={p.name}
                  className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0"
                >
                  <span className="font-numeric text-xs font-bold text-[var(--text-3)] w-5 text-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-1)] truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-[var(--text-3)]">
                      {p.units} vendus
                    </p>
                  </div>
                  <span className="font-numeric text-sm font-bold text-[var(--amber)]">
                    {formatFCFA(p.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Reviews */}
        <motion.div variants={fadeUp}>
          <div className="dedco-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="display-sm font-semibold text-[var(--text-1)]">
                Avis récents
              </h2>
              <MessageSquare size={16} className="text-[var(--text-3)]" />
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto dedco-scroll">
              {REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className="py-2 border-b border-[var(--border)] last:border-0"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-semibold text-[var(--text-1)]">
                      {review.author}
                    </p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i} className="star text-xs">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-2)] leading-relaxed line-clamp-3">
                    {review.text}
                  </p>
                  <p className="text-[10px] text-[var(--text-3)] mt-1">
                    {review.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
