"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { Mail, ArrowLeft, CheckCircle, MailCheck } from "lucide-react";

export function ForgotPasswordPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="dedco-card p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-6">
            <button
              onClick={() => navigate({ page: "home" })}
              className="inline-block cursor-pointer"
            >
              <span className="font-display text-3xl font-bold" style={{ color: "var(--terracotta)" }}>
                Dedco
              </span>
              <span className="font-display text-3xl font-bold" style={{ color: "var(--amber)" }}>
                .
              </span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "var(--amber-pale)" }}
                  >
                    <Mail size={28} style={{ color: "var(--amber)" }} />
                  </div>
                  <h2 className="font-display text-xl font-semibold" style={{ color: "var(--text-1)" }}>
                    Mot de passe oublié?
                  </h2>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-2)" }}>
                    Entrez votre adresse email, nous vous enverrons un lien de réinitialisation.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="reset-email"
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: "var(--text-1)" }}
                    >
                      Adresse email
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                        size={18}
                        style={{ color: "var(--text-3)" }}
                      />
                      <input
                        id="reset-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                        className="w-full pl-10 pr-4 py-3 text-sm rounded-md border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          background: "var(--bg-cream)",
                          borderColor: "var(--border)",
                          color: "var(--text-1)",
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="dedco-btn dedco-btn-primary dedco-btn-lg w-full"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Envoi en cours...
                      </span>
                    ) : (
                      "Envoyer le lien de réinitialisation"
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="text-center py-4"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "var(--forest-pale)" }}
                >
                  <MailCheck size={28} style={{ color: "var(--forest)" }} />
                </div>
                <h2 className="font-display text-xl font-semibold" style={{ color: "var(--forest)" }}>
                  Lien envoyé!
                </h2>
                <p className="mt-2 text-sm" style={{ color: "var(--text-2)" }}>
                  Vérifiez votre boîte de réception à <span className="font-semibold">{email}</span>
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--text-3)" }}>
                  Le lien expire dans 30 minutes.
                </p>

                <button
                  onClick={() => navigate({ page: "login" })}
                  className="dedco-btn dedco-btn-primary dedco-btn-lg w-full mt-6"
                >
                  Retour à la connexion
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to login */}
          {!sent && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate({ page: "login" })}
                className="inline-flex items-center gap-1.5 text-sm font-medium cursor-pointer hover:underline"
                style={{ color: "var(--amber)" }}
              >
                <ArrowLeft size={14} />
                Retour à la connexion
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
