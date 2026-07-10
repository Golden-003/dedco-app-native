"use client";

import type { AppRoute } from "@/lib/store";

/**
 * Calcule la route + le label du bouton "Retour" pour les pages de détail
 * partagées (projet-artisan-detail, projet-designer-detail, brief-*-detail).
 *
 * - Artisan → "Projets en cours" (artisan-projets)
 * - Designer → "Projets en cours" (designer-projects)
 * - Maison déco → "Mon espace" (maison-dashboard)
 * - Admin → "Mon espace" (admin-dashboard)
 * - Client → "Mes projets" (client-projets)
 *
 * @param role Rôle de l'utilisateur connecté (ou undefined si non connecté)
 */
export function getBackToProjets(role: string | undefined): {
  route: AppRoute;
  label: string;
} {
  switch (role) {
    case "artisan":
      return { route: { page: "artisan-projets" }, label: "Projets en cours" };
    case "designer":
      return { route: { page: "designer-projects" }, label: "Projets en cours" };
    case "maison":
      return { route: { page: "maison-dashboard" }, label: "Mon espace" };
    case "admin":
      return { route: { page: "admin-dashboard" }, label: "Mon espace" };
    case "client":
    default:
      return { route: { page: "client-projets" }, label: "Mes projets" };
  }
}

