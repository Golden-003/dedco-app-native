"use client";

import { motion } from "framer-motion";
import {
  Users,
  ShoppingBag,
  DollarSign,
  Wrench,
  TrendingUp,
  ArrowUpRight,
  UserPlus,
  PackageCheck,
  ShieldCheck,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { AdminLayout } from "./admin-layout";
import { formatFCFA } from "@/lib/dedco-data";

// ── KPI data ──
const KPIS = [
  {
    label: "Utilisateurs",
    value: "1 247",
    change: "+12%",
    icon: <Users size={20} />,
    color: "var(--amber)",
  },
  {
    label: "Commandes",
    value: "384",
    change: "+8%",
    icon: <ShoppingBag size={20} />,
    color: "var(--forest)",
  },
  {
    label: "Chiffre d'affaires",
    value: "45 200 000 FCFA",
    change: "+15%",
    icon: <DollarSign size={20} />,
    color: "var(--amber-dark)",
  },
  {
    label: "Artisans actifs",
    value: "56",
    change: null,
    icon: <Wrench size={20} />,
    color: "var(--forest)",
  },
];

// ── Revenue mini chart (CSS bars, last 7 days) ──
const REVENUE_BARS = [
  { day: "Lun", value: 65 },
  { day: "Mar", value: 80 },
  { day: "Mer", value: 45 },
  { day: "Jeu", value: 90 },
  { day: "Ven", value: 72 },
  { day: "Sam", value: 55 },
  { day: "Dim", value: 40 },
];

// ── Recent activity ──
const ACTIVITIES = [
  {
    id: 1,
    icon: <UserPlus size={16} />,
    iconColor: "var(--forest)",
    iconBg: "var(--forest-pale)",
    text: "Nouvel utilisateur : Aminata Zannou",
    time: "Il y a 5 min",
  },
  {
    id: 2,
    icon: <ShoppingBag size={16} />,
    iconColor: "var(--amber-dark)",
    iconBg: "var(--amber-pale)",
    text: "Commande #CMD-0472 créée — 285 000 FCFA",
    time: "Il y a 12 min",
  },
  {
    id: 3,
    icon: <ShieldCheck size={16} />,
    iconColor: "var(--forest)",
    iconBg: "var(--forest-pale)",
    text: "KYC soumis par Kossi Mensah",
    time: "Il y a 34 min",
  },
  {
    id: 4,
    icon: <PackageCheck size={16} />,
    iconColor: "var(--amber)",
    iconBg: "var(--amber-pale)",
    text: "Produit « Table Basse Adja » approuvé",
    time: "Il y a 1h",
  },
  {
    id: 5,
    icon: <AlertTriangle size={16} />,
    iconColor: "var(--terracotta)",
    iconBg: "var(--terracotta-pale)",
    text: "Litige #L-023 signalé — Commande #CMD-0451",
    time: "Il y a 2h",
  },
];

// ── Pending moderation ──
const PENDING_ITEMS = [
  {
    id: 1,
    type: "Artisan" as const,
    label: "Vérification artisan",
    detail: "Yao Agbo — Cotonou — Ébénisterie",
    badge: "KYC",
    badgeClass: "dedco-badge-amber",
  },
  {
    id: 2,
    type: "Produit" as const,
    label: "Produit en attente",
    detail: "Chaise Royale Adanzo — 175 000 FCFA",
    badge: "Revue",
    badgeClass: "dedco-badge-amber",
  },
  {
    id: 3,
    type: "Litige" as const,
    label: "Litige à traiter",
    detail: "Client: Rachida Bello — Produit endommagé",
    badge: "Urgent",
    badgeClass: "dedco-badge-terra",
  },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function AdminDashboardPage() {
  return (
    <AdminLayout>
      <motion.div variants={stagger} initial="initial" animate="animate">
        <motion.div variants={fadeUp} className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-1)]">
            Tableau de bord
          </h1>
          <p className="text-sm text-[var(--text-3)] mt-1">
            Vue d&apos;ensemble de la plateforme DEDCO
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {KPIS.map((kpi) => (
            <div key={kpi.label} className="dedco-card p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${kpi.color}18`, color: kpi.color }}
                >
                  {kpi.icon}
                </div>
                {kpi.change && (
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-[var(--forest)]">
                    <TrendingUp size={12} />
                    {kpi.change}
                  </span>
                )}
              </div>
              <p className="font-numeric text-lg md:text-xl font-bold text-[var(--text-1)]">
                {kpi.value}
              </p>
              <p className="text-xs text-[var(--text-3)] mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Revenue Chart */}
          <motion.div variants={fadeUp} className="lg:col-span-2 dedco-card p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-1)]">
                  Revenus — 7 derniers jours
                </h3>
                <p className="text-xs text-[var(--text-3)] mt-0.5">
                  Données en temps réel
                </p>
              </div>
              <span className="font-numeric text-sm font-semibold text-[var(--amber-dark)]">
                {formatFCFA(6_450_000)}
              </span>
            </div>
            <div className="flex items-end gap-2 md:gap-3 h-40">
              {REVENUE_BARS.map((bar) => (
                <div
                  key={bar.day}
                  className="flex-1 flex flex-col items-center gap-1.5"
                >
                  <motion.div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${(bar.value / 100) * 100}%`,
                      backgroundColor: "var(--amber)",
                      opacity: 0.2 + (bar.value / 100) * 0.8,
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(bar.value / 100) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                  />
                  <span className="text-[10px] text-[var(--text-3)] font-medium">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={fadeUp} className="dedco-card p-5">
            <h3 className="text-sm font-semibold text-[var(--text-1)] mb-4">
              Activité récente
            </h3>
            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto dedco-scroll">
              {ACTIVITIES.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: act.iconBg, color: act.iconColor }}
                  >
                    {act.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[var(--text-1)] leading-snug">
                      {act.text}
                    </p>
                    <p className="text-[10px] text-[var(--text-3)] mt-0.5 flex items-center gap-1">
                      <Clock size={10} />
                      {act.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Pending Moderation */}
        <motion.div variants={fadeUp} className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-[var(--terracotta)]" />
            En attente de modération
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PENDING_ITEMS.map((item) => (
              <div key={item.id} className="dedco-card p-4 flex items-center gap-3">
                <div
                  className={`dedco-badge ${item.badgeClass} text-[10px] shrink-0`}
                >
                  {item.badge}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--text-1)] truncate">
                    {item.label}
                  </p>
                  <p className="text-xs text-[var(--text-3)] truncate">
                    {item.detail}
                  </p>
                </div>
                <button className="shrink-0 text-[var(--text-3)] hover:text-[var(--amber)] transition-colors cursor-pointer">
                  <ArrowUpRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}