"use client";

import {
  LayoutDashboard,
  Inbox,
  ClipboardList,
  Images,
  MessageCircle,
  Wallet,
  CreditCard,
  Settings,
} from "lucide-react";
import { DashboardSidebar, type NavItem } from "../shared-sidebar";
import type { ReactNode } from "react";

const DESIGNER_NAV: NavItem[] = [
  { label: "Tableau de bord", page: "designer-dashboard", icon: LayoutDashboard },
  { label: "Briefs reçus", page: "designer-briefs", icon: Inbox },
  { label: "Projets en cours", page: "designer-projects", icon: ClipboardList },
  { label: "Portfolio", page: "designer-portfolio", icon: Images },
  { label: "Messagerie", page: "messages", icon: MessageCircle },
  { label: "Wallet", page: "designer-wallet", icon: Wallet },
  {
    label: "Abonnement",
    page: "designer-abonnement",
    icon: CreditCard,
    badge: "Pro",
    badgeColor: "var(--amber)",
  },
  { label: "Paramètres", page: "designer-settings", icon: Settings },
];

export function DesignerLayout({
  children,
  currentPage,
}: {
  children: ReactNode;
  currentPage: string;
}) {
  return (
    <DashboardSidebar
      title="Designer"
      subtitle="Espace Designer"
      items={DESIGNER_NAV}
      currentPage={currentPage}
      allowExitToSite={false}
    >
      {children}
    </DashboardSidebar>
  );
}
