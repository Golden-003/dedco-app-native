"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  BarChart3,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { useDedcoStore, type AppRoute } from "@/lib/store";
import { useState } from "react";

const NAV_ITEMS: {
  label: string;
  page: AppRoute["page"];
  icon: React.ReactNode;
}[] = [
  { label: "Tableau de bord", page: "admin-dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Utilisateurs", page: "admin-users", icon: <Users size={18} /> },
  { label: "Produits", page: "admin-products", icon: <Package size={18} /> },
  { label: "Commandes", page: "admin-orders", icon: <ShoppingBag size={18} /> },
  { label: "Analytics", page: "admin-analytics", icon: <BarChart3 size={18} /> },
  { label: "Contenu", page: "admin-content", icon: <FileText size={18} /> },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const route = useDedcoStore((s) => s.route);
  const navigate = useDedcoStore((s) => s.navigate);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPage = route.page as string;

  const handleNav = (page: AppRoute["page"]) => {
    navigate({ page } as AppRoute);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-cream)]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[var(--bg-card)] border-r border-[var(--border)] p-4 gap-1 sticky top-0 h-screen">
        <div className="mb-6 px-2">
          <h2 className="font-display text-lg font-semibold text-[var(--text-1)]">
            Administration
          </h2>
          <p className="text-xs text-[var(--text-3)] mt-0.5">DEDCO Panel</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const active = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  active
                    ? "bg-[var(--amber-pale)] text-[var(--amber-dark)]"
                    : "text-[var(--text-2)] hover:bg-[var(--bg-warm)] hover:text-[var(--text-1)]"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-[var(--border)] pt-3 px-2">
          <p className="text-xs text-[var(--text-3)]">v1.0.0 — Prototype</p>
        </div>
      </aside>

      {/* Mobile header + bottom tabs */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[var(--bg-card)] border-b border-[var(--border)] sticky top-0 z-40">
          <h2 className="font-display text-base font-semibold text-[var(--text-1)]">
            Admin
          </h2>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-[var(--bg-warm)] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Mobile dropdown nav */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden bg-[var(--bg-card)] border-b border-[var(--border)] px-4 py-2 flex flex-col gap-1"
          >
            {NAV_ITEMS.map((item) => {
              const active = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNav(item.page)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                    active
                      ? "bg-[var(--amber-pale)] text-[var(--amber-dark)]"
                      : "text-[var(--text-2)] hover:bg-[var(--bg-warm)]"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile bottom tabs */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-card)] border-t border-[var(--border)] flex justify-around py-2 safe-bottom z-40">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const active = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                  active
                    ? "text-[var(--amber-dark)]"
                    : "text-[var(--text-3)]"
                }`}
              >
                {item.icon}
                <span className="truncate max-w-[56px]">{item.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}