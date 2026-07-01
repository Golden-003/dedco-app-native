"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Star,
  BadgeCheck,
  Sparkles,
  Home,
  Palette,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { ARTISANS, CATEGORIES, DESIGNERS, PRODUCTS } from "@/lib/dedco-data";
import { ALL_SCENES } from "@/lib/dedco-data-expanded";

// ============================================================
// Onboarding Steps
// ============================================================

const TOTAL_STEPS = 4;

export function OnboardingPage() {
  const route = useDedcoStore((s) => s.route);
  const navigate = useDedcoStore((s) => s.navigate);
  const initialStep =
    route.page === "onboarding" ? (route.step ?? 0) : 0;
  const [currentStep, setCurrentStep] = useState(
    Math.max(0, Math.min(initialStep, TOTAL_STEPS - 1))
  );
  const [direction, setDirection] = useState(0);

  const goNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const skip = () => {
    navigate({ page: "home" });
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  return (
    <div className="dedco-fade-in min-h-screen flex flex-col bg-cream">
      {/* Skip */}
      <div className="flex justify-end px-6 pt-4">
        <button
          type="button"
          onClick={skip}
          className="text-sm text-ink-mute hover:text-amber transition-colors font-medium"
        >
          Passer
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-3xl mx-auto w-full relative overflow-hidden">
        {/* Left/Right arrows on desktop */}
        {currentStep > 0 && (
          <button
            type="button"
            onClick={goPrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white shadow-md items-center justify-center text-ink-soft hover:text-ink hover:shadow-lg transition-all z-10"
            aria-label="Précédent"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        {currentStep < TOTAL_STEPS - 1 && (
          <button
            type="button"
            onClick={goNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white shadow-md items-center justify-center text-ink-soft hover:text-ink hover:shadow-lg transition-all z-10"
            aria-label="Suivant"
          >
            <ArrowRight size={20} />
          </button>
        )}

        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            {currentStep === 0 && <StepWelcome />}
            {currentStep === 1 && <StepExplore />}
            {currentStep === 2 && <StepArtisans />}
            {currentStep === 3 && <StepPersonalize />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer with dots and action */}
      <div className="px-6 pb-8 pt-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? "w-8 bg-amber"
                    : i < currentStep
                      ? "w-2 bg-amber/50"
                      : "w-2 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Action button */}
          {currentStep === TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={() => navigate({ page: "register" })}
              className="dedco-btn dedco-btn-primary dedco-btn-lg w-full"
            >
              Créer mon compte
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="dedco-btn dedco-btn-primary dedco-btn-lg w-full"
            >
              {currentStep === 0 ? "Commencer" : "Suivant"}
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Step 1: Welcome
// ============================================================

function StepWelcome() {
  return (
    <div className="text-center">
      <motion.div
        className="w-full max-w-md mx-auto aspect-[4/3] rounded-2xl overflow-hidden mb-8 shadow-lg"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85"
          alt="Artisanat béninois"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(30,24,19,0.4) 0%, transparent 60%)",
          }}
        />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles size={20} className="text-amber" />
          <span className="section-eyebrow mb-0">Bienvenue</span>
        </div>
        <h1 className="display-xl mb-3">
          L'artisanat béninois à portée de clic
        </h1>
        <p className="text-ink-soft text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Découvrez des créations uniques faites main par des artisans
          vérifiés. Tables, fauteuils, luminaires — chaque pièce raconte
          une histoire.
        </p>
      </motion.div>
    </div>
  );
}

// ============================================================
// Step 2: Explore
// ============================================================

function StepExplore() {
  const topCategories = CATEGORIES.slice(0, 8);
  return (
    <div>
      <motion.div
        className="text-center mb-8"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Palette size={20} className="text-amber" />
          <span className="section-eyebrow mb-0">Explorer</span>
        </div>
        <h2 className="display-lg mb-2">Explorez les créations</h2>
        <p className="text-ink-soft text-sm max-w-md mx-auto">
          Parcourez des centaines de produits dans toutes les catégories
          de la décoration intérieure.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {topCategories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            className="dedco-card p-4 text-center hover:shadow-lg hover:border-amber transition-all cursor-pointer group"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3 }}
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
              {cat.icon}
            </div>
            <p className="font-display font-semibold text-sm">{cat.name}</p>
            <p className="text-xs text-ink-mute mt-0.5 font-numeric">
              {cat.count} produits
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Step 3: Artisans
// ============================================================

function StepArtisans() {
  const topArtisans = ARTISANS.slice(0, 4);
  const topDesigners = DESIGNERS.slice(0, 3);

  return (
    <div>
      <motion.div
        className="text-center mb-8"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Users size={20} className="text-amber" />
          <span className="section-eyebrow mb-0">Communauté</span>
        </div>
        <h2 className="display-lg mb-2">Trouvez votre artisan</h2>
        <p className="text-ink-soft text-sm max-w-md mx-auto">
          Des artisans vérifiés avec des niveaux de confiance
          transparents. Travaillez avec les meilleurs.
        </p>
      </motion.div>

      {/* Artisans carousel */}
      <div className="mb-6">
        <h3 className="font-display font-bold text-sm text-ink-mute mb-3 uppercase tracking-wider">
          Artisans vedettes
        </h3>
        <div className="flex gap-4 overflow-x-auto dedco-hide-scroll pb-2">
          {topArtisans.map((artisan, i) => (
            <motion.div
              key={artisan.id}
              className="flex-shrink-0 w-44 dedco-card p-4 text-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <img
                src={artisan.avatar}
                alt={artisan.name}
                className="w-14 h-14 rounded-full object-cover mx-auto mb-2"
              />
              <p className="font-display font-semibold text-sm truncate">
                {artisan.name}
              </p>
              <p className="text-xs text-ink-mute truncate mb-1">
                {artisan.specialty}
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-amber">
                <Star size={11} fill="currentColor" />
                <span className="font-numeric">{artisan.rating}</span>
              </div>
              <span className="dedco-badge dedco-badge-terra mt-2 text-[10px]">
                {artisan.level}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Designers carousel */}
      <div>
        <h3 className="font-display font-bold text-sm text-ink-mute mb-3 uppercase tracking-wider">
          Designers d'espace
        </h3>
        <div className="flex gap-4 overflow-x-auto dedco-hide-scroll pb-2">
          {topDesigners.map((designer, i) => (
            <motion.div
              key={designer.id}
              className="flex-shrink-0 w-52 dedco-card overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="aspect-[16/9] overflow-hidden bg-warm">
                <img
                  src={designer.cover}
                  alt={`Projet de ${designer.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="font-display font-semibold text-sm truncate">
                    {designer.name}
                  </p>
                  <BadgeCheck size={12} className="text-forest flex-shrink-0" />
                </div>
                <p className="text-xs text-ink-mute">{designer.specialty}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Step 4: Personalize
// ============================================================

function StepPersonalize() {
  const featuredScenes = ALL_SCENES.slice(0, 3);
  return (
    <div>
      <motion.div
        className="text-center mb-8"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Home size={20} className="text-amber" />
          <span className="section-eyebrow mb-0">Personnaliser</span>
        </div>
        <h2 className="display-lg mb-2">Personnalisez votre espace</h2>
        <p className="text-ink-soft text-sm max-w-md mx-auto">
          Envoyez un brief à nos designers et recevez des plans, moodboards
          et recommandations personnalisés pour votre intérieur.
        </p>
      </motion.div>

      {/* Scene previews */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {featuredScenes.map((scene, i) => (
          <motion.div
            key={scene.id}
            className="dedco-card overflow-hidden group cursor-pointer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -3 }}
          >
            <div className="aspect-[4/3] overflow-hidden bg-warm">
              <img
                src={scene.image}
                alt={scene.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(30,24,19,0.6) 0%, transparent 50%)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="text-xs text-white/70">{scene.room}</p>
                <p className="font-display text-sm font-semibold">
                  {scene.title}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Brief CTA */}
      <motion.div
        className="dedco-card p-5 text-center bg-amber-pale/30 border-amber/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm text-ink-soft">
          Envoyez un brief gratuit et recevez des propositions de designers
          professionnels. Paiement sécurisé via Mobile Money.
        </p>
      </motion.div>
    </div>
  );
}
