"use client";

import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Star,
  BadgeCheck,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data";

// ============================================================
// Mock Maison Dashboard Data
// ============================================================

const BRAND = {
  name: "Maison Zinsou Déco",
  logo: "ZD",
  description: "Marque de mobilier haut de gamme alliant tradition locale et design contemporain.",
  revenue: 2100000,
  productCount: 15,
  designerCount: 3,
  orderCount: 45,
};

const DASHBOARD_STATS = [
  {
    label: "Produits",
    value: "15",
    icon: Package,
    color: "bg-amber-pale text-amber",
  },
  {
    label: "Designers",
    value: "3",
    icon: Users,
    color: "bg-forest-pale text-forest",
  },
  {
    label: "Commandes",
    value: "45",
    icon: ShoppingCart,
    color: "bg-terracotta-pale text-terracotta",
  },
  {
    label: "Chiffre d'affaires",
    value: formatFCFA(2100000),
    icon: TrendingUp,
    color: "bg-amber-pale text-amber",
  },
];

const CATALOG_PRODUCTS = [
  {
    id: 101,
    name: "Table Bénin Wax XL",
    price: 320000,
    stock: 4,
    status: "active",
    image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=400&q=85",
  },
  {
    id: 102,
    name: "Fauteuil Royal Rotin",
    price: 145000,
    stock: 2,
    status: "active",
    image: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=400&q=85",
  },
  {
    id: 103,
    name: "Suspension Bambou Grand",
    price: 95000,
    stock: 0,
    status: "draft",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=85",
  },
  {
    id: 104,
    name: "Tapis Kente Premium",
    price: 185000,
    stock: 7,
    status: "active",
    image: "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?auto=format&fit=crop&w=400&q=85",
  },
  {
    id: 105,
    name: "Vase Céramique Bogolan",
    price: 42000,
    stock: 12,
    status: "active",
    image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=400&q=85",
  },
  {
    id: 106,
    name: "Étagère Iroko Massif",
    price: 265000,
    stock: 3,
    status: "active",
    image: "https://images.unsplash.com/photo-1510828561531-05a3388f6d3d?auto=format&fit=crop&w=400&q=85",
  },
];

const DESIGNERS = [
  {
    id: 1,
    name: "Aminata Zannou",
    role: "Directrice artistique",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&crop=faces&w=400&q=85",
    projects: 12,
  },
  {
    id: 2,
    name: "Kofi Mensah",
    role: "Designer produit",
    avatar:
      "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&crop=faces&w=400&q=85",
    projects: 18,
  },
  {
    id: 3,
    name: "Fatou Loko",
    role: "Designer textile",
    avatar:
      "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&crop=faces&w=400&q=85",
    projects: 15,
  },
];

const RECENT_ORDERS = [
  {
    id: "ORD-045",
    client: "Marie Houénou",
    product: "Table Bénin Wax XL",
    amount: 320000,
    status: "livrée",
    date: "24 Jan 2024",
  },
  {
    id: "ORD-044",
    client: "Jean-Pierre Agossou",
    product: "Tapis Kente Premium",
    amount: 185000,
    status: "expédiée",
    date: "23 Jan 2024",
  },
  {
    id: "ORD-043",
    client: "Aminata Djossou",
    product: "Fauteuil Royal Rotin",
    amount: 145000,
    status: "en préparation",
    date: "22 Jan 2024",
  },
  {
    id: "ORD-042",
    client: "Paul Dossou",
    product: "Étagère Iroko Massif",
    amount: 265000,
    status: "en attente",
    date: "21 Jan 2024",
  },
];

const STATUS_STYLES: Record<string, string> = {
  livrée: "dedco-badge-forest",
  expédiée: "dedco-badge-amber",
  "en préparation": "dedco-badge-terra",
  "en attente": "dedco-badge-gray",
};

// ============================================================
// MaisonDashboardPage
// ============================================================

export function MaisonDashboardPage() {
  const navigate = useDedcoStore((s) => s.navigate);

  return (
    <div className="dedco-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Header */}
      <motion.div
        className="dedco-card p-5 sm:p-6 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-amber text-white flex items-center justify-center font-display font-bold text-2xl flex-shrink-0">
            {BRAND.logo}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="display-lg truncate">{BRAND.name}</h1>
            <p className="text-sm text-ink-soft">{BRAND.description}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ page: "settings" })}
            className="dedco-btn dedco-btn-secondary dedco-btn-sm flex-shrink-0"
          >
            Paramètres
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {DASHBOARD_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="dedco-card p-4 sm:p-5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}
              >
                <stat.icon size={18} />
              </div>
              <span className="text-xs text-ink-mute font-medium uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
            <p className="font-display font-bold text-xl sm:text-2xl font-numeric">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Catalog */}
        <div className="lg:col-span-2">
          <motion.div
            className="dedco-card p-5 sm:p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg">
                Catalogue produits
              </h2>
              <button type="button" onClick={() => navigate({ page: "marketplace" })} className="dedco-btn dedco-btn-primary dedco-btn-sm">
                + Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {CATALOG_PRODUCTS.map((product, i) => (
                <motion.div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-warm transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.04 }}
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-warm flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-ink-mute font-numeric">
                      {formatFCFA(product.price)} · Stock: {product.stock}
                    </p>
                  </div>
                  <span
                    className={`dedco-badge text-[10px] ${
                      STATUS_STYLES[product.status] ?? "dedco-badge-gray"
                    }`}
                  >
                    {product.status === "active" ? "Actif" : "Brouillon"}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Designer Team */}
          <motion.div
            className="dedco-card p-5 sm:p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-display font-bold text-lg mb-4">
              Équipe designers
            </h2>
            <div className="space-y-3">
              {DESIGNERS.map((designer) => (
                <div
                  key={designer.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-warm transition-colors"
                >
                  <img
                    src={designer.avatar}
                    alt={designer.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {designer.name}
                    </p>
                    <p className="text-xs text-ink-mute">{designer.role}</p>
                  </div>
                  <span className="text-xs text-ink-mute font-numeric">
                    {designer.projects} projets
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            className="dedco-card p-5 sm:p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="font-display font-bold text-lg mb-4">
              Commandes récentes
            </h2>
            <div className="space-y-3">
              {RECENT_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium truncate">
                      {order.product}
                    </p>
                    <p className="text-xs text-ink-mute">
                      {order.client} · {order.date}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-amber font-numeric">
                      {formatFCFA(order.amount)}
                    </p>
                    <span
                      className={`dedco-badge text-[9px] ${
                        STATUS_STYLES[order.status] ?? "dedco-badge-gray"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
