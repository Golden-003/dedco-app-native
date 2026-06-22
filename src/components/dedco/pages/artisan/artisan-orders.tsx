"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Truck,
  CheckCircle2,
  Eye,
  Package,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data-expanded";

// ── Mock Orders for Kofi (artisanId 1) ──
type OrderStatus = "fabrication" | "expediee" | "livree";

interface ArtisanOrder {
  id: string;
  client: string;
  clientAvatar: string;
  product: string;
  productImage: string;
  amount: number;
  status: OrderStatus;
  date: string;
  quantity: number;
}

const ORDERS: ArtisanOrder[] = [
  {
    id: "ORD-001",
    client: "Marie Houénou",
    clientAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&w=80&q=75",
    product: "Table basse Bénin Wax",
    productImage: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=120&q=75",
    amount: 185000,
    status: "fabrication",
    date: "28 Jan 2024",
    quantity: 1,
  },
  {
    id: "ORD-003",
    client: "Aminata Zannou",
    clientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&crop=faces&w=80&q=75",
    product: "Commode Porto-Novo",
    productImage: "https://images.unsplash.com/photo-1517467139951-f5a925c9f9de?auto=format&fit=crop&w=120&q=75",
    amount: 385000,
    status: "fabrication",
    date: "25 Jan 2024",
    quantity: 1,
  },
  {
    id: "ORD-005",
    client: "Jean-Pierre Agossou",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=80&q=75",
    product: "Bibliothèque Yoruba",
    productImage: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=120&q=75",
    amount: 295000,
    status: "expediee",
    date: "20 Jan 2024",
    quantity: 1,
  },
  {
    id: "ORD-007",
    client: "Fatoumata Diallo",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&w=80&q=75",
    product: "Étagère Adja",
    productImage: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=120&q=75",
    amount: 250000,
    status: "expediee",
    date: "18 Jan 2024",
    quantity: 2,
  },
  {
    id: "ORD-009",
    client: "Paul Dossou",
    clientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&w=80&q=75",
    product: "Cadre Sculpté Dan",
    productImage: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=120&q=75",
    amount: 70000,
    status: "livree",
    date: "10 Jan 2024",
    quantity: 2,
  },
  {
    id: "ORD-011",
    client: "Adèle Mensah",
    clientAvatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&crop=faces&w=80&q=75",
    product: "Bureau Mahi",
    productImage: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=120&q=75",
    amount: 210000,
    status: "livree",
    date: "05 Jan 2024",
    quantity: 1,
  },
  {
    id: "ORD-013",
    client: "Kofi Béhanzin",
    clientAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=faces&w=80&q=75",
    product: "Table basse Bénin Wax",
    productImage: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=120&q=75",
    amount: 370000,
    status: "livree",
    date: "02 Jan 2024",
    quantity: 2,
  },
];

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    badge: string;
    icon: typeof Clock;
    color: string;
  }
> = {
  fabrication: {
    label: "En fabrication",
    badge: "dedco-badge dedco-badge-amber",
    icon: Clock,
    color: "var(--amber)",
  },
  expediee: {
    label: "Expédiée",
    badge: "dedco-badge dedco-badge-terra",
    icon: Truck,
    color: "var(--terracotta)",
  },
  livree: {
    label: "Livrée",
    badge: "dedco-badge dedco-badge-forest",
    icon: CheckCircle2,
    color: "var(--forest)",
  },
};

type TabKey = "all" | OrderStatus;
const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "fabrication", label: "En cours" },
  { key: "expediee", label: "Expédiées" },
  { key: "livree", label: "Livrées" },
];

const container = {
  animate: { transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};
const itemAnim = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

export function ArtisanOrdersPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const [tab, setTab] = useState<TabKey>("all");

  const filtered =
    tab === "all" ? ORDERS : ORDERS.filter((o) => o.status === tab);

  return (
    <motion.section
      variants={container}
      initial="initial"
      animate="animate"
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10"
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
          Mes Commandes
        </h1>
        <p className="text-sm text-[var(--text-3)] mt-1">
          {ORDERS.length} commandes · {ORDERS.filter((o) => o.status === "fabrication").length} en cours
        </p>
      </motion.div>

      {/* ── Tabs ── */}
      <motion.div
        variants={fadeUp}
        className="flex gap-1 mt-6 mb-6 border-b border-[var(--border)] overflow-x-auto dedco-hide-scroll"
      >
        {TABS.map((t) => {
          const count =
            t.key === "all"
              ? ORDERS.length
              : ORDERS.filter((o) => o.status === t.key).length;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                tab === t.key
                  ? "text-[var(--amber)]"
                  : "text-[var(--text-3)] hover:text-[var(--text-1)]"
              }`}
            >
              {t.label}
              <span className="ml-1.5 text-xs opacity-60">({count})</span>
              {tab === t.key && (
                <motion.span
                  layoutId="order-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--amber)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </motion.div>

      {/* ── Order Cards ── */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            variants={itemAnim}
            initial="initial"
            animate="animate"
            exit="exit"
            className="dedco-card p-12 text-center"
          >
            <Package className="mx-auto mb-3 text-[var(--text-3)]" size={40} />
            <p className="text-[var(--text-2)] font-medium">Aucune commande</p>
            <p className="text-sm text-[var(--text-3)] mt-1">
              Aucune commande ne correspond à ce filtre.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3" key={tab}>
            {filtered.map((order) => {
              const cfg = STATUS_CONFIG[order.status];
              return (
                <motion.div
                  key={order.id}
                  variants={itemAnim}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="dedco-card overflow-hidden"
                >
                  <div className="p-4 sm:p-5">
                    {/* Top row */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--text-1)]">
                          {order.id}
                        </span>
                        <span className={cfg.badge}>
                          <cfg.icon size={12} />
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-3)]">
                        <Calendar size={12} />
                        {order.date}
                      </div>
                    </div>

                    {/* Content row */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Client */}
                      <div className="flex items-center gap-2.5 min-w-0 sm:w-36 flex-shrink-0">
                        <img
                          src={order.clientAvatar}
                          alt={order.client}
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--text-1)] truncate">
                            {order.client}
                          </p>
                          <p className="text-xs text-[var(--text-3)]">
                            {order.quantity} article{order.quantity > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      {/* Divider (desktop) */}
                      <div className="hidden sm:block w-px h-10 bg-[var(--border)]" />

                      {/* Product */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--bg-warm)]">
                          <img
                            src={order.productImage}
                            alt={order.product}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm text-[var(--text-2)] truncate">
                          {order.product}
                        </p>
                      </div>

                      {/* Amount */}
                      <div className="flex-shrink-0 text-right">
                        <p className="font-numeric text-sm font-bold text-[var(--text-1)]">
                          {formatFCFA(order.amount)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                      {order.status === "fabrication" && (
                        <button
                          type="button"
                          className="dedco-btn dedco-btn-primary dedco-btn-sm"
                        >
                          <Truck size={14} />
                          Marquer expédié
                        </button>
                      )}
                      <button
                        type="button"
                        className="dedco-btn dedco-btn-ghost dedco-btn-sm"
                      >
                        <Eye size={14} />
                        Voir détails
                      </button>
                      <ChevronRight
                        size={16}
                        className="ml-auto text-[var(--text-3)]"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
