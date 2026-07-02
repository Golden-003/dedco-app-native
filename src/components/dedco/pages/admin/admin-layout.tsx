"use client";

import {
  LayoutDashboard,
  UserCheck,
  Flag,
  Scale,
  Image as ImageIcon,
  Layers,
  Award,
  Users,
  BarChart2,
  Settings,
  Package,
  ClipboardList,
  FileText,
} from "lucide-react";
import { DashboardSidebar, type NavItem } from "../shared-sidebar";
import type { ReactNode } from "react";

const ADMIN_NAV: NavItem[] = [
  { label: "Vue d'ensemble", page: "admin-dashboard", icon: LayoutDashboard, badge: "!", badgeColor: "var(--terracotta)" },
  { label: "Produits", page: "admin-products", icon: Package },
  { label: "Commandes", page: "admin-orders", icon: ClipboardList },
  { label: "Contenu", page: "admin-content", icon: FileText },
  { label: "Validation KYC", page: "admin-kyc", icon: UserCheck },
  { label: "Messages flaggés", page: "admin-messages", icon: Flag },
  { label: "Litiges", page: "admin-litiges", icon: Scale },
  { label: "Scènes & Hotspots", page: "admin-scenes", icon: ImageIcon },
  { label: "Collections", page: "admin-collections", icon: Layers },
  { label: "Certification N4", page: "admin-certification", icon: Award, badge: 2, badgeColor: "var(--amber)" },
  { label: "Utilisateurs", page: "admin-users", icon: Users },
  { label: "Analytics", page: "admin-analytics", icon: BarChart2 },
  { label: "Paramètres", page: "admin-parametres", icon: Settings },
];

export function AdminLayout({
  children,
  currentPage,
}: {
  children: ReactNode;
  currentPage: string;
}) {
  return (
    <DashboardSidebar
      title="Admin"
      subtitle="Espace Administrateur"
      items={ADMIN_NAV}
      currentPage={currentPage}
    >
      {children}
    </DashboardSidebar>
  );
}
