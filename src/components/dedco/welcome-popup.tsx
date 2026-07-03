"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

// ============================================================
// DEDCO — Welcome Modal + Cookie Banner
// Inspiré de Airbnb, ASOS, COS — subtil, visuel, pas lourd
// ============================================================

export function WelcomePopup({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    const welcomeSeen = sessionStorage.getItem("dedco-welcome-seen");
    if (!welcomeSeen) {
      const timer = setTimeout(() => setShowWelcome(true), 1200);
      return () => clearTimeout(timer);
    }

    const cookiesAccepted = localStorage.getItem("dedco-cookies");
    if (!cookiesAccepted) {
      const timer2 = setTimeout(() => setShowCookies(true), 2500);
      return () => clearTimeout(timer2);
    }
  }, []);

  function closeWelcome() {
    setShowWelcome(false);
    sessionStorage.setItem("dedco-welcome-seen", "true");
  }

  function acceptCookies() {
    localStorage.setItem("dedco-cookies", "accepted");
    setShowCookies(false);
  }

  return (
    <>
      {/* ── WELCOME MODAL ── (Radix Dialog pour a11y : focus trap, Échap, aria-modal) */}
      <Dialog.Root open={showWelcome} onOpenChange={(o) => !o && closeWelcome()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[200] bg-black/75 dedco-fade-in" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[200] -translate-x-1/2 -translate-y-1/2 max-w-md w-[calc(100%-32px)] bg-card rounded-2xl overflow-hidden shadow-2xl dedco-scale-in">
            <Dialog.Title className="sr-only">Bienvenue sur Dedco</Dialog.Title>
            <Dialog.Description className="sr-only">
              Découvrez l'artisanat béninois — bois iroko, rotin tressé, bogolan, wax.
            </Dialog.Description>

            {/* Image plein cadre avec overlay */}
            <div className="relative h-56 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
                alt="Intérieur contemporain"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, rgba(30,24,19,0.85) 100%)" }} />

              {/* Logo en bas de l'image */}
              <div className="absolute bottom-4 left-6 text-white">
                <p className="font-display font-black text-3xl leading-none" style={{ fontFamily: "Quache, Georgia, serif" }}>
                  Dedco<span style={{ color: "#BF793B" }}>.</span>
                </p>
              </div>

              {/* Bouton fermer */}
              <Dialog.Close asChild>
                <button
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                  aria-label="Fermer"
                >
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>

            {/* Contenu */}
            <div className="p-6">
              <h2 className="font-display font-bold text-lg mb-2 text-[var(--text-1)]" style={{ fontFamily: "Quache, Georgia, serif" }}>
                L'art de vivre chez soi.
              </h2>
              <p className="text-sm text-[var(--text-2)] leading-relaxed mb-5">
                Bois iroko, rotin tressé, bogolan, wax — des pièces façonnées à la main par les artisans de Cotonou, Porto-Novo et Parakou.
              </p>

              <button
                onClick={() => { closeWelcome(); onNavigate("marketplace"); }}
                className="w-full bg-[var(--text-1)] text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[var(--amber)] transition-colors"
              >
                Voir les créations
                <ArrowRight size={16} />
              </button>
              <Dialog.Close asChild>
                <button
                  className="w-full text-xs text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors mt-3"
                >
                  Plus tard
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ── COOKIE BANNER ── Style subtil — petit widget en bas à droite */}
      <AnimatePresence>
        {showCookies && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 z-[150] max-w-[280px]"
          >
            <div className="bg-card rounded-xl shadow-xl border border-[var(--border)] p-4">
              <div className="flex items-start gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--amber-pale)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--amber-dark)" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-9-9c0 1.5.5 3 1.5 4S16 8 16 10c0 1 .5 2 1.5 2s2 0 3.5 0z" />
                    <circle cx="9" cy="9" r="1" fill="var(--amber-dark)" />
                    <circle cx="15" cy="12" r="1" fill="var(--amber-dark)" />
                    <circle cx="11" cy="15" r="1" fill="var(--amber-dark)" />
                  </svg>
                </div>
                <p className="text-xs text-[var(--text-2)] leading-relaxed flex-1">
                  On garde quelques cookies pour vos paiements et votre visite. C'est tout.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { localStorage.setItem("dedco-cookies", "declined"); setShowCookies(false); }}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-3)] border border-[var(--border)] hover:bg-[var(--bg-warm)] transition-colors"
                >
                  Non merci
                </button>
                <button
                  onClick={acceptCookies}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[var(--text-1)] hover:bg-[var(--amber)] transition-colors"
                >
                  D'accord
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
