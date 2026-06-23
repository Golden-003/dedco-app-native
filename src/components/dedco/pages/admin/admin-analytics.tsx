"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingCart, Award, AlertTriangle } from "lucide-react";
import { formatFCFA } from "@/lib/dedco-data";

type Period = "7j" | "30j" | "3mo" | "1an";

const PERIODS: Period[] = ["7j", "30j", "3mo", "1an"];

// Revenue monthly data
const REVENUE_DATA = [
  { month: "Oct", value: 28 },
  { month: "Nov", value: 35 },
  { month: "Déc", value: 42 },
  { month: "Jan", value: 50 },
  { month: "Fév", value: 45 },
  { month: "Mar", value: 58 },
];

// Top categories
const CATEGORIES_DATA = [
  { name: "Mobilier", value: 42 },
  { name: "Décoration", value: 28 },
  { name: "Textile", value: 15 },
  { name: "Luminaires", value: 10 },
  { name: "Art mural", value: 5 },
];

// Top artisans
const TOP_ARTISANS = [
  { name: "Kofi Akindélé", revenue: 4_850_000, orders: 42, city: "Cotonou" },
  { name: "Amara Dossou", revenue: 3_200_000, orders: 35, city: "Porto-Novo" },
  { name: "Faustin Kodjo", revenue: 2_890_000, orders: 28, city: "Cotonou" },
  { name: "Rachidatou Bello", revenue: 1_750_000, orders: 19, city: "Ouidah" },
  { name: "Adjovi Agbo", revenue: 1_340_000, orders: 15, city: "Abomey-Calavi" },
];

// User growth (simple CSS line)
const USER_GROWTH = [320, 480, 590, 710, 820, 950, 1050, 1150, 1247];

const KEY_METRICS = [
  {
    label: "Panier moyen",
    value: "125 000 FCFA",
    icon: <ShoppingCart size={18} />,
    color: "var(--amber)",
    bg: "var(--amber-pale)",
  },
  {
    label: "Taux de conversion",
    value: "3.2%",
    icon: <TrendingUp size={18} />,
    color: "var(--forest)",
    bg: "var(--forest-pale)",
  },
  {
    label: "Artisans N4",
    value: "8 / 56",
    icon: <Award size={18} />,
    color: "var(--amber-dark)",
    bg: "var(--amber-pale)",
  },
  {
    label: "Litiges",
    value: "2.1%",
    icon: <AlertTriangle size={18} />,
    color: "var(--terracotta)",
    bg: "var(--terracotta-pale)",
  },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30j");

  return (
          <motion.div variants={stagger} initial="initial" animate="animate">
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-1)]">
              Analytics
            </h1>
            <p className="text-sm text-[var(--text-3)] mt-1">
              Statistiques de la plateforme
            </p>
          </div>
          <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  period === p
                    ? "bg-[var(--amber)] text-white"
                    : "text-[var(--text-2)] hover:bg-[var(--bg-warm)]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div variants={fadeUp} className="dedco-card p-5 mb-6">
          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-1">
            Chiffre d&apos;affaires
          </h3>
          <p className="text-xs text-[var(--text-3)] mb-6">
            Revenus mensuels (en millions FCFA)
          </p>
          <div className="flex items-end gap-3 md:gap-5 h-48">
            {REVENUE_DATA.map((bar, i) => (
              <div
                key={bar.month}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <span className="text-[10px] font-numeric font-medium text-[var(--text-2)]">
                  {bar.value}M
                </span>
                <motion.div
                  className="w-full rounded-t-md relative group"
                  style={{
                    backgroundColor: "var(--amber)",
                    opacity: 0.25 + (bar.value / 100) * 0.75,
                  }}
                  initial={{ height: 0 }}
                  animate={{
                    height: `${(bar.value / 60) * 100}%`,
                  }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                />
                <span className="text-[11px] text-[var(--text-3)] font-medium">
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {KEY_METRICS.map((m) => (
            <div key={m.label} className="dedco-card p-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: m.bg, color: m.color }}
              >
                {m.icon}
              </div>
              <p className="font-numeric text-lg font-bold text-[var(--text-1)]">
                {m.value}
              </p>
              <p className="text-xs text-[var(--text-3)] mt-0.5">{m.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Top Categories */}
          <motion.div variants={fadeUp} className="dedco-card p-5">
            <h3 className="text-sm font-semibold text-[var(--text-1)] mb-5">
              Catégories populaires
            </h3>
            <div className="flex flex-col gap-3">
              {CATEGORIES_DATA.map((cat) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-2)] w-20 shrink-0 truncate">
                    {cat.name}
                  </span>
                  <div className="flex-1 h-6 bg-[var(--bg-cream)] rounded-md overflow-hidden">
                    <motion.div
                      className="h-full rounded-md"
                      style={{ backgroundColor: "var(--amber)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.value}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  <span className="font-numeric text-xs text-[var(--text-3)] w-8 text-right">
                    {cat.value}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Artisans */}
          <motion.div variants={fadeUp} className="dedco-card p-5">
            <h3 className="text-sm font-semibold text-[var(--text-1)] mb-4">
              Top artisans
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider">
                      Artisan
                    </th>
                    <th className="text-right py-2 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider">
                      CA
                    </th>
                    <th className="text-right py-2 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider hidden sm:table-cell">
                      Commandes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_ARTISANS.map((a, i) => (
                    <tr
                      key={a.name}
                      className="border-b border-[var(--border)] last:border-0"
                    >
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[var(--amber-pale)] text-[var(--amber-dark)] text-[10px] font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-medium text-[var(--text-1)] text-sm">
                              {a.name}
                            </p>
                            <p className="text-[10px] text-[var(--text-3)]">
                              {a.city}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 text-right font-numeric font-medium text-[var(--text-1)] text-sm">
                        {formatFCFA(a.revenue)}
                      </td>
                      <td className="py-2.5 text-right font-numeric text-[var(--text-3)] text-xs hidden sm:table-cell">
                        {a.orders}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* User Growth */}
        <motion.div variants={fadeUp} className="dedco-card p-5">
          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-1">
            Croissance des utilisateurs
          </h3>
          <p className="text-xs text-[var(--text-3)] mb-6">
            Évolution sur les 9 derniers mois
          </p>
          <div className="relative h-40 flex items-end">
            {/* Y axis labels */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-numeric text-[var(--text-3)] pr-2">
              <span>1 247</span>
              <span>800</span>
              <span>320</span>
            </div>
            {/* Chart area */}
            <div className="ml-10 flex-1 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-dashed border-[var(--border)]" />
                <div className="border-b border-dashed border-[var(--border)]" />
                <div className="border-b border-[var(--border)]" />
              </div>
              {/* SVG Line */}
              <svg
                viewBox="0 0 200 100"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="lineGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--amber)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d={USER_GROWTH.map((v, i) => {
                    const x = (i / (USER_GROWTH.length - 1)) * 200;
                    const y = 100 - ((v - 300) / (1300 - 300)) * 100;
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                  }).join(" ")}
                  fill="none"
                  stroke="var(--amber)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <motion.path
                  d={
                    USER_GROWTH.map((v, i) => {
                      const x = (i / (USER_GROWTH.length - 1)) * 200;
                      const y = 100 - ((v - 300) / (1300 - 300)) * 100;
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                    }).join(" ") +
                    ` L 200 100 L 0 100 Z`
                  }
                  fill="url(#lineGrad)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                {/* Dots */}
                {USER_GROWTH.map((v, i) => {
                  const x = (i / (USER_GROWTH.length - 1)) * 200;
                  const y = 100 - ((v - 300) / (1300 - 300)) * 100;
                  return (
                    <motion.circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="2.5"
                      fill="var(--amber)"
                      initial={{ r: 0 }}
                      animate={{ r: 2.5 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          {/* X axis labels */}
          <div className="ml-10 flex justify-between mt-2">
            {["Juil", "Août", "Sep", "Oct", "Nov", "Déc", "Jan", "Fév", "Mar"].map(
              (m) => (
                <span
                  key={m}
                  className="text-[10px] font-numeric text-[var(--text-3)]"
                >
                  {m}
                </span>
              )
            )}
          </div>
        </motion.div>
      </motion.div>
      );
}