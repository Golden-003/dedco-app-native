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
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { DashboardSidebar, type NavItem } from "../shared-sidebar";
import type { ReactNode } from "react";

const ADMIN_NAV: NavItem[] = [
  { label: "Vue d'ensemble", page: "admin-dashboard", icon: LayoutDashboard, badge: "!", badgeColor: "var(--terracotta)" },
  { label: "Validation KYC", page: "admin-kyc", icon: UserCheck, badge: 3, badgeColor: "var(--amber)" },
  { label: "Messages flaggés", page: "admin-messages", icon: Flag, badge: 4, badgeColor: "var(--terracotta)" },
  { label: "Litiges", page: "admin-litiges", icon: Scale, badge: 2, badgeColor: "var(--terracotta)" },
  { label: "Scènes & Hotspots", page: "admin-scenes", icon: ImageIcon },
  { label: "Collections", page: "admin-collections", icon: Layers },
  { label: "Certification N4", page: "admin-certification", icon: Award, badge: 2, badgeColor: "var(--amber)" },
  { label: "Utilisateurs", page: "admin-users", icon: Users },
  { label: "Analytics", page: "admin-analytics", icon: BarChart2 },
  { label: "Paramètres", page: "admin-parametres", icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const route = useDedcoStore((s) => s.route);
  return (
    <DashboardSidebar
      title="Admin"
      subtitle="Espace Administrateur"
      items={ADMIN_NAV}
      currentPage={route.page as string}
    >
      {children}
    </DashboardSidebar>
  );
}
