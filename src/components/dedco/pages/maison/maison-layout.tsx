"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Settings,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { DashboardSidebar, type NavItem } from "../shared-sidebar";
import type { ReactNode } from "react";

const MAISON_NAV: NavItem[] = [
  { label: "Vue d'ensemble", page: "maison-dashboard", icon: LayoutDashboard },
  { label: "Produits", page: "marketplace", icon: Package },
  { label: "Commandes", page: "order-history", icon: ShoppingCart, badge: 5, badgeColor: "var(--amber)" },
  { label: "Designers", page: "designers", icon: Users },
  { label: "Statistiques", page: "artisan-stats", icon: TrendingUp },
  { label: "Paramètres", page: "settings", icon: Settings },
];

export function MaisonLayout({ children }: { children: ReactNode }) {
  const route = useDedcoStore((s) => s.route);
  return (
    <DashboardSidebar
      title="Dedco."
      subtitle="Espace Maison"
      items={MAISON_NAV}
      currentPage={route.page}
    >
      {children}
    </DashboardSidebar>
  );
}
