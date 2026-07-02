"use client";

import { useDedcoStore, type AppRoute, type UserRole } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { Route } from "@/lib/dedco-types";

// Pages critiques — eager load (LCP)
import { HomePage } from "@/components/dedco/home-page";
import { MarketplacePage } from "@/components/dedco/marketplace-page";
import { ProductPage } from "@/components/dedco/product-page";
import { ScenePage } from "@/components/dedco/scene-page";
import {
  InspirationsPage,
  DesignersPage,
  DesignerDetailPage,
  ArtisanDetailPage,
  MagazinePage,
} from "@/components/dedco/other-pages";

// Pages secondaires — lazy load (code splitting)
const LoginPage = dynamic(() => import("@/components/dedco/pages/login-page").then(m => ({ default: m.LoginPage })));
const RegisterPage = dynamic(() => import("@/components/dedco/pages/register-page").then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = dynamic(() => import("@/components/dedco/pages/forgot-password-page").then(m => ({ default: m.ForgotPasswordPage })));
const CartPage = dynamic(() => import("@/components/dedco/pages/cart-page").then(m => ({ default: m.CartPage })));
const CheckoutPage = dynamic(() => import("@/components/dedco/pages/checkout-page").then(m => ({ default: m.CheckoutPage })));
const PaymentPage = dynamic(() => import("@/components/dedco/pages/payment-page").then(m => ({ default: m.PaymentPage })));
const ProfilePage = dynamic(() => import("@/components/dedco/pages/profile-page").then(m => ({ default: m.ProfilePage })));
const FavoritesPage = dynamic(() => import("@/components/dedco/pages/favorites-page").then(m => ({ default: m.FavoritesPage })));
const WalletPage = dynamic(() => import("@/components/dedco/pages/wallet-page").then(m => ({ default: m.WalletPage })));
const KYCPage = dynamic(() => import("@/components/dedco/pages/kyc-page").then(m => ({ default: m.KYCPage })));
const BriefListPage = dynamic(() => import("@/components/dedco/pages/brief-list-page").then(m => ({ default: m.BriefListPage })));
const BriefCreatePage = dynamic(() => import("@/components/dedco/pages/brief-create-page").then(m => ({ default: m.BriefCreatePage })));
const BriefPage = dynamic(() => import("@/components/dedco/brief-page").then(m => ({ default: m.BriefPage })));
const ProjetArtisanDetailPage = dynamic(() => import("@/components/dedco/pages/projet-artisan-detail").then(m => ({ default: m.ProjetArtisanDetailPage })));
const ProjetDesignerDetailPage = dynamic(() => import("@/components/dedco/pages/projet-designer-detail").then(m => ({ default: m.ProjetDesignerDetailPage })));
const ProjetPaiementArtisanPage = dynamic(() => import("@/components/dedco/pages/projet-paiement-artisan").then(m => ({ default: m.ProjetPaiementArtisanPage })));
const BriefArtisanDetailPage = dynamic(() => import("@/components/dedco/pages/brief-artisan-detail").then(m => ({ default: m.BriefArtisanDetailPage })));
const BriefDesignerDetailPage = dynamic(() => import("@/components/dedco/pages/brief-designer-detail").then(m => ({ default: m.BriefDesignerDetailPage })));
const OrderConfirmationPage = dynamic(() => import("@/components/dedco/pages/order-pages").then(m => ({ default: m.OrderConfirmationPage })));
const InvoicePage = dynamic(() => import("@/components/dedco/pages/order-pages").then(m => ({ default: m.InvoicePage })));
const NewOrderTrackingPage = dynamic(() => import("@/components/dedco/pages/order-pages").then(m => ({ default: m.OrderTrackingPage })));
const DesignerDashboardPage = dynamic(() => import("@/components/dedco/pages/designer/designer-dashboard").then(m => ({ default: m.DesignerDashboardPage })));
const DesignerProjectsPage = dynamic(() => import("@/components/dedco/pages/designer/designer-projects").then(m => ({ default: m.DesignerProjectsPage })));
const DesignerBriefsPage = dynamic(() => import("@/components/dedco/pages/designer/designer-briefs").then(m => ({ default: m.DesignerBriefsPage })));
const BriefDetailPage = dynamic(() => import("@/components/dedco/pages/designer/brief-detail").then(m => ({ default: m.BriefDetailPage })));
const DesignerProfilePage = dynamic(() => import("@/components/dedco/pages/designer/designer-profile").then(m => ({ default: m.DesignerProfilePage })));
const DesignerSettingsPage = dynamic(() => import("@/components/dedco/pages/designer/designer-settings").then(m => ({ default: m.DesignerSettingsPage })));
const ArtisanDashboardPage = dynamic(() => import("@/components/dedco/pages/artisan/artisan-dashboard").then(m => ({ default: m.ArtisanDashboardPage })));
const ArtisanProductsPage = dynamic(() => import("@/components/dedco/pages/artisan/artisan-products").then(m => ({ default: m.ArtisanProductsPage })));
const ArtisanOrdersPage = dynamic(() => import("@/components/dedco/pages/artisan/artisan-orders").then(m => ({ default: m.ArtisanOrdersPage })));
const ArtisanProfilePage = dynamic(() => import("@/components/dedco/pages/artisan/artisan-profile").then(m => ({ default: m.ArtisanProfilePage })));
const ArtisanStatsPage = dynamic(() => import("@/components/dedco/pages/artisan/artisan-stats").then(m => ({ default: m.ArtisanStatsPage })));
const AdminDashboardPage = dynamic(() => import("@/components/dedco/pages/admin/admin-dashboard").then(m => ({ default: m.AdminDashboardPage })));
const AdminUsersPage = dynamic(() => import("@/components/dedco/pages/admin/admin-users").then(m => ({ default: m.AdminUsersPage })));
const AdminProductsPage = dynamic(() => import("@/components/dedco/pages/admin/admin-products").then(m => ({ default: m.AdminProductsPage })));
const AdminOrdersPage = dynamic(() => import("@/components/dedco/pages/admin/admin-orders").then(m => ({ default: m.AdminOrdersPage })));
const AdminAnalyticsPage = dynamic(() => import("@/components/dedco/pages/admin/admin-analytics").then(m => ({ default: m.AdminAnalyticsPage })));
const AdminContentPage = dynamic(() => import("@/components/dedco/pages/admin/admin-content").then(m => ({ default: m.AdminContentPage })));
const MessagesPage = dynamic(() => import("@/components/dedco/pages/messages-page").then(m => ({ default: m.MessagesPage })));
const LitigePage = dynamic(() => import("@/components/dedco/pages/litige-page").then(m => ({ default: m.LitigePage })));
const MoodboardPage = dynamic(() => import("@/components/dedco/pages/moodboard-page").then(m => ({ default: m.MoodboardPage })));
const SearchResultsPage = dynamic(() => import("@/components/dedco/pages/search-page").then(m => ({ default: m.SearchResultsPage })));
const OnboardingPage = dynamic(() => import("@/components/dedco/pages/onboarding-page").then(m => ({ default: m.OnboardingPage })));
const MaisonDashboardPage = dynamic(() => import("@/components/dedco/pages/maison-dashboard").then(m => ({ default: m.MaisonDashboardPage })));
const ArticlePage = dynamic(() => import("@/components/dedco/pages/article-page").then(m => ({ default: m.ArticlePage })));
const ArtisansListingPage = dynamic(() => import("@/components/dedco/pages/artisans-page").then(m => ({ default: m.ArtisansListingPage })));
const MarketplaceCategoryPage = dynamic(() => import("@/components/dedco/pages/marketplace-category-page").then(m => ({ default: m.MarketplaceCategoryPage })));
const OrderHistoryPage = dynamic(() => import("@/components/dedco/pages/order-history-page").then(m => ({ default: m.OrderHistoryPage })));
const SettingsPage = dynamic(() => import("@/components/dedco/pages/settings-page").then(m => ({ default: m.SettingsPage })));
const NotificationsPage = dynamic(() => import("@/components/dedco/pages/notifications-page").then(m => ({ default: m.NotificationsPage })));
const HelpCenterPage = dynamic(() => import("@/components/dedco/pages/help-center-page").then(m => ({ default: m.HelpCenterPage })));
const AboutPage = dynamic(() => import("@/components/dedco/pages/about-page").then(m => ({ default: m.AboutPage })));
const BecomeArtisanPage = dynamic(() => import("@/components/dedco/pages/become-artisan-page").then(m => ({ default: m.BecomeArtisanPage })));

// BLOC 6 — New pages (lazy)
const ArtisanDemandesPage = dynamic(() => import("@/components/dedco/pages/artisan/artisan-extended-pages").then(m => ({ default: m.ArtisanDemandesPage })));
const ArtisanProjetsPage = dynamic(() => import("@/components/dedco/pages/artisan/artisan-extended-pages").then(m => ({ default: m.ArtisanProjetsPage })));
const ArtisanWalletPage = dynamic(() => import("@/components/dedco/pages/artisan/artisan-extended-pages").then(m => ({ default: m.ArtisanWalletPage })));
const ArtisanAvisPage = dynamic(() => import("@/components/dedco/pages/artisan/artisan-extended-pages").then(m => ({ default: m.ArtisanAvisPage })));
const ArtisanCertificationPage = dynamic(() => import("@/components/dedco/pages/artisan/artisan-extended-pages").then(m => ({ default: m.ArtisanCertificationPage })));
const ArtisanAbonnementPage = dynamic(() => import("@/components/dedco/pages/artisan/artisan-extended-pages").then(m => ({ default: m.ArtisanAbonnementPage })));
const ArtisanParametresPage = dynamic(() => import("@/components/dedco/pages/artisan/artisan-extended-pages").then(m => ({ default: m.ArtisanParametresPage })));
const ArtisanBriefRecuPage = dynamic(() => import("@/components/dedco/pages/artisan/artisan-brief-workflow").then(m => ({ default: m.ArtisanBriefRecuPage })));
const ArtisanDevisCreatePage = dynamic(() => import("@/components/dedco/pages/artisan/artisan-brief-workflow").then(m => ({ default: m.ArtisanDevisCreatePage })));
const AdminKYCPage = dynamic(() => import("@/components/dedco/pages/admin/admin-extended-pages").then(m => ({ default: m.AdminKYCPage })));
const AdminMessagesPage = dynamic(() => import("@/components/dedco/pages/admin/admin-extended-pages").then(m => ({ default: m.AdminMessagesPage })));
const AdminLitigesPage = dynamic(() => import("@/components/dedco/pages/admin/admin-extended-pages").then(m => ({ default: m.AdminLitigesPage })));
const AdminScenesPage = dynamic(() => import("@/components/dedco/pages/admin/admin-extended-pages").then(m => ({ default: m.AdminScenesPage })));
const AdminCollectionsPage = dynamic(() => import("@/components/dedco/pages/admin/admin-extended-pages").then(m => ({ default: m.AdminCollectionsPage })));
const AdminCertificationPage = dynamic(() => import("@/components/dedco/pages/admin/admin-extended-pages").then(m => ({ default: m.AdminCertificationPage })));
const AdminParametresPage = dynamic(() => import("@/components/dedco/pages/admin/admin-extended-pages").then(m => ({ default: m.AdminParametresPage })));
const DesignerWalletPage = dynamic(() => import("@/components/dedco/pages/client-and-designer-pages").then(m => ({ default: m.DesignerWalletPage })));
const DesignerPortfolioPage = dynamic(() => import("@/components/dedco/pages/client-and-designer-pages").then(m => ({ default: m.DesignerPortfolioPage })));
const DesignerAbonnementPage = dynamic(() => import("@/components/dedco/pages/client-and-designer-pages").then(m => ({ default: m.DesignerAbonnementPage })));
const BriefDesignerPage = dynamic(() => import("@/components/dedco/pages/client-and-designer-pages").then(m => ({ default: m.BriefDesignerPage })));
const AvisLivraisonPage = dynamic(() => import("@/components/dedco/pages/client-and-designer-pages").then(m => ({ default: m.AvisLivraisonPage })));
const PlansTarifsPage = dynamic(() => import("@/components/dedco/pages/client-and-designer-pages").then(m => ({ default: m.PlansTarifsPage })));
const MesProjetsPage = dynamic(() => import("@/components/dedco/pages/mes-projets-page").then(m => ({ default: m.MesProjetsPage })));
// Workflow designer (lazy)
const DesignerProjetAttentePage = dynamic(() => import("@/components/dedco/pages/designer-workflow-pages").then(m => ({ default: m.DesignerProjetAttentePage })));
const DesignerBriefRecuPage = dynamic(() => import("@/components/dedco/pages/designer-workflow-pages").then(m => ({ default: m.DesignerBriefRecuPage })));
const DesignerPropositionMissionPage = dynamic(() => import("@/components/dedco/pages/designer-workflow-pages").then(m => ({ default: m.DesignerPropositionMissionPage })));
const ClientPropositionRecuePage = dynamic(() => import("@/components/dedco/pages/designer-workflow-pages").then(m => ({ default: m.ClientPropositionRecuePage })));
const ProjetPaiementPage = dynamic(() => import("@/components/dedco/pages/designer-workflow-pages").then(m => ({ default: m.ProjetPaiementPage })));
const ProjetDetailPage = dynamic(() => import("@/components/dedco/pages/designer-workflow-pages").then(m => ({ default: m.ProjetDetailPage })));
const ProjetLivraisonPage = dynamic(() => import("@/components/dedco/pages/designer-workflow-pages").then(m => ({ default: m.ProjetLivraisonPage })));

// Layouts (eager — utilisés partout)
import { ArtisanLayout } from "@/components/dedco/pages/artisan/artisan-layout";
import { DesignerLayout } from "@/components/dedco/pages/designer/designer-layout";
import { AdminLayout } from "@/components/dedco/pages/admin/admin-layout";
import { MaisonLayout } from "@/components/dedco/pages/maison/maison-layout";

// ============================================================
// Bridge: AppRoute ↔ Route
// ============================================================

function appRouteToRoute(ar: AppRoute): Route {
  switch (ar.page) {
    case "home": return { name: "home" };
    case "marketplace": return { name: "marketplace" };
    case "marketplace-category": return { name: "marketplace" };
    case "product": return { name: "product", id: ar.id };
    case "inspirations": return { name: "inspirations" };
    case "scene": return { name: "scene", slug: ar.slug };
    case "artisans": return { name: "artisans" };
    case "artisan": return { name: "artisan", id: ar.id };
    case "designers": return { name: "designers" };
    case "designer": return { name: "designer", id: ar.id };
    case "magazine": return { name: "magazine" };
    case "article": return { name: "article", id: ar.id };
    case "favorites": return { name: "favorites" };
    case "brief": return { name: "brief" };
    // Routes non-gérées par la navbar → "other" (aucun onglet highlighted)
    default: return { name: "other" };
  }
}

function routeToAppRoute(r: Route): AppRoute {
  switch (r.name) {
    case "home": return { page: "home" };
    case "marketplace": return { page: "marketplace" };
    case "product": return { page: "product", id: r.id };
    case "inspirations": return { page: "inspirations" };
    case "scene": return { page: "scene", slug: r.slug };
    case "artisan": return { page: "artisan", id: r.id };
    case "designers": return { page: "designers" };
    case "designer": return { page: "designer", id: r.id };
    case "magazine": return { page: "magazine" };
    case "favorites": return { page: "favorites" };
    case "brief": return { page: "brief" };
    default: return { page: "home" };
  }
}

// ============================================================
// Dashboard page sets (for layout wrapping)
// ============================================================

const ARTISAN_PAGES = new Set([
  "artisan-dashboard","artisan-products","artisan-orders","artisan-profile","artisan-stats",
  "artisan-demandes","artisan-projets","artisan-wallet","artisan-avis","artisan-certification","artisan-abonnement","artisan-parametres",
  "artisan-brief-recu","artisan-devis-create","projet-artisan-detail",
]);
const DESIGNER_PAGES = new Set([
  "designer-dashboard","designer-projects","designer-briefs","designer-profile","designer-settings",
  "designer-wallet","designer-portfolio","designer-abonnement",
  "designer-brief-recu","designer-proposition-mission","projet-designer-detail","brief-designer-detail",
]);
const ADMIN_PAGES = new Set([
  "admin-dashboard","admin-users","admin-products","admin-orders","admin-analytics","admin-content",
  "admin-kyc","admin-messages","admin-litiges","admin-scenes","admin-collections","admin-certification","admin-parametres",
]);

// Routes workflow accessibles à tout utilisateur authentifié (client, artisan, designer)
const AUTH_REQUIRED_PAGES = new Set([
  "brief-detail",          // client voit son brief, designer voit un brief reçu
  "brief-artisan-detail",  // détail brief artisan
  "client-proposition-recue", // client voit proposition reçue
  "projet-paiement",       // paiement projet designer
  "projet-paiement-artisan", // paiement projet artisan
  "projet-detail",         // suivi projet
  "projet-livraison",      // livraison projet
  "client-projets",        // liste projets client
  "mes-projets",           // page mes projets
  "order-history",         // historique commandes
  "profile",               // profil utilisateur
  "wallet",                // portefeuille
  "settings",              // paramètres
  "notifications",         // notifications
  "messages",              // messagerie
  "kyc",                   // KYC artisan
  "moodboard",             // moodboard (sauvegardes)
  "onboarding",            // onboarding post-inscription
]);

export function isDashboardPage(page: string): boolean {
  return ARTISAN_PAGES.has(page) || DESIGNER_PAGES.has(page) || ADMIN_PAGES.has(page) || page === "maison-dashboard";
}

// ============================================================
// Route Guarding — vérifie le rôle utilisateur avant d'accéder aux dashboards
// ============================================================

function getRequiredRole(page: string): UserRole | null {
  if (ARTISAN_PAGES.has(page)) return "artisan";
  if (DESIGNER_PAGES.has(page)) return "designer";
  if (ADMIN_PAGES.has(page)) return "admin";
  if (page === "maison-dashboard") return "maison";
  return null; // page publique ou auth-required
}

// Routes qui nécessitent juste une authentification (peu importe le rôle)
function isAuthRequired(page: string): boolean {
  return AUTH_REQUIRED_PAGES.has(page);
}

function GuardBlocked({ requiredRole }: { requiredRole: UserRole }) {
  const navigate = useDedcoStore((s) => s.navigate);
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#faf8f5",
      color: "#1e1813",
      fontFamily: "system-ui, sans-serif",
      padding: "40px 20px",
      textAlign: "center",
    }}>
      <div style={{
        fontSize: "64px",
        fontWeight: 700,
        color: "#a6442e",
        marginBottom: "16px",
        fontFamily: "Georgia, serif",
      }}>🔒</div>
      <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "12px" }}>
        Accès restreint
      </h1>
      <p style={{ fontSize: "14px", color: "#5b5048", marginBottom: "24px", maxWidth: "400px" }}>
        Cette page est réservée aux <strong>{requiredRole}s</strong>. 
        Connectez-vous avec le bon compte pour y accéder.
      </p>
      <button
        onClick={() => navigate({ page: "login" })}
        style={{
          background: "#bf793b",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Se connecter
      </button>
    </div>
  );
}

// ============================================================
// Router
// ============================================================

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" as const } },
};

export function DedcoRouter() {
  const route = useDedcoStore((s) => s.route);
  const navigate = useDedcoStore((s) => s.navigate);
  const goBack = useDedcoStore((s) => s.goBack);
  const favorites = useDedcoStore((s) => s.favorites);
  const savedScenes = useDedcoStore((s) => s.savedScenes);
  const toggleFavorite = useDedcoStore((s) => s.toggleFavorite);
  const addToCart = useDedcoStore((s) => s.addToCart);
  const toggleSceneSave = useDedcoStore((s) => s.toggleSceneSave);
  const currentUser = useDedcoStore((s) => s.currentUser);

  // ── Route Guarding ──
  const requiredRole = getRequiredRole(route.page);
  if (requiredRole && (!currentUser || currentUser.role !== requiredRole)) {
    return <GuardBlocked requiredRole={requiredRole} />;
  }
  // Routes auth-required (peu importe le rôle)
  if (!requiredRole && isAuthRequired(route.page) && !currentUser) {
    return <GuardBlocked requiredRole={"client"} />; // affiche écran login générique
  }

  const legacyRoute = appRouteToRoute(route);
  const navigateBridge = (r: Route) => navigate(routeToAppRoute(r));
  const favSet: Set<number> = new Set(favorites);
  const sceneSet: Set<string> = new Set(savedScenes);

  const renderPage = () => {
    switch (route.page) {
      // ════════════════════════════════════════
      // PUBLIC PAGES
      // ════════════════════════════════════════
      case "home":
        return <HomePage onNavigate={navigateBridge} favorites={favSet} toggleFav={toggleFavorite} savedScenes={sceneSet} toggleSaveScene={toggleSceneSave} />;

      case "marketplace":
        return <MarketplacePage onNavigate={navigateBridge} favorites={favSet} toggleFav={toggleFavorite} />;

      case "marketplace-category":
        return <MarketplaceCategoryPage category={route.category} />;

      case "product":
        return <ProductPage productId={route.id} onNavigate={navigateBridge} onBack={goBack} favorites={favSet} toggleFav={toggleFavorite} onAddToCart={addToCart} />;

      case "inspirations":
        return <InspirationsPage onNavigate={navigateBridge} savedScenes={sceneSet} toggleSaveScene={toggleSceneSave} />;

      case "scene":
        return <ScenePage slug={route.slug} onNavigate={navigateBridge} onBack={goBack} favorites={favSet} toggleFav={toggleFavorite} onAddToCart={addToCart} />;

      case "artisans":
        return <ArtisansListingPage />;

      case "artisan":
        return <ArtisanDetailPage artisanId={route.id} onNavigate={navigateBridge} onBack={goBack} favorites={favSet} toggleFav={toggleFavorite} />;

      case "designers":
        return <DesignersPage onNavigate={navigateBridge} />;

      case "designer":
        return <DesignerDetailPage designerId={route.id} onNavigate={navigateBridge} onBack={goBack} />;

      case "magazine":
        return <MagazinePage />;

      case "article":
        return <ArticlePage />;

      case "favorites":
        return <FavoritesPage />;

      case "about":
        return <AboutPage />;

      case "become-artisan":
        return <BecomeArtisanPage />;

      case "help-center":
        return <HelpCenterPage />;

      // ════════════════════════════════════════
      // AUTH PAGES
      // ════════════════════════════════════════
      case "login":
        return <LoginPage />;

      case "register":
        return <RegisterPage />;

      case "forgot-password":
        return <ForgotPasswordPage />;

      case "onboarding":
        return <OnboardingPage />;

      // ════════════════════════════════════════
      // CART & CHECKOUT
      // ════════════════════════════════════════
      case "cart":
        return <CartPage />;

      case "checkout":
        return <CheckoutPage />;

      case "payment":
        return <PaymentPage />;

      // ════════════════════════════════════════
      // CLIENT ACCOUNT PAGES
      // ════════════════════════════════════════
      case "profile":
        return <ProfilePage />;

      case "order-tracking":
        return <NewOrderTrackingPage orderId={route.id} />;

      case "order-confirmation":
        return <OrderConfirmationPage orderId={route.orderId} />;

      case "invoice":
        return <InvoicePage orderId={route.orderId} />;

      case "order-history":
        return <OrderHistoryPage />;

      case "wallet":
        return <WalletPage />;

      case "kyc":
        return <KYCPage />;

      case "settings":
        return <SettingsPage />;

      case "notifications":
        return <NotificationsPage />;

      case "messages":
        return <MessagesPage />;

      case "litige":
        return <LitigePage />;

      case "moodboard":
        return <MoodboardPage />;

      case "search":
        return <SearchResultsPage />;

      // ════════════════════════════════════════
      // BRIEF SYSTEM
      // ════════════════════════════════════════
      case "brief":
        return <BriefPage onNavigate={navigateBridge} onBack={goBack} />;

      case "brief-list":
        return <BriefListPage />;

      case "brief-create":
        return <BriefCreatePage />;

      case "brief-detail":
        return <BriefDetailPage briefId={route.id} />;

      // ════════════════════════════════════════
      // ARTISAN DASHBOARD (wrapped in ArtisanLayout)
      // ════════════════════════════════════════
      case "artisan-dashboard":
        return <ArtisanDashboardPage />;

      case "artisan-products":
        return <ArtisanProductsPage />;

      case "artisan-orders":
        return <ArtisanOrdersPage />;

      case "artisan-profile":
        return <ArtisanProfilePage />;

      case "artisan-stats":
        return <ArtisanStatsPage />;

      // BLOC 6 — New artisan pages
      case "artisan-demandes":
        return <ArtisanDemandesPage />;

      case "artisan-projets":
        return <ArtisanProjetsPage />;

      case "artisan-wallet":
        return <ArtisanWalletPage />;

      case "artisan-avis":
        return <ArtisanAvisPage />;

      case "artisan-certification":
        return <ArtisanCertificationPage />;

      case "artisan-abonnement":
        return <ArtisanAbonnementPage />;

      case "artisan-parametres":
        return <ArtisanParametresPage />;

      // ARTISAN BRIEF WORKFLOW
      case "artisan-brief-recu":
        return <ArtisanBriefRecuPage briefId={route.briefId} />;

      case "artisan-devis-create":
        return <ArtisanDevisCreatePage briefId={route.briefId} />;

      // ════════════════════════════════════════
      // DESIGNER DASHBOARD (wrapped in DesignerLayout)
      // ════════════════════════════════════════
      case "designer-dashboard":
        return <DesignerDashboardPage />;

      case "designer-projects":
        return <DesignerProjectsPage />;

      case "designer-briefs":
        return <DesignerBriefsPage />;

      case "designer-profile":
        return <DesignerProfilePage />;

      case "designer-settings":
        return <DesignerSettingsPage />;

      // BLOC 6 — New designer pages
      case "designer-wallet":
        return <DesignerWalletPage />;

      case "designer-portfolio":
        return <DesignerPortfolioPage />;

      case "designer-abonnement":
        return <DesignerAbonnementPage />;

      // ════════════════════════════════════════
      // ADMIN DASHBOARD (already wrapped in AdminLayout internally)
      // ════════════════════════════════════════
      case "admin-dashboard":
        return <AdminDashboardPage />;

      case "admin-users":
        return <AdminUsersPage />;

      case "admin-products":
        return <AdminProductsPage />;

      case "admin-orders":
        return <AdminOrdersPage />;

      case "admin-analytics":
        return <AdminAnalyticsPage />;

      case "admin-content":
        return <AdminContentPage />;

      // BLOC 6 — New admin pages (wrapped in AdminLayout)
      case "admin-kyc":
        return <AdminKYCPage />;

      case "admin-messages":
        return <AdminMessagesPage />;

      case "admin-litiges":
        return <AdminLitigesPage />;

      case "admin-scenes":
        return <AdminScenesPage />;

      case "admin-collections":
        return <AdminCollectionsPage />;

      case "admin-certification":
        return <AdminCertificationPage />;

      case "admin-parametres":
        return <AdminParametresPage />;

      // BLOC 6 — Client pages
      case "client-projets":
        return <MesProjetsPage />;

      case "brief-designer":
        return <BriefDesignerPage designerId={route.designerId} />;

      case "avis-livraison":
        return <AvisLivraisonPage orderId={route.orderId} />;

      case "plans-tarifs":
        return <PlansTarifsPage />;

      // ════════════════════════════════════════
      // WORKFLOW DESIGNER (version simplifiée)
      // ════════════════════════════════════════
      case "designer-projet-attente":
        return <DesignerProjetAttentePage projectId={route.projectId} />;

      case "designer-brief-recu":
        return <DesignerBriefRecuPage briefId={route.briefId} />;

      case "designer-proposition-mission":
        return <DesignerPropositionMissionPage briefId={route.briefId} />;

      case "client-proposition-recue":
        return <ClientPropositionRecuePage proposalId={route.proposalId} />;

      case "projet-paiement":
        return <ProjetPaiementPage proposalId={route.proposalId} />;

      case "projet-paiement-artisan":
        return <ProjetPaiementArtisanPage proposalId={route.proposalId} />;

      case "projet-detail":
        // Routing intelligent : PD- → designer, PA- → artisan
        return route.projectId.startsWith("PD-")
          ? <ProjetDesignerDetailPage projectId={route.projectId} />
          : <ProjetArtisanDetailPage projectId={route.projectId} />;

      case "projet-artisan-detail":
        return <ProjetArtisanDetailPage projectId={route.projectId} />;

      case "projet-designer-detail":
        return <ProjetDesignerDetailPage projectId={route.projectId} />;

      case "brief-artisan-detail":
        return <BriefArtisanDetailPage briefId={route.briefId} />;

      case "brief-designer-detail":
        return <BriefDesignerDetailPage briefId={route.briefId} />;

      case "projet-livraison":
        return <ProjetLivraisonPage projectId={route.projectId} />;

      // ════════════════════════════════════════
      // MAISON DASHBOARD
      // ════════════════════════════════════════
      case "maison-dashboard":
        return <MaisonDashboardPage />;

      default:
        return <HomePage onNavigate={navigateBridge} favorites={favSet} toggleFav={toggleFavorite} savedScenes={sceneSet} toggleSaveScene={toggleSceneSave} />;
    }
  };

  const isArtisan = ARTISAN_PAGES.has(route.page);
  const isDesigner = DESIGNER_PAGES.has(route.page);
  const isAdmin = ADMIN_PAGES.has(route.page);
  const isDashboard = isArtisan || isDesigner || isAdmin || route.page === "maison-dashboard";

  // ── Dashboard pages: stable Layout, only children change ──
  if (isArtisan) {
    return <ArtisanLayout key="artisan-layout">{renderPage()}</ArtisanLayout>;
  }
  if (isDesigner) {
    return <DesignerLayout key="designer-layout">{renderPage()}</DesignerLayout>;
  }
  if (isAdmin) {
    return <AdminLayout key="admin-layout">{renderPage()}</AdminLayout>;
  }
  if (route.page === "maison-dashboard") {
    return <MaisonLayout key="maison-layout">{renderPage()}</MaisonLayout>;
  }

  // ── Public pages: with animation ──
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={route.page}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="min-h-screen"
      >
        {renderPage()}
      </motion.div>
    </AnimatePresence>
  );
}
