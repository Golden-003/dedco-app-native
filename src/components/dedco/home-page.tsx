"use client";

import { ArrowRight, Sparkles, Users, ShieldCheck, Truck } from "lucide-react";
import {
  ARTISANS,
  PRODUCTS,
  SCENES,
  DESIGNERS,
  CATEGORIES,
  MAGAZINE,
  heroAvatars,
} from "@/lib/dedco-data";
import type { Route } from "@/lib/dedco-types";
import {
  ProductCard,
  SceneCard,
  ArtisanCard,
  DesignerCard,
  MagazineCard,
  CategoryCard,
} from "./cards";

// ============================================================
// HOMEPAGE
// ============================================================

export function HomePage({
  onNavigate,
  favorites,
  toggleFav,
  savedScenes,
  toggleSaveScene,
}: {
  onNavigate: (route: Route) => void;
  favorites: Set<number>;
  toggleFav: (id: number) => void;
  savedScenes: Set<string>;
  toggleSaveScene: (slug: string) => void;
}) {
  const featuredScenes = SCENES.slice(0, 5);
  const featuredArtisans = ARTISANS.slice(0, 4);
  const featuredProducts = PRODUCTS.filter((p) => p.badge).slice(0, 8);
  const featuredDesigners = DESIGNERS.slice(0, 3);

  return (
    <div className="dedco-fade-in">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1920&q=85"
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(30,24,19,0.85) 0%, rgba(30,24,19,0.55) 50%, rgba(30,24,19,0.3) 100%)",
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-semibold mb-5">
              <Sparkles size={14} className="text-amber-light" />
              <span>Artisans béninois vérifiés · Paiement sécurisé</span>
            </div>
            <h1 className="font-display font-bold leading-[1.05] tracking-tight mb-5"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
              Votre intérieur,
              <br />
              <em className="text-amber-light not-italic font-display italic">
                sublimé par
              </em>
              <br />
              nos artisans
            </h1>
            <p className="text-base sm:text-lg opacity-90 leading-relaxed mb-8 max-w-lg">
              Découvrez des créations uniques fabriquées à la main par les
              meilleurs artisans béninois. Du wax au bois iroko, transformez
              votre espace en œuvre d'art.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate({ name: "marketplace" })}
                className="dedco-btn dedco-btn-light dedco-btn-xl"
              >
                Explorer la marketplace
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ name: "inspirations" })}
                className="dedco-btn dedco-btn-secondary dedco-btn-xl"
                style={{ borderColor: "rgba(255,255,255,0.6)", color: "white" }}
              >
                Voir les inspirations
              </button>
            </div>
            <div className="flex items-center gap-4 mt-10 flex-wrap">
              <div className="flex">
                {heroAvatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    aria-hidden
                    className="w-9 h-9 rounded-full border-2 border-white/80 object-cover -ml-2.5 first:ml-0"
                  />
                ))}
              </div>
              <p className="text-sm opacity-90">
                <strong>2 400+ clients</strong> satisfaits ·{" "}
                <strong>180+ artisans</strong> vérifiés
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <ShieldCheck size={22} className="text-forest" />,
              title: "Paiement séquestré",
              desc: "Sécurisé Fedapay",
            },
            {
              icon: <Users size={22} className="text-terracotta" />,
              title: "Artisans vérifiés",
              desc: "KYC + niveaux N1-N4",
            },
            {
              icon: <Truck size={22} className="text-terracotta-lt" />,
              title: "Livraison 3 temps",
              desc: "Tracée photo par photo",
            },
            {
              icon: <Sparkles size={22} className="text-amber" />,
              title: "Shop the Look",
              desc: "Scènes interactives",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warm flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink leading-tight">
                  {item.title}
                </p>
                <p className="text-xs text-ink-mute">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SCENES SECTION */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <div className="section-eyebrow">Découvrir</div>
              <h2 className="display-lg">Scènes qui inspirent</h2>
              <p className="text-sm text-ink-soft mt-1 max-w-md">
                Cliquez sur un élément de la scène pour découvrir le produit et
                l'artisan qui l'a créé.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ name: "inspirations" })}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-terracotta hover:text-terracotta-lt transition-colors"
            >
              Toutes les scènes <ArrowRight size={16} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto dedco-hide-scroll pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {featuredScenes.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                onOpen={(slug) => onNavigate({ name: "scene", slug })}
                onToggleSave={toggleSaveScene}
                isSaved={savedScenes.has(scene.slug)}
                className="w-[280px] flex-shrink-0"
              />
            ))}
          </div>
          <div className="mt-4 sm:hidden">
            <button
              type="button"
              onClick={() => onNavigate({ name: "inspirations" })}
              className="dedco-btn dedco-btn-ghost w-full"
            >
              Toutes les scènes <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ARTISANS SECTION */}
      <section className="py-12 lg:py-16" style={{ background: "var(--bg-warm)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="section-eyebrow">Talents locaux</div>
            <h2 className="display-lg mb-2">Artisans à découvrir</h2>
            <p className="text-sm text-ink-soft max-w-lg mx-auto">
              Des créateurs béninois vérifiés, du novice au maître artisan,
              réunis sur une seule plateforme.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredArtisans.map((artisan) => (
              <ArtisanCard
                key={artisan.id}
                artisan={artisan}
                onOpen={(id) => onNavigate({ name: "artisan", id })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <div className="section-eyebrow">Sélection</div>
              <h2 className="display-lg">Coups de cœur du moment</h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ name: "marketplace" })}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-terracotta hover:text-terracotta-lt transition-colors"
            >
              Voir tout <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFav={favorites.has(product.id)}
                onToggleFav={toggleFav}
                onOpen={(id) => onNavigate({ name: "product", id })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* DESIGNERS SECTION */}
      <section
        className="py-12 lg:py-16 text-white"
        style={{ background: "var(--text-1)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <div
                className="section-eyebrow"
                style={{ color: "var(--amber-light)" }}
              >
                Service premium
              </div>
              <h2 className="display-lg text-white">
                Designers d'espace Dedco
              </h2>
              <p className="text-sm opacity-80 mt-1 max-w-md">
                Un projet d'aménagement complet ? Travaillez avec un designer
                professionnel pour transformer votre intérieur.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ name: "designers" })}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-amber-light hover:text-amber transition-colors"
            >
              Tous les designers <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredDesigners.map((designer) => (
              <DesignerCard
                key={designer.id}
                designer={designer}
                onOpen={(id) => onNavigate({ name: "designer", id })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="section-eyebrow">Parcourir</div>
            <h2 className="display-lg">Toutes les catégories</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.slug}
                category={cat}
                onOpen={() => onNavigate({ name: "marketplace" })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Brief */}
      <section
        className="py-16 text-center text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--terracotta) 0%, var(--amber-dark) 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="display-xl mb-4 text-white">
            Vous avez un projet
            <br />
            d'aménagement ?
          </h2>
          <p className="text-base sm:text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Décrivez votre vision en 6 étapes. Recevez 5 à 15 propositions
            d'artisans qualifiés sous 48h. Paiement sécurisé, livraison tracée.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate({ name: "brief" })}
              className="dedco-btn dedco-btn-light dedco-btn-xl"
            >
              Créer mon brief gratuit
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ name: "designers" })}
              className="dedco-btn dedco-btn-xl"
              style={{
                background: "transparent",
                color: "white",
                border: "2px solid rgba(255,255,255,0.5)",
              }}
            >
              Voir les designers
            </button>
          </div>
        </div>
      </section>

      {/* MAGAZINE */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <div className="section-eyebrow">Magazine</div>
              <h2 className="display-lg">Tendances & Conseils</h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ name: "magazine" })}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-terracotta hover:text-terracotta-lt transition-colors"
            >
              Tous les articles <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MAGAZINE.slice(0, 4).map((article) => (
              <MagazineCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
