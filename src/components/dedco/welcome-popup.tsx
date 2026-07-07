"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// DEDCO — Cookie Banner uniquement (popup de bienvenue retiré)
// ============================================================

export function WelcomePopup({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem("dedco-cookies");
    if (!cookiesAccepted) {
      const timer = setTimeout(() => setShowCookies(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function acceptCookies() {
    localStorage.setItem("dedco-cookies", "accepted");
    setShowCookies(false);
  }

  return (
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
  );
}
