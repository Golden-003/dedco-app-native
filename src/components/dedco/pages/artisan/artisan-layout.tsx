"use client";

import {
  LayoutDashboard,
  Inbox,
  ClipboardList,
  Grid,
  MessageCircle,
  Wallet,
  BarChart2,
  Star,
  Award,
  CreditCard,
  Settings,
} from "lucide-react";
import { DashboardSidebar, type NavItem } from "../shared-sidebar";
import type { ReactNode } from "react";

const ARTISAN_NAV: NavItem[] = [
  { label: "Tableau de bord", page: "artisan-dashboard", icon: LayoutDashboard },
  { label: "Briefs reçus", page: "artisan-demandes", icon: Inbox },
  { label: "Projets en cours", page: "artisan-projets", icon: ClipboardList },
  { label: "Catalogue", page: "artisan-products", icon: Grid },
  { label: "Messagerie", page: "messages", icon: MessageCircle },
  { label: "Wallet", page: "artisan-wallet", icon: Wallet },
  { label: "Statistiques", page: "artisan-stats", icon: BarChart2 },
  { label: "Avis et notes", page: "artisan-avis", icon: Star },
  {
    label: "Certification",
    page: "artisan-certification",
    icon: Award,
    visible: true, // visible only if N3 (logic handled in component)
  },
  {
    label: "Abonnement",
    page: "artisan-abonnement",
    icon: CreditCard,
    badge: "Pro",
    badgeColor: "var(--amber)",
  },
  { label: "Paramètres", page: "artisan-parametres", icon: Settings },
];

export function ArtisanLayout({
  children,
  currentPage,
}: {
  children: ReactNode;
  currentPage: string;
}) {
  return (
    <DashboardSidebar
      title="Artisan"
      subtitle="Espace Artisan"
      items={ARTISAN_NAV}
      currentPage={currentPage}
    >
      {children}
    </DashboardSidebar>
  );
}
