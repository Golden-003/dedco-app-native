"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  User,
  Settings,
  Menu,
  X,
  Home,
} from "lucide-react";
import { useDedcoStore, type AppRoute } from "@/lib/store";
import { useState } from "react";

const NAV_ITEMS: {
  label: string;
  page: AppRoute["page"];
  icon: React.ReactNode;
}[] = [
  { label: "Tableau de bord", page: "designer-dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Mes projets", page: "designer-projects", icon: <FolderKanban size={18} /> },
  { label: "Briefs", page: "designer-briefs", icon: <FileText size={18} /> },
  { label: "Mon profil", page: "designer-profile", icon: <User size={18} /> },
  { label: "Paramètres", page: "designer-settings", icon: <Settings size={18} /> },
];

export function DesignerLayout({ children }: { children: React.ReactNode }) {
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
          <button
            onClick={() => navigate({ page: "home" })}
            className="font-display text-lg font-semibold text-[var(--terracotta)] cursor-pointer hover:opacity-80 transition-opacity"
          >
            Dedco<span className="text-[var(--amber)]">.</span>
          </button>
          <p className="text-xs text-[var(--text-3)] mt-0.5">Espace Designer</p>
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

      {/* Mobile header + dropdown */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[var(--bg-card)] border-b border-[var(--border)] sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-semibold text-[var(--terracotta)]">
              Dedco<span className="text-[var(--amber)]">.</span>
            </span>
            <span className="text-xs text-[var(--text-3)]">Designer</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-[var(--bg-warm)] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
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
