"use client";

import { motion } from "framer-motion";
import {
  Menu,
  X,
  Home,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { useDedcoStore, type AppRoute } from "@/lib/store";
import { memo, useState, useCallback } from "react";
import { NotificationBell } from "@/components/dedco/layout";

export type NavItem = {
  label: string;
  page: AppRoute["page"];
  icon: LucideIcon;
  badge?: number | string;
  badgeColor?: string;
  visible?: boolean;
};

/**
 * DashboardSidebar — sidebar partagée par tous les dashboards.
 *
 * Stabilité du rendu :
 *  - Le composant est memoïsé. Les props `title`, `subtitle`, `items`
 *    sont stables (constantes au niveau du module côté parent).
 *  - Seuls `currentPage` et `children` changent à la navigation.
 *  - Le drawer mobile est contrôlé par un état local — l'ouverture/fermeture
 *    ne provoque pas de re-render des composants frères.
 *  - La fonction `handleNav` est stable grâce à `useCallback`.
 *
 * La sidebar et le header mobile ne sont jamais démontés entre deux pages
 * d'un même dashboard : React garde le nœud `<aside>` monté, seul l'état
 * "actif" des boutons change.
 */
function DashboardSidebarComponent({
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
  const logout = useDedcoStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = useCallback(
    (page: AppRoute["page"]) => {
      navigate({ page } as AppRoute);
      setMobileOpen(false);
    },
    [navigate]
  );

  const goHome = useCallback(() => {
    navigate({ page: "home" });
    setMobileOpen(false);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate({ page: "home" });
    setMobileOpen(false);
  }, [logout, navigate]);

  const visibleItems = items.filter((i) => i.visible !== false);

  // ── Sous-composants rendus à l'identique desktop / mobile ──
  const Brand = (
    <div className="mb-6 px-2">
      <button
        onClick={goHome}
        className="font-display text-lg font-semibold cursor-pointer hover:opacity-80 transition-opacity"
      >
        <span className="text-[var(--terracotta)]">Dedco</span>
        <span className="text-[var(--amber)]">.</span>
      </button>
      <p className="text-xs text-[var(--text-3)] mt-0.5">{subtitle}</p>
    </div>
  );

  const NavButtons = (
    <nav className="flex flex-col gap-1 flex-1 overflow-y-auto dedco-scroll">
      {visibleItems.map((item) => {
        const active = currentPage === item.page;
        const Icon = item.icon;
        return (
          <button
            key={item.page}
            onClick={() => handleNav(item.page)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer ${
              active
                ? "bg-[var(--amber-pale)] text-[var(--amber-dark)]"
                : "text-[var(--text-2)] hover:bg-[var(--bg-warm)] hover:text-[var(--text-1)]"
            }`}
          >
            <Icon size={18} className={active ? "text-[var(--amber)]" : ""} />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge !== undefined && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center text-white"
                style={{
                  backgroundColor: item.badgeColor || "var(--terracotta)",
                }}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  const FooterActions = (
    <div className="border-t border-[var(--border)] pt-3 space-y-1">
      <button
        onClick={goHome}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-3)] hover:bg-[var(--bg-warm)] hover:text-[var(--text-1)] transition-colors cursor-pointer"
      >
        <Home size={18} />
        Retour au site
      </button>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--terracotta)] hover:bg-[var(--terracotta-pale)] transition-colors cursor-pointer"
      >
        <LogOut size={18} />
        Déconnexion
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-[var(--bg-cream)] overflow-hidden">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 bg-[var(--bg-card)] border-r border-[var(--border)] p-4 flex-shrink-0">
        {Brand}
        {NavButtons}
        {FooterActions}
      </aside>

      {/* ── Main column ── */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {/* Mobile header — hauteur fixe h-16 (64px). Pas besoin de sticky :
            le parent est h-screen + overflow-hidden, le header est en flux
            normal en haut de la colonne. */}
        <header className="lg:hidden flex items-center justify-between px-4 h-16 bg-[var(--bg-card)] border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={goHome}
              className="font-display text-base font-semibold cursor-pointer"
            >
              <span className="text-[var(--terracotta)]">Dedco</span>
              <span className="text-[var(--amber)]">.</span>
            </button>
            <span className="text-xs text-[var(--text-3)]">· {title}</span>
          </div>
          <div className="flex items-center gap-1">
            <NotificationBell navigate={navigate} />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-[var(--bg-warm)] transition-colors cursor-pointer"
              aria-label="Ouvrir le menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
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
              {NavButtons}
              {FooterActions}
            </motion.aside>
          </div>
        )}

        {/* ── Page content ──
            h-screen + overflow-hidden sur le wrapper, main en flex-1 + overflow-y-auto.
            Permet aux pages "plein écran" (ex: messagerie) de gérer leur propre
            scroll interne sans impacter la sidebar ni le header mobile. */}
        <div className="flex-1 flex flex-col min-h-0">
          <main className="flex-1 overflow-y-auto dedco-scroll">{children}</main>
        </div>
      </div>
    </div>
  );
}

export const DashboardSidebar = memo(DashboardSidebarComponent);
