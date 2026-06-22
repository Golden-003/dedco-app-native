"use client";

import { motion } from "framer-motion";
import { Package, ChevronRight, Clock, CheckCircle2, Truck } from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data";

const ORDERS = [
  { id: "ORD-001", product: "Table basse Bénin Wax", amount: 185000, status: "livraison" as const, date: "20 Jan 2024", artisan: "Kofi Akindélé" },
  { id: "ORD-002", product: "Coussin Wax Imprimé", amount: 35000, status: "livré" as const, date: "15 Jan 2024", artisan: "Aïssatou Bello" },
  { id: "ORD-003", product: "Tapis Kente Royal", amount: 145000, status: "livré" as const, date: "10 Jan 2024", artisan: "Rachid Agossou" },
  { id: "ORD-004", product: "Vase Céramique Bogolan", amount: 67000, status: "livré" as const, date: "05 Jan 2024", artisan: "Mairo Saka" },
  { id: "ORD-005", product: "Suspension Bambou Adja", amount: 95000, status: "livré" as const, date: "28 Déc 2023", artisan: "Koffi Mensah" },
];

const STATUS_MAP = {
  livraison: { label: "En livraison", badge: "dedco-badge dedco-badge-amber", icon: Truck },
  livré: { label: "Livré", badge: "dedco-badge dedco-badge-forest", icon: CheckCircle2 },
  preparation: { label: "En préparation", badge: "dedco-badge dedco-badge-terra", icon: Clock },
};

export function OrderHistoryPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const goBack = useDedcoStore((s) => s.goBack);

  return (
    <div className="dedco-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <button
        onClick={goBack}
        className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] transition-colors mb-4 inline-flex items-center gap-1 cursor-pointer"
      >
        ← Retour
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="display-lg font-bold text-[var(--text-1)]">Historique des commandes</h1>
          <p className="text-sm text-[var(--text-3)] mt-1">{ORDERS.length} commandes</p>
        </div>
      </div>

      <div className="space-y-3">
        {ORDERS.map((order, i) => {
          const cfg = STATUS_MAP[order.status];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => navigate({ page: "order-tracking", id: order.id })}
                className="w-full dedco-card p-4 sm:p-5 flex items-center justify-between hover:border-[var(--amber)] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--bg-warm)] flex items-center justify-center text-[var(--text-3)]">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[var(--text-1)]">{order.product}</p>
                    <p className="text-xs text-[var(--text-3)]">{order.artisan} · {order.date}</p>
                    <p className="font-numeric text-xs font-medium text-[var(--text-2)] mt-0.5">{order.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="font-numeric text-sm font-bold text-[var(--text-1)]">{formatFCFA(order.amount)}</p>
                    <span className={cfg.badge}><cfg.icon size={12} /> {cfg.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-[var(--text-3)]" />
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
