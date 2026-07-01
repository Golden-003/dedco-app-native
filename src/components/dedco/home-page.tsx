"use client";

import { ArrowRight, Sparkles, Users, ShieldCheck, Truck, Hammer, Palette, Check } from "lucide-react";
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
import { useDedcoStore } from "@/lib/store";
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
  const navigateStore = useDedcoStore((s) => s.navigate);
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
            style={{ animation: "dedco-fade-in 1s ease-out" }}
          />
          <div
            className="absolute inset-0 dedco-animated-gradient"
            style={{
              background: "linear-gradient(135deg, rgba(30,24,19,0.88) 0%, rgba(30,24,19,0.6) 50%, rgba(191,121,59,0.2) 100%)",
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-xl text-white">
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
              Du wax au bois iroko, du bogolan au rotin tressé —
              des pièces uniques façonnées à la main par les artisans
              de Cotonou, Porto-Novo et Parakou.
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
            <div className="flex items-center gap-3 mt-10 flex-wrap">
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
              <div className="flex items-center gap-3">
                <span className="font-numeric text-xl font-bold text-white">2 400+</span>
                <span className="text-xs text-white/70">clients</span>
                <span className="text-white/30 text-xs">·</span>
                <span className="font-numeric text-xl font-bold text-white">180+</span>
                <span className="text-xs text-white/70">artisans</span>
                <span className="text-white/30 text-xs">·</span>
                <span className="font-numeric text-xl font-bold text-white">4.8</span>
                <span className="text-xs text-white/70">/ 5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{ background: "var(--bg-warm)" }} className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <ShieldCheck size={22} className="text-forest" />,
              title: "Paiement sécurisé",
              desc: "MTN MoMo · Moov Money",
            },
            {
              icon: <Users size={22} className="text-amber" />,
              title: "Artisans vérifiés",
              desc: "De Cotonou à Parakou",
            },
            {
              icon: <Truck size={22} className="text-amber-dark" />,
              title: "Livraison suivie",
              desc: "Partout au Bénin",
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
      <section className="py-12 lg:py-16 bg-card">
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
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-amber hover:text-amber-dark transition-colors"
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
      <section className="py-12 lg:py-16" style={{ background: "#fdf9f3" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <div className="section-eyebrow">Talents locaux</div>
              <h2 className="display-lg mb-2">Artisans à découvrir</h2>
              <p className="text-sm text-ink-soft max-w-lg mx-auto">
                Des créateurs béninois vérifiés, du novice au maître artisan,
                réunis sur une seule plateforme.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateStore({ page: "artisans" })}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-amber hover:text-amber-dark transition-colors"
            >
              Tous les artisans <ArrowRight size={16} />
            </button>
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
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-amber hover:text-amber-dark transition-colors"
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
            "linear-gradient(135deg, var(--amber) 0%, var(--terracotta) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="display-xl mb-3 text-white">
            Deux façons de créer
          </h2>
          <p className="text-base sm:text-lg opacity-90 mb-10 max-w-xl mx-auto">
            Que vous cherchiez un meuble sur mesure ou un aménagement complet, Dedco vous accompagne.
          </p>

          {/* 2 cartes distinctes */}
          <div className="grid sm:grid-cols-2 gap-5 text-left">

            {/* CARTE 1 — BRIEF ARTISAN (commande personnalisée) */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/30">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Hammer size={24} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Commander sur mesure
              </h3>
              <p className="text-sm text-white/90 mb-4">
                Vous voulez un mobilier, un objet de décoration ou un aménagement fabriqué par un artisan ? 
                Décrivez votre besoin en 6 étapes, recevez des propositions d'artisans qualifiés sous 48h.
              </p>
              <ul className="space-y-1.5 mb-5 text-sm text-white/90">
                <li className="flex items-center gap-2"><Check size={14} className="text-white flex-shrink-0" /> Mobilier, décoration, aménagement sur mesure</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-white flex-shrink-0" /> 5 à 15 artisans qualifiés notifiés (N2+, note ≥ 4.0)</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-white flex-shrink-0" /> Sélection, paiement sécurisé, livraison confirmation</li>
              </ul>
              <button
                type="button"
                onClick={() => onNavigate({ name: "brief" })}
                className="dedco-btn dedco-btn-light dedco-btn-lg w-full"
              >
                Créer un brief artisan
                <ArrowRight size={18} />
              </button>
            </div>

            {/* CARTE 2 — BRIEF DESIGNER (projet d'aménagement) */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/30">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Palette size={24} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Projet d'aménagement
              </h3>
              <p className="text-sm text-white/90 mb-4">
                Vous voulez aménager un espace ou transformer une pièce ? 
                Travaillez avec un designer professionnel de votre choix.
              </p>
              <ul className="space-y-1.5 mb-5 text-sm text-white/90">
                <li className="flex items-center gap-2"><Check size={14} className="text-white flex-shrink-0" /> Choix du designer, niveau de projet</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-white flex-shrink-0" /> Proposition de mission avec prix</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-white flex-shrink-0" /> Paiement après acceptation</li>
              </ul>
              <button
                type="button"
                onClick={() => onNavigate({ name: "designers" })}
                className="dedco-btn dedco-btn-xl w-full"
                style={{
                  background: "transparent",
                  color: "white",
                  border: "2px solid rgba(255,255,255,0.5)",
                }}
              >
                Voir les designers
                <ArrowRight size={18} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* MAGAZINE */}
      <section className="py-12 lg:py-16" style={{ background: "var(--bg-warm)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <div className="section-eyebrow">Magazine</div>
              <h2 className="display-lg">Tendances & Conseils</h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ name: "magazine" })}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-amber hover:text-amber-dark transition-colors"
            >
              Tous les articles <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MAGAZINE.slice(0, 4).map((article) => (
              <button key={article.id} type="button" onClick={() => navigateStore({ page: "article", id: article.id })} className="dedco-card overflow-hidden text-left cursor-pointer hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] overflow-hidden bg-warm">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-ink-mute mb-2">
                    <span>{article.category}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-display font-bold text-sm mb-1">{article.title}</h3>
                  <p className="text-xs text-ink-mute">{article.author} · {article.date}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
