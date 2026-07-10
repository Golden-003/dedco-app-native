"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Bell,
  Settings,
  FileText,
} from "lucide-react";
import { DashboardSidebar, type NavItem } from "../shared-sidebar";
import type { ReactNode } from "react";

// ── Navigation maison ──
// IMPORTANT : un user maison est isPrestataireLocked → il ne peut PAS accéder
// au site public (marketplace, designers, etc.) ni aux pages réservées aux
// autres rôles (artisan-stats). On ne propose donc QUE des pages accessibles :
// - maison-dashboard (sa home)
// - order-history (ses commandes)
// - messages / notifications / settings (pages AUTH_REQUIRED, accessibles à tous les rôles authentifiés)
// On remplace "Produits" / "Designers" / "Statistiques" (cassés) par des
// pages cohérentes pour une maison de déco.
const MAISON_NAV: NavItem[] = [
  { label: "Vue d'ensemble", page: "maison-dashboard", icon: LayoutDashboard },
  { label: "Commandes", page: "order-history", icon: ShoppingCart, badge: 5, badgeColor: "var(--amber)" },
  { label: "Catalogue", page: "moodboard", icon: Package },
  { label: "Factures", page: "wallet", icon: FileText },
  { label: "Messages", page: "messages", icon: MessageSquare },
  { label: "Notifications", page: "notifications", icon: Bell },
  { label: "Paramètres", page: "settings", icon: Settings },
];

export function MaisonLayout({
  children,
  currentPage,
}: {
  children: ReactNode;
  currentPage: string;
}) {
  return (
    <DashboardSidebar
      title="Dedco."
      subtitle="Espace Maison"
      items={MAISON_NAV}
      currentPage={currentPage}
      allowExitToSite={false}
    >
      {children}
    </DashboardSidebar>
  );
}
