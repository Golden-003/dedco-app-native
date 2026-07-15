"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data";

type OrderStatus =
  | "en_cours"
  | "livree"
  | "litige"
  | "remboursee"
  | "annulee";

interface MockOrder {
  id: string;
  client: string;
  artisan: string;
  amount: number;
  status: OrderStatus;
  date: string;
  items: number;
}

const ORDERS: MockOrder[] = [
  { id: "CMD-0472", client: "Aminata Zannou", artisan: "Kofi Akindélé", amount: 285000, status: "en_cours", date: "2024-03-20", items: 2 },
  { id: "CMD-0471", client: "Rachida Bello", artisan: "Amara Dossou", amount: 145000, status: "en_cours", date: "2024-03-20", items: 1 },
  { id: "CMD-0470", client: "Marius Dossou", artisan: "Faustin Kodjo", amount: 380000, status: "litige", date: "2024-03-19", items: 3 },
  { id: "CMD-0469", client: "Adjoua Sossou", artisan: "Kofi Akindélé", amount: 175000, status: "livree", date: "2024-03-18", items: 1 },
  { id: "CMD-0468", client: "Fati Houénou", artisan: "Rachidatou Bello", amount: 92000, status: "livree", date: "2024-03-17", items: 2 },
  { id: "CMD-0467", client: "Gérard Ahossi", artisan: "Kofi Akindélé", amount: 560000, status: "remboursee", date: "2024-03-15", items: 1 },
  { id: "CMD-0466", client: "Sandrine Vignon", artisan: "Faustin Kodjo", amount: 210000, status: "livree", date: "2024-03-14", items: 2 },
  { id: "CMD-0465", client: "Kossi Mensah", artisan: "Amara Dossou", amount: 435000, status: "en_cours", date: "2024-03-13", items: 4 },
];

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; badge: string }
> = {
  en_cours: { label: "En cours", badge: "dedco-badge-amber" },
  livree: { label: "Livrée", badge: "dedco-badge-forest" },
  litige: { label: "Litige", badge: "dedco-badge-terra" },
  remboursee: { label: "Remboursée", badge: "dedco-badge-gray" },
  annulee: { label: "Annulée", badge: "dedco-badge-gray" },
};

const TABS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "en_cours", label: "En cours" },
  { key: "litige", label: "Litige" },
  { key: "remboursee", label: "Remboursées" },
  { key: "livree", label: "Livrées" },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function AdminOrdersPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<OrderStatus | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = useMemo(() => {
    return ORDERS.filter((o) => {
      if (statusTab !== "all" && o.status !== statusTab) return false;
      if (dateFrom && o.date < dateFrom) return false;
      if (dateTo && o.date > dateTo) return false;
      if (
        search &&
        !o.id.toLowerCase().includes(search.toLowerCase()) &&
        !o.client.toLowerCase().includes(search.toLowerCase()) &&
        !o.artisan.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [search, statusTab, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
          <motion.div variants={stagger} initial="initial" animate="animate">
        <motion.div variants={fadeUp} className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-1)]">
            Commandes
          </h1>
          <p className="text-sm text-[var(--text-3)] mt-1">
            {filtered.length} commande{filtered.length > 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Status Tabs */}
        <motion.div variants={fadeUp} className="flex gap-1 mb-4 overflow-x-auto dedco-hide-scroll pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusTab(tab.key);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                statusTab === tab.key
                  ? "bg-[var(--amber)] text-white"
                  : "bg-[var(--bg-card)] text-[var(--text-2)] border border-[var(--border)] hover:bg-[var(--bg-warm)]"
              }`}
            >
              {tab.label}
              {tab.key !== "all" && (
                <span className="ml-1.5 text-xs opacity-70 font-numeric">
                  {ORDERS.filter((o) => o.status === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Search + Date filters */}
        <motion.div variants={fadeUp} className="dedco-card p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]"
              />
              <input
                type="text"
                placeholder="Rechercher ID, client, artisan..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--bg-cream)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]/30 focus:border-[var(--amber)] transition-colors"
              />
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Calendar
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]"
                />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 pr-3 py-2.5 text-sm bg-[var(--bg-cream)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]/30 cursor-pointer"
                />
              </div>
              <span className="text-[var(--text-3)] text-xs">→</span>
              <div className="relative">
                <Calendar
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]"
                />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 pr-3 py-2.5 text-sm bg-[var(--bg-cream)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]/30 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div variants={fadeUp} className="dedco-card overflow-hidden">
          <div className="overflow-x-auto dedco-hide-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-cream)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider">
                    Client
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider hidden md:table-cell">
                    Artisan
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider hidden sm:table-cell">
                    Statut
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((order) => {
                  const sc = STATUS_CONFIG[order.status];
                  return (
                    <motion.tr
                      key={order.id}
                      variants={fadeUp}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-warm)]/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-medium text-[var(--text-1)] text-sm">
                        {order.id}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[var(--text-1)] text-sm">
                          {order.client}
                        </p>
                        <p className="text-xs text-[var(--text-3)] md:hidden">
                          {order.artisan}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-2)] hidden md:table-cell">
                        {order.artisan}
                      </td>
                      <td className="px-4 py-3 font-numeric font-medium text-[var(--text-1)]">
                        {formatFCFA(order.amount)}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`dedco-badge ${sc.badge}`}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-numeric text-[var(--text-3)] text-xs hidden lg:table-cell">
                        {new Date(order.date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            onClick={() =>
                              navigate({ page: "order-tracking", id: order.id })
                            }
                            title="Voir le suivi"
                            className="p-1.5 rounded-md hover:bg-[var(--bg-warm)] text-[var(--text-3)] hover:text-[var(--amber-dark)] transition-colors cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-[var(--text-3)]">
                      Aucune commande trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-3)] font-numeric">
                {(page - 1) * PER_PAGE + 1}–
                {Math.min(page * PER_PAGE, filtered.length)} sur{" "}
                {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-md hover:bg-[var(--bg-warm)] disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        p === page
                          ? "bg-[var(--amber)] text-white"
                          : "text-[var(--text-2)] hover:bg-[var(--bg-warm)]"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-md hover:bg-[var(--bg-warm)] disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
      );
}