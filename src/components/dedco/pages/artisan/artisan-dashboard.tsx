"use client";

import { motion } from "framer-motion";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Star,
  Plus,
  ArrowRight,
  Clock,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { ARTISANS, ALL_PRODUCTS, formatFCFA } from "@/lib/dedco-data-expanded";

// ── Mock orders for Kofi (artisanId 1) ──
const MOCK_ORDERS = [
  {
    id: "ORD-001",
    client: "Marie Houénou",
    product: "Table basse Bénin Wax",
    amount: 185000,
    status: "fabrication" as const,
    date: "2024-01-28",
  },
  {
    id: "ORD-003",
    client: "Aminata Zannou",
    product: "Commode Porto-Novo",
    amount: 385000,
    status: "fabrication" as const,
    date: "2024-01-25",
  },
  {
    id: "ORD-005",
    client: "Jean-Pierre Agossou",
    product: "Bibliothèque Yoruba",
    amount: 295000,
    status: "expediee" as const,
    date: "2024-01-20",
  },
];

const STATUS_CONFIG = {
  fabrication: {
    label: "En fabrication",
    badgeClass: "dedco-badge dedco-badge-amber",
    icon: Clock,
  },
  expediee: {
    label: "Expédiée",
    badgeClass: "dedco-badge dedco-badge-terra",
    icon: Truck,
  },
  livree: {
    label: "Livrée",
    badgeClass: "dedco-badge dedco-badge-forest",
    icon: CheckCircle2,
  },
} as const;

const container = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function ArtisanDashboardPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const artisan = ARTISANS.find((a) => a.id === 1)!;
  const myProducts = ALL_PRODUCTS.filter((p) => p.artisanId === 1);
  const onlineProducts = myProducts.filter((p) => p.stock > 0);

  const stats = [
    {
      label: "Commandes actives",
      value: "5",
      icon: ShoppingBag,
      color: "var(--amber)",
      bg: "var(--amber-pale)",
    },
    {
      label: "Produits en ligne",
      value: String(onlineProducts.length),
      icon: Package,
      color: "var(--forest)",
      bg: "var(--forest-pale)",
    },
    {
      label: "Chiffre d'affaires",
      value: formatFCFA(1250000),
      icon: TrendingUp,
      color: "var(--terracotta)",
      bg: "var(--terracotta-pale)",
    },
    {
      label: "Note moyenne",
      value: `${artisan.rating}/5`,
      icon: Star,
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
      {/* ── Welcome Header ── */}
      <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
        <div className="relative">
          <img
            src={artisan.avatar}
            alt={artisan.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[var(--amber)]"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--forest)] border-2 border-white" />
        </div>
        <div>
          <p className="section-eyebrow">Tableau de bord</p>
          <h1 className="display-lg font-bold text-[var(--text-1)]">
            Bonjour {artisan.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-[var(--text-2)] mt-0.5">
            {artisan.specialty} · {artisan.city}
          </p>
        </div>
      </motion.div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="dedco-card p-4 sm:p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                <stat.icon size={20} />
              </div>
            </div>
            <p className="font-numeric text-2xl sm:text-3xl font-bold text-[var(--text-1)]">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-3)] mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Recent Orders + Quick Actions (desktop side-by-side) ── */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Orders */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="display-sm font-semibold text-[var(--text-1)]">
              Commandes récentes
            </h2>
            <button
              type="button"
              onClick={() => navigate({ page: "artisan-orders" })}
              className="text-sm font-medium text-[var(--amber)] hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight size={14} />
            </button>
          </div>
          <div className="dedco-card divide-y divide-[var(--border)]">
            {MOCK_ORDERS.map((order) => {
              const cfg = STATUS_CONFIG[order.status];
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-3 sm:gap-4 p-4 hover:bg-[var(--bg-warm)]/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-[var(--text-1)]">
                        {order.id}
                      </span>
                      <span className={cfg.badgeClass}>
                        <cfg.icon size={12} />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-2)] truncate">
                      {order.product}
                    </p>
                    <p className="text-xs text-[var(--text-3)]">{order.client}</p>
                  </div>
                  <p className="font-numeric text-sm font-bold text-[var(--text-1)] whitespace-nowrap">
                    {formatFCFA(order.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp}>
          <h2 className="display-sm font-semibold text-[var(--text-1)] mb-4">
            Actions rapides
          </h2>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate({ page: "artisan-products" })}
              className="dedco-card w-full p-4 flex items-center gap-3 hover:border-[var(--amber)] transition-colors cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--amber-pale)] text-[var(--amber)] flex items-center justify-center flex-shrink-0">
                <Plus size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-1)]">
                  Ajouter un produit
                </p>
                <p className="text-xs text-[var(--text-3)]">
                  Créer une nouvelle fiche produit
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => navigate({ page: "artisan-orders" })}
              className="dedco-card w-full p-4 flex items-center gap-3 hover:border-[var(--amber)] transition-colors cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--forest-pale)] text-[var(--forest)] flex items-center justify-center flex-shrink-0">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-1)]">
                  Voir toutes les commandes
                </p>
                <p className="text-xs text-[var(--text-3)]">
                  Gérer et suivre vos ventes
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => navigate({ page: "artisan-stats" })}
              className="dedco-card w-full p-4 flex items-center gap-3 hover:border-[var(--amber)] transition-colors cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--terracotta-pale)] text-[var(--terracotta)] flex items-center justify-center flex-shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-1)]">
                  Mes statistiques
                </p>
                <p className="text-xs text-[var(--text-3)]">
                  CA, ventes, performances
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => navigate({ page: "artisan-profile" })}
              className="dedco-card w-full p-4 flex items-center gap-3 hover:border-[var(--amber)] transition-colors cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-warm)] text-[var(--text-2)] flex items-center justify-center flex-shrink-0">
                <Star size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-1)]">
                  Mon profil
                </p>
                <p className="text-xs text-[var(--text-3)]">
                  Modifier mes informations
                </p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
