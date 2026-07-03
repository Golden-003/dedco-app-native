"use client";

import { useState } from "react";
import {
  TrendingUp, ShoppingBag, Star, Users, ArrowUpRight, Package, Clock, CheckCircle2,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { ARTISANS, formatFCFA } from "@/lib/dedco-data";

type Period = "7j" | "30j" | "3mo" | "1an";
const PERIODS: Period[] = ["7j", "30j", "3mo", "1an"];
const PERIOD_LABELS: Record<Period, string> = { "7j": "7 jours", "30j": "30 jours", "3mo": "3 mois", "1an": "1 an" };

// Données mock adaptées à la période
const STATS_DATA: Record<Period, { revenue: number; orders: number; rating: number; clients: number }> = {
  "7j": { revenue: 285000, orders: 3, rating: 4.8, clients: 2 },
  "30j": { revenue: 1250000, orders: 12, rating: 4.9, clients: 8 },
  "3mo": { revenue: 3200000, orders: 28, rating: 4.9, clients: 19 },
  "1an": { revenue: 12500000, orders: 87, rating: 4.9, clients: 52 },
};

// Graphique revenus (barres CSS)
const CHART_DATA: Record<Period, { label: string; value: number }[]> = {
  "7j": [
    { label: "Lun", value: 0 }, { label: "Mar", value: 85000 }, { label: "Mer", value: 0 },
    { label: "Jeu", value: 120000 }, { label: "Ven", value: 0 }, { label: "Sam", value: 80000 }, { label: "Dim", value: 0 },
  ],
  "30j": [
    { label: "S1", value: 280000 }, { label: "S2", value: 350000 },
    { label: "S3", value: 420000 }, { label: "S4", value: 200000 },
  ],
  "3mo": [
    { label: "Avr", value: 980000 }, { label: "Mai", value: 1150000 }, { label: "Juin", value: 1070000 },
  ],
  "1an": [
    { label: "T1", value: 2800000 }, { label: "T2", value: 3500000 },
    { label: "T3", value: 3100000 }, { label: "T4", value: 3100000 },
  ],
};

// Top produits
const TOP_PRODUCTS = [
  { name: "Table basse Bénin Wax", units: 23, revenue: 4255000 },
  { name: "Commode Porto-Novo", units: 12, revenue: 4620000 },
  { name: "Bibliothèque Yoruba", units: 9, revenue: 2655000 },
  { name: "Tabouret Tamtam", units: 31, revenue: 1178000 },
];

// Projets en cours
const ACTIVE_PROJECTS = [
  { id: "CMD-0042", client: "Sophie K.", item: "Table basse Wax", progress: 60, dueDate: "20 fév" },
  { id: "CMD-0045", client: "Marc A.", item: "Commode Porto-Novo", progress: 15, dueDate: "5 mars" },
  { id: "CMD-0048", client: "Bob M.", item: "Tabourets ×2", progress: 80, dueDate: "18 fév" },
];

export function ArtisanStatsPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const [period, setPeriod] = useState<Period>("30j");
  const stats = STATS_DATA[period];
  const chartData = CHART_DATA[period];
  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  const statCards = [
    { label: "Revenus", value: formatFCFA(stats.revenue), icon: TrendingUp, change: "+18%", color: "var(--forest)", bg: "var(--forest-pale)" },
    { label: "Commandes", value: stats.orders.toString(), icon: ShoppingBag, change: "+12%", color: "var(--amber)", bg: "var(--amber-pale)" },
    { label: "Note moyenne", value: stats.rating.toString(), icon: Star, change: "+0.2", color: "var(--terracotta)", bg: "var(--terracotta-pale)" },
    { label: "Nouveaux clients", value: stats.clients.toString(), icon: Users, change: "+30%", color: "var(--amber)", bg: "var(--amber-pale)" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate({ page: "artisan-dashboard" })}
          className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] transition-colors mb-1 inline-flex items-center gap-1"
        >
          ← Tableau de bord
        </button>
        <h1 className="display-lg">Statistiques</h1>
        <p className="text-sm text-[var(--text-3)] mt-1">Performance de votre atelier sur {PERIOD_LABELS[period]}</p>
      </div>

      {/* Sélecteur de période */}
      <div className="flex gap-2 mb-6">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              period === p
                ? "bg-[var(--amber)] text-white"
                : "bg-card border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-dark)]"
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="dedco-card p-4 sm:p-5">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: stat.bg, color: stat.color }}
                >
                  <Icon size={20} />
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
            </div>
          );
        })}
      </div>

      {/* Graphique revenus */}
      <div className="dedco-card p-5 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-semibold text-lg">Revenus</h2>
            <p className="text-sm text-[var(--text-3)] mt-0.5">{PERIOD_LABELS[period]}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-3)]">Total</p>
            <p className="font-numeric font-bold text-[var(--amber)] text-lg">
              {formatFCFA(chartData.reduce((s, d) => s + d.value, 0))}
            </p>
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-2 sm:gap-4 h-40 sm:h-48">
          {chartData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t-md min-h-[4px] transition-all duration-500 group relative cursor-pointer"
                  style={{
                    height: `${(d.value / maxValue) * 100}%`,
                    backgroundColor: d.value > 0 ? "var(--amber)" : "var(--border)",
                  }}
                >
                  {/* Tooltip */}
                  {d.value > 0 && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[var(--amber)] text-white text-[10px] font-numeric whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {formatFCFA(d.value)}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] sm:text-xs text-[var(--text-3)] font-medium">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2 colonnes : Top produits + Projets en cours */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top produits */}
        <div className="dedco-card p-5 sm:p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Produits les plus vendus</h2>
          <div className="space-y-3">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
                <span className="font-numeric text-xs font-bold text-[var(--text-3)] w-5 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-1)] truncate">{p.name}</p>
                  <p className="text-xs text-[var(--text-3)] font-numeric">{p.units} vendus</p>
                </div>
                <span className="font-numeric text-sm font-bold text-[var(--amber)]">{formatFCFA(p.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projets en cours */}
        <div className="dedco-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">Fabrications en cours</h2>
            <Package size={18} className="text-[var(--text-3)]" />
          </div>
          <div className="space-y-4">
            {ACTIVE_PROJECTS.map((p) => (
              <div key={p.id} className="pb-3 border-b border-[var(--border)] last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-medium">{p.item}</p>
                    <p className="text-xs text-[var(--text-3)] font-numeric">{p.id} · {p.client} · échéance {p.dueDate}</p>
                  </div>
                  <span className={`text-xs font-semibold ${p.progress >= 80 ? "text-[var(--forest)]" : p.progress >= 40 ? "text-[var(--amber)]" : "text-[var(--text-3)]"}`}>
                    {p.progress}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-2 bg-[var(--bg-warm)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${p.progress >= 80 ? "bg-[var(--forest)]" : "bg-[var(--amber)]"}`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
