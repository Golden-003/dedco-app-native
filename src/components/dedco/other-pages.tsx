"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import {
  SCENES,
  DESIGNERS,
  MAGAZINE,
  ARTISANS,
  PRODUCTS,
} from "@/lib/dedco-data";
import type { Route, CartItem } from "@/lib/dedco-types";
import {
  SceneCard,
  DesignerCard,
  MagazineCard,
  ProductCard,
  ArtisanCard,
} from "./cards";
import { BackButton } from "./layout";

// ============================================================
// INSPIRATIONS — masonry grid
// ============================================================

export function InspirationsPage({
  onNavigate,
  savedScenes,
  toggleSaveScene,
}: {
  onNavigate: (route: Route) => void;
  savedScenes: Set<string>;
  toggleSaveScene: (slug: string) => void;
}) {
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const rooms = ["all", ...Array.from(new Set(SCENES.map((s) => s.room)))];
  const filtered =
    roomFilter === "all"
      ? SCENES
      : SCENES.filter((s) => s.room === roomFilter);

  return (
    <div className="dedco-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="display-xl mb-2">Inspirations d'intérieur</h1>
        <p className="text-sm text-ink-soft max-w-xl">
          Découvrez des scènes aménagées par nos designers. Cliquez sur une
          scène pour Shop the Look — chaque objet est cliquable.
        </p>
      </div>

      {/* Room filter */}
      <div className="flex gap-2 overflow-x-auto dedco-hide-scroll pb-3 mb-6">
        {rooms.map((room) => (
          <button
            key={room}
            type="button"
            onClick={() => setRoomFilter(room)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
              roomFilter === room
                ? "bg-amber text-white border-amber"
                : "bg-white text-ink-soft border-border hover:border-ink-mute"
            }`}
          >
            {room === "all" ? "Toutes les pièces" : room}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="masonry-grid">
        {filtered.map((scene, i) => (
          <div key={scene.id} className="masonry-item">
            <SceneCard
              scene={scene}
              onOpen={(slug) => onNavigate({ name: "scene", slug })}
              onToggleSave={toggleSaveScene}
              isSaved={savedScenes.has(scene.slug)}
              style={{
                aspectRatio:
                  i % 3 === 0 ? "3 / 4" : i % 3 === 1 ? "4 / 5" : "3 / 5",
              }}
            />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-ink-mute py-12">
          Aucune scène pour cette pièce.
        </p>
      )}
    </div>
  );
}

// ============================================================
// DESIGNERS list page
// ============================================================

export function DesignersPage({
  onNavigate,
}: {
  onNavigate: (route: Route) => void;
}) {
  const [styleFilter, setStyleFilter] = useState<string>("all");
  const styles = ["all", ...Array.from(new Set(DESIGNERS.map((d) => d.style)))];
  const filtered =
    styleFilter === "all"
      ? DESIGNERS
      : DESIGNERS.filter((d) => d.style === styleFilter);

  return (
    <div className="dedco-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="display-xl mb-2">Designers d'espace Dedco</h1>
        <p className="text-sm text-ink-soft max-w-xl">
          Travaillez avec un designer professionnel pour transformer votre
          intérieur. Profitez de la messagerie sécurisée, des liens Google Meet
          et des livrables PDF.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto dedco-hide-scroll pb-3 mb-6">
        {styles.map((style) => (
          <button
            key={style}
            type="button"
            onClick={() => setStyleFilter(style)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
              styleFilter === style
                ? "bg-amber text-white border-amber"
                : "bg-white text-ink-soft border-border hover:border-ink-mute"
            }`}
          >
            {style === "all" ? "Tous les styles" : style}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <DesignerCard
            key={d.id}
            designer={d}
            onOpen={(id) => onNavigate({ name: "designer", id })}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// DESIGNER detail page
// ============================================================

export function DesignerDetailPage({
  designerId,
  onNavigate,
  onBack,
}: {
  designerId: number;
  onNavigate: (route: Route) => void;
  onBack: () => void;
}) {
  const designer = DESIGNERS.find((d) => d.id === designerId);
  if (!designer) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="font-display text-xl mb-4">Designer introuvable</p>
        <button onClick={onBack} className="dedco-btn dedco-btn-primary">
          Retour
        </button>
      </div>
    );
  }
  return (
    <div className="dedco-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BackButton onBack={onBack} />
        {/* Cover */}
        <div
          className="rounded-xl overflow-hidden mb-6 bg-warm relative"
          style={{ aspectRatio: "21 / 9" }}
        >
          <img
            src={designer.cover}
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(30,24,19,0.7) 0%, transparent 60%)",
            }}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-5 -mt-16 lg:-mt-20 relative">
              <img
                src={designer.avatar}
                alt={designer.name}
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-cream"
              />
              <div>
                <h1 className="display-lg text-white drop-shadow-lg">
                  {designer.name}
                </h1>
                <p className="text-sm text-white/90 drop-shadow">
                  {designer.specialty}
                </p>
              </div>
            </div>

            <div className="dedco-card p-5 sm:p-6 mb-4">
              <h2 className="font-display font-bold text-lg mb-3">
                À propos
              </h2>
              <p className="text-sm text-ink-soft leading-relaxed mb-4">
                {designer.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="dedco-badge dedco-badge-amber">
                  {designer.style}
                </span>
                <span className="dedco-badge dedco-badge-gray">
                  {designer.city}
                </span>
                <span className="dedco-badge dedco-badge-gray">
                  {designer.projects} projets réalisés
                </span>
              </div>
            </div>

            <div className="dedco-card p-5 sm:p-6">
              <h2 className="font-display font-bold text-lg mb-4">
                Processus de collaboration
              </h2>
              <ol className="space-y-3">
                {[
                  { title: "Brief initial (gratuit)", desc: "Vous choisissez un niveau de projet (Prototype, Standard, Premium) et décrivez votre besoin. Aucun paiement." },
                  { title: "Réponse du designer", desc: "Le designer accepte et propose, pose des questions, ou refuse. Réponse sous 24-48h." },
                  { title: "Proposition de mission", desc: "Le designer envoie une proposition complète : objectif, livrables, étapes, délai, prix, inclusions et exclusions." },
                  { title: "Paiement", desc: "Vous acceptez et payez (avec 1,5% de frais de garantie Dedco). Le projet démarre immédiatement." },
                  { title: "Projet", desc: "Exécution selon la mission validée. Messagerie, calendrier, jalons et achats recommandés." },
                  { title: "Livraison", desc: "Le designer livre les livrables définis. Vous validez ou demandez un ajustement. Le paiement est libéré." },
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="text-sm leading-relaxed">
                      <p className="font-semibold text-ink">{step.title}</p>
                      <p className="text-ink-soft text-xs mt-0.5">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="dedco-card p-5 sm:p-6 sticky top-20">
              <div className="grid grid-cols-2 gap-3 mb-5 pb-5 border-b border-border">
                <div>
                  <p className="text-xs text-ink-mute uppercase tracking-wide mb-1">
                    Note
                  </p>
                  <p className="font-display font-bold text-lg">
                    {designer.rating} ★
                  </p>
                  <p className="text-xs text-ink-mute">
                    {designer.reviews} avis
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-mute uppercase tracking-wide mb-1">
                    Prix de démarrage
                  </p>
                  <p className="font-display font-bold text-lg text-amber font-numeric">
                    {designer.hourlyRate.toLocaleString("fr-FR")} F
                  </p>
                  <p className="text-xs text-ink-mute">FCFA · cadrage</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => useDedcoStore.getState().navigate({ page: "brief-designer", designerId: designer.id })}
                className="dedco-btn dedco-btn-primary w-full mb-3"
              >
                Démarrer un projet
                <span className="block text-[10px] font-normal opacity-80">À partir de {designer.hourlyRate.toLocaleString("fr-FR")} FCFA</span>
              </button>
              <p className="text-xs text-ink-soft text-center mb-4 px-2">
                Décrivez votre besoin. Le designer vous répondra puis vous enverra une proposition de mission avec prix.
              </p>

              <p className="text-xs text-ink-mute leading-relaxed">
                Le brief est gratuit. Le paiement se fait uniquement après acceptation de la proposition de mission. Paiement sécurisé via Mobile Money avec 1,5% de frais de garantie Dedco.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ARTISAN detail page
// ============================================================

export function ArtisanDetailPage({
  artisanId,
  onNavigate,
  onBack,
  favorites,
  toggleFav,
}: {
  artisanId: number;
  onNavigate: (route: Route) => void;
  onBack: () => void;
  favorites: Set<number>;
  toggleFav: (id: number) => void;
}) {
  const artisan = ARTISANS.find((a) => a.id === artisanId);
  if (!artisan) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="font-display text-xl mb-4">Artisan introuvable</p>
        <button onClick={onBack} className="dedco-btn dedco-btn-primary">
          Retour
        </button>
      </div>
    );
  }
  const products = PRODUCTS.filter((p) => p.artisanId === artisan.id);

  return (
    <div className="dedco-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BackButton onBack={onBack} />

      <div className="dedco-card p-5 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <img
            src={artisan.avatar}
            alt={artisan.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="display-lg">{artisan.name}</h1>
              {artisan.verified && (
                <span className="dedco-badge dedco-badge-forest">
                  Vérifié
                </span>
              )}
              <span className="dedco-badge dedco-badge-amber">
                {artisan.level}
              </span>
            </div>
            <p className="text-sm text-ink-soft mb-2">{artisan.specialty}</p>
            <p className="text-xs text-ink-mute mb-3">
              <MapPin size={12} className="inline" />{artisan.city} · {artisan.experience} d'expérience
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="font-bold text-amber font-numeric">{artisan.rating}</span>{" "}
                <span className="text-ink-mute">/ 5 · <span className="font-numeric">{artisan.reviews}</span> avis</span>
              </div>
              <div>
                <span className="font-bold font-numeric">{artisan.trust}%</span>{" "}
                <span className="text-ink-mute">de confiance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dedco-card p-5 sm:p-6 mb-6">
        <h2 className="font-display font-bold text-lg mb-3">Biographie</h2>
        <p className="text-sm text-ink-soft leading-relaxed">{artisan.bio}</p>
      </div>

      <div className="mb-6">
        <h2 className="display-md mb-4">Réalisations (<span className="font-numeric">{artisan.portfolio.length}</span>)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {artisan.portfolio.map((img, i) => (
            <div
              key={i}
              className="aspect-square rounded-md overflow-hidden bg-warm"
            >
              <img
                src={img}
                alt={`Réalisation ${i + 1} de ${artisan.name}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {products.length > 0 && (
        <div>
          <h2 className="display-md mb-4">
            Produits en vente (<span className="font-numeric">{products.length}</span>)
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isFav={favorites.has(p.id)}
                onToggleFav={toggleFav}
                onOpen={(id) => onNavigate({ name: "product", id })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAGAZINE page
// ============================================================

export function MagazinePage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const featured = MAGAZINE.find((m) => m.featured) ?? MAGAZINE[0];
  const others = MAGAZINE.filter((m) => m.id !== featured.id);

  return (
    <div className="dedco-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="display-xl mb-2">Magazine Dedco</h1>
        <p className="text-sm text-ink-soft max-w-xl">
          Tendances déco, guides d'achat, reportages d'atelier. Tout l'écosystème
          Dedco en articles.
        </p>
      </div>

      {/* Featured */}
      <article className="dedco-card overflow-hidden mb-8 cursor-pointer group">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="aspect-[16/10] lg:aspect-auto overflow-hidden bg-warm">
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs text-ink-mute mb-3">
              <span className="dedco-badge dedco-badge-terra-solid">
                À la une
              </span>
              <span>·</span>
              <span>{featured.category}</span>
              <span>·</span>
              <span>{featured.readTime}</span>
            </div>
            <h2 className="display-lg mb-3">{featured.title}</h2>
            <p className="text-sm text-ink-soft leading-relaxed mb-4">
              {featured.excerpt}
            </p>
            <p className="text-xs text-ink-mute">
              Par {featured.author} · {featured.date}
            </p>
            <button type="button" onClick={() => navigate({ page: "article", id: featured.id })} className="dedco-btn dedco-btn-primary self-start mt-4">
              Lire l'article
            </button>
          </div>
        </div>
      </article>

      {/* Others */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {others.map((article) => (
          <button key={article.id} type="button" onClick={() => navigate({ page: "article", id: article.id })} className="dedco-card overflow-hidden text-left cursor-pointer hover:shadow-md transition-shadow">
            <div className="aspect-[4/3] overflow-hidden bg-warm">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs text-ink-mute mb-2">
                <span>{article.category}</span>
                <span>·</span>
                <span>{article.readTime}</span>
              </div>
              <h3 className="font-display font-bold text-base mb-2">{article.title}</h3>
              <p className="text-sm text-ink-soft line-clamp-2">{article.excerpt}</p>
              <p className="text-xs text-ink-mute mt-2">{article.author} · {article.date}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// FAVORITES page
// ============================================================

export function FavoritesPage({
  onNavigate,
  favorites,
  toggleFav,
}: {
  onNavigate: (route: Route) => void;
  favorites: Set<number>;
  toggleFav: (id: number) => void;
}) {
  const favProducts = PRODUCTS.filter((p) => favorites.has(p.id));
  return (
    <div className="dedco-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="display-xl mb-2">Mes favoris</h1>
        <p className="text-sm text-ink-soft">
          {favProducts.length} produit{favProducts.length > 1 ? "s" : ""}{" "}
          sauvegardé{favProducts.length > 1 ? "s" : ""}.
        </p>
      </div>
      {favProducts.length === 0 ? (
        <div className="dedco-card p-12 text-center">
          <p className="font-display font-semibold text-lg mb-2">
            Aucun favori pour le moment
          </p>
          <p className="text-sm text-ink-soft mb-4">
            Cliquez sur le cœur d'un produit pour le retrouver ici.
          </p>
          <button
            type="button"
            onClick={() => onNavigate({ name: "marketplace" })}
            className="dedco-btn dedco-btn-primary"
          >
            Explorer la marketplace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {favProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isFav={true}
              onToggleFav={toggleFav}
              onOpen={(id) => onNavigate({ name: "product", id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
