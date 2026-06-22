"use client";

import { useDedcoStore, type AppRoute } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import type { Route } from "@/lib/dedco-types";
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

import { LoginPage } from "@/components/dedco/pages/login-page";
import { RegisterPage } from "@/components/dedco/pages/register-page";
import { ForgotPasswordPage } from "@/components/dedco/pages/forgot-password-page";
import { CartPage } from "@/components/dedco/pages/cart-page";
import { CheckoutPage } from "@/components/dedco/pages/checkout-page";
import { PaymentPage } from "@/components/dedco/pages/payment-page";
import { ProfilePage } from "@/components/dedco/pages/profile-page";
import { OrderTrackingPage } from "@/components/dedco/pages/order-tracking-page";
import { FavoritesPage } from "@/components/dedco/pages/favorites-page";
import { WalletPage } from "@/components/dedco/pages/wallet-page";
import { KYCPage } from "@/components/dedco/pages/kyc-page";
import { BriefListPage } from "@/components/dedco/pages/brief-list-page";
import { BriefCreatePage } from "@/components/dedco/pages/brief-create-page";
import { DesignerDashboardPage } from "@/components/dedco/pages/designer/designer-dashboard";
import { DesignerProjectsPage } from "@/components/dedco/pages/designer/designer-projects";
import { DesignerBriefsPage } from "@/components/dedco/pages/designer/designer-briefs";
import { BriefDetailPage } from "@/components/dedco/pages/designer/brief-detail";
import { DesignerProfilePage } from "@/components/dedco/pages/designer/designer-profile";
import { DesignerSettingsPage } from "@/components/dedco/pages/designer/designer-settings";
import { ArtisanDashboardPage } from "@/components/dedco/pages/artisan/artisan-dashboard";
import { ArtisanProductsPage } from "@/components/dedco/pages/artisan/artisan-products";
import { ArtisanOrdersPage } from "@/components/dedco/pages/artisan/artisan-orders";
import { ArtisanProfilePage } from "@/components/dedco/pages/artisan/artisan-profile";
import { ArtisanStatsPage } from "@/components/dedco/pages/artisan/artisan-stats";
import { AdminDashboardPage } from "@/components/dedco/pages/admin/admin-dashboard";
import { AdminUsersPage } from "@/components/dedco/pages/admin/admin-users";
import { AdminProductsPage } from "@/components/dedco/pages/admin/admin-products";
import { AdminOrdersPage } from "@/components/dedco/pages/admin/admin-orders";
import { AdminAnalyticsPage } from "@/components/dedco/pages/admin/admin-analytics";
import { AdminContentPage } from "@/components/dedco/pages/admin/admin-content";
import { MessagesPage } from "@/components/dedco/pages/messages-page";
import { LitigePage } from "@/components/dedco/pages/litige-page";
import { MoodboardPage } from "@/components/dedco/pages/moodboard-page";
import { SearchResultsPage } from "@/components/dedco/pages/search-page";
import { OnboardingPage } from "@/components/dedco/pages/onboarding-page";
import { MaisonDashboardPage } from "@/components/dedco/pages/maison-dashboard";
import { ArticlePage } from "@/components/dedco/pages/article-page";
import { ArtisansListingPage } from "@/components/dedco/pages/artisans-page";
import { MarketplaceCategoryPage } from "@/components/dedco/pages/marketplace-category-page";
import { OrderHistoryPage } from "@/components/dedco/pages/order-history-page";
import { SettingsPage } from "@/components/dedco/pages/settings-page";
import { NotificationsPage } from "@/components/dedco/pages/notifications-page";
import { HelpCenterPage } from "@/components/dedco/pages/help-center-page";
import { AboutPage } from "@/components/dedco/pages/about-page";
import { BecomeArtisanPage } from "@/components/dedco/pages/become-artisan-page";

// BLOC 6 — New pages (audit)
import {
  ArtisanDemandesPage,
  ArtisanProjetsPage,
  ArtisanWalletPage,
  ArtisanAvisPage,
  ArtisanCertificationPage,
  ArtisanAbonnementPage,
  ArtisanParametresPage,
} from "@/components/dedco/pages/artisan/artisan-extended-pages";
import {
  AdminKYCPage,
  AdminMessagesPage,
  AdminLitigesPage,
  AdminScenesPage,
  AdminCollectionsPage,
  AdminCertificationPage,
  AdminParametresPage,
} from "@/components/dedco/pages/admin/admin-extended-pages";
import {
  DesignerWalletPage,
  DesignerPortfolioPage,
  DesignerAbonnementPage,
  ClientProjetsPage,
  BriefDesignerPage,
  AvisLivraisonPage,
  PlansTarifsPage,
} from "@/components/dedco/pages/client-and-designer-pages";

// Layouts
import { ArtisanLayout } from "@/components/dedco/pages/artisan/artisan-layout";
import { DesignerLayout } from "@/components/dedco/pages/designer/designer-layout";
import { AdminLayout } from "@/components/dedco/pages/admin/admin-layout";

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
    default: return { name: "home" };
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
]);
const DESIGNER_PAGES = new Set([
  "designer-dashboard","designer-projects","designer-briefs","designer-profile","designer-settings","brief-detail",
  "designer-wallet","designer-portfolio","designer-abonnement",
]);
const ADMIN_PAGES = new Set([
  "admin-dashboard","admin-users","admin-products","admin-orders","admin-analytics","admin-content",
  "admin-kyc","admin-messages","admin-litiges","admin-scenes","admin-collections","admin-certification","admin-parametres",
]);

export function isDashboardPage(page: string): boolean {
  return ARTISAN_PAGES.has(page) || DESIGNER_PAGES.has(page) || ADMIN_PAGES.has(page) || page === "maison-dashboard";
}

// ============================================================
// Router
// ============================================================

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
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
        return <OrderTrackingPage orderId={route.id} />;

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
        return <BriefListPage />;

      case "brief-create":
        return <BriefCreatePage />;

      case "brief-detail":
        return <BriefDetailPage briefId={route.id} />;

      // ════════════════════════════════════════
      // ARTISAN DASHBOARD (wrapped in ArtisanLayout)
      // ════════════════════════════════════════
      case "artisan-dashboard":
        return <ArtisanLayout><ArtisanDashboardPage /></ArtisanLayout>;

      case "artisan-products":
        return <ArtisanLayout><ArtisanProductsPage /></ArtisanLayout>;

      case "artisan-orders":
        return <ArtisanLayout><ArtisanOrdersPage /></ArtisanLayout>;

      case "artisan-profile":
        return <ArtisanLayout><ArtisanProfilePage /></ArtisanLayout>;

      case "artisan-stats":
        return <ArtisanLayout><ArtisanStatsPage /></ArtisanLayout>;

      // BLOC 6 — New artisan pages
      case "artisan-demandes":
        return <ArtisanLayout><ArtisanDemandesPage /></ArtisanLayout>;

      case "artisan-projets":
        return <ArtisanLayout><ArtisanProjetsPage /></ArtisanLayout>;

      case "artisan-wallet":
        return <ArtisanLayout><ArtisanWalletPage /></ArtisanLayout>;

      case "artisan-avis":
        return <ArtisanLayout><ArtisanAvisPage /></ArtisanLayout>;

      case "artisan-certification":
        return <ArtisanLayout><ArtisanCertificationPage /></ArtisanLayout>;

      case "artisan-abonnement":
        return <ArtisanLayout><ArtisanAbonnementPage /></ArtisanLayout>;

      case "artisan-parametres":
        return <ArtisanLayout><ArtisanParametresPage /></ArtisanLayout>;

      // ════════════════════════════════════════
      // DESIGNER DASHBOARD (wrapped in DesignerLayout)
      // ════════════════════════════════════════
      case "designer-dashboard":
        return <DesignerLayout><DesignerDashboardPage /></DesignerLayout>;

      case "designer-projects":
        return <DesignerLayout><DesignerProjectsPage /></DesignerLayout>;

      case "designer-briefs":
        return <DesignerLayout><DesignerBriefsPage /></DesignerLayout>;

      case "designer-profile":
        return <DesignerLayout><DesignerProfilePage /></DesignerLayout>;

      case "designer-settings":
        return <DesignerLayout><DesignerSettingsPage /></DesignerLayout>;

      // BLOC 6 — New designer pages
      case "designer-wallet":
        return <DesignerLayout><DesignerWalletPage /></DesignerLayout>;

      case "designer-portfolio":
        return <DesignerLayout><DesignerPortfolioPage /></DesignerLayout>;

      case "designer-abonnement":
        return <DesignerLayout><DesignerAbonnementPage /></DesignerLayout>;

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
        return <AdminLayout><AdminKYCPage /></AdminLayout>;

      case "admin-messages":
        return <AdminLayout><AdminMessagesPage /></AdminLayout>;

      case "admin-litiges":
        return <AdminLayout><AdminLitigesPage /></AdminLayout>;

      case "admin-scenes":
        return <AdminLayout><AdminScenesPage /></AdminLayout>;

      case "admin-collections":
        return <AdminLayout><AdminCollectionsPage /></AdminLayout>;

      case "admin-certification":
        return <AdminLayout><AdminCertificationPage /></AdminLayout>;

      case "admin-parametres":
        return <AdminLayout><AdminParametresPage /></AdminLayout>;

      // BLOC 6 — Client pages
      case "client-projets":
        return <ClientProjetsPage />;

      case "brief-designer":
        return <BriefDesignerPage designerId={route.designerId} />;

      case "avis-livraison":
        return <AvisLivraisonPage orderId={route.orderId} />;

      case "plans-tarifs":
        return <PlansTarifsPage />;

      // ════════════════════════════════════════
      // MAISON DASHBOARD
      // ════════════════════════════════════════
      case "maison-dashboard":
        return <MaisonDashboardPage />;

      default:
        return <HomePage onNavigate={navigateBridge} favorites={favSet} toggleFav={toggleFavorite} savedScenes={sceneSet} toggleSaveScene={toggleSceneSave} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={JSON.stringify(route)}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="min-h-screen"
      >
        {renderPage()}
      </motion.div>
    </AnimatePresence>
  );
}
