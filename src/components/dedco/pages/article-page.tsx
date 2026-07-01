"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Clock,
  User,
  Share2,
  Heart,
  Bookmark,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { MAGAZINE } from "@/lib/dedco-data";
import { ARTISANS, PRODUCTS, formatFCFA } from "@/lib/dedco-data";

// ============================================================
// ArticlePage — Magazine Article Detail
// ============================================================

const RELATED_ARTICLES = [
  {
    id: 2,
    title: "5 artisans à suivre absolument",
    author: "Rédaction Dedco",
    date: "15 Jan 2024",
    readTime: "4 min",
    image:
      "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Tendances déco Afrique 2024",
    author: "Karine Agboton",
    date: "08 Jan 2024",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: 4,
    title: "Guide : bien choisir son artisan sur Dedco",
    author: "Rédaction Dedco",
    date: "02 Jan 2024",
    readTime: "7 min",
    image:
      "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=800&q=80",
  },
];

export function ArticlePage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }
  const goBack = useDedcoStore((s) => s.goBack);
  const toggleFavorite = useDedcoStore((s) => s.toggleFavorite);
  const favorites = useDedcoStore((s) => s.favorites);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const article = MAGAZINE[0]; // Featured article

  const featuredProduct = PRODUCTS[0]; // Table basse Bénin Wax

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="relative w-full h-[280px] sm:h-[400px] lg:h-[500px]">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={goBack}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 dedco-btn dedco-btn-light dedco-btn-sm rounded-full"
        >
          <ArrowLeft size={18} />
        </motion.button>

        {/* Category badge */}
        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
          <span className="dedco-badge dedco-badge-amber-solid mb-2 inline-block">
            {article.category}
          </span>
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-display font-bold max-w-2xl leading-tight">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
      >
        {/* Meta row */}
        <div className="flex items-center gap-4 text-sm text-[var(--text-2)] mb-8 pb-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span className="font-medium text-[var(--text-1)]">{article.author}</span>
          </div>
          <span className="text-[var(--text-3)]">•</span>
          <span>{article.date}</span>
          <span className="text-[var(--text-3)]">•</span>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{article.readTime} de lecture</span>
          </div>
        </div>

        {/* Share/Save actions */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setLiked(!liked)}
            className={`dedco-btn dedco-btn-ghost dedco-btn-sm ${liked ? "text-[var(--terracotta)]" : ""}`}
          >
            <Heart size={16} fill={liked ? "var(--terracotta)" : "none"} />
            <span className="hidden sm:inline">{liked ? "Aimé" : "J'aime"}</span>
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className={`dedco-btn dedco-btn-ghost dedco-btn-sm ${saved ? "text-[var(--amber)]" : ""}`}
          >
            <Bookmark size={16} fill={saved ? "var(--amber)" : "none"} />
            <span className="hidden sm:inline">{saved ? "Sauvegardé" : "Sauvegarder"}</span>
          </button>
          <button onClick={() => showToast("Lien copié dans le presse-papier.")} className="dedco-btn dedco-btn-ghost dedco-btn-sm">
            <Share2 size={16} />
            <span className="hidden sm:inline">Partager</span>
          </button>
        </div>

        {/* Article Body */}
        <article className="prose prose-lg max-w-none">
          <p className="text-[var(--text-1)] text-lg leading-relaxed mb-6">
            Le design d'intérieur africain connaît une véritable renaissance.
            En fusionnant les matériaux traditionnels — wax, bois iroko, rotin —
            avec des lignes contemporaines épurées, les créateurs béninois
            redéfinissent ce que signifie habiter avec style et authenticité.
          </p>

          <h2 className="font-display text-xl sm:text-2xl font-medium text-[var(--text-1)] mb-4 mt-8">
            Le wax : bien plus qu'un simple tissu
          </h2>
          <p className="text-[var(--text-2)] leading-relaxed mb-4">
            Historiquement utilisé pour les vêtements, le wax s'invite aujourd'hui
            dans nos salons sous forme de coussins, rideaux, tentures murales et
            même de plateaux de tables. Les motifs géométriques et les couleurs
            vives apportent une énergie incomparable à chaque pièce. Sur Dedco,
            des artisans comme Aïcha Monteiro à Cotonou créent des coussins kente
            et wax qui transforment instantanément un canapé neutre en point
            focal vibrants.
          </p>

          <h2 className="font-display text-xl sm:text-2xl font-medium text-[var(--text-1)] mb-4 mt-8">
            Le bois iroko : l'or noir du mobilier
          </h2>
          <p className="text-[var(--text-2)] leading-relaxed mb-4">
            L'iroko, essence locale du Bénin, est au cœur de l'ébénisterie
            artisanale. Des maîtres comme Kofi Akindélé (Niveau N3, 12 ans
            d'expérience) créent des meubles qui marient les techniques
            traditionnelles de sculpture avec un design contemporain minimaliste.
            Sa table basse Bénin Wax, combinant bois iroko massif et plateau en
            tissu wax, est devenue un best-seller sur la plateforme.
          </p>

          {/* Featured product embed */}
          <div
            className="dedco-card p-4 sm:p-6 my-8 flex flex-col sm:flex-row gap-4 cursor-pointer"
            onClick={() => navigate({ page: "product", id: featuredProduct.id })}
          >
            <img
              src={featuredProduct.images[0]}
              alt={featuredProduct.name}
              className="w-full sm:w-48 h-40 object-cover rounded-lg"
            />
            <div className="flex-1">
              <span className="dedco-badge dedco-badge-amber text-xs mb-2">
                Produit mentionné
              </span>
              <h3 className="font-display text-lg font-medium mb-1">
                {featuredProduct.name}
              </h3>
              <p className="text-sm text-[var(--text-2)] mb-2 line-clamp-2">
                {featuredProduct.desc}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-numeric font-semibold text-[var(--amber)]">
                  {formatFCFA(featuredProduct.price)}
                </span>
                <span className="text-sm text-[var(--forest)] flex items-center gap-1">
                  Voir le produit <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-medium text-[var(--text-1)] mb-4 mt-8">
            L'art de la lumière : bogolan et bambou
          </h2>
          <p className="text-[var(--text-2)] leading-relaxed mb-4">
            Fatou Loko, créatrice luminieuse basée à Cotonou, associe les textiles
            traditionnels bogolan et wax à des structures en laiton et bambou
            pour créer des luminaires uniques. Ses lampes et suspensions créent
            une ambiance chaleureuse qui transforme chaque espace en un lieu de
            vie. Le bogolan, tissu malien traditionnel, apporte des motifs
            ancestraux qui racontent une histoire dans chaque pièce.
          </p>

          <h2 className="font-display text-xl sm:text-2xl font-medium text-[var(--text-1)] mb-4 mt-8">
            Créer son salon afro-contemporain en 5 étapes
          </h2>
          <ol className="list-decimal pl-6 space-y-3 text-[var(--text-2)] mb-6">
            <li>
              <strong className="text-[var(--text-1)]">Choisir une pièce d'ancrage</strong> —
              Une table basse en bois iroko ou un tapis en laine tissée main
              donne le ton de toute la pièce.
            </li>
            <li>
              <strong className="text-[var(--text-1)]">Ajouter des textiles vibrants</strong> —
              Coussins wax ou kente pour la touche de couleur. 4 coussins suffisent
              pour transformer un canapé.
            </li>
            <li>
              <strong className="text-[var(--text-1)]">Éclairer avec intention</strong> —
              Suspension en bambou ou lampe bogolan pour une lumière tamisée
              et chaleureuse.
            </li>
            <li>
              <strong className="text-[var(--text-1)]">Intégrer l'art mural</strong> —
              Miroir en raffia tressé ou masque sculpté pour apporter de la
              profondeur aux murs.
            </li>
            <li>
              <strong className="text-[var(--text-1)]">Équilibrer les matières</strong> —
              Mélanger bois, rotin, textile et métal pour un rendu riche sans
              surcharge.
            </li>
          </ol>

          <div className="bg-[var(--bg-warm)] rounded-xl p-6 my-8">
            <p className="text-[var(--text-2)] italic leading-relaxed">
              "Le design africain n'est pas une tendance, c'est un héritage vivant
              qui évolue avec son temps. Chaque pièce artisanale raconte l'histoire
              de son créateur et de sa communauté."
            </p>
            <p className="text-sm text-[var(--text-3)] mt-3">— Ndèye Sarr, Designer d'intérieur</p>
          </div>
        </article>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[var(--border)]">
          <span className="text-sm font-medium text-[var(--text-2)] mr-2">Tags :</span>
          {["décoration", "wax", "bois iroko", "afro-contemporain", "bogolan", "artisanat béninois"].map(
            (tag) => (
              <span
                key={tag}
                className="dedco-badge dedco-badge-gray cursor-pointer hover:bg-[var(--border-dark)] transition-colors"
                onClick={() => navigate({ page: "search", query: tag })}
              >
                {tag}
              </span>
            )
          )}
        </div>

        {/* Comments section */}
        <div className="mt-10 pt-8 border-t border-[var(--border)]">
          <h3 className="font-display text-xl font-medium mb-6 flex items-center gap-2">
            <MessageSquare size={20} />
            Commentaires (3)
          </h3>
          <div className="space-y-4 mb-6">
            {[
              {
                name: "Aminata Z.",
                date: "22 Jan 2024",
                text: "Super article ! J'ai commandé la table basse Bénin Wax et elle est magnifique. Exactement comme sur les photos.",
                avatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=80&q=85",
              },
              {
                name: "Paul D.",
                date: "20 Jan 2024",
                text: "Le conseil numéro 4 m'a beaucoup aidé. J'ai ajouté un miroir en raffia dans mon entrée et ça change tout.",
                avatar: "https://images.unsplash.com/photo-1616805765352-beedbad46b2a?auto=format&fit=crop&crop=faces&w=80&q=85",
              },
              {
                name: "Karine A.",
                date: "19 Jan 2024",
                text: "En tant que décoratrice, je recommande toujours Dedco à mes clients. Les artisans sont talentueux et fiables.",
                avatar: "https://images.unsplash.com/photo-1533674689012-136b487b7736?auto=format&fit=crop&crop=faces&w=80&q=85",
              },
            ].map((comment, i) => (
              <div key={i} className="flex gap-3">
                <img
                  src={comment.avatar}
                  alt={comment.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-[var(--text-1)]">{comment.name}</span>
                    <span className="text-[var(--text-3)]">{comment.date}</span>
                  </div>
                  <p className="text-[var(--text-2)] mt-1">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment form */}
          <div className="dedco-card p-4">
            <textarea
              placeholder="Écrire un commentaire..."
              className="w-full bg-transparent border border-[var(--border)] rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--amber)] min-h-[80px]"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button onClick={() => navigate({ page: "home" })} className="dedco-btn dedco-btn-primary dedco-btn-sm">
                Publier
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <h3 className="font-display text-xl font-medium mb-6">Articles similaires</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {RELATED_ARTICLES.map((a) => (
              <div
                key={a.id}
                className="dedco-card overflow-hidden cursor-pointer group"
                onClick={() => navigate({ page: "article", id: a.id })}
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-sm line-clamp-2 mb-2">{a.title}</h4>
                  <p className="text-xs text-[var(--text-3)]">
                    {a.author} · {a.readTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Toast inline */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 dedco-card px-4 py-3 shadow-lg flex items-center gap-2" style={{ backgroundColor: "var(--forest-pale)", borderColor: "var(--forest)" }}>
          <CheckCircle2 size={16} className="text-[var(--forest)] flex-shrink-0" />
          <p className="text-sm text-[var(--text-1)]">{toast}</p>
        </div>
      )}
    </div>
  );
}
