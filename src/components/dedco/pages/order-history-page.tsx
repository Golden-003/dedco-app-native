"use client";

import { motion } from "framer-motion";
import { Package, ChevronRight, Clock, CheckCircle2, Truck, ShoppingBag } from "lucide-react";
import { useDedcoStore, type OrderStatus } from "@/lib/store";
import { useReviewStore } from "@/lib/review-store";
import { formatFCFA } from "@/lib/dedco-data";

// ============================================================
// HISTORIQUE DES COMMANDES — lu depuis le store (vraies commandes)
// ============================================================

const STATUS_MAP: Record<OrderStatus, { label: string; badge: string; icon: typeof Truck }> = {
  'payé':            { label: 'Payé',            badge: 'dedco-badge dedco-badge-amber', icon: Clock },
  'en_fabrication':  { label: 'En fabrication',  badge: 'dedco-badge dedco-badge-terra', icon: Clock },
  'expédié':         { label: 'En livraison',    badge: 'dedco-badge dedco-badge-amber', icon: Truck },
  'livré':           { label: 'Livré',           badge: 'dedco-badge dedco-badge-forest', icon: CheckCircle2 },
  'litige':          { label: 'Litige',          badge: 'dedco-badge dedco-badge-terra-solid', icon: Package },
};

function formatDateFromISO(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function OrderHistoryPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const goBack = useDedcoStore((s) => s.goBack);
  const orders = useDedcoStore((s) => s.orders);
  const hasReviewed = useReviewStore((s) => s.hasReviewed);

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
          <h1 className="display-lg font-bold text-[var(--text-1)]">
            Historique des commandes
          </h1>
          <p className="text-sm text-[var(--text-3)] mt-1">
            {orders.length} commande{orders.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="dedco-card p-12 text-center">
          <ShoppingBag
            size={36}
            className="mx-auto text-[var(--border-dark)] mb-3"
            strokeWidth={1.5}
          />
          <p className="font-display font-semibold text-base mb-2">
            Aucune commande pour le moment
          </p>
          <p className="text-sm text-[var(--text-3)] mb-5 max-w-md mx-auto">
            Une fois que vous aurez passé votre première commande, elle
            apparaîtra ici avec son statut et son suivi.
          </p>
          <button
            onClick={() => navigate({ page: "marketplace" })}
            className="dedco-btn dedco-btn-primary"
          >
            <ShoppingBag size={16} /> Explorer la marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => {
            const cfg = STATUS_MAP[order.status];
            const isDelivered = order.status === "livré";
            const reviewed = hasReviewed(order.id);
            const productLabel =
              order.items.length === 1
                ? order.items[0].name
                : `${order.items[0].name} +${order.items.length - 1} autre${order.items.length > 2 ? "s" : ""}`;
            const artisanLabel =
              order.items.length === 1
                ? order.items[0].artisanName
                : `${order.items[0].artisanName} et autres`;
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
                      <p className="font-semibold text-sm text-[var(--text-1)] line-clamp-1">
                        {productLabel}
                      </p>
                      <p className="text-xs text-[var(--text-3)]">
                        {artisanLabel} · {formatDateFromISO(order.createdAt)}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="font-numeric text-xs font-medium text-[var(--text-2)]">
                          {order.id}
                        </p>
                        {isDelivered && (
                          <span className="text-[10px] text-[var(--forest)] flex items-center gap-0.5">
                            <CheckCircle2 size={10} />
                            {reviewed ? "Avis publié" : "Avis en attente"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="font-numeric text-sm font-bold text-[var(--text-1)]">
                        {formatFCFA(order.total)}
                      </p>
                      <span className={cfg.badge}>
                        <cfg.icon size={12} /> {cfg.label}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-[var(--text-3)]" />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
