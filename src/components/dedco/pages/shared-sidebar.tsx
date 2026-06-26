"use client";

import { motion } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Bell,
  type LucideIcon,
} from "lucide-react";
import { useDedcoStore, type AppRoute } from "@/lib/store";
import { useState } from "react";

export type NavItem = {
  label: string;
  page: AppRoute["page"];
  icon: LucideIcon;
  badge?: number | string;
  badgeColor?: string;
  visible?: boolean;
};

export function DashboardSidebar({
  title,
  subtitle,
  items,
  currentPage,
  children,
}: {
  title: string;
  subtitle: string;
  items: NavItem[];
  currentPage: string;
  children?: React.ReactNode;
}) {
  const navigate = useDedcoStore((s) => s.navigate);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: AppRoute["page"]) => {
    navigate({ page } as AppRoute);
    setMobileOpen(false);
  };

  const visibleItems = items.filter((i) => i.visible !== false);

  const Sidebar = (
    <aside className="hidden lg:flex flex-col w-60 bg-[var(--bg-card)] border-r border-[var(--border)] p-4 gap-1 sticky top-0 h-screen">
      <div className="mb-6 px-2">
        <button
          onClick={() => navigate({ page: "home" })}
          className="font-display text-lg font-semibold cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-[var(--terracotta)]">Dedco</span>
          <span className="text-[var(--amber)]">.</span>
        </button>
        <p className="text-xs text-[var(--text-3)] mt-0.5">{subtitle}</p>
      </div>
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const active = currentPage === item.page;
          const Icon = item.icon;
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
              <Icon size={18} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                  style={{
                    backgroundColor: item.badgeColor || "var(--terracotta)",
                    color: "white",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-[var(--border)] pt-3 space-y-1">
        <button
          onClick={() => navigate({ page: "home" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-3)] hover:bg-[var(--bg-warm)] hover:text-[var(--text-1)] transition-colors cursor-pointer"
        >
          <Home size={18} />
          Retour au site
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[var(--bg-cream)]">
      {Sidebar}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[var(--bg-card)] border-b border-[var(--border)] sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-semibold">
              <span className="text-[var(--terracotta)]">Dedco</span>
              <span className="text-[var(--amber)]">.</span>
            </span>
            <span className="text-xs text-[var(--text-3)]">{title}</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-[var(--bg-warm)] transition-colors cursor-pointer"
            aria-label="Ouvrir le menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-72 max-w-[80vw] bg-[var(--bg-card)] h-full flex flex-col p-4"
            >
              <div className="mb-6 px-2 flex items-center justify-between">
                <div>
                  <span className="font-display text-lg font-semibold">
                    <span className="text-[var(--terracotta)]">Dedco</span>
                    <span className="text-[var(--amber)]">.</span>
                  </span>
                  <p className="text-xs text-[var(--text-3)] mt-0.5">{subtitle}</p>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-[var(--bg-warm)]"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
                {visibleItems.map((item) => {
                  const active = currentPage === item.page;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.page}
                      onClick={() => handleNav(item.page)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? "bg-[var(--amber-pale)] text-[var(--amber-dark)]"
                          : "text-[var(--text-2)] hover:bg-[var(--bg-warm)]"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center text-white"
                          style={{ backgroundColor: item.badgeColor || "var(--terracotta)" }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
              <button
                onClick={() => navigate({ page: "home" })}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-3)] hover:bg-[var(--bg-warm)] transition-colors"
              >
                <Home size={18} />
                Retour au site
              </button>
            </motion.aside>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
