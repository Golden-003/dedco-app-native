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

/**
 * Retourne le PARENT LOGIQUE d'une page — utilisé quand l'historique est vide
 * (ex: refresh, arrivée directe par URL) pour que le bouton "Retour" aille
 * à un endroit qui fait sens plutôt qu'à home par défaut.
 *
 * Règles :
 * - Pages de détail produit/scène/artisan → leur listing parent
 * - Pages de détail brief/projet → leur liste (client-projets)
 * - Pages de compte (profile, wallet, settings…) → home
 * - Pages d'auth → home
 * - Dashboards prestataires → leur dashboard
 * - Tout le reste → home
 */
export function getLogicalBackRoute(currentRoute: AppRoute): AppRoute {
  const page = currentRoute.page;

  // ── Détails catalogue → listings ──
  if (page === "product") return { page: "marketplace" };
  if (page === "scene") return { page: "inspirations" };
  if (page === "artisan") return { page: "marketplace" };
  if (page === "designer") return { page: "designers" };
  if (page === "article") return { page: "magazine" };

  // ── Briefs & projets → mes projets ──
  if (page === "brief-detail" || page === "brief-create" || page === "brief-list")
    return { page: "brief-list" };
  if (page === "brief-artisan-detail" || page === "brief-designer-detail")
    return { page: "client-projets" };
  if (page === "artisan-brief-recu" || page === "artisan-devis-create")
    return { page: "artisan-demandes" };
  if (page === "designer-brief-recu" || page === "designer-proposition-mission")
    return { page: "designer-briefs" };

  // ── Projets → mes projets ──
  if (
    page === "projet-detail" ||
    page === "projet-livraison" ||
    page === "projet-paiement" ||
    page === "projet-paiement-artisan" ||
    page === "projet-artisan-detail" ||
    page === "projet-designer-detail" ||
    page === "client-proposition-recue" ||
    page === "designer-projet-attente"
  )
    return { page: "client-projets" };

  // ── Commandes → historique ──
  if (page === "order-tracking" || page === "order-confirmation" || page === "invoice")
    return { page: "order-history" };
  if (page === "payment") return { page: "checkout" };

  // ── Pages compte client → home ──
  if (
    page === "profile" ||
    page === "wallet" ||
    page === "kyc" ||
    page === "settings" ||
    page === "notifications" ||
    page === "messages" ||
    page === "moodboard" ||
    page === "favorites" ||
    page === "search" ||
    page === "litige"
  )
    return { page: "home" };

  // ── Pages auth → home ──
  if (page === "login" || page === "register" || page === "forgot-password" || page === "onboarding")
    return { page: "home" };

  // ── Pages statiques → home ──
  if (page === "about" || page === "become-artisan" || page === "help-center" || page === "plans-tarifs")
    return { page: "home" };

  // ── Dashboards prestataires → leur dashboard ──
  if (page === "artisan-dashboard") return { page: "artisan-dashboard" };
  if (page === "designer-dashboard") return { page: "designer-dashboard" };
  if (page === "admin-dashboard") return { page: "admin-dashboard" };
  if (page === "maison-dashboard") return { page: "maison-dashboard" };

  // ── Défaut : home ──
  return { page: "home" };
}
